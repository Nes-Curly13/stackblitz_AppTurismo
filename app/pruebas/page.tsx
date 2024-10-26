"use client"
import { useSitio } from '@/hooks/use-sitio';
import { useEffect } from 'react';
import MainSitioCard from '@/components/main/sitioTuristicoCard'

export default function Prueba() {
  const { sitios, getSitios } = useSitio()
  useEffect(() => {
    getSitios()
  }, []);
  console.log(sitios);
  return (
    
    
    <main>
      {
        sitios.map(sitio => {
          const {
            id,
            Titulo:name ,
            Descripcion:descripcion,
            Valoracion:valoracion,
            Imagen_pri:Imagen
          }=sitio
          return <MainSitioCard 
          key={sitio.id} 
          Titulo={name}
          Descripcion={descripcion}
          Valoracion={valoracion}
          Imagen_pri={Imagen|| '/assets/images/OIP.jpg'}
          
          />
        })
      }

    </main>


  );

}