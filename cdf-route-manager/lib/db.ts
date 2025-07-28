import { createClient } from "@supabase/supabase-js"

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let supabase: any = null
let USE_MOCK_DATA = true

// Intentar inicializar Supabase si las credenciales están disponibles
if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
    USE_MOCK_DATA = false
  } catch (error) {
    console.warn("Supabase initialization failed, using mock data:", error)
    USE_MOCK_DATA = true
  }
} else {
  console.log("Supabase credentials not found, using demo mode with mock data")
}

// Función para verificar conexión a la base de datos
export async function checkDatabaseConnection(): Promise<boolean> {
  if (!supabase) return false

  try {
    const { error } = await supabase.from("clientes").select("count", { count: "exact", head: true })
    return !error
  } catch (error) {
    console.warn("Database connection check failed:", error)
    return false
  }
}

// Datos mock para desarrollo y demo
const MOCK_DATA = {
  clientes: [
    {
      id: 1,
      nombre: "Tienda El Buen Precio",
      direccion: "Av. Principal 123, Col. Centro",
      telefono: "555-0101",
      correo: "contacto@elbuenprecio.com",
      ruta_id: 1,
      latitud: 19.4326,
      longitud: -99.1332,
      activo: true,
      created_at: "2024-01-15T10:00:00Z",
    },
    {
      id: 2,
      nombre: "Súper Mercado Familiar",
      direccion: "Calle Reforma 456, Col. Norte",
      telefono: "555-0102",
      correo: "ventas@superfamiliar.com",
      ruta_id: 1,
      latitud: 19.44,
      longitud: -99.13,
      activo: true,
      created_at: "2024-01-16T11:30:00Z",
    },
    {
      id: 3,
      nombre: "Abarrotes Don Juan",
      direccion: "Av. Insurgentes 789, Col. Sur",
      telefono: "555-0103",
      correo: "donjuan@abarrotes.com",
      ruta_id: 2,
      latitud: 19.42,
      longitud: -99.14,
      activo: true,
      created_at: "2024-01-17T09:15:00Z",
    },
    {
      id: 4,
      nombre: "Minisuper La Esquina",
      direccion: "Calle Juárez 321, Col. Centro",
      telefono: "555-0104",
      correo: "laesquina@minisuper.com",
      ruta_id: 2,
      latitud: 19.435,
      longitud: -99.128,
      activo: true,
      created_at: "2024-01-18T14:20:00Z",
    },
    {
      id: 5,
      nombre: "Comercial Los Pinos",
      direccion: "Blvd. Tecnológico 654, Col. Industrial",
      telefono: "555-0105",
      correo: "ventas@lospinos.com",
      ruta_id: 3,
      latitud: 19.45,
      longitud: -99.12,
      activo: true,
      created_at: "2024-01-19T16:45:00Z",
    },
  ],
  productos: [
    {
      id: 1,
      nombre: "Coca-Cola 600ml",
      sku: "CC-600",
      categoria: "Bebidas",
      precio: 15.5,
      tipo_producto: "Bebida",
      stock: 150,
      stock_minimo: 20,
      activo: true,
      created_at: "2024-01-10T08:00:00Z",
    },
    {
      id: 2,
      nombre: "Sabritas Original 45g",
      sku: "SAB-45",
      categoria: "Botanas",
      precio: 18.0,
      tipo_producto: "Snack",
      stock: 200,
      stock_minimo: 30,
      activo: true,
      created_at: "2024-01-10T08:15:00Z",
    },
    {
      id: 3,
      nombre: "Agua Bonafont 1L",
      sku: "BON-1L",
      categoria: "Bebidas",
      precio: 12.0,
      tipo_producto: "Bebida",
      stock: 300,
      stock_minimo: 50,
      activo: true,
      created_at: "2024-01-10T08:30:00Z",
    },
    {
      id: 4,
      nombre: "Galletas Marías 200g",
      sku: "MAR-200",
      categoria: "Galletas",
      precio: 22.5,
      tipo_producto: "Galleta",
      stock: 8,
      stock_minimo: 15,
      activo: true,
      created_at: "2024-01-10T08:45:00Z",
    },
    {
      id: 5,
      nombre: "Leche Lala 1L",
      sku: "LAL-1L",
      categoria: "Lácteos",
      precio: 24.0,
      tipo_producto: "Lácteo",
      stock: 120,
      stock_minimo: 25,
      activo: true,
      created_at: "2024-01-10T09:00:00Z",
    },
  ],
  rutas: [
    {
      id: 1,
      numero_identificador: "PV-0001",
      nombre: "Ruta Centro Preventa",
      tipo: "Preventa",
      descripcion: "Ruta de preventa para zona centro de la ciudad",
      vendedor_id: 1,
      vendedor_nombre: "Carlos Mendoza",
      activa: true,
      progreso: 75,
      estado: "activa",
      created_at: "2024-01-05T10:00:00Z",
    },
    {
      id: 2,
      numero_identificador: "RP-0001",
      nombre: "Ruta Norte Reparto",
      tipo: "Reparto",
      descripcion: "Ruta de reparto para zona norte",
      vendedor_id: 2,
      vendedor_nombre: "Ana García",
      activa: true,
      progreso: 60,
      estado: "activa",
      created_at: "2024-01-06T11:00:00Z",
    },
    {
      id: 3,
      numero_identificador: "CV-0001",
      nombre: "Ruta Industrial Convencional",
      tipo: "Convencional",
      descripcion: "Ruta convencional para zona industrial",
      vendedor_id: 3,
      vendedor_nombre: "Luis Rodríguez",
      activa: true,
      progreso: 90,
      estado: "completada",
      created_at: "2024-01-07T12:00:00Z",
    },
  ],
  pedidos: [
    {
      id: 1,
      cliente_id: 1,
      usuario_id: 1,
      fecha: "2024-01-20T10:00:00Z",
      total: 156.5,
      estatus: "Pendiente",
      created_at: "2024-01-20T10:00:00Z",
    },
    {
      id: 2,
      cliente_id: 2,
      usuario_id: 1,
      fecha: "2024-01-20T11:30:00Z",
      total: 234.0,
      estatus: "Entregado",
      created_at: "2024-01-20T11:30:00Z",
    },
    {
      id: 3,
      cliente_id: 3,
      usuario_id: 2,
      fecha: "2024-01-21T09:15:00Z",
      total: 189.75,
      estatus: "Pendiente",
      created_at: "2024-01-21T09:15:00Z",
    },
    {
      id: 4,
      cliente_id: 1,
      usuario_id: 1,
      fecha: new Date().toISOString(),
      total: 89.25,
      estatus: "Pendiente",
      created_at: new Date().toISOString(),
    },
    {
      id: 5,
      cliente_id: 4,
      usuario_id: 2,
      fecha: new Date().toISOString(),
      total: 145.8,
      estatus: "Entregado",
      created_at: new Date().toISOString(),
    },
  ],
  inventarios: [
    {
      id: 1,
      producto_id: 1,
      cantidad: 150,
      ubicacion: "Almacén Principal",
      created_at: "2024-01-10T08:00:00Z",
    },
    {
      id: 2,
      producto_id: 2,
      cantidad: 200,
      ubicacion: "Almacén Principal",
      created_at: "2024-01-10T08:15:00Z",
    },
    {
      id: 3,
      producto_id: 3,
      cantidad: 300,
      ubicacion: "Almacén Principal",
      created_at: "2024-01-10T08:30:00Z",
    },
    {
      id: 4,
      producto_id: 4,
      cantidad: 8,
      ubicacion: "Almacén Principal",
      created_at: "2024-01-10T08:45:00Z",
    },
    {
      id: 5,
      producto_id: 5,
      cantidad: 120,
      ubicacion: "Almacén Principal",
      created_at: "2024-01-10T09:00:00Z",
    },
  ],
  usuarios: [
    {
      id: 1,
      nombre: "Carlos Mendoza",
      correo: "carlos@empresa.com",
      rol_id: 2,
      created_at: "2024-01-01T08:00:00Z",
    },
    {
      id: 2,
      nombre: "Ana García",
      correo: "ana@empresa.com",
      rol_id: 2,
      created_at: "2024-01-01T08:15:00Z",
    },
    {
      id: 3,
      nombre: "Luis Rodríguez",
      correo: "luis@empresa.com",
      rol_id: 2,
      created_at: "2024-01-01T08:30:00Z",
    },
  ],
}

