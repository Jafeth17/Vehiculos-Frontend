import axios from 'axios';
//Se declara la url base de la API para las entradas y salidas
const API_URL = 'http://localhost:5000/entradas-salidas';

//Estructura para cada una de las consultas de entradas-salidas
const obtenerEntradasSalidas = async (queryString = '') => {
    const response = await fetch(`http://localhost:5000/entradas-salidas/${queryString}`);
    const data = await response.json();
    return data;
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
//Se exportan para ser usadas en los otros componentes
export { obtenerEntradasSalidas, crearEntradaSalida, actualizarEntradaSalida, eliminarEntradaSalida };
