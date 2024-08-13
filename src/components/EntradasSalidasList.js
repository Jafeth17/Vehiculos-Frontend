import React, { useEffect, useState } from 'react';
import { obtenerEntradasSalidas, eliminarEntradaSalida, crearEntradaSalida, actualizarEntradaSalida } from '../services/EntradasSalidasService';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Messages } from 'primereact/messages';
import { Link } from 'react-router-dom';
import Container from './Container';

const EntradasSalidasList = () => {
    const [entradasSalidas, setEntradasSalidas] = useState([]);
    const [entradaSalida, setEntradaSalida] = useState({ vehiculoId: '', nombreMotorista: '', fecha: null, hora: '', kilometraje: '' });
    const [mostrarDialogo, setMostrarDialogo] = useState(false);
    const [editando, setEditando] = useState(false);
    const [mensaje, setMensaje] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEntradasSalidas = async () => {
            const data = await obtenerEntradasSalidas();
            setEntradasSalidas(data);
        };

        fetchEntradasSalidas();
    }, []);

    const handleDelete = async (id) => {
        await eliminarEntradaSalida(id);
        setEntradasSalidas(entradasSalidas.filter(es => es.id !== id));
    };

    const openNew = () => {
        setEntradaSalida({ vehiculoId: '', nombreMotorista: '', fecha: null, hora: '', kilometraje: '' });
        setEditando(false);
        setMostrarDialogo(true);
    };

    const openEdit = (es) => {
        setEntradaSalida({ ...es, fecha: new Date(es.fecha) });
        setEditando(true);
        setMostrarDialogo(true);
    };

    const hideDialog = () => {
        setMostrarDialogo(false);
        setError(null);
        setMensaje(null);
    };

    const saveEntradaSalida = async () => {
        try {
            if (editando) {
                await actualizarEntradaSalida(entradaSalida.id, entradaSalida);
                setMensaje('Registro actualizado exitosamente.');
            } else {
                await crearEntradaSalida(entradaSalida);
                setMensaje('Registro agregado exitosamente.');
            }
            setEntradasSalidas(await obtenerEntradasSalidas());
            hideDialog();
        } catch (error) {
            setError('Error al guardar el registro: ' + (error.response?.data?.error || error.message));
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
                <Button label="Guardar" icon="pi pi-check" className="p-button" onClick={saveEntradaSalida} />
            </div>
        );
    };

    return (
        <Container>
            <div>
                <h2 className="p-text-center">Entradas y Salidas de Vehículos</h2>
                <Toolbar className="p-mb-4" left={
                    <>
                        <Button label="Agregar Registro" icon="pi pi-plus" className="p-button-success" onClick={openNew} />
                        <Link to="/">
                            <Button label="Regresar a Vehículos" icon="pi pi-arrow-left" className="p-button-secondary p-ml-2" />
                        </Link>
                    </>
                } />

                <DataTable value={entradasSalidas} paginator rows={10} responsiveLayout="scroll" className="p-datatable-sm">
                    <Column field="vehiculoId" header="ID Vehículo" />
                    <Column field="nombreMotorista" header="Nombre del Motorista" />
                    <Column field="fecha" header="Fecha" body={(rowData) => new Date(rowData.fecha).toLocaleDateString()} />
                    <Column field="hora" header="Hora" />
                    <Column field="kilometraje" header="Kilometraje" />
                    <Column body={renderActions} header="Acciones" />
                </DataTable>

                <Dialog
                    visible={mostrarDialogo}
                    style={{ width: '450px' }}
                    header={editando ? "Editar Registro" : "Agregar Registro"}
                    modal
                    className="p-fluid"
                    footer={renderFooter()}
                    onHide={hideDialog}
                >
                    {mensaje && <Messages severity="success" text={mensaje} />}
                    {error && <Messages severity="error" text={error} />}

                    <div className="p-field">
                        <label htmlFor="vehiculoId">ID Vehículo:</label>
                        <InputText id="vehiculoId" name="vehiculoId" value={entradaSalida.vehiculoId} onChange={(e) => setEntradaSalida({ ...entradaSalida, vehiculoId: e.target.value })} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="nombreMotorista">Nombre del Motorista:</label>
                        <InputText id="nombreMotorista" name="nombreMotorista" value={entradaSalida.nombreMotorista} onChange={(e) => setEntradaSalida({ ...entradaSalida, nombreMotorista: e.target.value })} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="fecha">Fecha:</label>
                        <Calendar id="fecha" name="fecha" value={entradaSalida.fecha} onChange={(e) => setEntradaSalida({ ...entradaSalida, fecha: e.value })} dateFormat="dd/mm/yy" />
                    </div>
                    <div className="p-field">
                        <label htmlFor="hora">Hora:</label>
                        <Calendar id="hora" name="hora" value={entradaSalida.hora} onChange={(e) => setEntradaSalida({ ...entradaSalida, hora: e.target.value })} timeOnly hourFormat="24" />
                    </div>
                    <div className="p-field">
                        <label htmlFor="kilometraje">Kilometraje:</label>
                        <InputText id="kilometraje" name="kilometraje" value={entradaSalida.kilometraje} onChange={(e) => setEntradaSalida({ ...entradaSalida, kilometraje: e.target.value })} />
                    </div>
                </Dialog>
            </div>
        </Container>
    );
};

export default EntradasSalidasList;
