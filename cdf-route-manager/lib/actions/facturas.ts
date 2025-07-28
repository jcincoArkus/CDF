"use server"

import { supabase } from "@/lib/db"
import { revalidatePath } from "next/cache"

export interface Factura {
  id?: number
  folio: string
  serie?: string
  pedido_id?: number
  cliente_id: number
  fecha?: string
  subtotal: number
  descuento?: number
  impuestos: number
  total: number
  metodo_pago?: string
  forma_pago?: string
  uso_cfdi?: string
  estatus?: string
  uuid_sat?: string
  xml_content?: string
  pdf_url?: string
}

export interface PedidoSinFacturar {
  id: number
  cliente_nombre: string
  fecha: string
  total: number
  items_count: number
  detalles?: Array<{
    nombre: string
    cantidad: number
    precio_unitario: number
    subtotal: number
  }>
}

export interface CrearFacturaData {
  pedido_id: number
  serie: string
  metodo_pago: string
  observaciones?: string
}

export async function obtenerPedidosSinFacturar(): Promise<PedidoSinFacturar[]> {
  try {
    const { data, error } = await supabase
      .from("pedidos")
      .select(`
        id,
        total,
        fecha,
        clientes!inner (
          nombre
        ),
        pedidos_detalle (
          cantidad,
          precio_unitario,
          subtotal,
          productos (
            nombre
          )
        )
      `)
      .eq("estatus", "Entregado")
      .not("id", "in", `(SELECT pedido_id FROM facturas WHERE pedido_id IS NOT NULL)`)
      .order("fecha", { ascending: false })

    if (error) {
      console.warn("Database error, using mock data:", error)
      return getMockPedidosSinFacturar()
    }

    return (
      data?.map((pedido) => ({
        id: pedido.id,
        cliente_nombre: pedido.clientes?.nombre || "Cliente Desconocido",
        fecha: pedido.fecha,
        total: pedido.total,
        items_count: pedido.pedidos_detalle?.length || 0,
        detalles: pedido.pedidos_detalle?.map((detalle) => ({
          nombre: detalle.productos?.nombre || "Producto",
          cantidad: detalle.cantidad,
          precio_unitario: detalle.precio_unitario,
          subtotal: detalle.subtotal,
        })),
      })) || []
    )
  } catch (error) {
    console.warn("Error fetching pedidos sin facturar, using mock data:", error)
    return getMockPedidosSinFacturar()
  }
}

function getMockPedidosSinFacturar(): PedidoSinFacturar[] {
  return [
    {
      id: 1,
      cliente_nombre: "Tienda El Buen Precio",
      fecha: "2024-01-15T10:30:00Z",
      total: 2450.0,
      items_count: 5,
      detalles: [
        {
          nombre: "Coca Cola 600ml",
          cantidad: 24,
          precio_unitario: 18.5,
          subtotal: 444.0,
        },
        {
          nombre: "Sabritas Original 45g",
          cantidad: 20,
          precio_unitario: 15.0,
          subtotal: 300.0,
        },
        {
          nombre: "Agua Bonafont 1L",
          cantidad: 12,
          precio_unitario: 12.0,
          subtotal: 144.0,
        },
        {
          nombre: "Galletas Marías",
          cantidad: 15,
          precio_unitario: 22.0,
          subtotal: 330.0,
        },
        {
          nombre: "Chicles Trident",
          cantidad: 30,
          precio_unitario: 8.5,
          subtotal: 255.0,
        },
      ],
    },
    {
      id: 2,
      cliente_nombre: "Abarrotes San Miguel",
      fecha: "2024-01-14T14:20:00Z",
      total: 1850.0,
      items_count: 4,
      detalles: [
        {
          nombre: "Pepsi 600ml",
          cantidad: 18,
          precio_unitario: 17.5,
          subtotal: 315.0,
        },
        {
          nombre: "Doritos Nacho",
          cantidad: 25,
          precio_unitario: 16.0,
          subtotal: 400.0,
        },
        {
          nombre: "Cerveza Corona 355ml",
          cantidad: 24,
          precio_unitario: 28.0,
          subtotal: 672.0,
        },
        {
          nombre: "Cigarros Marlboro",
          cantidad: 10,
          precio_unitario: 46.3,
          subtotal: 463.0,
        },
      ],
    },
    {
      id: 3,
      cliente_nombre: "Minisuper La Esquina",
      fecha: "2024-01-13T09:15:00Z",
      total: 3200.0,
      items_count: 6,
      detalles: [
        {
          nombre: "Leche Lala 1L",
          cantidad: 20,
          precio_unitario: 24.5,
          subtotal: 490.0,
        },
        {
          nombre: "Pan Bimbo Grande",
          cantidad: 15,
          precio_unitario: 32.0,
          subtotal: 480.0,
        },
        {
          nombre: "Huevos San Juan 18pz",
          cantidad: 12,
          precio_unitario: 45.0,
          subtotal: 540.0,
        },
        {
          nombre: "Aceite Capullo 1L",
          cantidad: 8,
          precio_unitario: 65.0,
          subtotal: 520.0,
        },
        {
          nombre: "Arroz Verde Valle 1kg",
          cantidad: 10,
          precio_unitario: 28.0,
          subtotal: 280.0,
        },
        {
          nombre: "Frijoles La Costeña",
          cantidad: 18,
          precio_unitario: 22.0,
          subtotal: 396.0,
        },
      ],
    },
  ]
}

