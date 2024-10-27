'use client'

import { useState, useEffect } from 'react'
import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, ChevronLeft, ChevronRight, MapPin } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from '@/lib/supabase';
import { useSitio } from '@/hooks/use-sitio'
import MainSitioCard from '@/components/main/sitioTuristicoCard'
import MainCarrouselCard from '@/components/main/CarrouselSitioCard'


// Interfaz de los datos de la base de datos
interface DestinationFromDB {
  id: number;
  Titulo: string;
  Categoria: string;
  Imagen_pri: string;
  Valoracion: string;
  Descripcion?: string;
}

// Interfaz de los datos mapeados
interface Destination {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  rating: number;
  type: string;
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('')
  const [carouselIndex, setCarouselIndex] = useState(0)
 

  // Fetch de destinos desde Supabase
  const { sitios, getSitios } = useSitio()
  useEffect(() => {
    getSitios(filterType !== "All" ? filterType : undefined)
  }, [filterType]);

  useEffect(() => {
    console.log(sitios);
  }, [sitios]);
  // filter recomendations but the ones that are on the cache of app
  // const filteredDestinations = destinations.filter(dest =>
  //   dest.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
  //   (filterType === 'All' || dest.type === filterType)
  // )

  const featuredDestinations = sitios.slice(0, 3)

  const nextSlide = () => {
    setCarouselIndex((prevIndex) => (prevIndex + 1) % featuredDestinations.length)
  }

  const prevSlide = () => {
    setCarouselIndex((prevIndex) => (prevIndex - 1 + featuredDestinations.length) % featuredDestinations.length)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center justify-between">
        <Link className="flex items-center justify-center" href="/">
          <MapPin className="h-6 w-6 mr-2" />
          <span className="text-lg font-bold">TurValleGuide</span>
        </Link>
        <nav className="flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/destinations">
            Destinos
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/hotels">
            Hoteles
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/map">
            Explorar mapa
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Descrubre tu proxima aventura
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Explora los mejores destinos del Valle del Cauca, encuentra los hoteles mejor puntuados y planea tu viaje perfecto.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex flex-col space-y-2" onSubmit={(e) => e.preventDefault()}>
                  <div className="flex space-x-2">
                    <Input
                      className="max-w-lg flex-1"
                      placeholder="Buscar destinos"
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button type="submit">
                      <Search className="h-4 w-4" />
                      <span className="sr-only">Buscar</span>
                    </Button>
                  </div>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">Todos los tipos</SelectItem>
                      <SelectItem value="gastronomico">Gastronomico</SelectItem>
                      <SelectItem value="natural">Natural</SelectItem>
                      <SelectItem value="hosteleria">Hoteles</SelectItem>
                    </SelectContent>
                  </Select>
                </form>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Destinos destacados</h2>
            <div className="relative">
              <div className="overflow-hidden">
                <div className="flex transition-transform duration-300 ease-in-out" style={{ transform: `translateX(-${carouselIndex * 100}%)` }}>
                  
                  {sitios.map( (sitio) => {
                    
                    const {
                      id:id,
                      Titulo: name,
                      Descripcion: descripcion,
                      Categoria: categoria,
                      Valoracion: valoracion,
                      Imagen_pri: Imagen,
                    } = sitio

                    return (
                      <div key={id} className="w-full flex-shrink-0">
                      <MainCarrouselCard key={id} id={id} Titulo={name} 
                      Descripcion={descripcion || "sin descripcion disponible"}
                      Valoracion={valoracion || "sin puntuar"}
                      Categoria={categoria}
                      Imagen_pri={Imagen || "/assets/images/OIP.jpg"}>
                      </MainCarrouselCard>
                      </div>
                    )
                  }
                  )}
                </div>
              </div>
              <Button variant="outline" className="absolute top-1/2 left-4 transform -translate-y-1/2" onClick={prevSlide}>
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button variant="outline" className="absolute top-1/2 right-4 transform -translate-y-1/2" onClick={nextSlide}>
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 justify-center items-center">
  <div className="container px-4 md:px-6">
    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
    Destinos Populares 
    </h2>
    <div className="flex items-center justify-center min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sitios.map((sitio) => {
          const {
            id:id,
            Titulo: name,
            Descripcion: descripcion,
            Categoria: categoria,
            Valoracion: valoracion,
            Imagen_pri: Imagen,
          } = sitio;
          return (
            <MainSitioCard
              key={sitio.id}
              Titulo={name}
              Descripcion={descripcion || "sin descripcion disponible"}
              Categoria={categoria}
              Valoracion={valoracion || "sin puntuar"}
              Imagen_pri={Imagen || "/assets/images/OIP.jpg"}
            />
          );
        })}
      </div>
    </div>
  </div>
</section>

      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2023 TravelGuide Inc. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="/terms">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="/privacy">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}
