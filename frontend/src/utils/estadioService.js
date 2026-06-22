import axios from "axios";

const API_URL = "http://localhost:8080/api/estadios";

export const listarEstadios = () => axios.get(API_URL);
export const buscarEstadioPorId = (id) => axios.get(`${API_URL}/${id}`);
export const criarEstadio = (dados) => axios.post(API_URL, dados);
export const atualizarEstadio = (id, dados) =>
  axios.put(`${API_URL}/${id}`, dados);
export const deletarEstadio = (id) => axios.delete(`${API_URL}/${id}`);