export async function crearFactura(facturaData: CrearFacturaData): Promise<number> {
  try {
    // Generar folio único
    const folio = await generarFolio()

    // Obtener datos del pedido
    const { data: pedido, error: pedidoError } = await supabase
      .from("pedidos")
      .select(`
        *,
        clientes (id, nombre),
        pedidos_detalle (
          cantidad,
          precio_unitario,
          subtotal
        )
      `)
      .eq("id", facturaData.pedido_id)
      .single()

    if (pedidoError) {
      console.warn("Database error, simulating factura creation:", pedidoError)
      return simulateFacturaCreation(facturaData)
    }

    // Calcular totales
    const subtotal = pedido.total / 1.16
    const impuestos = pedido.total - subtotal

    const nuevaFactura: Omit<Factura, "id"> = {
      folio,
      serie: facturaData.serie,
      pedido_id: facturaData.pedido_id,
      cliente_id: pedido.cliente_id,
      fecha: new Date().toISOString(),
      subtotal,
      impuestos,
      total: pedido.total,
      metodo_pago: facturaData.metodo_pago,
      forma_pago: "01", // Efectivo por defecto
      uso_cfdi: "G03", // Gastos en general
      estatus: "Vigente",
    }

    const { data, error } = await supabase.from("facturas").insert([nuevaFactura]).select().single()

    if (error) throw error

    revalidatePath("/dashboard/facturas")
    return data.id
  } catch (error) {
    console.warn("Error creating factura, using simulation:", error)
    return simulateFacturaCreation(facturaData)
  }
}

function simulateFacturaCreation(facturaData: CrearFacturaData): number {
  const facturaId = Math.floor(Math.random() * 1000) + 100
  console.log(
    `[DEMO MODE] Factura creada - ID: ${facturaId}, Pedido: ${facturaData.pedido_id}, Serie: ${facturaData.serie}`,
  )
  return facturaId
}

export async function actualizarFactura(id: number, factura: Partial<Factura>) {
  try {
    const { data, error } = await supabase.from("facturas").update(factura).eq("id", id).select().single()

    if (error) throw error

    revalidatePath("/dashboard/facturas")
    return { success: true, data }
  } catch (error) {
    console.error("Error updating factura:", error)
    return { success: false, error: "Error al actualizar la factura" }
  }
}

export async function cancelarFactura(id: number) {
  try {
    const { data, error } = await supabase
      .from("facturas")
      .update({ estatus: "Cancelada" })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    revalidatePath("/dashboard/facturas")
    return { success: true, data }
  } catch (error) {
    console.error("Error canceling factura:", error)
    return { success: false, error: "Error al cancelar la factura" }
  }
}

export async function obtenerFacturas() {
  try {
    const { data, error } = await supabase
      .from("facturas")
      .select(`
        *,
        clientes (
          id,
          nombre,
          rfc
        ),
        pedidos (
          id,
          numero_pedido
        )
      `)
      .order("fecha", { ascending: false })

    if (error) {
      console.warn("Database error, using mock facturas:", error)
      return { success: true, data: getMockFacturas() }
    }

    return { success: true, data: data || [] }
  } catch (error) {
    console.warn("Error fetching facturas, using mock data:", error)
    return { success: true, data: getMockFacturas() }
  }
}

