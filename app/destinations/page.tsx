'use client'

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"

// Use the same mock data as in the home page
const destinations = [
  { id: '1', name: 'Paris', description: 'The City of Light', imageUrl: 'https://source.unsplash.com/600x400/?paris', rating: 4.5, type: 'City' },
  { id: '2', name: 'Tokyo', description: 'A blend of the ultramodern and the traditional', imageUrl: 'https://source.unsplash.com/600x400/?tokyo', rating: 4.7, type: 'City' },
  { id: '3', name: 'Bali', description: 'Island of the Gods', imageUrl: 'https://source.unsplash.com/600x400/?bali', rating: 4.8, type: 'Beach' },
  { id: '4', name: 'Swiss Alps', description: 'Winter wonderland', imageUrl: 'https://source.unsplash.com/600x400/?swiss+alps', rating: 4.6, type: 'Mountain' },
  { id: '5', name: 'New York', description: 'The Big Apple', imageUrl: 'https://source.unsplash.com/600x400/?new+york', rating: 4.6, type: 'City' },
  { id: '6', name: 'Maldives', description: 'Tropical paradise', imageUrl: 'https://source.unsplash.com/600x400/?maldives', rating: 4.9, type: 'Beach' },
]

export default function Destinations() {
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
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/hotels">
            Hotels
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/map">
            Explore Map
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none mb-8">
              Explore Our Destinations
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {destinations.map((destination) => (
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