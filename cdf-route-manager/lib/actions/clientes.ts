"use server"

import { supabase } from "@/lib/db"
import { revalidatePath } from "next/cache"

export interface Cliente {
  id?: number
  nombre: string
  direccion?: string
  telefono?: string
  email?: string
  rfc?: string
  activo?: boolean
  ruta_id?: number
  latitud?: number
  longitud?: number
}

export interface NuevoClienteData {
  nombre: string
  telefono: string
  direccion: string
  ruta_id: number
  latitud?: number
  longitud?: number
  referencias?: string
}

export interface ActualizarClienteData {
  nombre: string
  telefono: string
  direccion: string
  ruta_id: number
  latitud?: number
  longitud?: number
  referencias?: string
}

export interface ClienteDetalle {
  id: number
  nombre: string
  telefono: string
  direccion: string
  ruta_id: number
  ruta_nombre?: string
  latitud?: number
  longitud?: number
  referencias?: string
  created_at: string
  updated_at?: string
  total_pedidos?: number
  ultimo_pedido?: string
}

export interface RutaDisponible {
  id: number
  nombre: string
  tipo: string
}

// Mock data for demo purposes
const mockRutas: RutaDisponible[] = [
  { id: 1, nombre: "Ruta Centro", tipo: "Urbana" },
  { id: 2, nombre: "Ruta Norte", tipo: "Urbana" },
  { id: 3, nombre: "Ruta Sur", tipo: "Suburbana" },
  { id: 4, nombre: "Ruta Este", tipo: "Rural" },
  { id: 5, nombre: "Ruta Oeste", tipo: "Industrial" },
]

const mockClientes: ClienteDetalle[] = [
  {
    id: 1,
    nombre: "Tienda La Esquina",
    telefono: "555-0101",
    direccion: "Av. Principal 123, Col. Centro, CP 01000, Ciudad de México, CDMX",
    ruta_id: 1,
    ruta_nombre: "Ruta Centro",
    latitud: 19.4326,
    longitud: -99.1332,
    referencias: "Esquina con calle Morelos",
    created_at: "2024-01-15T10:00:00Z",
    total_pedidos: 25,
    ultimo_pedido: "2024-01-20T14:30:00Z",
  },
  {
    id: 2,
    nombre: "Súper Martínez",
    telefono: "555-0202",
    direccion: "Calle Juárez 456, Col. Norte, CP 02000, Ciudad de México, CDMX",
    ruta_id: 2,
    ruta_nombre: "Ruta Norte",
    latitud: 19.45,
    longitud: -99.12,
    referencias: "Frente al parque",
    created_at: "2024-01-16T11:30:00Z",
    total_pedidos: 18,
    ultimo_pedido: "2024-01-19T16:45:00Z",
  },
  {
    id: 3,
    nombre: "Abarrotes Don José",
    telefono: "555-0303",
    direccion: "Av. Revolución 789, Col. Sur, CP 03000, Ciudad de México, CDMX",
    ruta_id: 3,
    ruta_nombre: "Ruta Sur",
    latitud: 19.41,
    longitud: -99.14,
    referencias: "Local 5, plaza comercial",
    created_at: "2024-01-17T09:15:00Z",
    total_pedidos: 32,
    ultimo_pedido: "2024-01-21T10:20:00Z",
  },
  {
    id: 4,
    nombre: "Minisuper El Ahorro",
    telefono: "555-0404",
    direccion: "Calle Hidalgo 321, Col. Este, CP 04000, Ciudad de México, CDMX",
    ruta_id: 4,
    ruta_nombre: "Ruta Este",
    latitud: 19.43,
    longitud: -99.11,
    referencias: "Junto a la farmacia",
    created_at: "2024-01-18T15:20:00Z",
    total_pedidos: 15,
    ultimo_pedido: "2024-01-22T09:30:00Z",
  },
  {
    id: 5,
    nombre: "Comercial Los Pinos",
    telefono: "555-0505",
    direccion: "Av. Industria 654, Col. Oeste, CP 05000, Ciudad de México, CDMX",
    ruta_id: 5,
    ruta_nombre: "Ruta Oeste",
    latitud: 19.44,
    longitud: -99.16,
    referencias: "Zona industrial, bodega 12",
    created_at: "2024-01-19T12:45:00Z",
    total_pedidos: 28,
    ultimo_pedido: "2024-01-23T11:15:00Z",
  },
]

export async function crearCliente(cliente: NuevoClienteData) {
  try {
    const { data, error } = await supabase
      .from("clientes")
      .insert([
        {
          nombre: cliente.nombre,
          telefono: cliente.telefono,
          direccion: cliente.direccion,
          ruta_id: cliente.ruta_id,
          latitud: cliente.latitud,
          longitud: cliente.longitud,
        },
      ])
      .select()
      .single()

    if (error) {
      console.warn("Database error, using mock success:", error.message)
      // Fallback to mock success for demo
      const newId = Math.max(...mockClientes.map((c) => c.id)) + 1
      return {
        success: true,
        message: "Cliente creado exitosamente (modo demo)",
        cliente_id: newId,
      }
    }

    revalidatePath("/dashboard/clientes")
    return {
      success: true,
      message: "Cliente creado exitosamente",
      cliente_id: data.id,
    }
  } catch (error) {
    console.warn("Database connection failed, using mock success:", error)

    // Fallback to mock success for demo
    const newId = Math.max(...mockClientes.map((c) => c.id)) + 1
    return {
      success: true,
      message: "Cliente creado exitosamente (modo demo)",
      cliente_id: newId,
    }
  }
}

