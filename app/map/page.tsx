'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Map, { Marker, Popup, NavigationControl, FullscreenControl, GeolocateControl, Source, Layer, ViewState } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Star, Filter, Search } from "lucide-react"
import SitioMapCard from '@/components/map/SitioMapCard'
import { useSitioMap } from '@/hooks/use-sitio-map'

const MAPBOX_TOKEN = 'pk.eyJ1IjoiZHJvem94NjYiLCJhIjoiY20yM25wY2ZiMDd5NTJqcHRpbDBleXNwaSJ9.aiFPwOjSP-WJ0d9qckQJoQ'

type NearbyPlace = {
  text: string;
  place_name: string;
  center: [number, number];
}

export default function ExplorePage() {
  const [viewport, setViewport] = useState<ViewState>({
    latitude: 3.4367,
    longitude: -76.32658,
    zoom: 7.5,
    bearing: 0,
    pitch: 0,
    padding: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    }
  })

  const [selectedPlace, setSelectedPlace] = useState(null)
  const { sitios, getSitios } = useSitioMap()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedmunicipios, setSelectedmunicipios] = useState([])
  const [sortBy, setSortBy] = useState('recommended')
  const [route, setRoute] = useState(null)
  const [startPoint, setStartPoint] = useState(null)
  const [endPoint, setEndPoint] = useState(null)
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlace[]>([])
  const [activeTab, setActiveTab] = useState('sitios')
  const [nearbyCategory, setNearbyCategory] = useState('')

  useEffect(() => {
    getSitios()
  }, [getSitios])

  useEffect(() => {
    if (selectedPlace) {
      setViewport(prevViewport => ({
        ...prevViewport,
        latitude: selectedPlace.latitud,
        longitude: selectedPlace.longitud,
        zoom: 14,
        transitionDuration: 500
      }));
    }
  }, [selectedPlace]);

  const handleCardClick = useCallback((id: number, lat: number, lon: number) => {
    const place = sitios.find(sitio => sitio.id === id)
    if (place) {
      setSelectedPlace(place)
      setViewport(prevViewport => ({
        ...prevViewport,
        latitude: lat,
        longitude: lon,
        zoom: 14,
        transitionDuration: 500
      }))
    }
  }, [sitios])

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

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center justify-between bg-white shadow-md">
        <Link className="flex items-center justify-center" href="/">
          <MapPin className="h-6 w-6 mr-2 text-primary" />
          <span className="text-lg font-bold">TravelGuide</span>
        </Link>
        <nav className="flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="/">
            Inicio
          </Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="/destinations">
            Destinos
          </Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="/hotels">
            Hoteles
          </Link>
        </nav>
      </header>
      <main className="flex-1 p-4">
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <Input
            placeholder="Buscar sitios"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filtros
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">municipios</h4>
                  <Separator />
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Categories</h4>
                  <Separator />
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
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="sitios">Sitios</TabsTrigger>
                <TabsTrigger value="cercanos">Cercanos</TabsTrigger>
              </TabsList>
              <TabsContent value="sitios" className="max-h-[calc(100vh-20rem)] overflow-y-auto">
                {sitios.map((place) => (
                  <SitioMapCard
                    key={place.id}
                    id={place.id}
                    Titulo={place.Titulo}
                    Descripcion={place.Descripcion || "sin descripcion disponible"}
                    Categoria={place.Categoria}
                    Municipio={place.Municipio}
                    Valoracion={place.Valoracion || "sin puntuar"}
                    Imagen_pri={place.Imagen_pri || "/assets/images/OIP.jpg"}
                    latitud={place.latitud}
                    longitud={place.longitud}
                    onCardClick={handleCardClick}
                  />
                ))}
              </TabsContent>
              <TabsContent value="cercanos" className="max-h-[calc(100vh-20rem)] overflow-y-auto">
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
                  style={{ width: '100%', height: '100%' }}
                  mapStyle="mapbox://styles/mapbox/streets-v11"
                  mapboxAccessToken={MAPBOX_TOKEN}
                >
                  <GeolocateControl position="top-left" />
                  <FullscreenControl position="top-left" />
                  <NavigationControl position="top-left" />
                  {sitios.map((place) => (
                    <Marker
                      key={place.id}
                      latitude={place.latitud}
                      longitude={place.longitud}
                    >
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <MapPin className="text-primary" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{place.Titulo}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Marker>
                  ))}
                  {selectedPlace && (
                    <Popup
                      latitude={selectedPlace.latitud}
                      longitude={selectedPlace.longitud}
                      onClose={() => setSelectedPlace(null)}
                      closeOnClick={false}
                    >
                      <div className="p-2">
                        <h3 className="text-lg font-semibold">{selectedPlace.Titulo}</h3>
                        <p className="text-sm text-gray-600">{selectedPlace.Municipio}</p>
                        <div className="flex items-center mt-1">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          <span>{selectedPlace.Valoracion}</span>
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