import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;
const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

const client = axios.create({
  // withCredentials: true,
  baseURL: BASE_URL,
  headers: {
    "Referrer-Policy": "strict-origin-when-cross-origin",
  },
});

export const request = async ({ ...option }) => {
  const accessToken = localStorage.getItem("access_token");
  const refreshToken = localStorage.getItem("refresh_token");

  if (accessToken) {
    client.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  }

  const onSuccess = (response) => {
    return response;
  };
  const onError = async (error) => {
    // Error handling
    if (
      error.response.status === 401 &&
      error.response.data.message === "JWT token has expired"
    ) {
      await axios
        .get(BASE_URL + "/auth/refresh-token", {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${refreshToken}`,
            "API-Key": API_KEY,
            "Referrer-Policy": "strict-origin-when-cross-origin",
          },
        })
        .then((response) => {
          localStorage.setItem("access_token", response.data.access_token);
          localStorage.setItem("refresh_token", response.data.refresh_token);
          localStorage.setItem("role", response.data.role);
        })
        .catch(async (err) => {
          await axios
            .get(BASE_URL + "/auth/logout", {
              withCredentials: true,
              headers: {
                "API-Key": API_KEY,
                "Referrer-Policy": "strict-origin-when-cross-origin",
              },
            })
            .then(() => {
              window.location.href = FRONTEND_URL;
              localStorage.removeItem("access_token");
              localStorage.removeItem("refresh_token");
              localStorage.removeItem("role");
            });
          return err;
        });
    }

    throw error;
  };

  return await client(option).then(onSuccess).catch(onError);
};
