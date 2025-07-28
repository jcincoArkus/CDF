export interface Pedido {
  id: number
  numero_pedido: string
  cliente_id: number
  usuario_id?: number
  fecha: string
  total: number
  estatus: "Pendiente" | "En Ruta" | "Entregado" | "Cancelado"
  observaciones?: string
  descuento?: number
  impuestos?: number
  items?: ItemPedido[]
  cliente?: {
    id: number
    nombre: string
    direccion?: string
    telefono?: string
  }
  usuario?: {
    id: number
    nombre: string
  }
}

export interface ItemPedido {
  producto_id: number
  cantidad: number
  precio_unitario: number
  subtotal: number
  producto?: {
    id: number
    nombre: string
    sku: string
    precio: number
  }
}

export interface DetallePedido {
  id?: number
  pedido_id?: number
  producto_id: number
  cantidad: number
  precio_unitario: number
  descuento?: number
  subtotal: number
}

export interface PedidoCompleto extends Pedido {
  detalles?: (DetallePedido & {
    producto?: {
      id: number
      nombre: string
      sku: string
      categoria?: string
    }
  })[]
}

export interface CrearPedidoData {
  cliente_id: number
  items: ItemPedido[]
  observaciones?: string
  descuento?: number
  impuestos?: number
  total: number
}

export interface CrearPedidoResponse {
  success: boolean
  data?: any
  error?: string
  message?: string
}

export const ESTATUS_PEDIDO = {
  PENDIENTE: "Pendiente",
  CONFIRMADO: "Confirmado",
  EN_RUTA: "En Ruta",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
} as const

export type EstatusPedido = (typeof ESTATUS_PEDIDO)[keyof typeof ESTATUS_PEDIDO]

export function calcularTotalPedido(detalles: DetallePedido[]): number {
  return detalles.reduce((total, detalle) => total + detalle.subtotal, 0)
}

export function calcularSubtotalDetalle(cantidad: number, precioUnitario: number, descuento = 0): number {
  return cantidad * precioUnitario - descuento
}

export function generarNumeroPedido(): string {
  const fecha = new Date()
  const año = fecha.getFullYear().toString().slice(-2)
  const mes = (fecha.getMonth() + 1).toString().padStart(2, "0")
  const dia = fecha.getDate().toString().padStart(2, "0")
  const timestamp = Date.now().toString().slice(-6)

  return `PED-${año}${mes}${dia}-${timestamp}`
}

export function formatearFecha(fecha: string | Date): string {
  const fechaObj = typeof fecha === "string" ? new Date(fecha) : fecha
  return fechaObj.toLocaleDateString("es-MX", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
}

export function formatearFechaHora(fecha: string | Date): string {
  const fechaObj = typeof fecha === "string" ? new Date(fecha) : fecha
  return fechaObj.toLocaleString("es-MX", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function obtenerColorEstatus(estatus: string): string {
  switch (estatus) {
    case ESTATUS_PEDIDO.PENDIENTE:
      return "bg-yellow-100 text-yellow-800"
    case ESTATUS_PEDIDO.CONFIRMADO:
      return "bg-blue-100 text-blue-800"
    case ESTATUS_PEDIDO.EN_RUTA:
      return "bg-purple-100 text-purple-800"
    case ESTATUS_PEDIDO.ENTREGADO:
      return "bg-green-100 text-green-800"
    case ESTATUS_PEDIDO.CANCELADO:
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

// Mock data para pedidos
const mockPedidos: Pedido[] = [
  {
    id: 1,
    numero_pedido: "PED-001",
    cliente_id: 1,
    usuario_id: 1,
    fecha: new Date().toISOString(),
    total: 156.5,
    estatus: "Pendiente",
    observaciones: "Entrega en horario matutino",
    cliente: { id: 1, nombre: "Tienda El Sol" },
    usuario: { id: 1, nombre: "Juan Pérez" },
    items: [
      {
        producto_id: 1,
        cantidad: 5,
        precio_unitario: 15.5,
        subtotal: 77.5,
        producto: { id: 1, nombre: "Coca-Cola 600ml", sku: "CC-600", precio: 15.5 },
      },
      {
        producto_id: 2,
        cantidad: 4,
        precio_unitario: 18.0,
        subtotal: 72.0,
        producto: { id: 2, nombre: "Sabritas Original 45g", sku: "SAB-45", precio: 18.0 },
      },
    ],
  },
  {
    id: 2,
    numero_pedido: "PED-002",
    cliente_id: 2,
    usuario_id: 1,
    fecha: new Date(Date.now() - 86400000).toISOString(),
    total: 289.75,
    estatus: "Entregado",
    observaciones: "Cliente satisfecho",
    cliente: { id: 2, nombre: "Supermercado Luna" },
    usuario: { id: 1, nombre: "Juan Pérez" },
    items: [
      {
        producto_id: 3,
        cantidad: 8,
        precio_unitario: 32.5,
        subtotal: 260.0,
        producto: { id: 3, nombre: "Bimbo Pan Blanco", sku: "BIM-PB", precio: 32.5 },
      },
    ],
  },
]

// Función para crear un nuevo pedido
export async function crearPedido(data: CrearPedidoData): Promise<CrearPedidoResponse> {
  try {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Validar datos
    if (!data.cliente_id || !data.items || data.items.length === 0) {
      return {
        success: false,
        error: "Datos incompletos para crear el pedido",
      }
    }

    // Validar que el total coincida con la suma de subtotales
    const totalCalculado = data.items.reduce((sum, item) => sum + item.subtotal, 0)
    if (Math.abs(totalCalculado - data.total) > 0.01) {
      return {
        success: false,
        error: "El total no coincide con la suma de los items",
      }
    }

    // Generar nuevo pedido
    const nuevoPedido: Pedido = {
      id: Math.max(...mockPedidos.map((p) => p.id), 0) + 1,
      numero_pedido: `PED-${String(mockPedidos.length + 1).padStart(3, "0")}`,
      cliente_id: data.cliente_id,
      usuario_id: 1, // Usuario actual (mock)
      fecha: new Date().toISOString(),
      total: data.total,
      estatus: "Pendiente",
      observaciones: data.observaciones,
      descuento: data.descuento || 0,
      impuestos: data.impuestos || 0,
      items: data.items,
      cliente: { id: data.cliente_id, nombre: `Cliente ${data.cliente_id}` },
      usuario: { id: 1, nombre: "Usuario Actual" },
    }

    // Agregar a mock data
    mockPedidos.push(nuevoPedido)

    console.log("Pedido creado exitosamente:", nuevoPedido)

    return {
      success: true,
      data: nuevoPedido,
      message: "Pedido creado exitosamente",
    }
  } catch (error) {
    console.error("Error al crear pedido:", error)
    return {
      success: false,
      error: "Error interno del servidor",
    }
  }
}

// Función para obtener un pedido por ID
export async function obtenerPedido(id: number): Promise<Pedido | null> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockPedidos.find((p) => p.id === id) || null
  } catch (error) {
    console.error("Error al obtener pedido:", error)
    return null
  }
}

// Función para obtener todos los pedidos
export async function obtenerPedidos(filtros?: {
  cliente_id?: number
  estatus?: string
  fecha_desde?: string
  fecha_hasta?: string
}): Promise<Pedido[]> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500))

    let pedidosFiltrados = [...mockPedidos]

    if (filtros) {
      if (filtros.cliente_id) {
        pedidosFiltrados = pedidosFiltrados.filter((p) => p.cliente_id === filtros.cliente_id)
      }
      if (filtros.estatus) {
        pedidosFiltrados = pedidosFiltrados.filter((p) => p.estatus === filtros.estatus)
      }
      if (filtros.fecha_desde) {
        pedidosFiltrados = pedidosFiltrados.filter((p) => p.fecha >= filtros.fecha_desde!)
      }
      if (filtros.fecha_hasta) {
        pedidosFiltrados = pedidosFiltrados.filter((p) => p.fecha <= filtros.fecha_hasta!)
      }
    }

    return pedidosFiltrados.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
  } catch (error) {
    console.error("Error al obtener pedidos:", error)
    return []
  }
}

