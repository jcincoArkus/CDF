"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, User, Navigation, AlertTriangle, CheckCircle } from "lucide-react"
import {
  actualizarCliente,
  obtenerDetalleCliente,
  obtenerRutasDisponibles,
  type ActualizarClienteData,
} from "@/lib/actions/clientes"
import { TelefonoInput } from "./telefono-input"

interface EditarClienteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clienteId: number | null
  onClienteActualizado?: () => void
}

interface FormData extends Omit<ActualizarClienteData, "telefono" | "direccion"> {
  telefono: string
  calle: string
  numero: string
  codigo_postal: string
  ciudad: string
  estado: string
  latitud_str: string
  longitud_str: string
}

export function EditarClienteDialog({ open, onOpenChange, clienteId, onClienteActualizado }: EditarClienteDialogProps) {
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(false)
  const [rutas, setRutas] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [telefono, setTelefono] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      nombre: "",
      calle: "",
      numero: "",
      codigo_postal: "",
      ciudad: "",
      estado: "",
      telefono: "",
      ruta_id: 0,
      latitud_str: "",
      longitud_str: "",
    },
  })

  const selectedRutaId = watch("ruta_id")

  useEffect(() => {
    if (open && clienteId) {
      loadClienteData()
      loadRutas()
      setError(null)
      setSuccess(null)
    }
  }, [open, clienteId])

  const loadClienteData = async () => {
    if (!clienteId) return

    setLoadingData(true)
    try {
      const clienteData = await obtenerDetalleCliente(clienteId)

      // Parse address components
      const direccionParts = clienteData.direccion.split(", ")
      const calleNumero = direccionParts[0] || ""
      const cpPart = direccionParts[1] || ""
      const ciudad = direccionParts[2] || ""
      const estado = direccionParts[3] || ""

      // Extract street and number
      const calleNumeroMatch = calleNumero.match(/^(.+)\s+(\S+)$/)
      const calle = calleNumeroMatch ? calleNumeroMatch[1] : calleNumero
      const numero = calleNumeroMatch ? calleNumeroMatch[2] : ""

      // Extract postal code
      const codigoPostal = cpPart.replace("CP ", "")

      // Set form values
      setValue("nombre", clienteData.nombre)
      setValue("calle", calle)
      setValue("numero", numero)
      setValue("codigo_postal", codigoPostal)
      setValue("ciudad", ciudad)
      setValue("estado", estado)
      setValue("telefono", clienteData.telefono)
      setValue("ruta_id", clienteData.ruta_id)
      setValue("latitud_str", clienteData.latitud?.toString() || "")
      setValue("longitud_str", clienteData.longitud?.toString() || "")

      setTelefono(clienteData.telefono)
    } catch (error) {
      console.error("Error cargando datos del cliente:", error)
      setError("Error al cargar los datos del cliente")
    } finally {
      setLoadingData(false)
    }
  }

  const loadRutas = async () => {
    try {
      const rutasData = await obtenerRutasDisponibles()
      setRutas(rutasData)
    } catch (error) {
      console.error("Error cargando rutas:", error)
      setError("Error al cargar las rutas disponibles")
    }
  }

  const onSubmit = async (data: FormData) => {
    if (!clienteId) return

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Construir la dirección completa a partir de los campos separados
      const direccionCompleta =
        `${data.calle} ${data.numero}, CP ${data.codigo_postal}, ${data.ciudad}, ${data.estado}`.trim()

      // Convertir coordenadas a números si están presentes
      const clienteData: ActualizarClienteData = {
        nombre: data.nombre.trim(),
        direccion: direccionCompleta,
        telefono: telefono.trim(),
        ruta_id: Number(data.ruta_id),
        latitud: data.latitud_str ? Number.parseFloat(data.latitud_str) : undefined,
        longitud: data.longitud_str ? Number.parseFloat(data.longitud_str) : undefined,
      }

      const result = await actualizarCliente(clienteId, clienteData)

      if (result.success) {
        setSuccess(result.message)
        onClienteActualizado?.()

        // Cerrar el dialog después de un breve delay
        setTimeout(() => {
          handleClose()
        }, 1500)
      } else {
        setError(result.error || "Error desconocido")
      }
    } catch (error) {
      console.error("Error en formulario:", error)
      setError("Error interno del sistema")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    reset()
    setTelefono("")
    setError(null)
    setSuccess(null)
    onOpenChange(false)
  }

  const obtenerUbicacionActual = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setValue("latitud_str", position.coords.latitude.toString())
          setValue("longitud_str", position.coords.longitude.toString())
        },
        (error) => {
          console.error("Error obteniendo ubicación:", error)
          setError("No se pudo obtener la ubicación actual")
        },
      )
    } else {
      setError("Geolocalización no soportada en este navegador")
    }
  }

  if (loadingData) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Cargando datos del cliente...</span>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Editar Cliente
          </DialogTitle>
          <DialogDescription>Modifica la información del cliente</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Información Básica */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información Básica</CardTitle>
              <CardDescription>Datos principales del cliente</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre del Cliente *</Label>
                  <Input
                    id="nombre"
                    placeholder="Ej: Tienda La Esquina"
                    {...register("nombre", {
                      required: "El nombre es obligatorio",
                      minLength: {
                        value: 2,
                        message: "El nombre debe tener al menos 2 caracteres",
                      },
                    })}
                    className={errors.nombre ? "border-red-500" : ""}
                  />
                  {errors.nombre && <p className="text-sm text-red-500">{errors.nombre.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono *</Label>
                  <TelefonoInput
                    id="telefono"
                    value={telefono}
                    onChange={(value) => {
                      setTelefono(value)
                      setValue("telefono", value)
                    }}
                    error={errors.telefono?.message}
                  />
                  <input
                    type="hidden"
                    {...register("telefono", {
                      required: "El teléfono es obligatorio",
                    })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dirección */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dirección Completa</CardTitle>
              <CardDescription>Información detallada de la ubicación del cliente</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="calle">Calle *</Label>
                  <Input
                    id="calle"
                    placeholder="Ej: Av. Insurgentes Sur"
                    {...register("calle", {
                      required: "La calle es obligatoria",
                      minLength: {
                        value: 3,
                        message: "La calle debe tener al menos 3 caracteres",
                      },
                    })}
                    className={errors.calle ? "border-red-500" : ""}
                  />
                  {errors.calle && <p className="text-sm text-red-500">{errors.calle.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numero">Número *</Label>
                  <Input
                    id="numero"
                    placeholder="Ej: 123 o 123-A"
                    {...register("numero", {
                      required: "El número es obligatorio",
                    })}
                    className={errors.numero ? "border-red-500" : ""}
                  />
                  {errors.numero && <p className="text-sm text-red-500">{errors.numero.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="codigo_postal">Código Postal *</Label>
                  <Input
                    id="codigo_postal"
                    placeholder="Ej: 03100"
                    maxLength={5}
                    {...register("codigo_postal", {
                      required: "El código postal es obligatorio",
                      pattern: {
                        value: /^\d{5}$/,
                        message: "Debe ser un código postal válido (5 dígitos)",
                      },
                    })}
                    className={errors.codigo_postal ? "border-red-500" : ""}
                  />
                  {errors.codigo_postal && <p className="text-sm text-red-500">{errors.codigo_postal.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ciudad">Ciudad *</Label>
                  <Input
                    id="ciudad"
                    placeholder="Ej: Ciudad de México"
                    {...register("ciudad", {
                      required: "La ciudad es obligatoria",
                      minLength: {
                        value: 2,
                        message: "La ciudad debe tener al menos 2 caracteres",
                      },
                    })}
                    className={errors.ciudad ? "border-red-500" : ""}
                  />
                  {errors.ciudad && <p className="text-sm text-red-500">{errors.ciudad.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estado">Estado *</Label>
                  <Input
                    id="estado"
                    placeholder="Ej: CDMX"
                    {...register("estado", {
                      required: "El estado es obligatorio",
                      minLength: {
                        value: 2,
                        message: "El estado debe tener al menos 2 caracteres",
                      },
                    })}
                    className={errors.estado ? "border-red-500" : ""}
                  />
                  {errors.estado && <p className="text-sm text-red-500">{errors.estado.message}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Asignación de Ruta */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Asignación de Ruta</CardTitle>
              <CardDescription>Selecciona la ruta a la que pertenecerá el cliente</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="ruta">Ruta Asignada *</Label>
                <Select
                  value={selectedRutaId?.toString() || ""}
                  onValueChange={(value) => setValue("ruta_id", Number.parseInt(value))}
                >
                  <SelectTrigger className={errors.ruta_id ? "border-red-500" : ""}>
                    <SelectValue placeholder="Selecciona una ruta" />
                  </SelectTrigger>
                  <SelectContent>
                    {rutas.map((ruta) => (
                      <SelectItem key={ruta.id} value={ruta.id.toString()}>
                        {ruta.nombre} ({ruta.tipo})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input
                  type="hidden"
                  {...register("ruta_id", {
                    required: "Debe seleccionar una ruta",
                    min: { value: 1, message: "Debe seleccionar una ruta válida" },
                  })}
                />
                {errors.ruta_id && <p className="text-sm text-red-500">{errors.ruta_id.message}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Coordenadas GPS */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Navigation className="h-5 w-5" />
                Coordenadas GPS
              </CardTitle>
              <CardDescription>Ubicación exacta del cliente (opcional pero recomendado)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 mb-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={obtenerUbicacionActual}
                  className="flex items-center gap-2 bg-transparent"
                >
                  <MapPin className="h-4 w-4" />
                  Obtener Ubicación Actual
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitud">Latitud</Label>
                  <Input
                    id="latitud"
                    placeholder="19.432608"
                    {...register("latitud_str", {
                      pattern: {
                        value: /^-?([1-8]?[0-9]\.{1}\d{1,6}$|90\.{1}0{1,6}$)/,
                        message: "Formato de latitud inválido",
                      },
                    })}
                    className={errors.latitud_str ? "border-red-500" : ""}
                  />
                  {errors.latitud_str && <p className="text-sm text-red-500">{errors.latitud_str.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longitud">Longitud</Label>
                  <Input
                    id="longitud"
                    placeholder="-99.133209"
                    {...register("longitud_str", {
                      pattern: {
                        value: /^-?([1]?[0-7][0-9]\.{1}\d{1,6}$|180\.{1}0{1,6}$|[1-9]?[0-9]\.{1}\d{1,6}$)/,
                        message: "Formato de longitud inválido",
                      },
                    })}
                    className={errors.longitud_str ? "border-red-500" : ""}
                  />
                  {errors.longitud_str && <p className="text-sm text-red-500">{errors.longitud_str.message}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mensajes de estado */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="min-w-[120px]">
              {loading ? "Guardando..." : "Actualizar Cliente"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
