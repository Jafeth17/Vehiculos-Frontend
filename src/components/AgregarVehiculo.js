import React, { useState } from 'react';
import { crearVehiculo } from '../services/vehiculosService';

const AgregarVehiculo = () => {
    const [vehiculo, setVehiculo] = useState({
        marca: '',
        modelo: '',
        placa: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setVehiculo({ ...vehiculo, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await crearVehiculo(vehiculo);
        // Limpia el formulario o muestra un mensaje de éxito
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>Marca:</label>
            <input type="text" name="marca" value={vehiculo.marca} onChange={handleChange} />
            <label>Modelo:</label>
            <input type="text" name="modelo" value={vehiculo.modelo} onChange={handleChange} />
            <label>Placa:</label>
            <input type="text" name="placa" value={vehiculo.placa} onChange={handleChange} />
            <button type="submit">Agregar Vehículo</button>
        </form>
    );
};

export default AgregarVehiculo;
