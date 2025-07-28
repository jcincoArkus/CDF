"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, MapPin, Users, Truck, Hash, Eye, Edit, UserPlus } from "lucide-react"
import { getRutas, getUsuarios } from "@/lib/db"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { NuevaRutaDialog } from "@/components/rutas/nueva-ruta-dialog"
import { EditarRutaDialog } from "@/components/rutas/editar-ruta-dialog"
import { DetalleRutaDialog } from "@/components/rutas/detalle-ruta-dialog"
import { AsignarVendedorDialog } from "@/components/rutas/asignar-vendedor-dialog"
import { useToast } from "@/hooks/use-toast"

interface Ruta {
  id: number
  numero_identificador: string
  nombre: string
  tipo: string
  descripcion?: string
  vendedor_id?: number
  vendedor_nombre?: string
  activa: boolean
  created_at: string
}

interface Usuario {
  id: number
  nombre: string
  correo: string
  rol_id: number
}

const tipoRutaColors = {
  Preventa: "bg-blue-100 text-blue-800 border-blue-200",
  Reparto: "bg-green-100 text-green-800 border-green-200",
  Convencional: "bg-purple-100 text-purple-800 border-purple-200",
  Autoventa: "bg-orange-100 text-orange-800 border-orange-200",
}

export default function RutasPage() {
  const [rutas, setRutas] = useState<Ruta[]>([])
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroTipo, setFiltroTipo] = useState("todos")
  const [filtroEstado, setFiltroEstado] = useState("todos")

  // Estados para dialogs
  const [showNuevaRuta, setShowNuevaRuta] = useState(false)
  const [showEditarRuta, setShowEditarRuta] = useState(false)
  const [showDetalleRuta, setShowDetalleRuta] = useState(false)
  const [showAsignarVendedor, setShowAsignarVendedor] = useState(false)
  const [rutaSeleccionada, setRutaSeleccionada] = useState<number | null>(null)

  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [rutasData, usuariosData] = await Promise.all([getRutas(), getUsuarios()])
      setRutas(rutasData)
      setUsuarios(usuariosData)
    } catch (error) {
      console.error("Error loading data:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Filtrar rutas
  const rutasFiltradas = rutas.filter((ruta) => {
    const matchesSearch =
      ruta.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ruta.numero_identificador.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ruta.vendedor_nombre && ruta.vendedor_nombre.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesTipo = filtroTipo === "todos" || ruta.tipo === filtroTipo

    const matchesEstado =
      filtroEstado === "todos" ||
      (filtroEstado === "activas" && ruta.activa) ||
      (filtroEstado === "inactivas" && !ruta.activa) ||
      (filtroEstado === "sin-vendedor" && !ruta.vendedor_id) ||
      (filtroEstado === "con-vendedor" && ruta.vendedor_id)

    return matchesSearch && matchesTipo && matchesEstado
  })

  // Calcular estadísticas
  const totalRutas = rutas.length
  const rutasActivas = rutas.filter((r) => r.activa).length
  const rutasSinVendedor = rutas.filter((r) => !r.vendedor_id).length
  const rutasConVendedor = rutas.filter((r) => r.vendedor_id).length

  // Obtener tipos únicos
  const tiposRuta = [...new Set(rutas.map((r) => r.tipo))]

  const getTipoRutaBadge = (tipo: string) => {
    const colorClass =
      tipoRutaColors[tipo as keyof typeof tipoRutaColors] || "bg-gray-100 text-gray-800 border-gray-200"
    return <Badge className={colorClass}>{tipo}</Badge>
  }

  const getEstadoBadge = (activa: boolean) => {
    return activa ? <Badge variant="default">Activa</Badge> : <Badge variant="secondary">Inactiva</Badge>
  }

  const handleRutaCreada = () => {
    toast({
      title: "¡Ruta creada exitosamente!",
      description: "La ruta ha sido registrada correctamente",
    })
    loadData()
  }

  const handleRutaActualizada = () => {
    toast({
      title: "¡Ruta actualizada exitosamente!",
      description: "Los datos de la ruta han sido actualizados",
    })
    loadData()
  }

  const handleVendedorAsignado = () => {
    toast({
      title: "¡Vendedor asignado exitosamente!",
      description: "El vendedor ha sido asignado a la ruta",
    })
    loadData()
  }

  const handleEditarRuta = (rutaId: number) => {
    setRutaSeleccionada(rutaId)
    setShowEditarRuta(true)
  }

  const handleVerRuta = (rutaId: number) => {
    setRutaSeleccionada(rutaId)
    setShowDetalleRuta(true)
  }

  const handleAsignarVendedor = (rutaId: number) => {
    setRutaSeleccionada(rutaId)
    setShowAsignarVendedor(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-muted-foreground">Cargando rutas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Rutas</h1>
          <p className="text-muted-foreground">Administra las rutas de distribución y vendedores</p>
        </div>
        <Button onClick={() => setShowNuevaRuta(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Ruta
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rutas</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRutas}</div>
            <p className="text-xs text-muted-foreground">{rutasActivas} activas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Con Vendedor</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{rutasConVendedor}</div>
            <p className="text-xs text-muted-foreground">Rutas asignadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sin Vendedor</CardTitle>
            <Users className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{rutasSinVendedor}</div>
            <p className="text-xs text-muted-foreground">Requieren asignación</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tipos de Ruta</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tiposRuta.length}</div>
            <p className="text-xs text-muted-foreground">Tipos diferentes</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar por nombre, código o vendedor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={filtroTipo} onValueChange={setFiltroTipo}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            {tiposRuta.map((tipo) => (
              <SelectItem key={tipo} value={tipo}>
                {tipo}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filtroEstado} onValueChange={setFiltroEstado}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="activas">Activas</SelectItem>
            <SelectItem value="inactivas">Inactivas</SelectItem>
            <SelectItem value="con-vendedor">Con Vendedor</SelectItem>
            <SelectItem value="sin-vendedor">Sin Vendedor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Routes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Rutas de Distribución</CardTitle>
          <CardDescription>
            {rutasFiltradas.length} de {totalRutas} rutas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    Código
                  </div>
                </TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Vendedor</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rutasFiltradas.map((ruta) => (
                <TableRow key={ruta.id}>
                  <TableCell className="font-mono text-sm">{ruta.numero_identificador}</TableCell>
                  <TableCell>
                    <div className="font-medium">{ruta.nombre}</div>
                  </TableCell>
                  <TableCell>{getTipoRutaBadge(ruta.tipo)}</TableCell>
                  <TableCell>
                    {ruta.vendedor_nombre ? (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-green-500" />
                        <span>{ruta.vendedor_nombre}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-muted-foreground">Sin asignar</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{getEstadoBadge(ruta.activa)}</TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate text-sm text-muted-foreground">
                      {ruta.descripcion || "Sin descripción"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" onClick={() => handleVerRuta(ruta.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEditarRuta(ruta.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleAsignarVendedor(ruta.id)}>
                        <UserPlus className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {rutasFiltradas.length === 0 && (
            <div className="text-center py-8">
              <MapPin className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay rutas</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || filtroTipo !== "todos" || filtroEstado !== "todos"
                  ? "No se encontraron rutas con los filtros aplicados."
                  : "Comienza creando tu primera ruta de distribución."}
              </p>
              {!searchTerm && filtroTipo === "todos" && filtroEstado === "todos" && (
                <div className="mt-6">
                  <Button onClick={() => setShowNuevaRuta(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Crear Ruta
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <NuevaRutaDialog open={showNuevaRuta} onOpenChange={setShowNuevaRuta} onRutaCreada={handleRutaCreada} />

      <EditarRutaDialog
        open={showEditarRuta}
        onOpenChange={setShowEditarRuta}
        rutaId={rutaSeleccionada}
        onRutaActualizada={handleRutaActualizada}
      />

      <DetalleRutaDialog
        open={showDetalleRuta}
        onOpenChange={setShowDetalleRuta}
        rutaId={rutaSeleccionada}
        onEditarRuta={handleEditarRuta}
      />

      <AsignarVendedorDialog
        open={showAsignarVendedor}
        onOpenChange={setShowAsignarVendedor}
        rutaId={rutaSeleccionada}
        usuarios={usuarios}
        onVendedorAsignado={handleVendedorAsignado}
      />
    </div>
  )
}
