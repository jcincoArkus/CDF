"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Phone, Mail, Users } from "lucide-react"

interface Cliente {
  id: number
  nombre: string
  direccion: string
  telefono: string
  email: string
  ruta_nombre: string
}

interface SeleccionClienteProps {
  clienteSeleccionado: Cliente | null
  onClienteSeleccionado: (cliente: Cliente) => void
}

export function SeleccionCliente({ clienteSeleccionado, onClienteSeleccionado }: SeleccionClienteProps) {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const cargarClientes = async () => {
      setLoading(true)

      // Simular carga de datos
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Datos de prueba
      const clientesPrueba: Cliente[] = [
        {
          id: 1,
          nombre: "Tienda La Esquina",
          direccion: "Av. Principal 123, Col. Centro",
          telefono: "555-0101",
          email: "esquina@email.com",
          ruta_nombre: "Ruta Norte",
        },
        {
          id: 2,
          nombre: "Súper Mercado Norte",
          direccion: "Calle Norte 456, Col. Lindavista",
          telefono: "555-0102",
          email: "norte@email.com",
          ruta_nombre: "Ruta Norte",
        },
        {
          id: 3,
          nombre: "Abarrotes El Sur",
          direccion: "Av. Sur 789, Col. Del Valle",
          telefono: "555-0103",
          email: "sur@email.com",
          ruta_nombre: "Ruta Sur",
        },
        {
          id: 4,
          nombre: "Minisuper Central",
          direccion: "Calle Madero 321, Col. Centro",
          telefono: "555-0104",
          email: "central@email.com",
          ruta_nombre: "Ruta Centro",
        },
      ]

      setClientes(clientesPrueba)
      setLoading(false)
    }

    cargarClientes()
  }, [])

  const clientesFiltrados = clientes.filter(
    (cliente) =>
      cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.direccion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.ruta_nombre.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="relative">
          <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Seleccionar Cliente</h3>
        <p className="text-sm text-muted-foreground mb-4">Elige el cliente para el cual deseas crear el pedido</p>
      </div>

      {/* Búsqueda */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Buscar cliente por nombre, dirección o ruta..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Lista de Clientes */}
      <div className="grid gap-4 md:grid-cols-2 max-h-96 overflow-y-auto">
        {clientesFiltrados.length === 0 ? (
          <div className="col-span-2 text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No se encontraron clientes</p>
          </div>
        ) : (
          clientesFiltrados.map((cliente) => (
            <Card
              key={cliente.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                clienteSeleccionado?.id === cliente.id ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-gray-50"
              }`}
              onClick={() => onClienteSeleccionado(cliente)}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base">{cliente.nombre}</CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {cliente.ruta_nombre}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">{cliente.direccion}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3" />
                    <span>{cliente.telefono}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3" />
                    <span className="truncate">{cliente.email}</span>
                  </div>
                </div>

                {clienteSeleccionado?.id === cliente.id && (
                  <div className="mt-3 pt-3 border-t">
                    <Badge className="bg-blue-500 text-white">Cliente Seleccionado</Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {clienteSeleccionado && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-blue-900">Cliente seleccionado:</p>
              <p className="text-blue-700">{clienteSeleccionado.nombre}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onClienteSeleccionado(clienteSeleccionado)}
              className="bg-white"
            >
              Continuar
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
