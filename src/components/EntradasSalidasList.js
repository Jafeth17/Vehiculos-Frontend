import React, { useEffect, useState, useRef } from 'react';
import { obtenerEntradasSalidas, eliminarEntradaSalida, crearEntradaSalida, actualizarEntradaSalida } from '../services/EntradasSalidasService';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import InputMask from 'react-input-mask';
import { Dropdown } from 'primereact/dropdown';
import { Link } from 'react-router-dom';
import Container from './Container';
import 'primeflex/primeflex.css';

const EntradasSalidasList = () => {
    const [entradasSalidas, setEntradasSalidas] = useState([]);
    const [entradaSalida, setEntradaSalida] = useState({ vehiculoId: '', nombreMotorista: '', fecha: null, hora: '', kilometraje: '', tipo: '' });
    const [filters, setFilters] = useState({ fecha: null, vehiculoId: '', nombreMotorista: '' });
    const [mostrarDialogo, setMostrarDialogo] = useState(false);
    const [editando, setEditando] = useState(false);
    const toast = useRef(null);

    useEffect(() => {
        fetchEntradasSalidas();
    }, []);

    const fetchEntradasSalidas = async () => {
        try {
            const queryParams = new URLSearchParams();
    
            if (filters.fecha) {
                queryParams.append('fecha', filters.fecha.toISOString().split('T')[0]);
            }
            if (filters.vehiculoId) {
                queryParams.append('vehiculoId', filters.vehiculoId);
            }
            if (filters.nombreMotorista) {
                queryParams.append('nombreMotorista', filters.nombreMotorista);
            }
    
            const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
            const data = await obtenerEntradasSalidas(queryString);
            setEntradasSalidas(data);
        } catch (error) {
            console.error('Error al obtener las entradas y salidas:', error);
        }
    };

    const handleDelete = async (id) => {
        confirmDialog({
            message: '¿Está seguro de que desea eliminar este registro?',
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                await eliminarEntradaSalida(id);
                setEntradasSalidas(entradasSalidas.filter(es => es.id !== id));
                showToast('success', 'Registro eliminado con éxito');
            }
        });
    };

    const openNew = () => {
        setEntradaSalida({ vehiculoId: '', nombreMotorista: '', fecha: null, hora: '', kilometraje: '', tipo: '' });
        setEditando(false);
        setMostrarDialogo(true);
    };

    const openEdit = (es) => {
        setEntradaSalida({ ...es, fecha: new Date(es.fecha), hora: es.hora });
        setEditando(true);
        setMostrarDialogo(true);
    };

    const hideDialog = () => {
        setMostrarDialogo(false);
    };

    const validateFields = () => {
        if (!entradaSalida.vehiculoId) {
            showToast('error', 'El ID del vehículo es obligatorio');
            return false;
        }
        if (!entradaSalida.nombreMotorista) {
            showToast('error', 'El nombre del motorista es obligatorio');
            return false;
        }
        if (!entradaSalida.fecha) {
            showToast('error', 'La fecha es obligatoria');
            return false;
        }
        if (!entradaSalida.hora) {
            showToast('error', 'La hora es obligatoria');
            return false;
        }
        if (!/^\d+$/.test(entradaSalida.kilometraje)) {
            showToast('error', 'El kilometraje debe ser un número entero positivo');
            return false;
        }
        if (!entradaSalida.tipo) {
            showToast('error', 'El tipo es obligatorio');
            return false;
        }
        return true;
    };

    const saveEntradaSalida = async () => {
        if (!validateFields()) return;

        try {
            const fechaFormateada = entradaSalida.fecha.toISOString().split('T')[0];
            const horaFormateada = entradaSalida.hora;
            const entradaSalidaFormateada = {
                ...entradaSalida,
                fecha: fechaFormateada,
                hora: horaFormateada
            };

            if (editando) {
                await actualizarEntradaSalida(entradaSalida.id, entradaSalidaFormateada);
                showToast('success', 'Registro actualizado con éxito');
            } else {
                await crearEntradaSalida(entradaSalidaFormateada);
                showToast('success', 'Registro agregado con éxito');
            }
            fetchEntradasSalidas();
            hideDialog();
        } catch (error) {
            showToast('error', 'Error al guardar el registro');
        }
    };

    const showToast = (severity, summary) => {
        toast.current.show({ severity, summary, life: 3000 });
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

    const tipoOptions = [
        { label: 'Entrada', value: 'entrada' },
        { label: 'Salida', value: 'salida' }
    ];

    const handleFilterChange = (e, field) => {
        setFilters({ ...filters, [field]: e.target ? e.target.value : e.value });
    };

    const applyFilters = () => {
        fetchEntradasSalidas();
    };

    const clearFilters = () => {
        setFilters({ fecha: null, vehiculoId: '', nombreMotorista: '' });
        fetchEntradasSalidas();
    };

    return (
        <Container>
            <Toast ref={toast} />
            <ConfirmDialog />
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

                <div className="p-grid p-mb-4 p-align-center p-justify-start">
                    <div className="p-col-12 p-md-2 p-p-2">
                        <Calendar id="fecha" name="fecha" value={filters.fecha} onChange={(e) => handleFilterChange(e, 'fecha')} dateFormat="dd/mm/yy" placeholder="Filtrar por fecha" />
                  
                        <InputText id="vehiculoId" placeholder="Filtrar por vehículo" value={filters.vehiculoId} onChange={(e) => handleFilterChange(e, 'vehiculoId')} />
                  
                    
                        <InputText id="nombreMotorista" placeholder="Filtrar por motorista" value={filters.nombreMotorista} onChange={(e) => handleFilterChange(e, 'nombreMotorista')} />
                    </div>
                    <div className="p-col-12 p-md-3 p-p-2">
                        <Button label="Aplicar Filtros" icon="pi pi-filter" className="p-button-primary" onClick={applyFilters} />
                        <Button label="Quitar Filtros" icon="pi pi-times" className="p-button-secondary p-ml-2" onClick={clearFilters} />
                    </div>
                </div>

                <DataTable value={entradasSalidas} paginator rows={10} responsiveLayout="scroll" className="p-datatable-sm">
                    <Column field="vehiculoId" header="ID Vehículo" />
                    <Column field="nombreMotorista" header="Nombre del Motorista" />
                    <Column field="fecha" header="Fecha" body={(rowData) => new Date(rowData.fecha).toLocaleDateString()} />
                    <Column field="hora" header="Hora" />
                    <Column field="kilometraje" header="Kilometraje" />
                    <Column field="tipo" header="Tipo" />
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
                        <div className="p-inputgroup">
                            <InputMask id="hora" mask="99:99" value={entradaSalida.hora} onChange={(e) => setEntradaSalida({ ...entradaSalida, hora: e.target.value })} placeholder="HH:mm" className="p-inputtext p-component" />
                        </div>
                    </div>
                    <div className="p-field">
                        <label htmlFor="kilometraje">Kilometraje:</label>
                        <InputText id="kilometraje" name="kilometraje" value={entradaSalida.kilometraje} onChange={(e) => setEntradaSalida({ ...entradaSalida, kilometraje: e.target.value })} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="tipo">Tipo:</label>
                        <Dropdown id="tipo" name="tipo" value={entradaSalida.tipo} options={tipoOptions} onChange={(e) => setEntradaSalida({ ...entradaSalida, tipo: e.value })} placeholder="Selecciona tipo" />
                    </div>
                </Dialog>
            </div>
        </Container>
    );
};

export default EntradasSalidasList;