// Funciones de acceso a datos con fallback a mock
export async function getClientes() {
  if (USE_MOCK_DATA || !supabase) {
    console.log("Using mock data for clientes")
    return MOCK_DATA.clientes
  }

  try {
    const { data, error } = await supabase.from("clientes").select("*").order("created_at", { ascending: false })

    if (error) {
      console.warn("Database error, falling back to mock data:", error)
      return MOCK_DATA.clientes
    }

    return data || MOCK_DATA.clientes
  } catch (error) {
    console.warn("Database connection failed, using mock data:", error)
    return MOCK_DATA.clientes
  }
}

export async function getProductos() {
  if (USE_MOCK_DATA || !supabase) {
    console.log("Using mock data for productos")
    return MOCK_DATA.productos
  }

  try {
    const { data, error } = await supabase.from("productos").select("*").order("created_at", { ascending: false })

    if (error) {
      console.warn("Database error, falling back to mock data:", error)
      return MOCK_DATA.productos
    }

    return data || MOCK_DATA.productos
  } catch (error) {
    console.warn("Database connection failed, using mock data:", error)
    return MOCK_DATA.productos
  }
}

export async function getRutas() {
  if (USE_MOCK_DATA || !supabase) {
    console.log("Using mock data for rutas")
    return MOCK_DATA.rutas
  }

  try {
    const { data, error } = await supabase
      .from("rutas")
      .select(`
        *,
        usuarios(nombre)
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.warn("Database error, falling back to mock data:", error)
      return MOCK_DATA.rutas
    }

    // Mapear los datos para incluir vendedor_nombre
    const rutasConVendedor =
      data?.map((ruta) => ({
        ...ruta,
        vendedor_nombre: ruta.usuarios?.nombre || "Sin asignar",
      })) || MOCK_DATA.rutas

    return rutasConVendedor
  } catch (error) {
    console.warn("Database connection failed, using mock data:", error)
    return MOCK_DATA.rutas
  }
}

export async function getPedidos() {
  if (USE_MOCK_DATA || !supabase) {
    console.log("Using mock data for pedidos")
    return MOCK_DATA.pedidos
  }

  try {
    const { data, error } = await supabase.from("pedidos").select("*").order("created_at", { ascending: false })

    if (error) {
      console.warn("Database error, falling back to mock data:", error)
      return MOCK_DATA.pedidos
    }

    return data || MOCK_DATA.pedidos
  } catch (error) {
    console.warn("Database connection failed, using mock data:", error)
    return MOCK_DATA.pedidos
  }
}

// Función principal para inventarios (plural)
export async function getInventarios() {
  if (USE_MOCK_DATA || !supabase) {
    console.log("Using mock data for inventarios")
    return MOCK_DATA.inventarios
  }

  try {
    const { data, error } = await supabase
      .from("inventarios")
      .select(`
        *,
        productos(nombre, sku, categoria)
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.warn("Database error, falling back to mock data:", error)
      return MOCK_DATA.inventarios
    }

    return data || MOCK_DATA.inventarios
  } catch (error) {
    console.warn("Database connection failed, using mock data:", error)
    return MOCK_DATA.inventarios
  }
}

