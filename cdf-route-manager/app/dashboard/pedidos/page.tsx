"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  Plus,
  Eye,
  TrendingUp,
  Package,
  Users,
  DollarSign,
  Download,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  ArrowRight,
  ArrowLeft,
  Receipt,
} from "lucide-react"
import { NuevoPedidoDialog } from "@/components/pedidos/nuevo-pedido-dialog"
import { DetallePedidoDialog } from "@/components/pedidos/detalle-pedido-dialog"
import { PreviewFacturaDialog } from "@/components/pedidos/preview-factura-dialog"
import { useToast } from "@/hooks/use-toast"

interface Pedido {
  id: number
  cliente_nombre: string
  usuario_nombre: string
  fecha: string
  total: number
  estatus: "Pendiente" | "En Ruta" | "Entregado" | "Cancelado"
  items_count: number
  tiene_factura?: boolean
}

interface EstadisticasPedidos {
  total_pedidos: number
  pedidos_pendientes: number
  pedidos_entregados: number
  ventas_totales: number
  promedio_pedido: number
  clientes_activos: number
}

const estadoColors = {
  Pendiente: "bg-yellow-100 text-yellow-800 border-yellow-200",
  "En Ruta": "bg-blue-100 text-blue-800 border-blue-200",
  Entregado: "bg-green-100 text-green-800 border-green-200",
  Cancelado: "bg-red-100 text-red-800 border-red-200",
}

const estadoIcons = {
  Pendiente: Clock,
  "En Ruta": Truck,
  Entregado: CheckCircle,
  Cancelado: XCircle,
}

