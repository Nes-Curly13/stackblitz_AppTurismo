'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Star } from "lucide-react"

// Mock data for destinations (same as in the destinations page)
const destinations = [
  { id: '1', name: 'Paris', description: 'The City of Light', imageUrl: 'https://source.unsplash.com/600x400/?paris', rating: 4.5, type: 'City' },
  { id: '2', name: 'Tokyo', description: 'A blend of the ultramodern and the traditional', imageUrl: 'https://source.unsplash.com/600x400/?tokyo', rating: 4.7, type: 'City' },
  { id: '3', name: 'Bali', description: 'Island of the Gods', imageUrl: 'https://source.unsplash.com/600x400/?bali', rating: 4.8, type: 'Beach' },
  { id: '4', name: 'Swiss Alps', description: 'Winter wonderland', imageUrl: 'https://source.unsplash.com/600x400/?swiss+alps', rating: 4.6, type: 'Mountain' },
  { id: '5', name: 'New York', description: 'The Big Apple', imageUrl: 'https://source.unsplash.com/600x400/?new+york', rating: 4.6, type: 'City' },
  { id: '6', name: 'Maldives', description: 'Tropical paradise', imageUrl: 'https://source.unsplash.com/600x400/?maldives', rating: 4.9, type: 'Beach' },
]

// Add this function to generate static params
export async function generateStaticParams() {
  return destinations.map((destination) => ({
    id: destination.id,
  }))
}

export default function DestinationDetails() {
  const { id } = useParams()
  const [destination, setDestination] = useState(null)

  useEffect(() => {
    const fetchedDestination = destinations.find(dest => dest.id === id)
    setDestination(fetchedDestination)
  }, [id])

  if (!destination) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center justify-between">
        <Link className="flex items-center justify-center" href="/">
          <MapPin className="h-6 w-6 mr-2" />
          <span className="text-lg font-bold">TravelGuide</span>
        </Link>
        <nav className="flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/">
            Home
          </Link>
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
        <div className="container mx-auto px-4 py-8">
          <Card className="overflow-hidden">
            <CardHeader className="p-0">
              <Image
                src={destination.imageUrl}
                alt={destination.name}
                width={1200}
                height={600}
                className="w-full h-96 object-cover"
              />
            </CardHeader>
            <CardContent className="p-6">
              <CardTitle className="text-3xl mb-4">{destination.name}</CardTitle>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">{destination.description}</p>
              <div className="flex items-center mb-4">
                <span className="text-yellow-500 mr-1">★</span>
                <span>{destination.rating.toFixed(1)}</span>
              </div>
              <p className="text-md mb-4">Type: {destination.type}</p>
              <Button asChild>
                <Link href="/map">Explore on Map</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
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