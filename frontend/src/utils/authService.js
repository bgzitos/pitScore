import axios from "axios";

const API_URL = "http://localhost:8080/api";

export const cadastrarUsuario = (dados) =>
  axios.post(`${API_URL}/usuarios`, dados);

export const fazerLogin = (dados) => axios.post(`${API_URL}/auth/login`, dados);

export const fazerLogout = (token) =>
  axios.post(`${API_URL}/auth/logout`, { token });