// Función para actualizar el estatus de un pedido
export async function actualizarEstatusPedido(
  id: number,
  nuevoEstatus: "Pendiente" | "En Ruta" | "Entregado" | "Cancelado",
): Promise<CrearPedidoResponse> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 800))

    const index = mockPedidos.findIndex((p) => p.id === id)
    if (index === -1) {
      return {
        success: false,
        error: "Pedido no encontrado",
      }
    }

    mockPedidos[index].estatus = nuevoEstatus

    console.log(`Estatus del pedido ${id} actualizado a: ${nuevoEstatus}`)

    return {
      success: true,
      data: mockPedidos[index],
      message: `Estatus actualizado a ${nuevoEstatus}`,
    }
  } catch (error) {
    console.error("Error al actualizar estatus:", error)
    return {
      success: false,
      error: "Error interno del servidor",
    }
  }
}

// Función para calcular estadísticas de pedidos
export function calcularEstadisticasPedidos(pedidos: Pedido[]) {
  const total = pedidos.length
  const pendientes = pedidos.filter((p) => p.estatus === "Pendiente").length
  const enRuta = pedidos.filter((p) => p.estatus === "En Ruta").length
  const entregados = pedidos.filter((p) => p.estatus === "Entregado").length
  const cancelados = pedidos.filter((p) => p.estatus === "Cancelado").length

  const ventasTotal = pedidos.filter((p) => p.estatus === "Entregado").reduce((sum, p) => sum + p.total, 0)

  return {
    total,
    pendientes,
    enRuta,
    entregados,
    cancelados,
    ventasTotal,
  }
}

// Función para validar items de pedido
export function validarItemsPedido(items: ItemPedido[]): { valido: boolean; errores: string[] } {
  const errores: string[] = []

  if (!items || items.length === 0) {
    errores.push("El pedido debe tener al menos un item")
  }

  items.forEach((item, index) => {
    if (!item.producto_id || item.producto_id <= 0) {
      errores.push(`Item ${index + 1}: ID de producto inválido`)
    }
    if (!item.cantidad || item.cantidad <= 0) {
      errores.push(`Item ${index + 1}: Cantidad debe ser mayor a 0`)
    }
    if (!item.precio_unitario || item.precio_unitario <= 0) {
      errores.push(`Item ${index + 1}: Precio unitario debe ser mayor a 0`)
    }
    if (Math.abs(item.subtotal - item.cantidad * item.precio_unitario) > 0.01) {
      errores.push(`Item ${index + 1}: Subtotal no coincide con cantidad × precio`)
    }
  })

  return {
    valido: errores.length === 0,
    errores,
  }
}
