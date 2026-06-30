import axios from "axios";

const BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";
const API = `${BASE}/api`;

export const cadastrarUsuario = (dados) => axios.post(`${API}/usuarios`, dados);
export const fazerLogin = (dados) => axios.post(`${API}/auth/login`, dados);
export const fazerLogout = (token) => axios.post(`${API}/auth/logout`, { token });
