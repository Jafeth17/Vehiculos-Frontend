import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import VehiculosList from './components/VehiculosList';
import EntradasSalidasList from './components/EntradasSalidasList'; 
import 'primereact/resources/themes/lara-light-blue/theme.css';  
import 'primereact/resources/primereact.min.css';                
import 'primeicons/primeicons.css';                               
import 'primeflex/primeflex.css';                                 

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<VehiculosList />} />
                <Route path="/entradas-salidas" element={<EntradasSalidasList />} /> 
            </Routes>
        </Router>
    );
}

export default App;
