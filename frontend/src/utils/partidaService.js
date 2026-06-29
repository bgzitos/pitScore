import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL || "http://localhost:8080"}/api/partidas`;

export const listarPartidas = () => axios.get(API_URL);
export const buscarPartidaPorId = (id) => axios.get(`${API_URL}/${id}`);
export const criarPartida = (dados) => axios.post(API_URL, dados);
export const atualizarPartida = (id, dados) => axios.put(`${API_URL}/${id}`, dados);
export const deletarPartida = (id) => axios.delete(`${API_URL}/${id}`);
