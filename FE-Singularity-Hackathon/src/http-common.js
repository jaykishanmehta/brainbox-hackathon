import axios from "axios";
console.log("REACT_APP_API_KEY===", process.env.REACT_APP_API_KEY);
export default axios.create({
  baseURL: process.env.REACT_APP_API_KEY || "http://localhost:8080",
  headers: {
    "Content-type": "application/json",
  },
});
