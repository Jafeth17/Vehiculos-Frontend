import React from 'react';
import './Container.css'; // Archivo CSS para estilos

const Container = ({ children }) => {
    return (
        <div className="main-container">
            {children}
        </div>
    );
};

export default Container;
