'use client'

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"


export default function MainCarrouselCard({
    id,Titulo, Descripcion,Categoria, Valoracion, Imagen_pri
}: {
    id:number,
    Titulo: string,
    Descripcion: string,
    Categoria:string,
    Valoracion: string,
    Imagen_pri: string
}) {

    return (
        
        
        <Card className="overflow-hidden">
          <CardHeader className="p-0">
            <Image
              src={Imagen_pri}
              alt={Titulo}
              width={600}
              height={400}
              className="w-full h-64 object-cover"
            />
          </CardHeader>
          <CardContent className="p-4">
            <CardTitle className="text-xl mb-2">{Titulo}</CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">{Descripcion}</p>
            < span > {Categoria} </span>
          </CardContent>
          <CardFooter className="p-4">
            <Button asChild>
              <Link href={`/destinations/${id}`}>Explorar</Link>
            </Button>
          </CardFooter>
        </Card>
      
        


    )

}

