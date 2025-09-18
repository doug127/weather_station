import axios from "axios";

// Node.js + Express
export const api = axios.create({
    baseURL: "http://localhost:3000/api",
})
// Django 
export const djangoApi = axios.create({
  baseURL: "http://localhost:8000/api", 
});
