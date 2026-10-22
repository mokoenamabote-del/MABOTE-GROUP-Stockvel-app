
const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://mabote-group-stockvel-app.onrender.com";

export async function apiRequest(path, options = {}) {
  let response;

  const token =
    typeof window !== "undefined"
      ? window.localStorage.getItem("maboteAuthToken")
      : null;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    });
  } catch {
    throw new Error(
      `Unable to connect to the server at ${API_URL}. Please check the backend connection and try again.`
    );
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.error || "Request failed");
    error.status = response.status;
    throw error;
  }

  return data;
}

export { API_URL };
