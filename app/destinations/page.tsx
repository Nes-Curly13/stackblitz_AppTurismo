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

const destinations = [
  { id: '1', name: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522, rating: 4.5, image: '/placeholder.svg?height=100&width=100', categories: ['city', 'culture'] },
  { id: '2', name: 'Bali', country: 'Indonesia', lat: -8.4095, lon: 115.1889, rating: 4.7, image: '/placeholder.svg?height=100&width=100', categories: ['beach', 'nature'] },
  { id: '3', name: 'New York City', country: 'USA', lat: 40.7128, lon: -74.0060, rating: 4.6, image: '/placeholder.svg?height=100&width=100', categories: ['city', 'culture'] },
  { id: '4', name: 'Machu Picchu', country: 'Peru', lat: -13.1631, lon: -72.5450, rating: 4.8, image: '/placeholder.svg?height=100&width=100', categories: ['nature', 'history'] },
  { id: '5', name: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503, rating: 4.7, image: '/placeholder.svg?height=100&width=100', categories: ['city', 'culture'] },
]

const categories = [
  { id: 'city', label: 'City' },
  { id: 'beach', label: 'Beach' },
  { id: 'nature', label: 'Nature' },
  { id: 'culture', label: 'Culture' },
  { id: 'history', label: 'History' },
]

const countries = Array.from(new Set(destinations.map(dest => dest.country)))

type Destination = {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
  rating: number;
  image: string;
  categories: string[];
}

export default function DestinationsPage() {
  const [viewport, setViewport] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 1
  })
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null) // Update type here
  const [filteredDestinations, setFilteredDestinations] = useState(destinations)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]) // Ensure selectedCategories is typed as string[]
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]) // Ensure selectedCountries is typed as string[]
  const [sortBy, setSortBy] = useState('recommended')

  useEffect(() => {
    const filtered = destinations.filter(dest => 
      dest.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCountries.length === 0 || selectedCountries.includes(dest.country)) &&
      (selectedCategories.length === 0 || selectedCategories.some(cat => dest.categories.includes(cat)))
    )

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'rating-high') return b.rating - a.rating
      if (sortBy === 'rating-low') return a.rating - b.rating
      return 0 // Default: recommended
    })

    setFilteredDestinations(sorted)
  }, [searchTerm, selectedCategories, selectedCountries, sortBy])

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
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="/map"> 
            Explore Map
          </Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="/hotels">
            Hotels
          </Link>
        </nav>
      </header>
      <main className="flex-1 p-4">
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <Input
            placeholder="Search destinations"
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
                  <h4 className="font-medium leading-none">Countries</h4>
                  <Separator />
                  {countries.map((country) => (
                    <div key={country} className="flex items-center space-x-2">
                      <Checkbox
                        id={`country-${country}`}
                        checked={selectedCountries.includes(country)}
                        onCheckedChange={(checked) => {
                          setSelectedCountries(
                            checked
                              ? [...selectedCountries, country]
                              : selectedCountries.filter((c) => c !== country)
                          )
                        }}
                      />
                      <label htmlFor={`country-${country}`}>{country}</label>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Categories</h4>
                  <Separator />
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={category.id}
                        checked={selectedCategories.includes(category.id)}
                        onCheckedChange={(checked) => {
                          setSelectedCategories(
                            checked
                              ? [...selectedCategories, category.id]
                              : selectedCategories.filter((c) => c !== category.id)
                          )
                        }}
                      />
                      <label htmlFor={category.id}>{category.label}</label>
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
              <SelectItem value="rating-high">Rating: High to Low</SelectItem>
              <SelectItem value="rating-low">Rating: Low to High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1 space-y-4 max-h-[calc(100vh-12rem)] overflow-y-auto pr-4">
            {filteredDestinations.map((destination) => (
              <Card key={destination.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex">
                  <Image
                    src={destination.image}
                    alt={destination.name}
                    width={100}
                    height={100}
                    className="rounded-md mr-4"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{destination.name}</h3>
                    <p className="text-sm text-gray-600">{destination.country}</p>
                    <div className="flex items-center mt-1">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span>{destination.rating}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {destination.categories.map((category) => (
                        <span key={category} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                          {category}
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
                  {filteredDestinations.map((destination) => (
                    <Marker
                      key={destination.id}
                      latitude={destination.lat}
                      longitude={destination.lon}
                      onClick={e => {
                        e.originalEvent.stopPropagation()
                        setSelectedDestination(destination)
                      }}
                    >
                      <MapPin className="text-primary" />
                    </Marker>
                  ))}
                  {selectedDestination && (
                    <Popup
                      latitude={selectedDestination.lat}
                      longitude={selectedDestination.lon}
                      onClose={() => setSelectedDestination(null)}
                      closeOnClick={false}
                    >
                      <div className="p-2">
                        <h3 className="text-lg font-semibold">{selectedDestination.name}</h3>
                        <p className="text-sm text-gray-600">{selectedDestination.country}</p>
                        <div className="flex items-center mt-1">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          <span>{selectedDestination.rating}</span>
                        </div>
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
