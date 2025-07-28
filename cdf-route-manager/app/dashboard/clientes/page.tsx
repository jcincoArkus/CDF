"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreHorizontal, Eye, Edit, Trash2, Phone, MapPin, Users } from "lucide-react"
import { obtenerClientes, eliminarCliente } from "@/lib/actions/clientes"
import { NuevoClienteDialog } from "@/components/clientes/nuevo-cliente-dialog"
import { DetalleClienteDialog } from "@/components/clientes/detalle-cliente-dialog"
import { EditarClienteDialog } from "@/components/clientes/editar-cliente-dialog"

interface Cliente {
  id: number
  nombre: string
  telefono: string
  direccion: string
  ruta_id: number
  ruta_nombre?: string
  activo: boolean
  created_at: string
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showNuevoDialog, setShowNuevoDialog] = useState(false)
  const [showDetalleDialog, setShowDetalleDialog] = useState(false)
  const [showEditarDialog, setShowEditarDialog] = useState(false)
  const [selectedClienteId, setSelectedClienteId] = useState<number | null>(null)

  useEffect(() => {
    loadClientes()
  }, [])

  const loadClientes = async () => {
    setLoading(true)
    try {
      const clientesData = await obtenerClientes()
      setClientes(clientesData)
    } catch (error) {
      console.error("Error cargando clientes:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEliminarCliente = async (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
      try {
        const result = await eliminarCliente(id)
        if (result.success) {
          await loadClientes()
        } else {
          alert(result.error || "Error al eliminar el cliente")
        }
      } catch (error) {
        console.error("Error eliminando cliente:", error)
        alert("Error al eliminar el cliente")
      }
    }
  }

  const handleVerDetalle = (clienteId: number) => {
    setSelectedClienteId(clienteId)
    setShowDetalleDialog(true)
  }

  const handleEditarCliente = (clienteId: number) => {
    setSelectedClienteId(clienteId)
    setShowEditarDialog(true)
  }

  const filteredClientes = clientes.filter(
    (cliente) =>
      cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.telefono.includes(searchTerm) ||
      cliente.direccion.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
            <p className="text-muted-foreground">Gestiona tu cartera de clientes</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Cargando clientes...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground">Gestiona tu cartera de clientes</p>
        </div>
        <Button onClick={() => setShowNuevoDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Cliente
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientes.length}</div>
            <p className="text-xs text-muted-foreground">Clientes registrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Activos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientes.filter((c) => c.activo).length}</div>
            <p className="text-xs text-muted-foreground">Con actividad reciente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nuevos Este Mes</CardTitle>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                clientes.filter((c) => {
                  const created = new Date(c.created_at)
                  const now = new Date()
                  return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
                }).length
              }
            </div>
            <p className="text-xs text-muted-foreground">Registrados este mes</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>Busca y gestiona todos tus clientes registrados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, teléfono o dirección..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Ruta</TableHead>
                  <TableHead>Registro</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClientes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="text-muted-foreground">
                        {searchTerm ? "No se encontraron clientes" : "No hay clientes registrados"}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClientes.map((cliente) => (
                    <TableRow key={cliente.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{cliente.nombre}</div>
                          <div className="text-sm text-muted-foreground flex items-center mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            {cliente.direccion.length > 50
                              ? `${cliente.direccion.substring(0, 50)}...`
                              : cliente.direccion}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Phone className="h-3 w-3 mr-1 text-muted-foreground" />
                          {cliente.telefono}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{cliente.ruta_nombre || `Ruta ${cliente.ruta_id}`}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{formatFecha(cliente.created_at)}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={cliente.activo ? "default" : "secondary"}>
                          {cliente.activo ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleVerDetalle(cliente.id)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Ver Detalle
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditarCliente(cliente.id)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEliminarCliente(cliente.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <NuevoClienteDialog
        open={showNuevoDialog}
        onOpenChange={setShowNuevoDialog}
        onClienteCreado={() => {
          loadClientes()
          setShowNuevoDialog(false)
        }}
      />

      <DetalleClienteDialog
        open={showDetalleDialog}
        onOpenChange={setShowDetalleDialog}
        clienteId={selectedClienteId}
        onEditarCliente={(clienteId) => {
          setShowDetalleDialog(false)
          setSelectedClienteId(clienteId)
          setShowEditarDialog(true)
        }}
      />

      <EditarClienteDialog
        open={showEditarDialog}
        onOpenChange={setShowEditarDialog}
        clienteId={selectedClienteId}
        onClienteActualizado={() => {
          loadClientes()
          setShowEditarDialog(false)
        }}
      />
    </div>
  )
}
