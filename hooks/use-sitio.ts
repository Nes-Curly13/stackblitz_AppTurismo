
import { useState } from "react"
import {supabase} from "@/lib/supabase"

export const useSitio= ()=>{
    const [sitios, setSitios]= useState(<any[]>([]))

    const getSitios = async () => {
        try {
            const { data, error } = await supabase
                .from('SITIO TURISTICO')
                .select('id,Titulo,Descripcion,Valoracion,Imagen_pri')
                .order('Valoracion', {ascending:true})
                .range(0,9)
    
                if(data){
                    setSitios(data);
                    
                }
                else(
                    console.log("no hay datos")                
                )
        } catch (error) {
            console.log(error);
            
        }
}
return {
    sitios, getSitios
}
}