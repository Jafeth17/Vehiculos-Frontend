import React, { useEffect, useState } from 'react';
import { obtenerVehiculos, eliminarVehiculo, crearVehiculo, actualizarVehiculo } from '../services/vehiculosService';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Messages } from 'primereact/messages';
import Container from './Container';

const VehiculosList = () => {
    const [vehiculos, setVehiculos] = useState([]);
    const [vehiculo, setVehiculo] = useState({ marca: '', modelo: '', placa: '' });
    const [mostrarDialogo, setMostrarDialogo] = useState(false);
    const [editando, setEditando] = useState(false);
    const [mensaje, setMensaje] = useState(null);
    const [error, setError] = useState(null);

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

    const openNew = () => {
        setVehiculo({ marca: '', modelo: '', placa: '' });
        setEditando(false);
        setMostrarDialogo(true);
    };

    const openEdit = (vehiculo) => {
        setVehiculo({ ...vehiculo });
        setEditando(true);
        setMostrarDialogo(true);
    };

    const hideDialog = () => {
        setMostrarDialogo(false);
        setError(null);
        setMensaje(null);
    };

    const saveVehiculo = async () => {
        try {
            if (editando) {
                await actualizarVehiculo(vehiculo.id, vehiculo);
                setMensaje('Vehículo actualizado exitosamente.');
            } else {
                await crearVehiculo(vehiculo);
                setMensaje('Vehículo agregado exitosamente.');
            }
            setVehiculos(await obtenerVehiculos());
            hideDialog();
        } catch (error) {
            setError('Error al guardar el vehículo: ' + (error.response?.data?.error || error.message));
        }
    };

    const renderActions = (rowData) => {
        return (
            <div>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-info" onClick={() => openEdit(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => handleDelete(rowData.id)} />
            </div>
        );
    };

    const renderFooter = () => {
        return (
            <div>
                <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
                <Button label="Guardar" icon="pi pi-check" className="p-button" onClick={saveVehiculo} />
            </div>
        );
    };

    return (
        <Container>
            <div>
                <h2 className="p-text-center">Lista de Vehículos</h2>
                <Toolbar className="p-mb-4" left={<Button label="Agregar Vehículo" icon="pi pi-plus" className="p-button-success" onClick={openNew} />} />

                <DataTable value={vehiculos} paginator rows={10} responsiveLayout="scroll" className="p-datatable-sm">
                    <Column field="marca" header="Marca" />
                    <Column field="modelo" header="Modelo" />
                    <Column field="placa" header="Placa" />
                    <Column body={renderActions} header="Acciones" />
                </DataTable>

                <Dialog
                    visible={mostrarDialogo}
                    style={{ width: '450px' }}
                    header={editando ? "Editar Vehículo" : "Agregar Vehículo"}
                    modal
                    className="p-fluid"
                    footer={renderFooter()}
                    onHide={hideDialog}
                >
                    {mensaje && <Messages severity="success" text={mensaje} />}
                    {error && <Messages severity="error" text={error} />}

                    <div className="p-field">
                        <label htmlFor="marca">Marca:</label>
                        <InputText id="marca" name="marca" value={vehiculo.marca} onChange={(e) => setVehiculo({ ...vehiculo, marca: e.target.value })} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="modelo">Modelo:</label>
                        <InputText id="modelo" name="modelo" value={vehiculo.modelo} onChange={(e) => setVehiculo({ ...vehiculo, modelo: e.target.value })} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="placa">Placa:</label>
                        <InputText id="placa" name="placa" value={vehiculo.placa} onChange={(e) => setVehiculo({ ...vehiculo, placa: e.target.value })} />
                    </div>
                </Dialog>
            </div>
        </Container>
    );
};

export default VehiculosList;
