'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Map, { Marker, Popup, NavigationControl, FullscreenControl, GeolocateControl, Source, Layer } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin } from "lucide-react"

// Replace with your actual Mapbox token
const MAPBOX_TOKEN = 'pk.eyJ1IjoiZHJvem94NjYiLCJhIjoiY20yM25wY2ZiMDd5NTJqcHRpbDBleXNwaSJ9.aiFPwOjSP-WJ0d9qckQJoQ'

// Mock data for places
const places = [
  { id: '1', name: 'Eiffel Tower', lat: 48.8584, lon: 2.2945 },
  { id: '2', name: 'Colosseum', lat: 41.8902, lon: 12.4922 },
  { id: '3', name: 'Statue of Liberty', lat: 40.6892, lon: -74.0445 },
  { id: '4', name: 'Taj Mahal', lat: 27.1751, lon: 78.0421 },
  { id: '5', name: 'Great Wall of China', lat: 40.4319, lon: 116.5704 },
]

const categories = [
  { value: 'gastronomico', label: 'Gastronomico' },
  { value: 'hoteles', label: 'Hoteles' },
  { value: 'atraccion', label: 'Atraccion' },
]

export default function ExplorePage() {
  const [viewport, setViewport] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 1.5,
  })
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [route, setRoute] = useState(null)
  const [startPoint, setStartPoint] = useState(null)
  const [endPoint, setEndPoint] = useState(null)
  const [nearbyPlaces, setNearbyPlaces] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')

  const filteredPlaces = places.filter(place =>
    place.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
      // Fetch route from Mapbox Directions API
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${startPoint.lng},${startPoint.lat};${endPoint.lng},${endPoint.lat}?geometries=geojson&access_token=${MAPBOX_TOKEN}`
      fetch(url)
        .then(response => response.json())
        .then(data => {
          setRoute(data.routes[0].geometry)
        })
    }
  }, [startPoint, endPoint])

  const findNearbyPlaces = () => {
    if (viewport.latitude && viewport.longitude && selectedCategory) {
      // Fetch nearby places from Mapbox Places API
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${selectedCategory}.json?proximity=${viewport.longitude},${viewport.latitude}&limit=5&access_token=${MAPBOX_TOKEN}`
      fetch(url)
        .then(response => response.json())
        .then(data => {
          setNearbyPlaces(data.features)
        })
    }
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
        </nav>
      </header>
      <main className="flex-1 p-4">
        <h1 className="text-3xl font-bold mb-4">Explore Destinations</h1>
        <div className="mb-4 flex">
          <Input
            className="max-w-sm flex-1 mr-2"
            placeholder="Search places"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button onClick={() => setSearchTerm('')}>
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Map
              {...viewport}
              onMove={evt => setViewport(evt.viewState)}
              onClick={handleMapClick}
              style={{width: '100%', height: '70vh'}}
              mapStyle="mapbox://styles/mapbox/streets-v11"
              mapboxAccessToken={MAPBOX_TOKEN}
            >
              <GeolocateControl position="top-left"  />
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
                  <MapPin className="text-red-500" />
                </Marker>
              ))}
              {selectedPlace && (
                <Popup
                  latitude={selectedPlace.lat}
                  longitude={selectedPlace.lon}
                  onClose={() => setSelectedPlace(null)}
                >
                  <div>
                    <h2>{selectedPlace.name}</h2>
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
                      "line-color": "#888",
                      "line-width": 8
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
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Places</h2>
            <div className="space-y-2">
              {filteredPlaces.map((place) => (
                <Card key={place.id} className="cursor-pointer" onClick={() => {
                  setSelectedPlace(place)
                  setViewport({...viewport, latitude: place.lat, longitude: place.lon, zoom: 10})
                }}>
                  <CardHeader>
                    <CardTitle>{place.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Lat: {place.lat.toFixed(4)}, Lon: {place.lon.toFixed(4)}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-2">Find Nearby Places</h2>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button className="mt-2" onClick={findNearbyPlaces}>Find Nearby</Button>
            </div>
            {nearbyPlaces.length > 0 && (
              <div className="mt-4">
                <h2 className="text-xl font-semibold mb-2">Nearby Places</h2>
                <div className="space-y-2">
                  {nearbyPlaces.map((place, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle>{place.text}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>{place.place_name}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
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