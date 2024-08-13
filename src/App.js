import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import VehiculosList from './components/VehiculosList';
import AgregarVehiculo from './components/AgregarVehiculo';
import EditarVehiculo from './components/EditarVehiculo';
import EntradasSalidasList from './components/EntradasSalidasList'; // Importar el componente EntradasSalidas
import 'primereact/resources/themes/lara-light-blue/theme.css';  // Tema de PrimeReact
import 'primereact/resources/primereact.min.css';                 // Componentes principales de PrimeReact
import 'primeicons/primeicons.css';                               // Íconos de PrimeReact
import 'primeflex/primeflex.css';                                 // Flexbox utilidades de PrimeFlex (opcional)

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<VehiculosList />} />
                <Route path="/agregar-vehiculo" element={<AgregarVehiculo />} />
                <Route path="/editar-vehiculo/:id" element={<EditarVehiculo />} />
                <Route path="/entradas-salidas" element={<EntradasSalidasList />} /> {/* Nueva ruta para Entradas y Salidas */}
            </Routes>
        </Router>
    );
}

export default App;
