import React from 'react';

interface LoggedInProps {
    data: any; // Reemplaza 'any' con el tipo adecuado de tus datos
}

const LoggedIn = ({ data }: LoggedInProps) => {
  return (
    <div>
      <h1>Cliente conectado</h1>
      <p>Nombre de usuario: {data.username}</p>
      <p>Nivel: {data.level}</p>
      <p>Rango: {data.rank}</p>
      {/* Otros datos que deseas mostrar */}
    </div>
  );
};

export default LoggedIn;
