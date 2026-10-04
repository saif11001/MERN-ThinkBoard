const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const request = async (endpoint, options) => {
  let res;
  try {
    res = await fetch(`${BASE_URL}${endpoint}`, options);
  } catch {
    const error = new Error("Cannot reach the server, check your connection and try again.");
    error.status = 0;
    throw error;
  }

  let body = null;
  try {
    body = await res.json();
  } catch {
  }

  if (!res.ok) {
    const error = new Error(body?.message || "Something went wrong, please try again.");
    error.status = res.status;
    throw error;
  }

  return body;
};

const jsonOptions = (method, data) => ({
  method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});

export const api = {
  get: (endpoint) => request(endpoint),
  post: (endpoint, data) => request(endpoint, jsonOptions("POST", data)),
  patch: (endpoint, data) => request(endpoint, jsonOptions("PATCH", data)),
  delete: (endpoint) => request(endpoint, { method: "DELETE" }),
};