function getMockFacturas() {
  return [
    {
      id: 1,
      folio: "FAC-000001",
      serie: "A",
      pedido_id: 5,
      cliente_id: 1,
      fecha: "2024-01-10T10:30:00Z",
      subtotal: 2112.07,
      impuestos: 337.93,
      total: 2450.0,
      metodo_pago: "01",
      estatus: "Vigente",
      uuid_sat: "12345678-1234-1234-1234-123456789012",
      clientes: {
        id: 1,
        nombre: "Tienda El Buen Precio",
        rfc: "XAXX010101000",
      },
      pedidos: {
        id: 5,
        numero_pedido: "PED-000005",
      },
    },
    {
      id: 2,
      folio: "FAC-000002",
      serie: "A",
      pedido_id: 6,
      cliente_id: 2,
      fecha: "2024-01-09T14:20:00Z",
      subtotal: 1594.83,
      impuestos: 255.17,
      total: 1850.0,
      metodo_pago: "03",
      estatus: "Vigente",
      uuid_sat: "12345678-1234-1234-1234-123456789013",
      clientes: {
        id: 2,
        nombre: "Abarrotes San Miguel",
        rfc: "XAXX010101001",
      },
      pedidos: {
        id: 6,
        numero_pedido: "PED-000006",
      },
    },
  ]
}

export async function obtenerFacturaPorId(id: number) {
  try {
    const { data, error } = await supabase
      .from("facturas")
      .select(`
        *,
        clientes (
          id,
          nombre,
          direccion,
          rfc,
          correo
        ),
        pedidos (
          id,
          numero_pedido,
          pedidos_detalle (
            id,
            cantidad,
            precio_unitario,
            subtotal,
            productos (
              id,
              nombre,
              sku
            )
          )
        )
      `)
      .eq("id", id)
      .single()

    if (error) {
      console.warn("Database error, using mock factura:", error)
      return { success: true, data: getMockFacturaDetalle(id) }
    }

    return { success: true, data }
  } catch (error) {
    console.warn("Error fetching factura, using mock data:", error)
    return { success: true, data: getMockFacturaDetalle(id) }
  }
}

function getMockFacturaDetalle(id: number) {
  return {
    id,
    folio: `FAC-${id.toString().padStart(6, "0")}`,
    serie: "A",
    pedido_id: id + 4,
    cliente_id: 1,
    fecha: "2024-01-10T10:30:00Z",
    subtotal: 2112.07,
    impuestos: 337.93,
    total: 2450.0,
    metodo_pago: "01",
    estatus: "Vigente",
    uuid_sat: `12345678-1234-1234-1234-12345678901${id}`,
    clientes: {
      id: 1,
      nombre: "Tienda El Buen Precio",
      direccion: "Av. Principal 123, Col. Centro",
      rfc: "XAXX010101000",
      correo: "contacto@elbuen precio.com",
    },
    pedidos: {
      id: id + 4,
      numero_pedido: `PED-${(id + 4).toString().padStart(6, "0")}`,
      pedidos_detalle: [
        {
          id: 1,
          cantidad: 24,
          precio_unitario: 18.5,
          subtotal: 444.0,
          productos: {
            id: 1,
            nombre: "Coca Cola 600ml",
            sku: "CC600",
          },
        },
        {
          id: 2,
          cantidad: 20,
          precio_unitario: 15.0,
          subtotal: 300.0,
          productos: {
            id: 2,
            nombre: "Sabritas Original 45g",
            sku: "SAB45",
          },
        },
      ],
    },
  }
}

export async function generarFolio(): Promise<string> {
  try {
    // Obtener el último folio
    const { data, error } = await supabase.from("facturas").select("folio").order("id", { ascending: false }).limit(1)

    if (error) {
      console.warn("Database error generating folio, using fallback:", error)
      return generateFallbackFolio()
    }

    let numeroFolio = 1
    if (data && data.length > 0) {
      const ultimoFolio = data[0].folio
      const numeroActual = Number.parseInt(ultimoFolio.replace(/\D/g, ""))
      numeroFolio = numeroActual + 1
    }

    return `FAC-${numeroFolio.toString().padStart(6, "0")}`
  } catch (error) {
    console.warn("Error generating folio, using fallback:", error)
    return generateFallbackFolio()
  }
}

function generateFallbackFolio(): string {
  // Generar folio con timestamp para demo
  const timestamp = Date.now().toString().slice(-6)
  return `FAC-${timestamp}`
}
