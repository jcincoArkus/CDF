const { createClient } = require("@supabase/supabase-js")

// Configuración
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-service-key"

if (supabaseUrl === "https://placeholder.supabase.co" || supabaseServiceKey === "placeholder-service-key") {
  console.log("⚠️  Configuración de Supabase no encontrada.")
  console.log("📝 Asegúrate de configurar las variables de entorno:")
  console.log("   - NEXT_PUBLIC_SUPABASE_URL")
  console.log("   - SUPABASE_SERVICE_ROLE_KEY")
  console.log("🎯 El sistema funcionará en modo demo con datos mock.")
  process.exit(0)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkAndInitDatabase() {
  console.log("🔍 Verificando conexión a la base de datos...")

  try {
    // Intentar conectar y verificar si las tablas existen
    const { data: tables, error } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")
      .in("table_name", ["clientes", "productos", "pedidos", "inventarios", "rutas"])

    if (error) {
      console.error("❌ Error verificando tablas:", error.message)
      return false
    }

    const existingTables = tables.map((t) => t.table_name)
    const requiredTables = ["clientes", "productos", "pedidos", "inventarios", "rutas"]
    const missingTables = requiredTables.filter((table) => !existingTables.includes(table))

    if (missingTables.length > 0) {
      console.log("⚠️  Tablas faltantes:", missingTables.join(", "))
      console.log("📝 Ejecuta el script SQL: scripts/00-init-with-mock-data.sql")
      return false
    }

    console.log("✅ Todas las tablas requeridas existen")

    // Verificar si hay datos
    const { data: clienteCount, error: countError } = await supabase
      .from("clientes")
      .select("id", { count: "exact", head: true })

    if (countError) {
      console.error("❌ Error contando clientes:", countError.message)
      return false
    }

    if (clienteCount === 0) {
      console.log("📊 Base de datos vacía, se usarán datos mock")
      return false
    }

    console.log(`✅ Base de datos inicializada con ${clienteCount} clientes`)
    return true
  } catch (error) {
    console.error("❌ Error de conexión:", error.message)
    return false
  }
}

async function seedDatabase() {
  console.log("🌱 Insertando datos de prueba...")

  try {
    // Insertar datos mock si la base de datos está vacía
    const { error: clientesError } = await supabase.from("clientes").upsert([
      {
        id: 1,
        nombre: "Tienda El Sol",
        direccion: "Av. Principal 123, Col. Centro, CP 01000, Ciudad de México, CDMX",
        telefono: "555-0101",
        correo: "contacto@tiendaelsol.com",
        ruta_id: 1,
        latitud: 19.432608,
        longitud: -99.133209,
        activo: true,
      },
      {
        id: 2,
        nombre: "Supermercado Luna",
        direccion: "Calle Comercio 456, Col. Norte, CP 02000, Ciudad de México, CDMX",
        telefono: "555-0102",
        correo: "info@superluna.com",
        ruta_id: 2,
        latitud: 19.445123,
        longitud: -99.125456,
        activo: true,
      },
    ])

    if (clientesError) {
      console.error("❌ Error insertando clientes:", clientesError.message)
      return false
    }

    console.log("✅ Datos de prueba insertados correctamente")
    return true
  } catch (error) {
    console.error("❌ Error sembrando base de datos:", error.message)
    return false
  }
}

// Ejecutar verificación
checkAndInitDatabase().then((success) => {
  if (success) {
    console.log("🎉 Base de datos lista para usar")
  } else {
    console.log("🎯 Sistema funcionará en modo demo con datos mock")
  }
})
