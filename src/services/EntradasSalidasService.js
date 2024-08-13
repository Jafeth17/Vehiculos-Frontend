import axios from 'axios';

const API_URL = 'http://localhost:5000/entradasSalidas';

const obtenerEntradasSalidas = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

const crearEntradaSalida = async (entradaSalida) => {
    const response = await axios.post(API_URL, entradaSalida);
    return response.data;
};

const actualizarEntradaSalida = async (id, entradaSalida) => {
    const response = await axios.put(`${API_URL}/${id}`, entradaSalida);
    return response.data;
};

const eliminarEntradaSalida = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};

export { obtenerEntradasSalidas, crearEntradaSalida, actualizarEntradaSalida, eliminarEntradaSalida };
