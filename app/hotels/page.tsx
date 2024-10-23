'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Map, { Marker, Popup } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { MapPin, Star, Heart, Filter } from "lucide-react"

const MAPBOX_TOKEN = 'pk.eyJ1IjoiZHJvem94NjYiLCJhIjoiY20yM25wY2ZiMDd5NTJqcHRpbDBleXNwaSJ9.aiFPwOjSP-WJ0d9qckQJoQ'

const hotels = [
  { id: '1', name: 'Luxury Palace', city: 'Paris', lat: 48.8584, lon: 2.2945, rating: 8.9, price: 250, image: '/placeholder.svg?height=100&width=100', amenities: ['pool', 'spa', 'wifi'] },
  { id: '2', name: 'Seaside Resort', city: 'Rome', lat: 41.8902, lon: 12.4922, rating: 9.2, price: 180, image: '/placeholder.svg?height=100&width=100', amenities: ['beach', 'restaurant', 'wifi'] },
  { id: '3', name: 'Mountain Retreat', city: 'New York', lat: 40.6892, lon: -74.0445, rating: 8.7, price: 150, image: '/placeholder.svg?height=100&width=100', amenities: ['hiking', 'spa', 'wifi'] },
  { id: '4', name: 'City Center Hotel', city: 'London', lat: 51.5074, lon: -0.1278, rating: 9.0, price: 200, image: '/placeholder.svg?height=100&width=100', amenities: ['gym', 'restaurant', 'wifi'] },
  { id: '5', name: 'Cozy Inn', city: 'Tokyo', lat: 35.6762, lon: 139.6503, rating: 8.5, price: 120, image: '/placeholder.svg?height=100&width=100', amenities: ['parking', 'wifi'] },
]

const amenities = [
  { id: 'pool', label: 'Pool' },
  { id: 'spa', label: 'Spa' },
  { id: 'wifi', label: 'WiFi' },
  { id: 'gym', label: 'Gym' },
  { id: 'restaurant', label: 'Restaurant' },
]

const cities = [...new Set(hotels.map(hotel => hotel.city))]

export default function HotelsPage() {
  const [viewport, setViewport] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 1
  })
  const [selectedHotel, setSelectedHotel] = useState(null)
  const [filteredHotels, setFilteredHotels] = useState(hotels)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAmenities, setSelectedAmenities] = useState([])
  const [selectedCities, setSelectedCities] = useState([])
  const [sortBy, setSortBy] = useState('recommended')

  useEffect(() => {
    const filtered = hotels.filter(hotel => 
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCities.length === 0 || selectedCities.includes(hotel.city)) &&
      selectedAmenities.every(amenity => hotel.amenities.includes(amenity))
    )

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price
      if (sortBy === 'price-high') return b.price - a.price
      if (sortBy === 'rating') return b.rating - a.rating
      return 0 // Default: recommended
    })

    setFilteredHotels(sorted)
  }, [searchTerm, selectedAmenities, selectedCities, sortBy])

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center justify-between bg-white shadow-md">
        <Link className="flex items-center justify-center" href="/">
          <MapPin className="h-6 w-6 mr-2 text-primary" />
          <span className="text-lg font-bold">TravelGuide</span>
        </Link>
        <nav className="flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="/">
            Home
          </Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="/explore">
            Explore
          </Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="/hotels">
            Hotels
          </Link>
        </nav>
      </header>
      <main className="flex-1 p-4">
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <Input
            placeholder="Search hotels"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Cities</h4>
                  <Separator />
                  {cities.map((city) => (
                    <div key={city} className="flex items-center space-x-2">
                      <Checkbox
                        id={`city-${city}`}
                        checked={selectedCities.includes(city)}
                        onCheckedChange={(checked) => {
                          setSelectedCities(
                            checked
                              ? [...selectedCities, city]
                              : selectedCities.filter((c) => c !== city)
                          )
                        }}
                      />
                      <label htmlFor={`city-${city}`}>{city}</label>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Amenities</h4>
                  <Separator />
                  {amenities.map((amenity) => (
                    <div key={amenity.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={amenity.id}
                        checked={selectedAmenities.includes(amenity.id)}
                        onCheckedChange={(checked) => {
                          setSelectedAmenities(
                            checked
                              ? [...selectedAmenities, amenity.id]
                              : selectedAmenities.filter((a) => a !== amenity.id)
                          )
                        }}
                      />
                      <label htmlFor={amenity.id}>{amenity.label}</label>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recommended">Recommended</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1 space-y-4 max-h-[calc(100vh-12rem)] overflow-y-auto pr-4">
            {filteredHotels.map((hotel) => (
              <Card key={hotel.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex">
                  <Image
                    src={hotel.image}
                    alt={hotel.name}
                    width={100}
                    height={100}
                    className="rounded-md mr-4"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{hotel.name}</h3>
                    <p className="text-sm text-gray-600">{hotel.city}</p>
                    <div className="flex items-center mt-1">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span>{hotel.rating}</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">From ${hotel.price} per night</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {hotel.amenities.map((amenity) => (
                        <span key={amenity} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="self-start ml-2">
                    <Heart className="h-4 w-4" />
                    <span className="sr-only">Add to favorites</span>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="lg:col-span-2">
            <Card className="h-[calc(100vh-12rem)]">
              <CardContent className="p-0 h-full">
                <Map
                  {...viewport}
                  onMove={evt => setViewport(evt.viewState)}
                  style={{width: '100%', height: '100%'}}
                  mapStyle="mapbox://styles/mapbox/streets-v11"
                  mapboxAccessToken={MAPBOX_TOKEN}
                >
                  {filteredHotels.map((hotel) => (
                    <Marker
                      key={hotel.id}
                      latitude={hotel.lat}
                      longitude={hotel.lon}
                      onClick={e => {
                        e.originalEvent.stopPropagation()
                        setSelectedHotel(hotel)
                      }}
                    >
                      <MapPin className="text-primary" />
                    </Marker>
                  ))}
                  {selectedHotel && (
                    <Popup
                      latitude={selectedHotel.lat}
                      longitude={selectedHotel.lon}
                      onClose={() => setSelectedHotel(null)}
                      closeOnClick={false}
                    >
                      <div className="p-2">
                        <h3 className="text-lg font-semibold">{selectedHotel.name}</h3>
                        <p className="text-sm text-gray-600">{selectedHotel.city}</p>
                        <div className="flex items-center mt-1">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          <span>{selectedHotel.rating}</span>
                        </div>
                        <p className="mt-1 text-sm">From ${selectedHotel.price} per night</p>
                      </div>
                    </Popup>
                  )}
                </Map>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <footer className="bg-white shadow-md mt-8">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-600">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-600">
              Privacy
            </Link>
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-sm text-gray-500">
              &copy; 2023 TravelGuide, Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}