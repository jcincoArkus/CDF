"use server"

import { supabase } from "@/lib/db"
import { revalidatePath } from "next/cache"

export interface Inventario {
  id?: number
  producto_id: number
  ubicacion?: string
  cantidad: number
  stock_minimo?: number
  stock_maximo?: number
}

export interface MovimientoInventario {
  id?: number
  producto_id: number
  tipo_movimiento: "ENTRADA" | "SALIDA" | "AJUSTE" | "TRANSFERENCIA"
  cantidad: number
  cantidad_anterior: number
  cantidad_nueva: number
  motivo?: string
  referencia?: string
  usuario_id?: number
}

export async function obtenerInventario() {
  try {
    const { data, error } = await supabase
      .from("inventarios")
      .select(`
        *,
        productos (
          id,
          nombre,
          sku,
          categoria,
          precio
        )
      `)
      .order("id")

    if (error) throw error

    return { success: true, data: data || [] }
  } catch (error) {
    console.error("Error fetching inventario:", error)
    return { success: false, error: "Error al obtener el inventario", data: [] }
  }
}

export async function actualizarStock(productoId: number, nuevaCantidad: number, motivo: string, usuarioId = 1) {
  try {
    // Obtener cantidad actual
    const { data: inventarioActual, error: errorInventario } = await supabase
      .from("inventarios")
      .select("cantidad")
      .eq("producto_id", productoId)
      .single()

    if (errorInventario) throw errorInventario

    const cantidadAnterior = inventarioActual?.cantidad || 0

    // Actualizar inventario
    const { data: inventarioActualizado, error: errorActualizar } = await supabase
      .from("inventarios")
      .update({ cantidad: nuevaCantidad })
      .eq("producto_id", productoId)
      .select()
      .single()

    if (errorActualizar) throw errorActualizar

    // Registrar movimiento
    const tipoMovimiento =
      nuevaCantidad > cantidadAnterior ? "ENTRADA" : nuevaCantidad < cantidadAnterior ? "SALIDA" : "AJUSTE"
    const cantidadMovimiento = Math.abs(nuevaCantidad - cantidadAnterior)

    const { error: errorMovimiento } = await supabase.from("movimientos_inventario").insert([
      {
        producto_id: productoId,
        tipo_movimiento: tipoMovimiento,
        cantidad: cantidadMovimiento,
        cantidad_anterior: cantidadAnterior,
        cantidad_nueva: nuevaCantidad,
        motivo,
        usuario_id: usuarioId,
      },
    ])

    if (errorMovimiento) throw errorMovimiento

    revalidatePath("/dashboard/inventario")
    return { success: true, data: inventarioActualizado }
  } catch (error) {
    console.error("Error updating stock:", error)
    return { success: false, error: "Error al actualizar el stock" }
  }
}

export async function registrarMovimiento(movimiento: Omit<MovimientoInventario, "id">) {
  try {
    const { data, error } = await supabase.from("movimientos_inventario").insert([movimiento]).select().single()

    if (error) throw error

    revalidatePath("/dashboard/inventario")
    return { success: true, data }
  } catch (error) {
    console.error("Error registering movimiento:", error)
    return { success: false, error: "Error al registrar el movimiento" }
  }
}

export async function obtenerMovimientos(productoId?: number) {
  try {
    let query = supabase
      .from("movimientos_inventario")
      .select(`
        *,
        productos (
          id,
          nombre,
          sku
        ),
        usuarios (
          id,
          nombre
        )
      `)
      .order("fecha", { ascending: false })

    if (productoId) {
      query = query.eq("producto_id", productoId)
    }

    const { data, error } = await query

    if (error) throw error

    return { success: true, data: data || [] }
  } catch (error) {
    console.error("Error fetching movimientos:", error)
    return { success: false, error: "Error al obtener los movimientos", data: [] }
  }
}

export async function obtenerProductosBajoStock() {
  try {
    const { data, error } = await supabase
      .from("inventarios")
      .select(`
        *,
        productos (
          id,
          nombre,
          sku,
          categoria
        )
      `)
      .filter("cantidad", "lt", "stock_minimo")

    if (error) throw error

    return { success: true, data: data || [] }
  } catch (error) {
    console.error("Error fetching productos bajo stock:", error)
    return { success: false, error: "Error al obtener productos con stock bajo", data: [] }
  }
}
