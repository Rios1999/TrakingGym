export const BASE_URL = import.meta.env.PROD ? import.meta.env.VITE_HOST_PROD : import.meta.env.VITE_HOST_DEV;

export const headers = {
  "Content-Type": "application/json",
};
