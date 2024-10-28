'use client'

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Star } from "lucide-react"

interface SitioMapCardProps {
    id: number,
    Titulo: string,
    Descripcion: string,
    Categoria: string,
    Municipio: string,
    Valoracion: string,
    Imagen_pri: string,
    latitud: number,
    longitud: number,
    onCardClick: (id: number, lat: number, lon: number) => void
}

export default function SitioMapCard({
    id, Titulo, Descripcion, Categoria, Municipio, Valoracion, Imagen_pri, latitud, longitud, onCardClick
}: SitioMapCardProps) {

    return (
        <Card 
            key={id} 
            className="mb-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onCardClick(id, latitud, longitud)}
        >
            <CardContent className="p-4 flex">
                <Image
                    src={Imagen_pri}
                    alt={Titulo}
                    width={100}
                    height={100}
                    className="rounded-md mr-4"
                />
                <div className="flex-1">
                    <h3 className="text-lg font-semibold">{Titulo}</h3>
                    <p className="text-sm text-gray-600">{Municipio}</p>
                    <div className="flex items-center mt-1">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span>{Valoracion}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                            {Categoria}
                        </span>
                    </div>
                </div>
                <Button variant="ghost" size="icon" className="self-start ml-2">
                    <Heart className="h-4 w-4" />
                    <span className="sr-only">Add to favorites</span>
                </Button>
            </CardContent>
        </Card>
    )
}