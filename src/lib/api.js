const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

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
      `Unable to connect to the server at ${API_URL}. Start the backend with "npm start" in the backend folder and try again.`
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