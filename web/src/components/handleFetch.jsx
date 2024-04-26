import React from "react";

async function handleFetch(url, options = {}, retry = 1) {
  try {
    const tokenString = sessionStorage.getItem("access_token");
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${tokenString}`,
    };

    const response = await fetch(url, options);
    if (!response.ok) {
      if (response.status === 401 && retry == 1) {
        const refreshToken = sessionStorage.getItem("refresh_token");
        const refreshed = await refreshFetch(refreshToken);
        if (refreshed) {
          return await handleFetch(url, options, 0);
        } else {
          throw new Error("Failed to refresh token");
        }
      }
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export default handleFetch;

async function refreshFetch(refreshToken) {
  try {
    const response = await fetch(`http://127.0.0.1:5000/api/token/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
    });
    if (!response.ok) {
      navigate("/", { tokenExpired: true });
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    sessionStorage.setItem("access_token", data?.access_token);
    return true;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return false;
  }
}
