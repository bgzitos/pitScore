import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL || "http://localhost:8080"}/api/selecoes`;

export const listarSelecoes = () => axios.get(API_URL);
export const buscarSelecaoPorId = (id) => axios.get(`${API_URL}/${id}`);
