import React, { useEffect, useState } from 'react';
import { obtenerVehiculos, eliminarVehiculo } from '../services/vehiculosService';
import { Link } from 'react-router-dom';

const VehiculosList = () => {
    const [vehiculos, setVehiculos] = useState([]);

    useEffect(() => {
        const fetchVehiculos = async () => {
            const data = await obtenerVehiculos();
            setVehiculos(data);
        };

        fetchVehiculos();
    }, []);

    const handleDelete = async (id) => {
        await eliminarVehiculo(id);
        setVehiculos(vehiculos.filter(vehiculo => vehiculo.id !== id));
    };

    return (
        <div>
            <h2>Lista de Vehículos</h2>
            <ul>
                {vehiculos.map(vehiculo => (
                    <li key={vehiculo.id}>
                        {vehiculo.marca} {vehiculo.modelo} - {vehiculo.placa}
                        <Link to={`/editar-vehiculo/${vehiculo.id}`}>Editar</Link>
                        <button onClick={() => handleDelete(vehiculo.id)}>Eliminar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default VehiculosList;