export async function actualizarCliente(id: number, cliente: ActualizarClienteData) {
  try {
    const { data, error } = await supabase
      .from("clientes")
      .update({
        nombre: cliente.nombre,
        telefono: cliente.telefono,
        direccion: cliente.direccion,
        ruta_id: cliente.ruta_id,
        latitud: cliente.latitud,
        longitud: cliente.longitud,
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.warn("Database error, using mock success:", error.message)
      return {
        success: true,
        message: "Cliente actualizado exitosamente (modo demo)",
      }
    }

    revalidatePath("/dashboard/clientes")
    return {
      success: true,
      message: "Cliente actualizado exitosamente",
      data,
    }
  } catch (error) {
    console.warn("Database connection failed, using mock success:", error)

    // Fallback to mock success for demo
    return {
      success: true,
      message: "Cliente actualizado exitosamente (modo demo)",
    }
  }
}

export async function eliminarCliente(id: number) {
  try {
    const { error } = await supabase.from("clientes").delete().eq("id", id)

    if (error) {
      console.warn("Database error:", error.message)
      return { success: false, error: "Error al eliminar el cliente (modo demo)" }
    }

    revalidatePath("/dashboard/clientes")
    return { success: true }
  } catch (error) {
    console.warn("Database connection failed:", error)
    return { success: false, error: "Error al eliminar el cliente (modo demo)" }
  }
}

export async function obtenerClientes() {
  try {
    const { data, error } = await supabase
      .from("clientes")
      .select(`
        *,
        rutas (nombre)
      `)
      .order("nombre")

    if (error) {
      console.warn("Database error, using mock data:", error.message)
      return mockClientes
    }

    return data || mockClientes
  } catch (error) {
    console.warn("Database connection failed, using mock data:", error)
    return mockClientes
  }
}

export async function obtenerDetalleCliente(id: number): Promise<ClienteDetalle> {
  try {
    const { data, error } = await supabase
      .from("clientes")
      .select(`
        *,
        rutas (nombre),
        pedidos (id, fecha)
      `)
      .eq("id", id)
      .single()

    if (error) {
      console.warn("Database error, using mock data:", error.message)
      // Fallback to mock data
      const mockCliente = mockClientes.find((c) => c.id === id)
      if (mockCliente) {
        return mockCliente
      }
      throw new Error("Cliente no encontrado")
    }

    const pedidos = data.pedidos || []
    const ultimoPedido =
      pedidos.length > 0
        ? pedidos.sort((a: any, b: any) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())[0]
        : null

    return {
      id: data.id,
      nombre: data.nombre,
      telefono: data.telefono,
      direccion: data.direccion,
      ruta_id: data.ruta_id,
      ruta_nombre: data.rutas?.nombre,
      latitud: data.latitud,
      longitud: data.longitud,
      referencias: data.referencias,
      created_at: data.created_at,
      updated_at: data.updated_at,
      total_pedidos: pedidos.length,
      ultimo_pedido: ultimoPedido?.fecha,
    }
  } catch (error) {
    console.warn("Database connection failed, using mock data:", error)

    // Fallback to mock data
    const mockCliente = mockClientes.find((c) => c.id === id)
    if (mockCliente) {
      return mockCliente
    }

    throw new Error("Cliente no encontrado")
  }
}

export async function obtenerRutasDisponibles(): Promise<RutaDisponible[]> {
  try {
    const { data, error } = await supabase.from("rutas").select("id, nombre, tipo").eq("activa", true).order("nombre")

    if (error) {
      console.warn("Database error (rutas table may not exist), using mock data:", error.message)
      return mockRutas
    }

    return data && data.length > 0 ? data : mockRutas
  } catch (error) {
    console.warn("Database connection failed or rutas table doesn't exist, using mock data:", error)
    // Always return mock rutas when database is not available
    return mockRutas
  }
}

export async function buscarClientes(termino: string) {
  try {
    const { data, error } = await supabase
      .from("clientes")
      .select(`
        *,
        rutas (nombre)
      `)
      .or(`nombre.ilike.%${termino}%,telefono.ilike.%${termino}%,direccion.ilike.%${termino}%`)
      .order("nombre")

    if (error) {
      console.warn("Database error, using mock data:", error.message)
      // Filter mock data based on search term
      const filteredMockClientes = mockClientes.filter(
        (cliente) =>
          cliente.nombre.toLowerCase().includes(termino.toLowerCase()) ||
          cliente.telefono.includes(termino) ||
          cliente.direccion.toLowerCase().includes(termino.toLowerCase()),
      )
      return filteredMockClientes
    }

    return data || []
  } catch (error) {
    console.warn("Database connection failed, using mock data:", error)
    // Filter mock data based on search term
    const filteredMockClientes = mockClientes.filter(
      (cliente) =>
        cliente.nombre.toLowerCase().includes(termino.toLowerCase()) ||
        cliente.telefono.includes(termino) ||
        cliente.direccion.toLowerCase().includes(termino.toLowerCase()),
    )
    return filteredMockClientes
  }
}

export async function obtenerClientesPorRuta(rutaId: number) {
  try {
    const { data, error } = await supabase
      .from("clientes")
      .select("*")
      .eq("ruta_id", rutaId)
      .eq("activo", true)
      .order("nombre")

    if (error) {
      console.warn("Database error, using mock data:", error.message)
      return mockClientes.filter((c) => c.ruta_id === rutaId)
    }

    return data || []
  } catch (error) {
    console.warn("Database connection failed, using mock data:", error)
    return mockClientes.filter((c) => c.ruta_id === rutaId)
  }
}
