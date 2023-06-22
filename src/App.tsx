import React, { useEffect, useState } from 'react';
import './App.css';
import LoggedIn from './components/LoggedIn';
import InGame from './components/InGame';
import NoClient from './components/NoClient';
import { ipcRenderer } from 'electron';

const App = () => {
  const [isLoading, setIsloading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await ipcRenderer.invoke('find-league-of-legends');
        if (data) {
          // Procesa los datos recibidos
          console.log(data);
        } else {
          console.log('League of Legends client not found.');
        }
      } catch (error: any) {
        console.error(error);
      }
      setIsloading(false);
    };
  
    fetchData();
  }, []);

  if (isLoading) {
    return <div>
      cargando...
    </div>
  }

  if (error) {
    return <div>ocurrio un error: {error.message}</div>
  }

  // renderizar vista basada en la respuesta

  if (data) {
    return <LoggedIn data={data}/>
  }

  // if (data?.status === 'in-game') {
  //   return <InGame data={data}/>
  // }

  return <NoClient/>

}

export default App;
