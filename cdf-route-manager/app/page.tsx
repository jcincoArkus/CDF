import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TruckIcon, Users, Package, ShoppingCart, BarChart3 } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <TruckIcon className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">CDF RouteManager</h1>
            </div>
            <Link href="/dashboard">
              <Button size="lg">Acceder al Sistema</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Sistema Integral de
            <span className="text-blue-600"> Gestión de Ventas</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Optimiza las operaciones de ventas y distribución con aplicaciones móviles y web, enfocadas en eficiencia
            operativa, control de inventario y experiencia del cliente.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <Link href="/dashboard">
              <Button size="lg" className="w-full sm:w-auto">
                Comenzar Ahora
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Gestión de Clientes</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Administra tu cartera de clientes, rutas y relaciones comerciales de manera eficiente.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Package className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Control de Inventario</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Mantén el control total de tu inventario con alertas automáticas y gestión en tiempo real.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <ShoppingCart className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle>Gestión de Pedidos</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Procesa pedidos de manera rápida y eficiente con seguimiento completo del estado.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-orange-600 mb-2" />
                <CardTitle>Reportes y Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Obtén insights valiosos con reportes detallados y análisis de rendimiento.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
