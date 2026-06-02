const BASE_URL = "https://thinkboard.bonto.run/api/v1";

const handleResponse = (res) => {
  if (res.status === 429) {
    const error = new Error("Rate limit exceeded");
    error.status = 429;
    throw error;
  }
  return res.json();
};

export const api = {
  get: (endpoint) =>
    fetch(`${BASE_URL}${endpoint}`).then(handleResponse),

  post: (endpoint, data) =>
    fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(handleResponse),

  patch: (endpoint, data) =>
    fetch(`${BASE_URL}${endpoint}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(handleResponse),

  delete: (endpoint) =>
    fetch(`${BASE_URL}${endpoint}`, {
      method: "DELETE",
    }).then(handleResponse),
};