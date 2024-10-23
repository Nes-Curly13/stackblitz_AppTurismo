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


// Interfaz de los datos de la base de datos
interface DestinationFromDB {
  id: number;
  Titulo: string;
  Categoria: string;
  Imagen_pri: string;
  Valoracion: string;
  Descripcio?: string;
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
  const [filterType, setFilterType] = useState('All')
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [destinations, setDestinations] = useState<Destination[]>([]) // Usamos el tipo Destination para el estado

  // Fetch de destinos desde Supabase
  useEffect(() => {
    const fetchDestinations = async () => {
      const { data, error } = await supabase
        .from('SITIO TURISTICO')  // Asegúrate de que sea el nombre de tu tabla
        .select('*')


      if (error) {
        console.error('Error fetching destinations:', error)
      } else {
        // Mapeamos los datos usando la interfaz definida
        const mappedData: Destination[] = (data as DestinationFromDB[]).map(dest => ({
          id: dest.id,
          name: dest.Titulo,
          description: dest.Descripcio || 'Sin descripcion disponible',
          imageUrl: dest.Imagen_pri|| '/assets/images/OIP.jpg',
          rating: parseFloat(dest.Valoracion), // Convertimos la valoración a número
          type: dest.Categoria,
        }))
        setDestinations(mappedData)
      }
    }

    fetchDestinations()
  }, [])

  const filteredDestinations = destinations.filter(dest =>
    dest.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterType === 'All' || dest.type === filterType)
  )

  const featuredDestinations = destinations.slice(0, 3)

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
          <span className="text-lg font-bold">TravelGuide</span>
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
                      <SelectItem value="hoteles">Hoteles</SelectItem>
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
                  {featuredDestinations.map((destination) => (
                    <div key={destination.id} className="w-full flex-shrink-0">
                      <Card className="overflow-hidden">
                        <CardHeader className="p-0">
                          <Image
                            src={destination.imageUrl}
                            alt={destination.name}
                            width={600}
                            height={400}
                            className="w-full h-64 object-cover"
                          />
                        </CardHeader>
                        <CardContent className="p-4">
                          <CardTitle className="text-xl mb-2">{destination.name}</CardTitle>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{destination.description}</p>
                        </CardContent>
                        <CardFooter className="p-4">
                          <Button asChild>
                            <Link href={`/destinations/${destination.id}`}>Explorar</Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    </div>
                  ))}
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
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Popular Destinations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDestinations.map((destination) => (
                <Card key={destination.id} className="overflow-hidden">
                  <CardHeader className="p-0">
                    <Image
                      src={destination.imageUrl}
                      alt={destination.name}
                      width={600}
                      height={400}
                      className="w-full h-48 object-cover"
                    />
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardTitle className="text-xl mb-2">{destination.name}</CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{destination.description}</p>
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span>{destination.rating.toFixed(1)}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4">
                    <Button asChild className="w-full">
                      <Link href={`/destinations/${destination.id}`}>Learn More</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
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