// Alias para compatibilidad (singular)
export const getInventario = getInventarios

export async function getUsuarios() {
  if (USE_MOCK_DATA || !supabase) {
    console.log("Using mock data for usuarios")
    return MOCK_DATA.usuarios
  }

  try {
    const { data, error } = await supabase.from("usuarios").select("*").order("created_at", { ascending: false })

    if (error) {
      console.warn("Database error, falling back to mock data:", error)
      return MOCK_DATA.usuarios
    }

    return data || MOCK_DATA.usuarios
  } catch (error) {
    console.warn("Database connection failed, using mock data:", error)
    return MOCK_DATA.usuarios
  }
}

// Función para obtener estadísticas del dashboard
export async function getDashboardStats() {
  try {
    const [clientes, productos, pedidos, inventarios] = await Promise.all([
      getClientes(),
      getProductos(),
      getPedidos(),
      getInventarios(),
    ])

    const today = new Date().toISOString().split("T")[0]
    const pedidosHoy = pedidos.filter((p) => p.fecha.split("T")[0] === today)
    const ventasHoy = pedidosHoy.reduce((sum, p) => sum + (p.total || 0), 0)

    return {
      totalClientes: clientes.length,
      clientesActivos: clientes.filter((c) => c.activo !== false).length,
      totalProductos: productos.length,
      productosActivos: productos.filter((p) => p.activo !== false).length,
      pedidosHoy: pedidosHoy.length,
      ventasHoy,
      stockTotal: inventarios.reduce((sum, i) => sum + (i.cantidad || 0), 0),
      productosStock: inventarios.length,
    }
  } catch (error) {
    console.error("Error getting dashboard stats:", error)
    return {
      totalClientes: 0,
      clientesActivos: 0,
      totalProductos: 0,
      productosActivos: 0,
      pedidosHoy: 0,
      ventasHoy: 0,
      stockTotal: 0,
      productosStock: 0,
    }
  }
}

export { supabase, USE_MOCK_DATA }
