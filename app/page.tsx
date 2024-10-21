'use client'

import { useState } from 'react'
import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, ChevronLeft, ChevronRight, MapPin } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for destinations
const destinations = [
  { id: '1', name: 'Paris', description: 'The City of Light', imageUrl: 'https://source.unsplash.com/600x400/?paris', rating: 4.5, type: 'City' },
  { id: '2', name: 'Tokyo', description: 'A blend of the ultramodern and the traditional', imageUrl: 'https://source.unsplash.com/600x400/?tokyo', rating: 4.7, type: 'City' },
  { id: '3', name: 'Bali', description: 'Island of the Gods', imageUrl: 'https://source.unsplash.com/600x400/?bali', rating: 4.8, type: 'Beach' },
  { id: '4', name: 'Swiss Alps', description: 'Winter wonderland', imageUrl: 'https://source.unsplash.com/600x400/?swiss+alps', rating: 4.6, type: 'Mountain' },
  { id: '5', name: 'New York', description: 'The Big Apple', imageUrl: 'https://source.unsplash.com/600x400/?new+york', rating: 4.6, type: 'City' },
  { id: '6', name: 'Maldives', description: 'Tropical paradise', imageUrl: 'https://source.unsplash.com/600x400/?maldives', rating: 4.9, type: 'Beach' },
]

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('All')
  const [carouselIndex, setCarouselIndex] = useState(0)

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
            Destinations
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/hotels">
            Hotels
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/map">
            Explore Map
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Discover Your Next Adventure
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Explore the world's best destinations, find top-rated hotels, and plan your perfect trip.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex flex-col space-y-2" onSubmit={(e) => e.preventDefault()}>
                  <div className="flex space-x-2">
                    <Input
                      className="max-w-lg flex-1"
                      placeholder="Search destinations"
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button type="submit">
                      <Search className="h-4 w-4" />
                      <span className="sr-only">Search</span>
                    </Button>
                  </div>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Types</SelectItem>
                      <SelectItem value="City">City</SelectItem>
                      <SelectItem value="Beach">Beach</SelectItem>
                      <SelectItem value="Mountain">Mountain</SelectItem>
                    </SelectContent>
                  </Select>
                </form>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Featured Destinations</h2>
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
                            <Link href={`/destinations/${destination.id}`}>Explore</Link>
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