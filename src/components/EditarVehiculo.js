import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { actualizarVehiculo, obtenerVehiculos } from '../services/vehiculosService';

const EditarVehiculo = () => {
    const { id } = useParams();
    const [vehiculo, setVehiculo] = useState({
        marca: '',
        modelo: '',
        placa: ''
    });

    useEffect(() => {
        const fetchVehiculo = async () => {
            const vehiculos = await obtenerVehiculos();
            const vehiculoEncontrado = vehiculos.find(v => v.id === parseInt(id));
            if (vehiculoEncontrado) {
                setVehiculo(vehiculoEncontrado);
            }
        };
        fetchVehiculo();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setVehiculo({ ...vehiculo, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await actualizarVehiculo(id, vehiculo);
        // Redirigir o mostrar un mensaje de éxito
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>Marca:</label>
            <input type="text" name="marca" value={vehiculo.marca} onChange={handleChange} />
            <label>Modelo:</label>
            <input type="text" name="modelo" value={vehiculo.modelo} onChange={handleChange} />
            <label>Placa:</label>
            <input type="text" name="placa" value={vehiculo.placa} onChange={handleChange} />
            <button type="submit">Actualizar Vehículo</button>
        </form>
    );
};

export default EditarVehiculo;
