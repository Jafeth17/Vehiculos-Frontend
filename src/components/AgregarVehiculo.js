import React, { useState } from 'react';
import { crearVehiculo } from '../services/vehiculosService';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Messages } from 'primereact/messages';
import Container from './Container';

const AgregarVehiculo = () => {
    const [vehiculo, setVehiculo] = useState({
        marca: '',
        modelo: '',
        placa: ''
    });
    const [mensaje, setMensaje] = useState(null);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setVehiculo({ ...vehiculo, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await crearVehiculo(vehiculo);
            setMensaje('Vehículo agregado exitosamente.');
            setError(null);
            setVehiculo({ marca: '', modelo: '', placa: '' }); // Limpiar el formulario
        } catch (error) {
            setError('Error al agregar el vehículo: ' + (error.response?.data?.error || error.message));
            setMensaje(null);
        }
    };

    return (
        <Container>
            <div>
                <h2>Agregar Vehículo</h2>
                {mensaje && <Messages severity="success" text={mensaje} />}
                {error && <Messages severity="error" text={error} />}

                <form onSubmit={handleSubmit} className="p-grid p-fluid">
                    <div className="p-field">
                        <label htmlFor="marca">Marca:</label>
                        <InputText id="marca" name="marca" value={vehiculo.marca} onChange={handleChange} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="modelo">Modelo:</label>
                        <InputText id="modelo" name="modelo" value={vehiculo.modelo} onChange={handleChange} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="placa">Placa:</label>
                        <InputText id="placa" name="placa" value={vehiculo.placa} onChange={handleChange} />
                    </div>
                    <Button label="Agregar Vehículo" icon="pi pi-check" className="p-button-success" type="submit" />
                </form>
            </div>
        </Container>
    );
};

export default AgregarVehiculo;
