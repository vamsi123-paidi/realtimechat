import axios from "axios";

// Directly use your Render backend URL
const BASE_URL = "https://realtimechat-1-gpm1.onrender.com/api";

export const postRequest = async (url, body) => {
  try {
    const fullUrl = url.startsWith('/') ? `${BASE_URL}${url}` : url;
    const response = await axios.post(fullUrl, body, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    return {
      error: true,
      message: error.response?.data?.message || error.message,
    };
  }
};

export const getRequest = async (url) => {
  try {
    const fullUrl = url.startsWith('/') ? `${BASE_URL}${url}` : url;
    const response = await axios.get(fullUrl, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    return {
      error: true,
      message: error.response?.data?.message || error.message,
    };
  }
};

export const putRequest = async (url, body) => {
  try {
    const fullUrl = url.startsWith('/') ? `${BASE_URL}${url}` : url;
    const response = await axios.put(fullUrl, body, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    return {
      error: true,
      message: error.response?.data?.message || error.message,
    };
  }
};

// For convenience if you still want to use baseUrl elsewhere
export const baseUrl = BASE_URL;