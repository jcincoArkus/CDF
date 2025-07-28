"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, DollarSign, Hash, AlertTriangle, CheckCircle } from "lucide-react"
import { crearProducto, obtenerCategorias, validarSKUDuplicado, type NuevoProductoData } from "@/lib/actions/productos"

interface NuevoProductoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onProductoCreado?: (producto_id: number) => void
}

interface FormData {
  nombre: string
  sku: string
  categoria: string
  categoria_nueva: string
  precio: string
  stock_inicial: string
  estado: "Activo" | "Inactivo"
}

export function NuevoProductoDialog({ open, onOpenChange, onProductoCreado }: NuevoProductoDialogProps) {
  const [loading, setLoading] = useState(false)
  const [categorias, setCategorias] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [validandoSKU, setValidandoSKU] = useState(false)
  const [usarNuevaCategoria, setUsarNuevaCategoria] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    setError: setFormError,
    clearErrors,
  } = useForm<FormData>({
    defaultValues: {
      nombre: "",
      sku: "",
      categoria: "",
      categoria_nueva: "",
      precio: "",
      stock_inicial: "",
      estado: "Activo",
    },
  })

  const skuValue = watch("sku")
  const categoriaValue = watch("categoria")
  const estadoValue = watch("estado")

  useEffect(() => {
    if (open) {
      loadCategorias()
      setError(null)
      setSuccess(null)
      setUsarNuevaCategoria(false)
      reset()
    }
  }, [open, reset])

  // Validación de SKU duplicado en tiempo real
  useEffect(() => {
    const checkSKUDuplicado = async () => {
      if (!skuValue || skuValue.length < 2) {
        clearErrors("sku")
        return
      }

      setValidandoSKU(true)
      try {
        const isDuplicate = await validarSKUDuplicado(skuValue)
        if (isDuplicate) {
          setFormError("sku", {
            type: "manual",
            message: "Este SKU ya existe en el sistema",
          })
        } else {
          clearErrors("sku")
        }
      } catch (error) {
        console.error("Error validando SKU:", error)
      } finally {
        setValidandoSKU(false)
      }
    }

    const timeoutId = setTimeout(checkSKUDuplicado, 500)
    return () => clearTimeout(timeoutId)
  }, [skuValue, setFormError, clearErrors])

  const loadCategorias = async () => {
    try {
      const categoriasData = await obtenerCategorias()
      setCategorias(categoriasData)
    } catch (error) {
      console.error("Error cargando categorías:", error)
    }
  }

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Validar campos numéricos
      const precio = Number.parseFloat(data.precio)
      const stockInicial = Number.parseInt(data.stock_inicial)

      if (isNaN(precio) || precio <= 0) {
        setFormError("precio", {
          type: "manual",
          message: "El precio debe ser un número mayor a 0",
        })
        setLoading(false)
        return
      }

      if (isNaN(stockInicial) || stockInicial < 0) {
        setFormError("stock_inicial", {
          type: "manual",
          message: "El stock inicial debe ser un número entero mayor o igual a 0",
        })
        setLoading(false)
        return
      }

      // Determinar la categoría final
      const categoriaFinal = usarNuevaCategoria ? data.categoria_nueva.trim() : data.categoria

      if (!categoriaFinal) {
        setError("Debe seleccionar o crear una categoría")
        setLoading(false)
        return
      }

      const productoData: NuevoProductoData = {
        nombre: data.nombre.trim(),
        sku: data.sku.trim().toUpperCase(),
        categoria: categoriaFinal,
        precio: precio,
        stock_inicial: stockInicial,
        estado: data.estado,
      }

      const result = await crearProducto(productoData)

      if (result.success) {
        setSuccess(result.message)
        onProductoCreado?.(result.producto_id)

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
    setError(null)
    setSuccess(null)
    setUsarNuevaCategoria(false)
    onOpenChange(false)
  }

  const handleSKUChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Convertir a mayúsculas automáticamente
    const value = e.target.value.toUpperCase()
    setValue("sku", value)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Nuevo Producto
          </DialogTitle>
          <DialogDescription>Registra un nuevo producto en el catálogo del sistema</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Información Básica */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información Básica</CardTitle>
              <CardDescription>Datos principales del producto</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre del Producto *</Label>
                  <Input
                    id="nombre"
                    placeholder="Ej: Coca Cola 600ml"
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
                  <Label htmlFor="sku">SKU *</Label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    {validandoSKU && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      </div>
                    )}
                    <Input
                      id="sku"
                      placeholder="Ej: CC600"
                      className={`pl-10 ${errors.sku ? "border-red-500" : ""}`}
                      {...register("sku", {
                        required: "El SKU es obligatorio",
                        minLength: {
                          value: 2,
                          message: "El SKU debe tener al menos 2 caracteres",
                        },
                        pattern: {
                          value: /^[A-Z0-9]+$/,
                          message: "El SKU solo puede contener letras mayúsculas y números",
                        },
                      })}
                      onChange={handleSKUChange}
                    />
                  </div>
                  {errors.sku && <p className="text-sm text-red-500">{errors.sku.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoria">Categoría *</Label>
                <div className="flex gap-2">
                  <Select
                    value={usarNuevaCategoria ? "nueva" : categoriaValue}
                    onValueChange={(value) => {
                      if (value === "nueva") {
                        setUsarNuevaCategoria(true)
                        setValue("categoria", "")
                      } else {
                        setUsarNuevaCategoria(false)
                        setValue("categoria", value)
                      }
                    }}
                    disabled={usarNuevaCategoria}
                  >
                    <SelectTrigger className={`flex-1 ${errors.categoria ? "border-red-500" : ""}`}>
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias.map((categoria) => (
                        <SelectItem key={categoria} value={categoria}>
                          {categoria}
                        </SelectItem>
                      ))}
                      <SelectItem value="nueva">+ Crear nueva categoría</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {usarNuevaCategoria && (
                  <div className="mt-2">
                    <Input
                      placeholder="Nombre de la nueva categoría"
                      {...register("categoria_nueva", {
                        required: usarNuevaCategoria ? "La nueva categoría es obligatoria" : false,
                        minLength: {
                          value: 2,
                          message: "La categoría debe tener al menos 2 caracteres",
                        },
                      })}
                      className={errors.categoria_nueva ? "border-red-500" : ""}
                    />
                    {errors.categoria_nueva && <p className="text-sm text-red-500">{errors.categoria_nueva.message}</p>}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2 bg-transparent"
                      onClick={() => {
                        setUsarNuevaCategoria(false)
                        setValue("categoria_nueva", "")
                      }}
                    >
                      Cancelar nueva categoría
                    </Button>
                  </div>
                )}

                <input
                  type="hidden"
                  {...register("categoria", {
                    required: !usarNuevaCategoria ? "Debe seleccionar una categoría" : false,
                  })}
                />
                {errors.categoria && !usarNuevaCategoria && (
                  <p className="text-sm text-red-500">{errors.categoria.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Precio e Inventario */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Precio e Inventario</CardTitle>
              <CardDescription>Información comercial y de stock</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="precio">Precio de Venta *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="precio"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      className={`pl-10 ${errors.precio ? "border-red-500" : ""}`}
                      {...register("precio", {
                        required: "El precio es obligatorio",
                        pattern: {
                          value: /^\d+(\.\d{1,2})?$/,
                          message: "Formato de precio inválido",
                        },
                      })}
                    />
                  </div>
                  {errors.precio && <p className="text-sm text-red-500">{errors.precio.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock_inicial">Stock Inicial *</Label>
                  <div className="relative">
                    <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="stock_inicial"
                      type="number"
                      min="0"
                      placeholder="0"
                      className={`pl-10 ${errors.stock_inicial ? "border-red-500" : ""}`}
                      {...register("stock_inicial", {
                        required: "El stock inicial es obligatorio",
                        pattern: {
                          value: /^\d+$/,
                          message: "Debe ser un número entero",
                        },
                      })}
                    />
                  </div>
                  {errors.stock_inicial && <p className="text-sm text-red-500">{errors.stock_inicial.message}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estado */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Estado del Producto</CardTitle>
              <CardDescription>Define si el producto estará disponible para venta</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="estado">Estado *</Label>
                <Select value={estadoValue} onValueChange={(value: "Activo" | "Inactivo") => setValue("estado", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Activo">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Activo
                      </div>
                    </SelectItem>
                    <SelectItem value="Inactivo">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        Inactivo
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Los productos inactivos no aparecerán en el catálogo de ventas
                </p>
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
              {loading ? "Guardando..." : "Crear Producto"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
