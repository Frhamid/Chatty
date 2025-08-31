import axios from "axios";

// const BASE_URL =
//   import.meta.env.MODE === "development"
//     ? "http://localhost:5001/api"
//     : import.meta.env.PROD_API_BASE_URL; // define this in your production env

// const BASE_URL = import.meta.env.PROD_API_BASE_URL;
const BASE_URL = "https://chatty-lac-three.vercel.app/api";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send the cookies that contains token
});
