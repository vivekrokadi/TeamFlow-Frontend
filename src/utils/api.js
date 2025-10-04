import { store } from "../store";

const API_BASE_URL = "https://teamflow-1yai.onrender.com";

export const navigationStore = {
  navigate: null,
};

export const setNavigate = (navigate) => {
  navigationStore.navigate = navigate;
};

export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === "object") {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    if (navigationStore.navigate) {
      navigationStore.navigate("/login", { replace: true });
    } else {
      window.location.href = "/login";
    }

    throw new Error("Unauthorized");
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || `Request failed with status ${response.status}`
    );
  }

  return data;
};
