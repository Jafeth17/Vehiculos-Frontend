import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { obtenerVehiculos, eliminarVehiculo, crearVehiculo, actualizarVehiculo } from '../services/vehiculosService';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import Container from './Container';
/*
  Componente que muestra la lista de vehículos y permite CRUD de vehículos.
 */
const VehiculosList = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [vehiculo, setVehiculo] = useState({ marca: '', modelo: '', placa: '' });
  const [mostrarDialogo, setMostrarDialogo] = useState(false);
  const [editando, setEditando] = useState(false);
  const toast = useRef(null);

  useEffect(() => {
      const fetchVehiculos = async () => {
          const data = await obtenerVehiculos();
          setVehiculos(data);
      };

      fetchVehiculos();
  }, []);

   /* Maneja la eliminación de un vehículo con confirmación previa.*/
  const handleDelete = async (id) => {
      confirmDialog({
          message: '¿Está seguro de que desea eliminar este vehículo?',
          header: 'Confirmación',
          icon: 'pi pi-exclamation-triangle',
          accept: async () => {
              await eliminarVehiculo(id);
              setVehiculos(vehiculos.filter(vehiculo => vehiculo.id !== id));
              showToast('success', 'Vehículo eliminado con éxito');
          }
      });
  };
  //Abre el modal para agregar un nuevo vehículo.
  const openNew = () => {
      setVehiculo({ marca: '', modelo: '', placa: '' });
      setEditando(false);
      setMostrarDialogo(true);
  };
  //Abre el modal para editar un vehículo existente.
  const openEdit = (vehiculo) => {
      setVehiculo({ ...vehiculo });
      setEditando(true);
      setMostrarDialogo(true);
  };
  //Oculta el modal de agregar/editar vehículo.
  const hideDialog = () => {
      setMostrarDialogo(false);
  };
  //Validaciones de datos obligatorios y campo unico
  const validateFields = () => {
      if (!vehiculo.marca) {
          showToast('error', 'La marca es obligatoria');
          return false;
      }
      if (!vehiculo.modelo) {
          showToast('error', 'El modelo es obligatorio');
          return false;
      }
      if (!vehiculo.placa) {
          showToast('error', 'La placa es obligatoria');
          return false;
      }
      if (!/^[A-Z0-9-]+$/.test(vehiculo.placa)) {
          showToast('error', 'La placa debe ser alfanumérica y puede incluir guiones');
          return false;
      }
      return true;
  };
  //Funcion para guardar un vehiculo nuevo o editado.
  const saveVehiculo = async () => {
    if (!validateFields()) return;

    try {
        if (editando) {
            await actualizarVehiculo(vehiculo.id, vehiculo);
            showToast('success', 'Vehículo actualizado con éxito');
        } else {
            await crearVehiculo(vehiculo);
            showToast('success', 'Vehículo agregado con éxito');
        }
        setVehiculos(await obtenerVehiculos());
        hideDialog();
    } catch (error) {
        if (error.response && error.response.data && error.response.data.error === 'Ya existe un vehículo con esta placa') {
            showToast('error', 'Ya existe un vehículo con esta placa');
        } else {
            showToast('error', 'Error al guardar el vehículo');
        }
    }
};

// Para mostrar notificaiones.
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
              <Button label="Guardar" icon="pi pi-check" className="p-button" onClick={saveVehiculo} />
          </div>
      );
  };

  return (
      <Container>
          <Toast ref={toast} />
          <ConfirmDialog />
          <div>
              <h2 className="p-text-center">Lista de Vehículos</h2>
              <Toolbar
                  className="p-mb-4"
                  left={
                      <>
                          <Button
                              label="Agregar Vehículo"
                              icon="pi pi-plus"
                              className="p-button-success"
                              onClick={openNew}
                          />
                          <Link to="/entradas-salidas">
                              <Button
                                  label="Ver Entradas y Salidas"
                                  icon="pi pi-calendar"
                                  className="p-button-info p-ml-2"
                              />
                          </Link>
                      </>
                  }
              />
              <DataTable value={vehiculos} paginator rows={10} responsiveLayout="scroll" className="p-datatable-sm">
                  <Column field="id" header="Código" />  {/* Nueva columna para el ID del vehículo */}
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
