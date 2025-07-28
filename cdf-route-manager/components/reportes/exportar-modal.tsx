"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FileText, FileSpreadsheet, ImageIcon, Download, Settings } from "lucide-react"

interface ExportarModalProps {
  isOpen: boolean
  onClose: () => void
  onExport: (tipo: string, formato: string) => void
  tipoReporte: string
}

export function ExportarModal({ isOpen, onClose, onExport, tipoReporte }: ExportarModalProps) {
  const [formato, setFormato] = useState("pdf")
  const [incluirGraficos, setIncluirGraficos] = useState(true)
  const [incluirDetalles, setIncluirDetalles] = useState(true)
  const [incluirResumen, setIncluirResumen] = useState(true)
  const [nombreArchivo, setNombreArchivo] = useState("")
  const [notas, setNotas] = useState("")

  const formatosDisponibles = [
    {
      value: "pdf",
      label: "PDF",
      icon: FileText,
      description: "Documento portable, ideal para presentaciones",
    },
    {
      value: "excel",
      label: "Excel",
      icon: FileSpreadsheet,
      description: "Hoja de cálculo para análisis adicional",
    },
    {
      value: "csv",
      label: "CSV",
      icon: FileSpreadsheet,
      description: "Datos separados por comas, compatible con cualquier sistema",
    },
    {
      value: "png",
      label: "PNG",
      icon: ImageIcon,
      description: "Imagen de alta calidad para presentaciones",
    },
  ]

  const tiposReporte = {
    dashboard: "Dashboard General",
    ventas: "Reporte de Ventas",
    clientes: "Reporte de Clientes",
    inventario: "Reporte de Inventario",
    rutas: "Reporte de Rutas",
  }

  const handleExport = () => {
    const nombreFinal =
      nombreArchivo ||
      `${tiposReporte[tipoReporte as keyof typeof tiposReporte]}_${new Date().toISOString().split("T")[0]}`
    onExport(tipoReporte, formato)
    onClose()
  }

  const formatoSeleccionado = formatosDisponibles.find((f) => f.value === formato)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Download className="h-5 w-5" />
            <span>Exportar Reporte</span>
          </DialogTitle>
          <DialogDescription>
            Configura las opciones de exportación para tu reporte de{" "}
            {tiposReporte[tipoReporte as keyof typeof tiposReporte]?.toLowerCase()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Selección de Formato */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Formato de Exportación</Label>
            <div className="grid grid-cols-2 gap-3">
              {formatosDisponibles.map((formatoOption) => {
                const Icon = formatoOption.icon
                return (
                  <div
                    key={formatoOption.value}
                    className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                      formato === formatoOption.value
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setFormato(formatoOption.value)}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <Icon className="h-4 w-4" />
                      <span className="font-medium text-sm">{formatoOption.label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{formatoOption.description}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Opciones de Contenido */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Contenido a Incluir</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="resumen"
                  checked={incluirResumen}
                  onCheckedChange={(checked) => setIncluirResumen(checked as boolean)}
                />
                <Label htmlFor="resumen" className="text-sm">
                  Resumen ejecutivo
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="graficos"
                  checked={incluirGraficos}
                  onCheckedChange={(checked) => setIncluirGraficos(checked as boolean)}
                  disabled={formato === "csv"}
                />
                <Label htmlFor="graficos" className="text-sm">
                  Gráficos y visualizaciones
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="detalles"
                  checked={incluirDetalles}
                  onCheckedChange={(checked) => setIncluirDetalles(checked as boolean)}
                />
                <Label htmlFor="detalles" className="text-sm">
                  Datos detallados
                </Label>
              </div>
            </div>
          </div>

          {/* Nombre del Archivo */}
          <div className="space-y-2">
            <Label htmlFor="nombreArchivo" className="text-sm font-medium">
              Nombre del Archivo
            </Label>
            <Input
              id="nombreArchivo"
              value={nombreArchivo}
              onChange={(e) => setNombreArchivo(e.target.value)}
              placeholder={`${tiposReporte[tipoReporte as keyof typeof tiposReporte]}_${new Date().toISOString().split("T")[0]}`}
            />
          </div>

          {/* Notas Adicionales */}
          <div className="space-y-2">
            <Label htmlFor="notas" className="text-sm font-medium">
              Notas Adicionales (Opcional)
            </Label>
            <Textarea
              id="notas"
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Agrega cualquier nota o comentario que quieras incluir en el reporte..."
              rows={3}
            />
          </div>

          {/* Información del Formato Seleccionado */}
          {formatoSeleccionado && (
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <Settings className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium">Configuración de {formatoSeleccionado.label}</span>
              </div>
              <p className="text-xs text-gray-600">{formatoSeleccionado.description}</p>
              {formato === "csv" && (
                <p className="text-xs text-orange-600 mt-1">Nota: Los gráficos no están disponibles en formato CSV</p>
              )}
            </div>
          )}
        </div>

        {/* Botones de Acción */}
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleExport} className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Exportar {formatoSeleccionado?.label}</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
