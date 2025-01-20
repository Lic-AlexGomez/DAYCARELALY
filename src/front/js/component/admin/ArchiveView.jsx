import React, { useState } from "react"
import {
  Folder,
  File,
  ChevronRight,
  ChevronDown,
  Search,
  Filter,
  Eye,
  Download,
  Printer,
  FilePlus,
  X,
} from "lucide-react"

const initialArchiveItems = [
  { id: 1, name: "Clase de Verano 2022", type: "Clase", archivedDate: "2022-09-01" },
  { id: 2, name: "Evento de Navidad 2022", type: "Evento", archivedDate: "2023-01-05" },
  { id: 3, name: "Programa de Primavera 2023", type: "Programa", archivedDate: "2023-06-15" },
]

const initialArchiveStructure = [
  {
    id: 4,
    name: "Documentos 2023",
    type: "folder",
    expanded: false,
    children: [
      { id: 5, name: "Inscripciones.pdf", type: "file" },
      { id: 6, name: "Horarios.xlsx", type: "file" },
    ],
  },
  {
    id: 7,
    name: "Fotos",
    type: "folder",
    expanded: false,
    children: [
      { id: 8, name: "Evento de primavera.jpg", type: "file" },
      { id: 9, name: "Graduación.jpg", type: "file" },
    ],
  },
]

