"use server"

import { supabase } from "@/lib/db"
import { revalidatePath } from "next/cache"

export interface Ruta {
  id?: number
  numero_identificador: string
  nombre: string
  tipo: string
  descripcion?: string
  vendedor_id?: number
  activa?: boolean
}

export async function crearRuta(rutaData: Omit<Ruta, "id">) {
  try {
    // En modo demo, simular creación exitosa
    if (!supabase) {
      console.log("Demo mode: Creating ruta", rutaData)
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simular delay
      return {
        success: true,
        data: {
          id: Math.floor(Math.random() * 1000) + 100,
          ...rutaData,
          created_at: new Date().toISOString(),
        },
      }
    }

    const { data, error } = await supabase.from("rutas").insert([rutaData]).select().single()

    if (error) throw error

    revalidatePath("/dashboard/rutas")
    return { success: true, data }
  } catch (error) {
    console.error("Error creating ruta:", error)
    return { success: false, error: "Error al crear la ruta" }
  }
}

export async function obtenerRutaPorId(id: number) {
  try {
    // En modo demo, simular datos
    if (!supabase) {
      console.log("Demo mode: Getting ruta by id", id)
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Datos mock para demo
      const mockRuta = {
        id,
        numero_identificador: `PV-${String(id).padStart(4, "0")}`,
        nombre: `Ruta Demo ${id}`,
        tipo: "Preventa",
        descripcion: `Descripción de la ruta ${id}`,
        vendedor_id: null,
        activa: true,
        created_at: new Date().toISOString(),
      }

      return { success: true, data: mockRuta }
    }

    const { data, error } = await supabase
      .from("rutas")
      .select(`
        *,
        usuarios(id, nombre)
      `)
      .eq("id", id)
      .single()

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("Error fetching ruta:", error)
    return { success: false, error: "Error al obtener la ruta" }
  }
}

export async function actualizarRuta(id: number, rutaData: Partial<Ruta>) {
  try {
    // En modo demo, simular actualización exitosa
    if (!supabase) {
      console.log("Demo mode: Updating ruta", id, rutaData)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return {
        success: true,
        data: {
          id,
          ...rutaData,
          updated_at: new Date().toISOString(),
        },
      }
    }

    const { data, error } = await supabase.from("rutas").update(rutaData).eq("id", id).select().single()

    if (error) throw error

    revalidatePath("/dashboard/rutas")
    return { success: true, data }
  } catch (error) {
    console.error("Error updating ruta:", error)
    return { success: false, error: "Error al actualizar la ruta" }
  }
}

export async function asignarVendedorARuta(rutaId: number, vendedorId: number) {
  try {
    // En modo demo, simular asignación exitosa
    if (!supabase) {
      console.log("Demo mode: Assigning vendedor to ruta", rutaId, vendedorId)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return {
        success: true,
        data: {
          id: rutaId,
          vendedor_id: vendedorId,
          updated_at: new Date().toISOString(),
        },
      }
    }

    const { data, error } = await supabase
      .from("rutas")
      .update({ vendedor_id: vendedorId })
      .eq("id", rutaId)
      .select()
      .single()

    if (error) throw error

    revalidatePath("/dashboard/rutas")
    return { success: true, data }
  } catch (error) {
    console.error("Error assigning vendedor to ruta:", error)
    return { success: false, error: "Error al asignar vendedor a la ruta" }
  }
}

export async function eliminarRuta(id: number) {
  try {
    // En modo demo, simular eliminación exitosa
    if (!supabase) {
      console.log("Demo mode: Deleting ruta", id)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return { success: true }
    }

    const { error } = await supabase.from("rutas").delete().eq("id", id)

    if (error) throw error

    revalidatePath("/dashboard/rutas")
    return { success: true }
  } catch (error) {
    console.error("Error deleting ruta:", error)
    return { success: false, error: "Error al eliminar la ruta" }
  }
}

export async function obtenerRutasConClientes() {
  try {
    // En modo demo, simular datos
    if (!supabase) {
      console.log("Demo mode: Getting rutas with clientes")
      await new Promise((resolve) => setTimeout(resolve, 500))
      return {
        success: true,
        data: [
          {
            id: 1,
            nombre: "Ruta Centro",
            clientes_count: 5,
            vendedor_nombre: "Carlos Mendoza",
          },
          {
            id: 2,
            nombre: "Ruta Norte",
            clientes_count: 3,
            vendedor_nombre: "Ana García",
          },
        ],
      }
    }

    const { data, error } = await supabase
      .from("rutas")
      .select(`
        id,
        nombre,
        numero_identificador,
        tipo,
        activa,
        usuarios(nombre),
        clientes(count)
      `)
      .eq("activa", true)

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("Error fetching rutas with clientes:", error)
    return { success: false, error: "Error al obtener rutas con clientes" }
  }
}
