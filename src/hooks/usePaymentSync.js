import { useEffect, useState } from "react";
import { apiRequest } from "../lib/api";

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
        const result = await apiRequest("/api/payments/sync");
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
    return await apiRequest("/api/payments/sync");
  } catch (error) {
    console.error("Failed to fetch payment updates:", error);
    throw error;
  }
}