const ArchivePage = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all")
  const [view, setView] = useState("list") // 'list' or 'tree'
  const [archivedItems, setArchivedItems] = useState(initialArchiveItems)
  const [archiveStructure, setArchiveStructure] = useState(initialArchiveStructure)
  const [selectedFile, setSelectedFile] = useState(null)

  const filteredItems = archivedItems.filter(
    (item) => (filter === "all" || item.type === filter) && item.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const toggleFolder = (id) => {
    setArchiveStructure((prevStructure) => {
      const updateItem = (items) => {
        return items.map((item) => {
          if (item.id === id) {
            return { ...item, expanded: !item.expanded }
          }
          if (item.children) {
            return { ...item, children: updateItem(item.children) }
          }
          return item
        })
      }
      return updateItem(prevStructure)
    })
  }

  const handleFileAction = (action, file) => {
    switch (action) {
      case "view":
        setSelectedFile(file)
        break
      case "download":
        // Implement download logic here
        console.log(`Downloading file: ${file.name}`)
        break
      case "print":
        // Implement print logic here
        console.log(`Printing file: ${file.name}`)
        break
      default:
        break
    }
  }

  const handleGenerateFile = () => {
    // Implement file generation logic here
    console.log("Generating new file")
    // For demonstration, let's add a new file to the list
    const newFile = {
      id: Date.now(),
      name: `Nuevo Archivo ${archivedItems.length + 1}`,
      type: "Documento",
      archivedDate: new Date().toISOString().split("T")[0],
    }
    setArchivedItems([...archivedItems, newFile])
  }

  const renderArchiveItem = (item) => (
    <div key={item.id} className="tw-mb-2">
      {item.type === "folder" ? (
        <div>
          <button
            className="tw-flex tw-items-center tw-text-gray-700 hover:tw-text-blue-600"
            onClick={() => toggleFolder(item.id)}
          >
            {item.expanded ? (
              <ChevronDown className="tw-w-4 tw-h-4 tw-mr-1" />
            ) : (
              <ChevronRight className="tw-w-4 tw-h-4 tw-mr-1" />
            )}
            <Folder className="tw-w-5 tw-h-5 tw-mr-2" />
            {item.name}
          </button>
          {item.expanded && (
            <div className="tw-ml-6 tw-mt-2">{item.children.map((child) => renderArchiveItem(child))}</div>
          )}
        </div>
      ) : (
        <div className="tw-flex tw-items-center tw-text-gray-600">
          <File className="tw-w-5 tw-h-5 tw-mr-2" />
          <span className="tw-flex-grow">{item.name}</span>
          <button
            className="tw-text-blue-600 hover:tw-text-blue-800 tw-mr-2"
            onClick={() => handleFileAction("view", item)}
          >
            <Eye className="tw-w-4 tw-h-4" />
          </button>
          <button
            className="tw-text-green-600 hover:tw-text-green-800 tw-mr-2"
            onClick={() => handleFileAction("download", item)}
          >
            <Download className="tw-w-4 tw-h-4" />
          </button>
          <button
            className="tw-text-purple-600 hover:tw-text-purple-800"
            onClick={() => handleFileAction("print", item)}
          >
            <Printer className="tw-w-4 tw-h-4" />
          </button>
        </div>
      )}
    </div>
  )

  return (
    <div className="tw-flex tw-h-screen tw-overflow-hidden">
  
      <div className="tw-flex-1 tw-overflow-auto">
        <header className="tw-flex tw-items-center tw-justify-between tw-p-4 tw-border-b">
          <h1 className="tw-text-2xl tw-font-bold">Archivo</h1>
      
        </header>
        <main className="tw-p-6">
          <div className="tw-bg-white tw-shadow-md tw-rounded-lg tw-p-6">
            <div className="tw-flex tw-justify-between tw-items-center tw-mb-6">
              <h2 className="tw-text-xl tw-font-semibold">Elementos Archivados</h2>
              <div className="tw-flex tw-space-x-2">
                <button
                  className={`tw-px-3 tw-py-1 tw-rounded ${view === "list" ? "tw-bg-blue-500 tw-text-white" : "tw-bg-gray-200"}`}
                  onClick={() => setView("list")}
                >
                  Lista
                </button>
                <button
                  className={`tw-px-3 tw-py-1 tw-rounded ${view === "tree" ? "tw-bg-blue-500 tw-text-white" : "tw-bg-gray-200"}`}
                  onClick={() => setView("tree")}
                >
                  Árbol
                </button>
              </div>
            </div>
            <div className="tw-mb-4 tw-flex tw-justify-between">
              <div className="tw-relative">
                <input
                  type="text"
                  placeholder="Buscar en el archivo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="tw-border tw-rounded-md tw-pl-10 tw-pr-3 tw-py-2 tw-w-64"
                />
                <Search className="tw-absolute tw-left-3 tw-top-2.5 tw-text-gray-400 tw-w-5 tw-h-5" />
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="tw-border tw-rounded-md tw-px-3 tw-py-2 tw-w-48"
              >
                <option value="all">Todos</option>
                <option value="Clase">Clases</option>
                <option value="Evento">Eventos</option>
                <option value="Programa">Programas</option>
              </select>
              <button
                onClick={handleGenerateFile}
                className="tw-bg-green-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-md tw-flex tw-items-center"
              >
                <FilePlus className="tw-w-5 tw-h-5 tw-mr-2" />
                Generar Archivo
              </button>
            </div>
            {view === "list" ? (
              <table className="tw-w-full">
                <thead className="tw-bg-gray-50">
                  <tr>
                    <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
                      Nombre
                    </th>
                    <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
                      Tipo
                    </th>
                    <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
                      Fecha de Archivo
                    </th>
                    <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="tw-bg-white tw-divide-y tw-divide-gray-200">
                  {filteredItems.map((item) => (
                    <tr key={item.id}>
                      <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{item.name}</td>
                      <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{item.type}</td>
                      <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{item.archivedDate}</td>
                      <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">
                        <button
                          onClick={() => handleFileAction("view", item)}
                          className="tw-text-blue-600 hover:tw-text-blue-800 tw-mr-2"
                        >
                          <Eye className="tw-w-5 tw-h-5" />
                        </button>
                        <button
                          onClick={() => handleFileAction("download", item)}
                          className="tw-text-green-600 hover:tw-text-green-800 tw-mr-2"
                        >
                          <Download className="tw-w-5 tw-h-5" />
                        </button>
                        <button
                          onClick={() => handleFileAction("print", item)}
                          className="tw-text-purple-600 hover:tw-text-purple-800"
                        >
                          <Printer className="tw-w-5 tw-h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="tw-mt-4">{archiveStructure.map((item) => renderArchiveItem(item))}</div>
            )}
          </div>
        </main>
      </div>
      {selectedFile && (
        <div className="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-flex tw-items-center tw-justify-center">
          <div className="tw-bg-white tw-rounded-lg tw-p-6 tw-w-3/4 tw-h-3/4 tw-overflow-auto">
            <div className="tw-flex tw-justify-between tw-items-center tw-mb-4">
              <h2 className="tw-text-xl tw-font-semibold">Vista previa del archivo: {selectedFile.name}</h2>
              <button onClick={() => setSelectedFile(null)} className="tw-text-gray-500 hover:tw-text-gray-700">
                <X className="tw-w-5 tw-h-5" />
              </button>
            </div>
            <div className="tw-space-y-2">
              <p>
                <strong>Nombre:</strong> {selectedFile.name}
              </p>
              <p>
                <strong>Tipo:</strong> {selectedFile.type}
              </p>
              <p>
                <strong>Fecha de archivo:</strong> {selectedFile.archivedDate}
              </p>
             
             
              <div className="tw-mt-4 tw-p-4 tw-border tw-rounded">
                <p>Contenido del archivo (simulado)</p>
                <p>Este es un ejemplo de cómo se vería el contenido del archivo {selectedFile.name}.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


export default ArchivePage

