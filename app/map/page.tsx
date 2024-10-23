'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Map, { Marker, Popup, NavigationControl, FullscreenControl, GeolocateControl, Source, Layer } from 'react-map-gl'
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

const MAPBOX_TOKEN = 'pk.eyJ1IjoiZHJvem94NjYiLCJhIjoiY20yM25wY2ZiMDd5NTJqcHRpbDBleXNwaSJ9.aiFPwOjSP-WJ0d9qckQJoQ'

const places = [
  { id: '1', name: 'Eiffel Tower', country: 'France', lat: 48.8584, lon: 2.2945, rating: 4.7, image: '/placeholder.svg?height=100&width=100', description: 'Iconic iron lattice tower on the Champ de Mars in Paris.', categories: ['landmark', 'culture'] },
  { id: '2', name: 'Colosseum', country: 'Italy', lat: 41.8902, lon: 12.4922, rating: 4.5, image: '/placeholder.svg?height=100&width=100', description: 'Oval amphitheatre in the centre of Rome, Italy.', categories: ['history', 'architecture'] },
  { id: '3', name: 'Statue of Liberty', country: 'USA', lat: 40.6892, lon: -74.0445, rating: 4.6, image: '/placeholder.svg?height=100&width=100', description: 'Colossal neoclassical sculpture on Liberty Island in New York Harbor.', categories: ['landmark', 'history'] },
  { id: '4', name: 'Taj Mahal', country: 'India', lat: 27.1751, lon: 78.0421, rating: 4.8, image: '/placeholder.svg?height=100&width=100', description: 'Ivory-white marble mausoleum on the right bank of the river Yamuna in Agra, India.', categories: ['architecture', 'culture'] },
  { id: '5', name: 'Great Wall of China', country: 'China', lat: 40.4319, lon: 116.5704, rating: 4.9, image: '/placeholder.svg?height=100&width=100', description: 'Series of fortifications and walls across the historical northern borders of ancient Chinese states.', categories: ['history', 'landmark'] },
]

const categories = [
  { id: 'landmark', label: 'Landmark' },
  { id: 'culture', label: 'Culture' },
  { id: 'history', label: 'History' },
  { id: 'architecture', label: 'Architecture' },
]

const countries = Array.from(new Set(places.map(place => place.country)))

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
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [filteredPlaces, setFilteredPlaces] = useState(places)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedCountries, setSelectedCountries] = useState([])
  const [sortBy, setSortBy] = useState('recommended')
  const [route, setRoute] = useState(null)
  const [startPoint, setStartPoint] = useState(null)
  const [endPoint, setEndPoint] = useState(null)
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlace[]>([])
  const [activeTab, setActiveTab] = useState('places')
  const [nearbyCategory, setNearbyCategory] = useState('')

  useEffect(() => {
    const filtered = places.filter(place => 
      place.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCountries.length === 0 || selectedCountries.includes(place.country)) &&
      (selectedCategories.length === 0 || selectedCategories.some(cat => place.categories.includes(cat)))
    )

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'rating-high') return b.rating - a.rating
      if (sortBy === 'rating-low') return a.rating - b.rating
      return 0 // Default: recommended
    })

    setFilteredPlaces(sorted)
  }, [searchTerm, selectedCategories, selectedCountries, sortBy])

  const handleMapClick = useCallback((event) => {
    const { lngLat } = event
    if (!startPoint) {
      setStartPoint(lngLat)
    } else if (!endPoint) {
      setEndPoint(lngLat)
    }
  }, [startPoint, endPoint])

  useEffect(() => {
    if (startPoint && endPoint) {
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${startPoint.lng},${startPoint.lat};${endPoint.lng},${endPoint.lat}?geometries=geojson&access_token=${MAPBOX_TOKEN}`
      fetch(url)
        .then(response => response.json())
        .then(data => {
          setRoute(data.routes[0].geometry)
        })
    }
  }, [startPoint, endPoint])

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
                        <SelectItem key={category.id} value={category.id}>
                          {category.label}
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
                        src={place.image}
                        alt={place.name}
                        width={100}
                        height={100}
                        className="rounded-md mr-4"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{place.name}</h3>
                        <p className="text-sm text-gray-600">{place.country}</p>
                        <div className="flex items-center mt-1">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          <span>{place.rating}</span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {place.categories.map((category) => (
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
                  onClick={handleMapClick}
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
                        <p className="text-sm text-gray-600">{selectedPlace.country}</p>
                        <div className="flex items-center mt-1">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          <span>{selectedPlace.rating}</span>
                        </div>
                      </div>
                    </Popup>
                  )}
                  {startPoint && (
                    <Marker latitude={startPoint.lat} longitude={startPoint.lng}>
                      <MapPin className="text-green-500" />
                    </Marker>
                  )}
                  {endPoint && (
                    <Marker latitude={endPoint.lat} longitude={endPoint.lng}>
                      <MapPin className="text-blue-500" />
                    </Marker>
                  )}
                  {route && (
                    <Source type="geojson" data={{
                      type: 'Feature',
                      properties: {},
                      geometry: route
                    }}>
                      <Layer
                        id="route"
                        type="line"
                        source="route"
                        layout={{
                          "line-join": "round",
                          "line-cap": "round"
                        }}
                        paint={{
                          "line-color": "#3b82f6",
                          "line-width": 4
                        }}
                      />
                    </Source>
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
