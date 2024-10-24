"use client"
import { useSitio } from '@/hooks/use-sitio';
import { useEffect } from 'react';

export default function Prueba(){
  const {sitios, getSitios} = useSitio()
  useEffect(()=>{
    getSitios()
  },[]);

  return <div>
    <ul>
      {sitios.map((sitio:any, index:number) =><li key={index}>{sitio.Titulo}</li>)}
    </ul>
  </div>
}