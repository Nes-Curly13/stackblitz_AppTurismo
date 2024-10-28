import { useState } from "react";
import { supabase } from "@/lib/supabase";

export const useSitio = () => {
  const [sitios, setSitios] = useState<any[]>([]);

  const getSitios = async (categoria?: string, start: number = 0, end: number = 8) => {
    try {
      // Inicializa la consulta base
      let query = supabase
        .from("SITIO TURISTICO")
        .select("id,Titulo,Categoria,Descripcion,Valoracion,Imagen_pri,latitud,longitud")
        .order("Valoracion", { ascending: false })
        .range(start, end);

      // Aplica filtro si se proporciona una categoría
      if (categoria) {
        query = query.eq("Categoria", categoria);
      }

      const { data, error } = await query;

      if (data) {
        setSitios(data);
      } else {
        console.log("No hay datos");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return {
    sitios,
    getSitios,
  };
};
