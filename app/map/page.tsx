'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Map, { Marker, Popup, NavigationControl, FullscreenControl, GeolocateControl } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Star, Heart, Filter, Search } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { supabase } from '@/lib/supabase'; 



const MAPBOX_TOKEN = 'pk.eyJ1IjoiZHJvem94NjYiLCJhIjoiY20yM25wY2ZiMDd5NTJqcHRpbDBleXNwaSJ9.aiFPwOjSP-WJ0d9qckQJoQ'

interface DestinationFromDB {
  id: string;
  Titulo: string;
  Descripcio: string | null;
  Imagen_pri: string | null;
  Valoracion: string;
  Categoria: string;
  latitud: number;
  longitud: number;
}

interface Destination {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  rating: number;
  type: string;
  lat: number;
  lon: number;
}

type NearbyPlace = {
  text: string;
  place_name: string;
  center: [number, number];
}

export default function ExplorePage() {
  const [viewport, setViewport] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 1.5,
  })
  const [selectedPlace, setSelectedPlace] = useState<Destination | null>(null)
  const [places, setPlaces] = useState<Destination[]>([])
  const [filteredPlaces, setFilteredPlaces] = useState<Destination[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedCountry, setSelectedCountry] = useState('all')
  const [sortBy, setSortBy] = useState('recommended')
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlace[]>([])
  const [activeTab, setActiveTab] = useState('places')
  const [nearbyCategory, setNearbyCategory] = useState('')

  useEffect(() => {
    const fetchDestinations = async () => {
      const { data, error } = await supabase
        .from('SITIO TURISTICO')
        .select('*')

      if (error) {
        console.error('Error fetching destinations:', error)
      } else {
        const mappedData: Destination[] = (data as DestinationFromDB[]).map(dest => ({
          id: dest.id,
          name: dest.Titulo,
          description: dest.Descripcio || 'Sin descripcion disponible',
          imageUrl: dest.Imagen_pri|| '/assets/images/OIP.jpg',
          rating: parseFloat(dest.Valoracion), // Convertimos la valoración a número
          type: dest.Categoria,
          lat: dest.latitud,
          lon: dest.longitud,
        }))
        setPlaces(mappedData)
        setFilteredPlaces(mappedData)
      }
    }

    fetchDestinations()
  }, [])

  useEffect(() => {
    const filtered = places.filter(place => 
      place.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategories.length === 0 || selectedCategories.includes(place.type))
    )

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'rating-high') return b.rating - a.rating
      if (sortBy === 'rating-low') return a.rating - b.rating
      return 0 // Default: recommended
    })

    setFilteredPlaces(sorted)
  }, [searchTerm, selectedCategories, sortBy, places])

  const categories = Array.from(new Set(places.map(place => place.type)))

  const findNearbyPlaces = () => {
    if (viewport.latitude && viewport.longitude && nearbyCategory) {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${nearbyCategory}.json?proximity=${viewport.longitude},${viewport.latitude}&limit=5&access_token=${MAPBOX_TOKEN}`
      fetch(url)
        .then(response => response.json())
        .then(data => {
          setNearbyPlaces(data.features)
          setActiveTab('nearby')
        })
    }
  }

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
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="/destinations">
            Destinations
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
                  <h4 className="font-medium leading-none">Categories</h4>
                  <Separator />
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={category}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={(checked) => {
                          setSelectedCategories(
                            checked
                              ? [...selectedCategories, category]
                              : selectedCategories.filter((c) => c !== category)
                          )
                        }}
                      />
                      <label htmlFor={category}>{category}</label>
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
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Find Nearby</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Select value={nearbyCategory} onValueChange={setNearbyCategory}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={findNearbyPlaces}>
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="places">Places</TabsTrigger>
                <TabsTrigger value="nearby">Nearby</TabsTrigger>
              </TabsList>
              <TabsContent value="places" className="max-h-[calc(100vh-20rem)] overflow-y-auto">
                {filteredPlaces.map((place) => (
                  <Card key={place.id} className="mb-4 cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex">
                      <Image
                        src={place.imageUrl}
                        alt={place.name}
                        width={100}
                        height={100}
                        className="rounded-md mr-4"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{place.name}</h3>
                        <p className="text-sm text-gray-600">{place.type}</p>
                        <div className="flex items-center mt-1">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          <span>{place.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="self-start ml-2">
                        <Heart className="h-4 w-4" />
                        <span className="sr-only">Add to favorites</span>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              <TabsContent value="nearby" className="max-h-[calc(100vh-20rem)] overflow-y-auto">
                {nearbyPlaces.length > 0 ? (
                  nearbyPlaces.map((place, index) => (
                    <Card key={index} className="mb-4">
                      <CardContent className="p-4">
                        <h3 className="text-lg font-semibold">{place.text}</h3>
                        <p className="text-sm text-gray-600">{place.place_name}</p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p>No nearby places found. Try selecting a category and clicking "Search".</p>
                )}
              </TabsContent>
            </Tabs>
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
                  <GeolocateControl position="top-left" />
                  <FullscreenControl position="top-left" />
                  <NavigationControl position="top-left" />
                  {filteredPlaces.map((place) => (
                    <Marker
                      key={place.id}
                      latitude={place.lat}
                      longitude={place.lon}
                      onClick={e => {
                        e.originalEvent.stopPropagation()
                        setSelectedPlace(place)
                      }}
                    >
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <MapPin className="text-primary" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{place.name}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Marker>
                  ))}
                  {selectedPlace && (
                    <Popup
                      latitude={selectedPlace.lat}
                      longitude={selectedPlace.lon}
                      onClose={() => setSelectedPlace(null)}
                      closeOnClick={false}
                    >
                      <div className="p-2">
                        <h3 className="text-lg font-semibold">{selectedPlace.name}</h3>
                        <p className="text-sm text-gray-600">{selectedPlace.type}</p>
                        <div className="flex items-center mt-1">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          <span>{selectedPlace.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </Popup>
                  )}
                  {nearbyPlaces.map((place, index) => (
                    <Marker
                      key={index}
                      latitude={place.center[1]}
                      longitude={place.center[0]}
                    >
                      <MapPin className="text-purple-500" />
                    </Marker>
                  ))}
                </Map>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <footer className="bg-white shadow-md mt-8">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <Link  href="/terms" className="text-sm text-gray-500 hover:text-gray-600">
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