const API = "https://flow-board-backend-phi.vercel.app";

// Central Logout Handler
const logoutUser = () => {
  localStorage.removeItem("token");

  // redirect instantly
  window.location.href = "/login";
};

// Core request handler
const request = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  };

  const response = await fetch(`${API}${url}`, config);

  const data = await response.json();

  // auto logout -> after token expiry
  if (response.status === 401) {
    console.warn("Token expired → Logging out user");
    logoutUser();
    throw new Error("Session expired. Please login again.");
  }

  if (!response.ok) {
    throw new Error(data.message || "An error occured");
  }

  return data;
};

// HTTP methods
const api = {
  get: (url) =>
    request(url, {
      method: "GET",
    }),

  post: (url, body) =>
    request(url, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  put: (url, body) =>
    request(url, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  delete: (url) =>
    request(url, {
      method: "DELETE",
    }),
};

export default api;
