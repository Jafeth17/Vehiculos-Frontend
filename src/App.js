import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import VehiculosList from './components/VehiculosList';
import AgregarVehiculo from './components/AgregarVehiculo';
import EditarVehiculo from './components/EditarVehiculo';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<VehiculosList />} />
                <Route path="/agregar-vehiculo" element={<AgregarVehiculo />} />
                <Route path="/editar-vehiculo/:id" element={<EditarVehiculo />} />
            </Routes>
        </Router>
    );
}

export default App;
