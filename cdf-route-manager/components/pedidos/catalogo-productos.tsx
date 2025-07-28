"use client"

import { useState, useEffect } from "react"
import { Search, Package, Plus, Minus, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCart } from "@/hooks/use-cart"

interface Producto {
  id: string
  nombre: string
  sku: string
  precio: number
  categoria: string
  stock: number
  tipo: string
}

const PRODUCTOS_MOCK: Producto[] = [
  // Bebidas
  { id: "1", nombre: "Coca Cola 600ml", sku: "CC600", precio: 15.5, categoria: "Bebidas", stock: 45, tipo: "Refresco" },
  { id: "2", nombre: "Pepsi 600ml", sku: "PP600", precio: 15.0, categoria: "Bebidas", stock: 8, tipo: "Refresco" },
  { id: "3", nombre: "Agua Bonafont 1L", sku: "AB1L", precio: 12.0, categoria: "Bebidas", stock: 60, tipo: "Agua" },
  { id: "4", nombre: "Jugo Del Valle 1L", sku: "JDV1L", precio: 25.0, categoria: "Bebidas", stock: 30, tipo: "Jugo" },
  { id: "5", nombre: "Gatorade 500ml", sku: "GT500", precio: 18.0, categoria: "Bebidas", stock: 25, tipo: "Deportiva" },

  // Snacks
  { id: "6", nombre: "Doritos Nacho", sku: "DN150", precio: 22.0, categoria: "Snacks", stock: 15, tipo: "Botana" },
  { id: "7", nombre: "Cheetos Poffs", sku: "CP120", precio: 18.5, categoria: "Snacks", stock: 35, tipo: "Botana" },
  { id: "8", nombre: "Papas Sabritas", sku: "PS140", precio: 20.0, categoria: "Snacks", stock: 40, tipo: "Papas" },
  {
    id: "9",
    nombre: "Cacahuates Japoneses",
    sku: "CJ100",
    precio: 15.0,
    categoria: "Snacks",
    stock: 28,
    tipo: "Frutos secos",
  },

  // Dulces
  { id: "10", nombre: "Galletas Oreo", sku: "GO154", precio: 28.0, categoria: "Dulces", stock: 22, tipo: "Galleta" },
  {
    id: "11",
    nombre: "Chocolate Carlos V",
    sku: "CCV30",
    precio: 12.5,
    categoria: "Dulces",
    stock: 50,
    tipo: "Chocolate",
  },
  { id: "12", nombre: "Chicles Trident", sku: "CT14", precio: 8.0, categoria: "Dulces", stock: 65, tipo: "Chicle" },
  { id: "13", nombre: "Paleta Payaso", sku: "PP25", precio: 5.5, categoria: "Dulces", stock: 80, tipo: "Paleta" },

  // Refrigerados
  {
    id: "14",
    nombre: "Leche Lala 1L",
    sku: "LL1L",
    precio: 22.0,
    categoria: "Refrigerados",
    stock: 18,
    tipo: "Lácteo",
  },
  {
    id: "15",
    nombre: "Queso Oaxaca 400g",
    sku: "QO400",
    precio: 45.0,
    categoria: "Refrigerados",
    stock: 12,
    tipo: "Queso",
  },
  {
    id: "16",
    nombre: "Jamón FUD 200g",
    sku: "JF200",
    precio: 35.0,
    categoria: "Refrigerados",
    stock: 20,
    tipo: "Embutido",
  },

  // Secos
  {
    id: "17",
    nombre: "Arroz Verde Valle 1kg",
    sku: "AVV1K",
    precio: 18.0,
    categoria: "Secos",
    stock: 25,
    tipo: "Grano",
  },
  { id: "18", nombre: "Frijol Bayos 1kg", sku: "FB1K", precio: 22.0, categoria: "Secos", stock: 30, tipo: "Legumbre" },
  { id: "19", nombre: "Aceite Capullo 1L", sku: "AC1L", precio: 28.0, categoria: "Secos", stock: 15, tipo: "Aceite" },

  // Estratégicos
  {
    id: "20",
    nombre: "Cerveza Corona 355ml",
    sku: "CR355",
    precio: 18.0,
    categoria: "Estratégicos",
    stock: 48,
    tipo: "Cerveza",
  },
  {
    id: "21",
    nombre: "Cigarros Marlboro",
    sku: "CM20",
    precio: 65.0,
    categoria: "Estratégicos",
    stock: 25,
    tipo: "Tabaco",
  },
]

const CATEGORIA_ICONS: Record<string, string> = {
  Bebidas: "🥤",
  Snacks: "🍿",
  Dulces: "🍭",
  Refrigerados: "❄️",
  Secos: "🌾",
  Estratégicos: "⭐",
}

