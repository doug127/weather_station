import axios from "axios";

// Node.js + Express
export const api = axios.create({
    baseURL: "http://127.0.0.1:3000/api",
    withCredentials: true
})
// Django 
export const djangoApi = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  withCredentials: true
});
