const { createClient } = require("@supabase/supabase-js")

// Configuración
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log("🔍 Verificando configuración de Supabase...")
console.log("=".repeat(50))

// Verificar variables de entorno
if (!supabaseUrl) {
  console.log("❌ NEXT_PUBLIC_SUPABASE_URL no está configurada")
} else {
  console.log("✅ NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl)
}

if (!supabaseAnonKey) {
  console.log("❌ NEXT_PUBLIC_SUPABASE_ANON_KEY no está configurada")
} else {
  console.log("✅ NEXT_PUBLIC_SUPABASE_ANON_KEY: [CONFIGURADA]")
}

if (!supabaseServiceKey) {
  console.log("❌ SUPABASE_SERVICE_ROLE_KEY no está configurada")
} else {
  console.log("✅ SUPABASE_SERVICE_ROLE_KEY: [CONFIGURADA]")
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.log("\n⚠️  Variables de entorno faltantes.")
  console.log("📝 Para configurar Supabase:")
  console.log("   1. Crea un proyecto en https://supabase.com")
  console.log("   2. Ve a Settings > API")
  console.log("   3. Copia la URL y las API Keys")
  console.log("   4. Configura las variables de entorno:")
  console.log("      - NEXT_PUBLIC_SUPABASE_URL=tu_url_aqui")
  console.log("      - NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui")
  console.log("      - SUPABASE_SERVICE_ROLE_KEY=tu_service_key_aqui")
  console.log("\n🎯 El sistema funcionará en modo demo con datos mock.")
  process.exit(0)
}

// Intentar conectar con Supabase
async function verificarConexion() {
  try {
    console.log("\n🔗 Intentando conectar con Supabase...")

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Verificar conexión básica
    const { data, error } = await supabase.from("clientes").select("count", { count: "exact", head: true })

    if (error) {
      console.log("❌ Error de conexión:", error.message)
      console.log("\n🔧 Posibles soluciones:")
      console.log("   1. Verifica que las credenciales sean correctas")
      console.log("   2. Asegúrate de que el proyecto Supabase esté activo")
      console.log("   3. Verifica que las tablas existan en la base de datos")
      console.log("   4. Ejecuta el script SQL: scripts/00-init-with-mock-data.sql")
      return false
    }

    console.log("✅ Conexión exitosa con Supabase")
    console.log(`📊 Registros en tabla 'clientes': ${data || 0}`)

    // Verificar tablas principales
    const tablas = ["clientes", "productos", "pedidos", "rutas", "inventarios"]
    console.log("\n📋 Verificando tablas principales...")

    for (const tabla of tablas) {
      try {
        const { data: count, error: tableError } = await supabase
          .from(tabla)
          .select("count", { count: "exact", head: true })

        if (tableError) {
          console.log(`❌ Tabla '${tabla}': ${tableError.message}`)
        } else {
          console.log(`✅ Tabla '${tabla}': ${count || 0} registros`)
        }
      } catch (err) {
        console.log(`❌ Tabla '${tabla}': Error de acceso`)
      }
    }

    return true
  } catch (error) {
    console.log("❌ Error general:", error.message)
    return false
  }
}

// Verificar con Service Role Key si está disponible
async function verificarPermisos() {
  if (!supabaseServiceKey) {
    console.log("\n⚠️  SUPABASE_SERVICE_ROLE_KEY no configurada - saltando verificación de permisos")
    return
  }

  try {
    console.log("\n🔐 Verificando permisos con Service Role Key...")

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    // Intentar una operación que requiere permisos elevados
    const { data, error } = await supabaseAdmin
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")
      .limit(5)

    if (error) {
      console.log("❌ Error con Service Role Key:", error.message)
    } else {
      console.log("✅ Service Role Key funcionando correctamente")
      console.log(`📋 Tablas encontradas: ${data?.length || 0}`)
    }
  } catch (error) {
    console.log("❌ Error verificando permisos:", error.message)
  }
}

// Ejecutar verificaciones
async function main() {
  const conexionExitosa = await verificarConexion()
  await verificarPermisos()

  console.log("\n" + "=".repeat(50))

  if (conexionExitosa) {
    console.log("🎉 ¡Supabase está configurado correctamente!")
    console.log("✅ El sistema puede usar la base de datos en la nube")
    console.log("\n📝 Próximos pasos:")
    console.log("   1. Ejecuta 'npm run dev' para iniciar el servidor")
    console.log("   2. Ve a http://localhost:3000/dashboard")
    console.log("   3. Si las tablas están vacías, ejecuta el script SQL de inicialización")
  } else {
    console.log("⚠️  Supabase no está completamente configurado")
    console.log("🎯 El sistema funcionará en modo demo con datos mock")
    console.log("\n📝 Para usar Supabase:")
    console.log("   1. Configura las variables de entorno correctamente")
    console.log("   2. Ejecuta el script SQL: scripts/00-init-with-mock-data.sql")
    console.log("   3. Vuelve a ejecutar este script de verificación")
  }
}

main().catch(console.error)
