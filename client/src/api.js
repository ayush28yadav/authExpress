import axios from "axios";

// These defaults apply to every axios request in the app.
axios.defaults.baseURL = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api`;
axios.defaults.withCredentials = true;

export default axios;
