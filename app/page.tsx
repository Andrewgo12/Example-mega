"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Search,
  Download,
  Share2,
  Trash2,
  FolderPlus,
  File,
  Folder,
  Image,
  Video,
  Music,
  Archive,
  Settings,
  User,
  Bell,
  Grid3X3,
  List,
  Star,
  Clock,
  MoreVertical,
  Copy,
  Mail,
  CloudUpload,
  HardDrive,
  Smartphone,
  Monitor,
} from "lucide-react"

interface FileItem {
  id: string
  name: string
  type: "file" | "folder"
  size?: string
  modified: string
  shared?: boolean
  starred?: boolean
  fileType?: "image" | "video" | "audio" | "document" | "archive" | "other"
}

export default function MegaClone() {
  const [currentPath, setCurrentPath] = useState("/")
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateFolder, setShowCreateFolder] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [files, setFiles] = useState<FileItem[]>([
    { id: "1", name: "Documentos", type: "folder", modified: "2024-01-15", starred: true },
    { id: "2", name: "Imágenes", type: "folder", modified: "2024-01-14", shared: true },
    { id: "3", name: "Videos", type: "folder", modified: "2024-01-13" },
    { id: "4", name: "Música", type: "folder", modified: "2024-01-12" },
    { id: "5", name: "Presentación.pptx", type: "file", size: "15.2 MB", modified: "2024-01-11", fileType: "document" },
    {
      id: "6",
      name: "Foto_vacaciones.jpg",
      type: "file",
      size: "3.8 MB",
      modified: "2024-01-10",
      fileType: "image",
      starred: true,
    },
    { id: "7", name: "Video_proyecto.mp4", type: "file", size: "125.6 MB", modified: "2024-01-09", fileType: "video" },
    { id: "8", name: "Canción.mp3", type: "file", size: "4.2 MB", modified: "2024-01-08", fileType: "audio" },
  ])

  const getFileIcon = (item: FileItem) => {
    if (item.type === "folder") return <Folder className="h-8 w-8 text-blue-500" />

    switch (item.fileType) {
      case "image":
        return <Image className="h-8 w-8 text-green-500" />
      case "video":
        return <Video className="h-8 w-8 text-red-500" />
      case "audio":
        return <Music className="h-8 w-8 text-purple-500" />
      case "document":
        return <File className="h-8 w-8 text-orange-500" />
      case "archive":
        return <Archive className="h-8 w-8 text-yellow-500" />
      default:
        return <File className="h-8 w-8 text-gray-500" />
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files
    if (uploadedFiles) {
      setIsUploading(true)
      setUploadProgress(0)

      // Simular progreso de subida
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setIsUploading(false)
            setShowUpload(false)

            // Agregar archivos a la lista
            const newFiles: FileItem[] = Array.from(uploadedFiles).map((file, index) => ({
              id: `new-${Date.now()}-${index}`,
              name: file.name,
              type: "file" as const,
              size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
              modified: new Date().toLocaleDateString(),
              fileType: file.type.startsWith("image/")
                ? "image"
                : file.type.startsWith("video/")
                  ? "video"
                  : file.type.startsWith("audio/")
                    ? "audio"
                    : "other",
            }))

            setFiles((prev) => [...newFiles, ...prev])
            return 100
          }
          return prev + 10
        })
      }, 200)
    }
  }

  const createFolder = () => {
    if (newFolderName.trim()) {
      const newFolder: FileItem = {
        id: `folder-${Date.now()}`,
        name: newFolderName,
        type: "folder",
        modified: new Date().toLocaleDateString(),
      }
      setFiles((prev) => [newFolder, ...prev])
      setNewFolderName("")
      setShowCreateFolder(false)
    }
  }

  const toggleItemSelection = (id: string) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const filteredFiles = files.filter((file) => file.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-red-600">MEGA</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar archivos y carpetas..."
                className="pl-10 w-96"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4" />
            </Button>

            <Dialog open={showSettings} onOpenChange={setShowSettings}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Configuración</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="account" className="w-full">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="account">Cuenta</TabsTrigger>
                    <TabsTrigger value="security">Seguridad</TabsTrigger>
                    <TabsTrigger value="sync">Sincronización</TabsTrigger>
                    <TabsTrigger value="bandwidth">Ancho de banda</TabsTrigger>
                    <TabsTrigger value="advanced">Avanzado</TabsTrigger>
                  </TabsList>

                  <TabsContent value="account" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Nombre de usuario</label>
                        <Input defaultValue="usuario@ejemplo.com" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Nombre completo</label>
                        <Input defaultValue="Usuario Ejemplo" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Plan actual</label>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="secondary">PRO I</Badge>
                        <span className="text-sm text-gray-600">400 GB de almacenamiento</span>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="security" className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Autenticación de dos factores</h3>
                          <p className="text-sm text-gray-600">Protege tu cuenta con 2FA</p>
                        </div>
                        <Button variant="outline">Configurar</Button>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Sesiones activas</h3>
                          <p className="text-sm text-gray-600">Gestiona tus dispositivos conectados</p>
                        </div>
                        <Button variant="outline">Ver sesiones</Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="sync" className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Monitor className="h-5 w-5" />
                        <span>Escritorio - Sincronizado</span>
                        <Badge variant="outline" className="text-green-600">
                          Activo
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Smartphone className="h-5 w-5" />
                        <span>Móvil - Última sync: hace 2 horas</span>
                        <Badge variant="outline">Pausado</Badge>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="bandwidth" className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Límite de subida (MB/s)</label>
                        <Input type="number" defaultValue="10" className="mt-1" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Límite de descarga (MB/s)</label>
                        <Input type="number" defaultValue="0" placeholder="Sin límite" className="mt-1" />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="advanced" className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Modo debug</h3>
                          <p className="text-sm text-gray-600">Habilitar logs detallados</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Activar
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Limpiar caché</h3>
                          <p className="text-sm text-gray-600">Eliminar archivos temporales</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Limpiar
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>

            <Button variant="outline" size="sm">
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 h-screen">
          <div className="p-4">
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start" onClick={() => setShowUpload(true)}>
                <CloudUpload className="h-4 w-4 mr-2" />
                Subir archivos
              </Button>

              <Dialog open={showCreateFolder} onOpenChange={setShowCreateFolder}>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start">
                    <FolderPlus className="h-4 w-4 mr-2" />
                    Nueva carpeta
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Crear nueva carpeta</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Nombre de la carpeta"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && createFolder()}
                    />
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setShowCreateFolder(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={createFolder}>Crear</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Separator className="my-4" />

            <div className="space-y-1">
              <Button variant="ghost" className="w-full justify-start">
                <HardDrive className="h-4 w-4 mr-2" />
                Mi nube
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Share2 className="h-4 w-4 mr-2" />
                Compartido conmigo
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Star className="h-4 w-4 mr-2" />
                Destacados
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Clock className="h-4 w-4 mr-2" />
                Recientes
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Trash2 className="h-4 w-4 mr-2" />
                Papelera
              </Button>
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700">Almacenamiento</div>
              <Progress value={65} className="h-2" />
              <div className="text-xs text-gray-500">260 GB de 400 GB usados</div>
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                Actualizar plan
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">Inicio {currentPath !== "/" && `> ${currentPath}`}</div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>

              {selectedItems.length > 0 && (
                <>
                  <Separator orientation="vertical" className="h-6" />
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Descargar
                  </Button>

                  <Dialog open={showShare} onOpenChange={setShowShare}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4 mr-1" />
                        Compartir
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Compartir archivos</DialogTitle>
                      </DialogHeader>
                      <Tabs defaultValue="link" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="link">Enlace</TabsTrigger>
                          <TabsTrigger value="email">Email</TabsTrigger>
                          <TabsTrigger value="permissions">Permisos</TabsTrigger>
                        </TabsList>

                        <TabsContent value="link" className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Enlace de descarga</label>
                            <div className="flex space-x-2">
                              <Input readOnly value="https://mega.nz/file/abc123def456" className="flex-1" />
                              <Button size="sm">
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="password" />
                            <label htmlFor="password" className="text-sm">
                              Proteger con contraseña
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="expiry" />
                            <label htmlFor="expiry" className="text-sm">
                              Fecha de expiración
                            </label>
                          </div>
                        </TabsContent>

                        <TabsContent value="email" className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Enviar por email</label>
                            <Input placeholder="destinatario@ejemplo.com" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Mensaje (opcional)</label>
                            <textarea
                              className="w-full p-2 border rounded-md resize-none h-20"
                              placeholder="Escribe un mensaje..."
                            />
                          </div>
                          <Button className="w-full">
                            <Mail className="h-4 w-4 mr-2" />
                            Enviar
                          </Button>
                        </TabsContent>

                        <TabsContent value="permissions" className="space-y-4">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Solo lectura</span>
                              <input type="radio" name="permission" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Lectura y escritura</span>
                              <input type="radio" name="permission" />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Control total</span>
                              <input type="radio" name="permission" />
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </DialogContent>
                  </Dialog>

                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Eliminar
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* File Grid/List */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredFiles.map((file) => (
                <Card
                  key={file.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedItems.includes(file.id) ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => toggleItemSelection(file.id)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="flex justify-center mb-2">{getFileIcon(file)}</div>
                    <div className="text-sm font-medium truncate">{file.name}</div>
                    {file.size && <div className="text-xs text-gray-500 mt-1">{file.size}</div>}
                    <div className="flex justify-center mt-2 space-x-1">
                      {file.starred && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
                      {file.shared && <Share2 className="h-3 w-3 text-blue-500" />}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border">
              <div className="grid grid-cols-12 gap-4 p-4 border-b font-medium text-sm text-gray-600">
                <div className="col-span-6">Nombre</div>
                <div className="col-span-2">Tamaño</div>
                <div className="col-span-2">Modificado</div>
                <div className="col-span-2">Acciones</div>
              </div>
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  className={`grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 cursor-pointer ${
                    selectedItems.includes(file.id) ? "bg-blue-50" : ""
                  }`}
                  onClick={() => toggleItemSelection(file.id)}
                >
                  <div className="col-span-6 flex items-center space-x-3">
                    {getFileIcon(file)}
                    <span className="font-medium">{file.name}</span>
                    <div className="flex space-x-1">
                      {file.starred && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
                      {file.shared && <Share2 className="h-3 w-3 text-blue-500" />}
                    </div>
                  </div>
                  <div className="col-span-2 flex items-center text-sm text-gray-600">{file.size || "-"}</div>
                  <div className="col-span-2 flex items-center text-sm text-gray-600">{file.modified}</div>
                  <div className="col-span-2 flex items-center">
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Upload Modal */}
      <Dialog open={showUpload} onOpenChange={setShowUpload}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Subir archivos</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <CloudUpload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-lg font-medium">Arrastra archivos aquí</p>
              <p className="text-sm text-gray-500">o haz clic para seleccionar</p>
            </div>

            <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileUpload} />

            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subiendo archivos...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
