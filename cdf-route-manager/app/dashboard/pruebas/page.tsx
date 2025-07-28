"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Database,
  Users,
  Package,
  ShoppingCart,
  Warehouse,
  RefreshCw,
  Activity,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getClientes, getProductos, getPedidos, getInventario, getRutas, getDashboardStats, supabase } from "@/lib/db"
import { obtenerFacturas } from "@/lib/actions/facturas"
import { crearPedido } from "@/lib/pedidos"

interface TestResult {
  name: string
  status: "success" | "error" | "warning" | "pending"
  message: string
  data?: any
  duration?: number
}

interface ConnectionTest {
  database: TestResult
  tables: TestResult[]
  operations: TestResult[]
}

export default function PruebasPage() {
  const [connectionTest, setConnectionTest] = useState<ConnectionTest>({
    database: { name: "Conexión Base de Datos", status: "pending", message: "Iniciando..." },
    tables: [],
    operations: [],
  })
  const [loading, setLoading] = useState(false)
  const [testData, setTestData] = useState<any>({})
  const { toast } = useToast()

  useEffect(() => {
    runAllTests()
  }, [])

  const runAllTests = async () => {
    setLoading(true)
    const startTime = Date.now()

    try {
      // Test 1: Conexión a Supabase
      const dbTest = await testDatabaseConnection()

      // Test 2: Verificar tablas
      const tableTests = await testTables()

      // Test 3: Operaciones CRUD
      const operationTests = await testOperations()

      setConnectionTest({
        database: dbTest,
        tables: tableTests,
        operations: operationTests,
      })

      const duration = Date.now() - startTime
      toast({
        title: "Pruebas completadas",
        description: `Todas las pruebas ejecutadas en ${duration}ms`,
      })
    } catch (error) {
      console.error("Error en pruebas:", error)
      toast({
        title: "Error en pruebas",
        description: "Ocurrió un error durante la ejecución de las pruebas",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const testDatabaseConnection = async (): Promise<TestResult> => {
    const startTime = Date.now()

    try {
      // Intentar conectar con Supabase
      const { data, error } = await supabase.from("clientes").select("count", { count: "exact" }).limit(1)

      const duration = Date.now() - startTime

      if (error) {
        return {
          name: "Conexión Base de Datos",
          status: "warning",
          message: `Usando datos mock - ${error.message}`,
          duration,
        }
      }

      return {
        name: "Conexión Base de Datos",
        status: "success",
        message: `Conectado exitosamente a Supabase`,
        duration,
        data: { count: data?.length || 0 },
      }
    } catch (error) {
      return {
        name: "Conexión Base de Datos",
        status: "warning",
        message: `Modo demo - usando datos mock`,
        duration: Date.now() - startTime,
      }
    }
  }

  const testTables = async (): Promise<TestResult[]> => {
    const tests: TestResult[] = []

    // Test Clientes
    try {
      const startTime = Date.now()
      const clientes = await getClientes()
      const duration = Date.now() - startTime

      tests.push({
        name: "Tabla Clientes",
        status: clientes.length > 0 ? "success" : "warning",
        message: `${clientes.length} registros encontrados`,
        duration,
        data: clientes.slice(0, 3),
      })

      setTestData((prev) => ({ ...prev, clientes }))
    } catch (error) {
      tests.push({
        name: "Tabla Clientes",
        status: "error",
        message: `Error: ${error}`,
      })
    }

    // Test Productos
    try {
      const startTime = Date.now()
      const productos = await getProductos()
      const duration = Date.now() - startTime

      tests.push({
        name: "Tabla Productos",
        status: productos.length > 0 ? "success" : "warning",
        message: `${productos.length} registros encontrados`,
        duration,
        data: productos.slice(0, 3),
      })

      setTestData((prev) => ({ ...prev, productos }))
    } catch (error) {
      tests.push({
        name: "Tabla Productos",
        status: "error",
        message: `Error: ${error}`,
      })
    }

    // Test Pedidos
    try {
      const startTime = Date.now()
      const pedidos = await getPedidos()
      const duration = Date.now() - startTime

      tests.push({
        name: "Tabla Pedidos",
        status: pedidos.length > 0 ? "success" : "warning",
        message: `${pedidos.length} registros encontrados`,
        duration,
        data: pedidos.slice(0, 3),
      })

      setTestData((prev) => ({ ...prev, pedidos }))
    } catch (error) {
      tests.push({
        name: "Tabla Pedidos",
        status: "error",
        message: `Error: ${error}`,
      })
    }

    // Test Inventario
    try {
      const startTime = Date.now()
      const inventario = await getInventario()
      const duration = Date.now() - startTime

      tests.push({
        name: "Tabla Inventario",
        status: inventario.length > 0 ? "success" : "warning",
        message: `${inventario.length} registros encontrados`,
        duration,
        data: inventario.slice(0, 3),
      })

      setTestData((prev) => ({ ...prev, inventario }))
    } catch (error) {
      tests.push({
        name: "Tabla Inventario",
        status: "error",
        message: `Error: ${error}`,
      })
    }

    // Test Rutas
    try {
      const startTime = Date.now()
      const rutas = await getRutas()
      const duration = Date.now() - startTime

      tests.push({
        name: "Tabla Rutas",
        status: rutas.length > 0 ? "success" : "warning",
        message: `${rutas.length} registros encontrados`,
        duration,
        data: rutas.slice(0, 3),
      })

      setTestData((prev) => ({ ...prev, rutas }))
    } catch (error) {
      tests.push({
        name: "Tabla Rutas",
        status: "error",
        message: `Error: ${error}`,
      })
    }

    return tests
  }

  const testOperations = async (): Promise<TestResult[]> => {
    const tests: TestResult[] = []

    // Test Dashboard Stats
    try {
      const startTime = Date.now()
      const stats = await getDashboardStats()
      const duration = Date.now() - startTime

      tests.push({
        name: "Dashboard Stats",
        status: "success",
        message: `Estadísticas calculadas correctamente`,
        duration,
        data: stats,
      })
    } catch (error) {
      tests.push({
        name: "Dashboard Stats",
        status: "error",
        message: `Error: ${error}`,
      })
    }

    // Test Facturas
    try {
      const startTime = Date.now()
      const { success, data } = await obtenerFacturas()
      const duration = Date.now() - startTime

      tests.push({
        name: "Sistema Facturas",
        status: success ? "success" : "error",
        message: success ? `${data?.length || 0} facturas encontradas` : "Error al obtener facturas",
        duration,
        data: data?.slice(0, 2),
      })
    } catch (error) {
      tests.push({
        name: "Sistema Facturas",
        status: "error",
        message: `Error: ${error}`,
      })
    }

    // Test Crear Pedido
    try {
      const startTime = Date.now()
      const testPedido = {
        cliente_id: 1,
        items: [
          {
            producto_id: 1,
            cantidad: 2,
            precio_unitario: 15.5,
            subtotal: 31.0,
          },
        ],
        total: 31.0,
        observaciones: "Pedido de prueba",
      }

      const result = await crearPedido(testPedido)
      const duration = Date.now() - startTime

      tests.push({
        name: "Crear Pedido",
        status: result.success ? "success" : "error",
        message: result.success ? "Pedido creado exitosamente" : result.error || "Error desconocido",
        duration,
        data: result.data,
      })
    } catch (error) {
      tests.push({
        name: "Crear Pedido",
        status: "error",
        message: `Error: ${error}`,
      })
    }

    return tests
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case "pending":
        return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />
      default:
        return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      success: "bg-green-100 text-green-800 border-green-200",
      error: "bg-red-100 text-red-800 border-red-200",
      warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
      pending: "bg-blue-100 text-blue-800 border-blue-200",
    }

    return (
      <Badge variant="outline" className={colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"}>
        {status.toUpperCase()}
      </Badge>
    )
  }

  const formatDuration = (duration?: number) => {
    if (!duration) return ""
    return `${duration}ms`
  }

  const getTotalTests = () => {
    return 1 + connectionTest.tables.length + connectionTest.operations.length
  }

  const getSuccessfulTests = () => {
    let count = 0
    if (connectionTest.database.status === "success") count++
    count += connectionTest.tables.filter((t) => t.status === "success").length
    count += connectionTest.operations.filter((t) => t.status === "success").length
    return count
  }

  const getWarningTests = () => {
    let count = 0
    if (connectionTest.database.status === "warning") count++
    count += connectionTest.tables.filter((t) => t.status === "warning").length
    count += connectionTest.operations.filter((t) => t.status === "warning").length
    return count
  }

  const getErrorTests = () => {
    let count = 0
    if (connectionTest.database.status === "error") count++
    count += connectionTest.tables.filter((t) => t.status === "error").length
    count += connectionTest.operations.filter((t) => t.status === "error").length
    return count
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pruebas de Sistema</h1>
          <p className="text-muted-foreground">Verificación de conexión Supabase y funcionalidades</p>
        </div>
        <Button onClick={runAllTests} disabled={loading} className="gap-2">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Ejecutando..." : "Ejecutar Pruebas"}
        </Button>
      </div>

      {/* Resumen */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pruebas</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalTests()}</div>
            <p className="text-xs text-muted-foreground">Pruebas ejecutadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exitosas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{getSuccessfulTests()}</div>
            <p className="text-xs text-muted-foreground">Funcionando correctamente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Advertencias</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{getWarningTests()}</div>
            <p className="text-xs text-muted-foreground">Usando datos mock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Errores</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{getErrorTests()}</div>
            <p className="text-xs text-muted-foreground">Requieren atención</p>
          </CardContent>
        </Card>
      </div>

      {/* Estado de conexión */}
      <Alert
        className={
          connectionTest.database.status === "success"
            ? "border-green-200 bg-green-50"
            : connectionTest.database.status === "warning"
              ? "border-yellow-200 bg-yellow-50"
              : "border-red-200 bg-red-50"
        }
      >
        <Database className="h-4 w-4" />
        <AlertTitle className="flex items-center gap-2">
          {getStatusIcon(connectionTest.database.status)}
          Estado de Conexión Supabase
        </AlertTitle>
        <AlertDescription>
          {connectionTest.database.message}
          {connectionTest.database.duration && (
            <span className="ml-2 text-xs">({formatDuration(connectionTest.database.duration)})</span>
          )}
        </AlertDescription>
      </Alert>

      {/* Resultados detallados */}
      <Tabs defaultValue="tables" className="w-full">
        <TabsList>
          <TabsTrigger value="tables">Tablas</TabsTrigger>
          <TabsTrigger value="operations">Operaciones</TabsTrigger>
          <TabsTrigger value="data">Datos</TabsTrigger>
        </TabsList>

        <TabsContent value="tables" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pruebas de Tablas</CardTitle>
              <CardDescription>Verificación de acceso a tablas y datos</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tabla</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Mensaje</TableHead>
                    <TableHead>Duración</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {connectionTest.tables.map((test, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium flex items-center gap-2">
                        {getStatusIcon(test.status)}
                        {test.name}
                      </TableCell>
                      <TableCell>{getStatusBadge(test.status)}</TableCell>
                      <TableCell>{test.message}</TableCell>
                      <TableCell className="text-muted-foreground">{formatDuration(test.duration)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pruebas de Operaciones</CardTitle>
              <CardDescription>Verificación de funcionalidades del sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Operación</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Mensaje</TableHead>
                    <TableHead>Duración</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {connectionTest.operations.map((test, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium flex items-center gap-2">
                        {getStatusIcon(test.status)}
                        {test.name}
                      </TableCell>
                      <TableCell>{getStatusBadge(test.status)}</TableCell>
                      <TableCell>{test.message}</TableCell>
                      <TableCell className="text-muted-foreground">{formatDuration(test.duration)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Clientes */}
            {testData.clientes && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Clientes ({testData.clientes.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {testData.clientes.slice(0, 3).map((cliente: any) => (
                      <div key={cliente.id} className="flex justify-between items-center p-2 bg-muted rounded">
                        <span className="font-medium">{cliente.nombre}</span>
                        <Badge variant="outline">{cliente.telefono}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Productos */}
            {testData.productos && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Productos ({testData.productos.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {testData.productos.slice(0, 3).map((producto: any) => (
                      <div key={producto.id} className="flex justify-between items-center p-2 bg-muted rounded">
                        <span className="font-medium">{producto.nombre}</span>
                        <Badge variant="outline">${producto.precio}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Pedidos */}
            {testData.pedidos && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Pedidos ({testData.pedidos.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {testData.pedidos.slice(0, 3).map((pedido: any) => (
                      <div key={pedido.id} className="flex justify-between items-center p-2 bg-muted rounded">
                        <span className="font-medium">#{pedido.id}</span>
                        <Badge variant="outline">${pedido.total}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Inventario */}
            {testData.inventario && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Warehouse className="h-4 w-4" />
                    Inventario ({testData.inventario.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {testData.inventario.slice(0, 3).map((item: any) => (
                      <div key={item.id} className="flex justify-between items-center p-2 bg-muted rounded">
                        <span className="font-medium">Producto #{item.producto_id}</span>
                        <Badge variant="outline">{item.cantidad} unidades</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
