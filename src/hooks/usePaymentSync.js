import { useEffect, useState } from "react";

export function usePaymentSync(intervalMs = 5000) {
  const [syncStatus, setSyncStatus] = useState({
    lastSync: null,
    synced: 0,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;
    let timeoutId;

    const syncPayments = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/payments/sync"
        );
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();
        if (isMounted) {
          setSyncStatus({
            lastSync: new Date().toISOString(),
            synced: result.data?.length || 0,
            error: null,
          });
        }
        return result.data;
      } catch (error) {
        console.error("Payment sync error:", error);
        if (isMounted) {
          setSyncStatus((prev) => ({
            ...prev,
            error: error.message,
          }));
        }
        return [];
      }
    };

    const scheduleSync = () => {
      timeoutId = setTimeout(() => {
        syncPayments().then(() => {
          if (isMounted) scheduleSync();
        });
      }, intervalMs);
    };

    // Initial sync
    syncPayments().then(() => {
      if (isMounted) scheduleSync();
    });

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [intervalMs]);

  return syncStatus;
}

export async function fetchPaymentUpdates() {
  try {
    const response = await fetch("http://localhost:5000/api/payments/sync");
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch payment updates:", error);
    throw error;
  }
}
