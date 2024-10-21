'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, MapPin } from "lucide-react"

const hotels = [
  { id: '1', name: 'Luxury Palace', description: 'Experience unparalleled luxury in the heart of the city.', imageUrl: 'https://www.svgrepo.com/show/338007/accommodation-hotel-bed-sleeping.svg', rating: 5, price: 500 },
  { id: '2', name: 'Seaside Resort', description: 'Relax and unwind with stunning ocean views.', imageUrl: 'https://www.svgrepo.com/show/338007/accommodation-hotel-bed-sleeping.svg', rating: 4, price: 300 },
  { id: '3', name: 'Mountain Retreat', description: 'Escape to nature in our cozy mountain lodge.', imageUrl: 'https://www.svgrepo.com/show/338007/accommodation-hotel-bed-sleeping.svg', rating: 4, price: 250 },
  { id: '4', name: 'Urban Oasis', description: 'Modern comfort in the bustling city center.', imageUrl: 'https://www.svgrepo.com/show/338007/accommodation-hotel-bed-sleeping.svg', rating: 4, price: 200 },
  { id: '5', name: 'Historic Inn', description: 'Step back in time in our beautifully restored inn.', imageUrl: 'https://www.svgrepo.com/show/338007/accommodation-hotel-bed-sleeping.svg', rating: 3, price: 150 },
]

export default function Hotels() {
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
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/map">
            Explore Map
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Featured Hotels</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map((hotel) => (
              <Card key={hotel.id} className="overflow-hidden">
                <CardHeader className="p-0">
                  <Image
                    src={hotel.imageUrl}
                    alt={hotel.name}
                    width={600}
                    height={400}
                    className="w-full h-48 object-cover"
                  />
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-xl mb-2">{hotel.name}</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{hotel.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${star <= hotel.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <p className="font-bold">${hotel.price}/night</p>
                  </div>
                </CardContent>
                <CardFooter className="p-4">
                  <Button asChild className="w-full">
                    <Link href={`/hotels/${hotel.id}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
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