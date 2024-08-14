import React from 'react';
import './Container.css'; 

//Componente de contenedor para renderizar el resto de componentes dentro de
// el para mantener el mismo estilo
const Container = ({ children }) => {
    return (
        <div className="main-container">
            {children}
        </div>
    );
};

export default Container;
