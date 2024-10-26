'use client'

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"


export default function MainSitioCard({
    Titulo, Descripcion, Valoracion, Imagen_pri
}: {

    Titulo: string,
    Descripcion: string,
    Valoracion: number,
    Imagen_pri: string
}) {

    return (
        
            <Card>
                <CardHeader className="p-0">
                    <Image
                        src={Imagen_pri}
                        alt={Descripcion}
                        width={600}
                        height={400}
                        className="w-full h-48 object-cover"
                    />
                </CardHeader>
                <CardContent className="p-4" >
                    <CardTitle className="text-xl mb-2" > {Titulo} </CardTitle>
                    < p className="text-sm text-gray-600 dark:text-gray-400 mb-2" > {Descripcion} </p>
                    < div className="flex items-center" >
                        <span className="text-yellow-500 mr-1" >★</span>
                        < span > {Valoracion} </span>
                    </div>
                </CardContent>
                <CardFooter className="p-4">
                    <Button asChild className="w-full">
                        {/* enlace para indicar a donde ir despues de precionar el elemento, deberia de llevar a 
                        la app de mapa con el zoom en el lugar. */}
                        <Link href={`/destinations/${Titulo}`}>Learn More</Link>
                    </Button>
                </CardFooter>
            </Card>
        


    )

}

