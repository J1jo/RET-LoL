import React from 'react';

interface InGameProps {
    data: any; // Reemplaza 'any' con el tipo adecuado de tus datos
}

const InGame = ({ data }: InGameProps) => {
  return (
    <div>
      <h1>Estás en partida</h1>
      <p>Tiempo de partida: {data.gameTime}</p>
      <p>Puntuación: {data.score}</p>
      {/* Otros datos que deseas mostrar */}
    </div>
  );
};

export default InGame;