const CATEGORIA_COLORS: Record<string, string> = {
  Bebidas: "border-blue-200 bg-blue-50",
  Snacks: "border-orange-200 bg-orange-50",
  Dulces: "border-pink-200 bg-pink-50",
  Refrigerados: "border-cyan-200 bg-cyan-50",
  Secos: "border-yellow-200 bg-yellow-50",
  Estratégicos: "border-purple-200 bg-purple-50",
}

export function CatalogoProductos() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("todas")

  const { addItem, removeItem, getItemQuantity, isInCart } = useCart()

  useEffect(() => {
    const cargarProductos = async () => {
      setLoading(true)
      // Simular carga de datos
      await new Promise((resolve) => setTimeout(resolve, 500))
      setProductos(PRODUCTOS_MOCK)
      setLoading(false)
    }

    cargarProductos()
  }, [])

  // Filtrar productos
  const productosFiltrados = productos.filter((producto) => {
    const matchesSearch =
      producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.sku.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategory === "todas" || producto.categoria === selectedCategory

    return matchesSearch && matchesCategory
  })

  // Agrupar productos por categoría
  const productosAgrupados = productosFiltrados.reduce(
    (grupos, producto) => {
      const categoria = producto.categoria
      if (!grupos[categoria]) {
        grupos[categoria] = []
      }
      grupos[categoria].push(producto)
      return grupos
    },
    {} as Record<string, Producto[]>,
  )

  const categorias = Object.keys(productosAgrupados).sort()

  const handleAddToCart = (producto: Producto) => {
    addItem({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      sku: producto.sku,
      stock: producto.stock,
    })
  }

  const handleRemoveFromCart = (productoId: string) => {
    removeItem(productoId)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Catálogo de Productos</h3>
        <p className="text-sm text-muted-foreground mb-4">Selecciona los productos para agregar al pedido</p>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Buscar productos por nombre o SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas las categorías</SelectItem>
            {Object.keys(CATEGORIA_ICONS).map((categoria) => (
              <SelectItem key={categoria} value={categoria}>
                {CATEGORIA_ICONS[categoria]} {categoria}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Productos por Categoría */}
      <div className="space-y-8 max-h-[600px] overflow-y-auto">
        {categorias.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No se encontraron productos</h3>
            <p className="text-muted-foreground">Intenta ajustar los filtros de búsqueda</p>
          </div>
        ) : (
          categorias.map((categoria) => (
            <div key={categoria} className="space-y-4">
              {/* Encabezado de Categoría */}
              <div className={`p-4 rounded-lg border-2 ${CATEGORIA_COLORS[categoria]}`}>
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold flex items-center gap-2">
                    <span className="text-2xl">{CATEGORIA_ICONS[categoria]}</span>
                    {categoria}
                  </h4>
                  <Badge variant="outline" className="bg-white">
                    {productosAgrupados[categoria].length} productos
                  </Badge>
                </div>
              </div>

              {/* Productos de la Categoría */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {productosAgrupados[categoria].map((producto) => {
                  const cantidadEnCarrito = getItemQuantity(producto.id)
                  const enCarrito = isInCart(producto.id)
                  const stockBajo = producto.stock <= 10

                  return (
                    <Card
                      key={producto.id}
                      className={`transition-all hover:shadow-md ${enCarrito ? "ring-2 ring-green-500" : ""}`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <CardTitle className="text-base line-clamp-2">{producto.nombre}</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                              SKU: {producto.sku} • {producto.tipo}
                            </p>
                          </div>
                          {enCarrito && <Badge className="bg-green-500 text-white ml-2">En carrito</Badge>}
                        </div>
                      </CardHeader>

                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-green-600">${producto.precio.toFixed(2)}</span>
                            <div className="text-right">
                              <p
                                className={`text-sm ${stockBajo ? "text-red-600 font-medium" : "text-muted-foreground"}`}
                              >
                                Stock: {producto.stock}
                              </p>
                              {stockBajo && (
                                <Badge variant="destructive" className="text-xs">
                                  Stock Bajo
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Controles de Cantidad */}
                          <div className="flex items-center justify-between">
                            {cantidadEnCarrito > 0 ? (
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleRemoveFromCart(producto.id)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="font-medium min-w-[2rem] text-center">{cantidadEnCarrito}</span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleAddToCart(producto)}
                                  disabled={cantidadEnCarrito >= producto.stock}
                                  className="h-8 w-8 p-0"
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <Button
                                onClick={() => handleAddToCart(producto)}
                                disabled={producto.stock === 0}
                                className="gap-2"
                                size="sm"
                              >
                                <ShoppingCart className="h-4 w-4" />
                                Agregar
                              </Button>
                            )}

                            {cantidadEnCarrito > 0 && (
                              <span className="text-sm text-muted-foreground">
                                Subtotal: ${(producto.precio * cantidadEnCarrito).toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