// Flujo de estados permitidos
const estadoFlujo = {
  Pendiente: { siguiente: "En Ruta", anterior: null },
  "En Ruta": { siguiente: "Entregado", anterior: "Pendiente" },
  Entregado: { siguiente: null, anterior: "En Ruta" },
  Cancelado: { siguiente: null, anterior: null },
}

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [estadisticas, setEstadisticas] = useState<EstadisticasPedidos>({
    total_pedidos: 0,
    pedidos_pendientes: 0,
    pedidos_entregados: 0,
    ventas_totales: 0,
    promedio_pedido: 0,
    clientes_activos: 0,
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroEstado, setFiltroEstado] = useState<string>("todos")
  const [filtroFecha, setFiltroFecha] = useState<string>("todos")
  const [nuevoPedidoOpen, setNuevoPedidoOpen] = useState(false)
  const [detallePedidoOpen, setDetallePedidoOpen] = useState(false)
  const [previewFacturaOpen, setPreviewFacturaOpen] = useState(false)
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<number | null>(null)
  const [cambiandoEstado, setCambiandoEstado] = useState<number | null>(null)
  const { toast } = useToast()

  // Datos de prueba simulados basados en el script SQL
  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true)

      // Simular carga de datos
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Datos de prueba que coinciden con el script SQL
      const pedidosPrueba: Pedido[] = [
        {
          id: 1,
          cliente_nombre: "Tienda La Esquina",
          usuario_nombre: "María García",
          fecha: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          total: 450.0,
          estatus: "Entregado",
          items_count: 4,
          tiene_factura: true,
        },
        {
          id: 2,
          cliente_nombre: "Súper Mercado Norte",
          usuario_nombre: "María García",
          fecha: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          total: 320.5,
          estatus: "En Ruta",
          items_count: 4,
          tiene_factura: false,
        },
        {
          id: 3,
          cliente_nombre: "Abarrotes El Sur",
          usuario_nombre: "Carlos López",
          fecha: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          total: 180.0,
          estatus: "Pendiente",
          items_count: 3,
          tiene_factura: false,
        },
        {
          id: 4,
          cliente_nombre: "Minisuper Central",
          usuario_nombre: "María García",
          fecha: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          total: 275.0,
          estatus: "Entregado",
          items_count: 4,
          tiene_factura: true,
        },
        {
          id: 5,
          cliente_nombre: "Tienda La Esquina",
          usuario_nombre: "Carlos López",
          fecha: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          total: 390.0,
          estatus: "Cancelado",
          items_count: 3,
          tiene_factura: false,
        },
        {
          id: 6,
          cliente_nombre: "Súper Mercado Norte",
          usuario_nombre: "María García",
          fecha: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
          total: 520.0,
          estatus: "Entregado",
          items_count: 4,
          tiene_factura: true,
        },
        {
          id: 7,
          cliente_nombre: "Abarrotes El Sur",
          usuario_nombre: "Carlos López",
          fecha: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          total: 210.5,
          estatus: "Entregado",
          items_count: 4,
          tiene_factura: false,
        },
        {
          id: 8,
          cliente_nombre: "Minisuper Central",
          usuario_nombre: "María García",
          fecha: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
          total: 340.0,
          estatus: "Entregado",
          items_count: 4,
          tiene_factura: true,
        },
      ]

      const estadisticasPrueba: EstadisticasPedidos = {
        total_pedidos: 18,
        pedidos_pendientes: 1,
        pedidos_entregados: 15,
        ventas_totales: 6235.5,
        promedio_pedido: 346.42,
        clientes_activos: 4,
      }

      setPedidos(pedidosPrueba)
      setEstadisticas(estadisticasPrueba)
      setLoading(false)
    }

    cargarDatos()
  }, [])

  const pedidosFiltrados = pedidos.filter((pedido) => {
    const matchesSearch =
      pedido.cliente_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pedido.usuario_nombre.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesEstado = filtroEstado === "todos" || pedido.estatus === filtroEstado

    let matchesFecha = true
    if (filtroFecha !== "todos") {
      const fechaPedido = new Date(pedido.fecha)
      const ahora = new Date()

      switch (filtroFecha) {
        case "hoy":
          matchesFecha = fechaPedido.toDateString() === ahora.toDateString()
          break
        case "semana":
          const inicioSemana = new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000)
          matchesFecha = fechaPedido >= inicioSemana
          break
        case "mes":
          const inicioMes = new Date(ahora.getTime() - 30 * 24 * 60 * 60 * 1000)
          matchesFecha = fechaPedido >= inicioMes
          break
      }
    }

    return matchesSearch && matchesEstado && matchesFecha
  })

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatearMoneda = (cantidad: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(cantidad)
  }

  const handleVerDetalle = (pedidoId: number) => {
    setPedidoSeleccionado(pedidoId)
    setDetallePedidoOpen(true)
  }

  const handlePreviewFactura = (pedidoId: number) => {
    setPedidoSeleccionado(pedidoId)
    setPreviewFacturaOpen(true)
  }

  const handleNuevoPedido = () => {
    setNuevoPedidoOpen(true)
  }

  const handlePedidoCreado = () => {
    toast({
      title: "Pedido creado",
      description: "El pedido se ha creado exitosamente.",
    })
    // Aquí recargarías los datos
  }

  const handleCambiarEstado = async (pedidoId: number, nuevoEstado: string, direccion: "adelante" | "atras") => {
    setCambiandoEstado(pedidoId)

    try {
      // Simular llamada a API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setPedidos((prev) =>
        prev.map((pedido) => (pedido.id === pedidoId ? { ...pedido, estatus: nuevoEstado as any } : pedido)),
      )

      const direccionTexto = direccion === "adelante" ? "avanzado" : "retrocedido"
      toast({
        title: "Estado actualizado",
        description: `El pedido #${pedidoId} ha ${direccionTexto} a ${nuevoEstado}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del pedido",
        variant: "destructive",
      })
    } finally {
      setCambiandoEstado(null)
    }
  }

  const puedeAvanzar = (estatus: string) => {
    return estadoFlujo[estatus as keyof typeof estadoFlujo]?.siguiente !== null
  }

  const puedeRetroceder = (estatus: string) => {
    return estadoFlujo[estatus as keyof typeof estadoFlujo]?.anterior !== null
  }

  const obtenerSiguienteEstado = (estatus: string) => {
    return estadoFlujo[estatus as keyof typeof estadoFlujo]?.siguiente
  }

  const obtenerAnteriorEstado = (estatus: string) => {
    return estadoFlujo[estatus as keyof typeof estadoFlujo]?.anterior
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Pedidos</h1>
          <p className="text-muted-foreground">Administra y monitorea todos los pedidos del sistema</p>
        </div>
        <Button onClick={handleNuevoPedido} className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Pedido
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pedidos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadisticas.total_pedidos}</div>
            <p className="text-xs text-muted-foreground">+2 desde ayer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatearMoneda(estadisticas.ventas_totales)}</div>
            <p className="text-xs text-muted-foreground">+12% desde el mes pasado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promedio por Pedido</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatearMoneda(estadisticas.promedio_pedido)}</div>
            <p className="text-xs text-muted-foreground">+5% desde la semana pasada</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Activos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadisticas.clientes_activos}</div>
            <p className="text-xs text-muted-foreground">Todos los clientes han pedido</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y búsqueda */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Pedidos</CardTitle>
          <CardDescription>Administra y visualiza todos los pedidos registrados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por cliente o vendedor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>

            <Select value={filtroEstado} onValueChange={setFiltroEstado}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="Pendiente">Pendiente</SelectItem>
                <SelectItem value="En Ruta">En Ruta</SelectItem>
                <SelectItem value="Entregado">Entregado</SelectItem>
                <SelectItem value="Cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filtroFecha} onValueChange={setFiltroFecha}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los períodos</SelectItem>
                <SelectItem value="hoy">Hoy</SelectItem>
                <SelectItem value="semana">Última semana</SelectItem>
                <SelectItem value="mes">Último mes</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </div>

          <Tabs defaultValue="lista" className="w-full">
            <TabsList>
              <TabsTrigger value="lista">Lista</TabsTrigger>
              <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
            </TabsList>

            <TabsContent value="lista" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Vendedor</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pedidosFiltrados.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          <div className="flex flex-col items-center gap-2">
                            <Package className="h-8 w-8 text-muted-foreground" />
                            <p className="text-muted-foreground">No se encontraron pedidos</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      pedidosFiltrados.map((pedido) => {
                        const EstadoIcon = estadoIcons[pedido.estatus]
                        const cargandoEste = cambiandoEstado === pedido.id

                        return (
                          <TableRow key={pedido.id}>
                            <TableCell className="font-medium">#{pedido.id}</TableCell>
                            <TableCell>{pedido.cliente_nombre}</TableCell>
                            <TableCell>{pedido.usuario_nombre}</TableCell>
                            <TableCell>{formatearFecha(pedido.fecha)}</TableCell>
                            <TableCell>{pedido.items_count} items</TableCell>
                            <TableCell className="font-medium">{formatearMoneda(pedido.total)}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={`${estadoColors[pedido.estatus]} gap-1`}>
                                <EstadoIcon className="h-3 w-3" />
                                {pedido.estatus}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleVerDetalle(pedido.id)}
                                  className="gap-1"
                                >
                                  <Eye className="h-3 w-3" />
                                  Ver
                                </Button>

                                {pedido.tiene_factura && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-1 bg-transparent"
                                    onClick={() => handlePreviewFactura(pedido.id)}
                                  >
                                    <Receipt className="h-3 w-3" />
                                    Factura
                                  </Button>
                                )}

                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      disabled={cargandoEste}
                                      className="gap-1 bg-transparent"
                                    >
                                      {cargandoEste ? (
                                        <div className="animate-spin rounded-full h-3 w-3 border-b border-current" />
                                      ) : (
                                        <MoreHorizontal className="h-3 w-3" />
                                      )}
                                      Estado
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Cambiar Estado</DropdownMenuLabel>
                                    <DropdownMenuSeparator />

                                    {puedeRetroceder(pedido.estatus) && (
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleCambiarEstado(
                                            pedido.id,
                                            obtenerAnteriorEstado(pedido.estatus)!,
                                            "atras",
                                          )
                                        }
                                        className="gap-2"
                                      >
                                        <ArrowLeft className="h-3 w-3" />
                                        Retroceder a {obtenerAnteriorEstado(pedido.estatus)}
                                      </DropdownMenuItem>
                                    )}

                                    {puedeAvanzar(pedido.estatus) && (
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleCambiarEstado(
                                            pedido.id,
                                            obtenerSiguienteEstado(pedido.estatus)!,
                                            "adelante",
                                          )
                                        }
                                        className="gap-2"
                                      >
                                        <ArrowRight className="h-3 w-3" />
                                        Avanzar a {obtenerSiguienteEstado(pedido.estatus)}
                                      </DropdownMenuItem>
                                    )}

                                    {pedido.estatus !== "Cancelado" && (
                                      <>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                          onClick={() => handleCambiarEstado(pedido.id, "Cancelado", "adelante")}
                                          className="gap-2 text-red-600"
                                        >
                                          <XCircle className="h-3 w-3" />
                                          Cancelar Pedido
                                        </DropdownMenuItem>
                                      </>
                                    )}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="estadisticas" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Pedidos por Estado</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Entregados
                        </span>
                        <Badge className="bg-green-100 text-green-800">{estadisticas.pedidos_entregados}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-yellow-600" />
                          Pendientes
                        </span>
                        <Badge className="bg-yellow-100 text-yellow-800">{estadisticas.pedidos_pendientes}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2">
                          <Truck className="h-4 w-4 text-blue-600" />
                          En Ruta
                        </span>
                        <Badge className="bg-blue-100 text-blue-800">1</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-red-600" />
                          Cancelados
                        </span>
                        <Badge className="bg-red-100 text-red-800">1</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Rendimiento de Ventas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Ventas del Mes</span>
                        <span className="font-medium">{formatearMoneda(6235.5)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Meta Mensual</span>
                        <span className="font-medium">{formatearMoneda(8000.0)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Progreso</span>
                        <Badge className="bg-blue-100 text-blue-800">77.9%</Badge>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: "77.9%" }}></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Productos Más Vendidos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Coca Cola 600ml</span>
                        <Badge variant="outline">150 unidades</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Agua Natural 1L</span>
                        <Badge variant="outline">180 unidades</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Pepsi 600ml</span>
                        <Badge variant="outline">120 unidades</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Sabritas Original</span>
                        <Badge variant="outline">45 unidades</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Clientes Top</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Súper Mercado Norte</span>
                        <span className="font-medium">{formatearMoneda(1221.0)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Tienda La Esquina</span>
                        <span className="font-medium">{formatearMoneda(1265.0)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Minisuper Central</span>
                        <span className="font-medium">{formatearMoneda(930.0)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Abarrotes El Sur</span>
                        <span className="font-medium">{formatearMoneda(680.5)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <NuevoPedidoDialog open={nuevoPedidoOpen} onOpenChange={setNuevoPedidoOpen} onPedidoCreado={handlePedidoCreado} />

      <DetallePedidoDialog open={detallePedidoOpen} onOpenChange={setDetallePedidoOpen} pedidoId={pedidoSeleccionado} />

      <PreviewFacturaDialog
        open={previewFacturaOpen}
        onOpenChange={setPreviewFacturaOpen}
        pedidoId={pedidoSeleccionado}
      />
    </div>
  )
}
