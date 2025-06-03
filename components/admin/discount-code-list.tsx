"use client"

import { useState, useEffect, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  MoreHorizontal,
  Plus,
  Search,
  Edit,
  Trash2,
  Check,
  X,
  ArrowUpDown,
  Calendar,
  Tag,
  User,
  ShoppingCart,
  RefreshCw,
  Download,
  FilePlus,
  ListFilter,
} from "lucide-react"
import Link from "next/link"
import { toast } from "@/components/ui/use-toast"
// REMOVE: import { type DiscountCode, getDiscountCodes } from "@/data/mock-discount-codes"
import type { DiscountCode, DiscountCodeFilter } from "@/types/discount" // Use type from types/discount
import {
  deleteDiscountCodeAction,
  updateDiscountCodeAction,
  bulkActionDiscountCodesAction,
  exportDiscountCodesAction,
  generateDiscountCodesAction,
} from "@/app/admin/discount-codes/actions"
import { Checkbox } from "@/components/ui/checkbox"

// Props for the component, receiving initial discount codes from the server
interface DiscountCodeListProps {
  discountCodes: DiscountCode[] | null
}

export function DiscountCodeList({ discountCodes: initialDiscountCodes }: DiscountCodeListProps) {
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>(initialDiscountCodes || [])
  const [filteredAndSortedCodes, setFilteredAndSortedCodes] = useState<DiscountCode[]>([])
  const [loading, setLoading] = useState(false) // Manage loading state for actions
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [scopeFilter, setScopeFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("created_at")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [codeToDelete, setCodeToDelete] = useState<DiscountCode | null>(null)
  const [selectedCodes, setSelectedCodes] = useState<Set<string>>(new Set())
  const [bulkAction, setBulkAction] = useState<string>("")
  const [showBulkActionDialog, setShowBulkActionDialog] = useState(false)
  const [extendDays, setExtendDays] = useState<number>(30)

  // This effect updates the internal state if the prop changes (e.g., after page revalidation)
  useEffect(() => {
    setDiscountCodes(initialDiscountCodes || [])
  }, [initialDiscountCodes])

  // This effect handles client-side filtering and sorting
  useEffect(() => {
    let filtered = [...discountCodes]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (code) =>
          code.code.toLowerCase().includes(query) ||
          (code.description && code.description.toLowerCase().includes(query)),
      )
    }

    if (statusFilter !== "all") {
      const now = new Date()
      if (statusFilter === "active") {
        filtered = filtered.filter(
          (code) =>
            code.is_active &&
            (!code.starts_at || new Date(code.starts_at) <= now) &&
            (!code.expires_at || new Date(code.expires_at) >= now) &&
            (code.max_uses === null || (code.current_uses || 0) < code.max_uses),
        )
      } else if (statusFilter === "inactive") {
        filtered = filtered.filter((code) => !code.is_active)
      } else if (statusFilter === "expired") {
        filtered = filtered.filter((code) => code.is_active && code.expires_at && new Date(code.expires_at) < now)
      } else if (statusFilter === "scheduled") {
        filtered = filtered.filter((code) => code.is_active && code.starts_at && new Date(code.starts_at) > now)
      } else if (statusFilter === "used_up") {
        filtered = filtered.filter(
          (code) => code.is_active && code.max_uses !== null && (code.current_uses || 0) >= code.max_uses,
        )
      }
    }

    if (scopeFilter !== "all") {
      filtered = filtered.filter((code) => code.scope === scopeFilter)
    }

    filtered.sort((a, b) => {
      let valueA: any = a[sortBy as keyof DiscountCode]
      let valueB: any = b[sortBy as keyof DiscountCode]

      if (valueA === null || valueA === undefined)
        valueA = sortDirection === "asc" ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY
      if (valueB === null || valueB === undefined)
        valueB = sortDirection === "asc" ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY

      if (typeof valueA === "string" && typeof valueB === "string") {
        valueA = valueA.toLowerCase()
        valueB = valueB.toLowerCase()
      }

      if (valueA < valueB) return sortDirection === "asc" ? -1 : 1
      if (valueA > valueB) return sortDirection === "asc" ? 1 : -1
      return 0
    })

    setFilteredAndSortedCodes(filtered)
    setCurrentPage(1) // Reset to first page on filter/sort change
  }, [discountCodes, searchQuery, statusFilter, scopeFilter, sortBy, sortDirection])

  const paginatedCodes = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredAndSortedCodes.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredAndSortedCodes, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredAndSortedCodes.length / itemsPerPage)

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortDirection("asc") // Default to ascending when changing column
    }
  }

  const refreshDiscountCodes = async () => {
    setLoading(true)
    try {
      // This is a simplified refresh. In a real app, you might want to preserve filters.
      // For now, it just re-fetches all codes.
      // Or, rely on Next.js revalidation triggered by server actions.
      // For client-side refresh without full page reload, you'd call getDiscountCodesAction.
      // This example assumes revalidation from server actions handles data refresh.
      // If not, you'd do:
      // const result = await getDiscountCodesAction();
      // if (result.success && result.data) {
      //   setDiscountCodes(result.data as DiscountCode[]);
      // } else {
      //   toast({ title: "Fehler", description: "Rabattcodes konnten nicht neu geladen werden.", variant: "destructive" });
      // }
      // For now, we assume server actions revalidate the page, updating `initialDiscountCodes` prop.
      // This function can be a placeholder or trigger a manual re-fetch if needed.
      toast({
        title: "Info",
        description: "Datenaktualisierung wird durch Server-Aktionen und Seiten-Neuladen/-Validierung gehandhabt.",
      })
    } catch (error) {
      toast({ title: "Fehler", description: "Rabattcodes konnten nicht neu geladen werden.", variant: "destructive" })
    }
    setLoading(false)
  }

  const handleStatusChange = async (id: string, isActive: boolean) => {
    setLoading(true)
    const result = await updateDiscountCodeAction(id, { is_active: isActive })
    setLoading(false)
    if (result.success) {
      toast({
        title: isActive ? "Rabattcode aktiviert" : "Rabattcode deaktiviert",
      })
      // Optimistic update or rely on revalidation from server action
      // For optimistic:
      // setDiscountCodes(currentCodes =>
      //   currentCodes.map(code => code.id === id ? { ...code, is_active: isActive } : code)
      // );
      // Server action should revalidatePath, which will update the `initialDiscountCodes` prop.
    } else {
      toast({ title: "Fehler", description: result.error, variant: "destructive" })
    }
  }

  const handleDelete = (code: DiscountCode) => {
    setCodeToDelete(code)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (codeToDelete) {
      setLoading(true)
      const result = await deleteDiscountCodeAction(codeToDelete.id)
      setLoading(false)
      if (result.success) {
        toast({ title: "Rabattcode verarbeitet", description: result.message || "Aktion erfolgreich." })
        // Optimistic update or rely on revalidation
        // setDiscountCodes(currentCodes => currentCodes.filter(c => c.id !== codeToDelete.id));
      } else {
        toast({ title: "Fehler", description: result.error, variant: "destructive" })
      }
      setDeleteDialogOpen(false)
      setCodeToDelete(null)
    }
  }

  const handleSelectCode = (codeId: string, checked: boolean) => {
    setSelectedCodes((prev) => {
      const newSet = new Set(prev)
      if (checked) {
        newSet.add(codeId)
      } else {
        newSet.delete(codeId)
      }
      return newSet
    })
  }

  const handleSelectAllCodes = (checked: boolean) => {
    if (checked) {
      setSelectedCodes(new Set(paginatedCodes.map((code) => code.id)))
    } else {
      setSelectedCodes(new Set())
    }
  }

  const isAllSelected = paginatedCodes.length > 0 && selectedCodes.size === paginatedCodes.length

  const handleBulkAction = async () => {
    if (selectedCodes.size === 0 || !bulkAction) {
      toast({
        title: "Aktion fehlgeschlagen",
        description: "Keine Codes ausgewählt oder keine Aktion gewählt.",
        variant: "destructive",
      })
      return
    }
    setShowBulkActionDialog(true) // Show confirmation dialog
  }

  const confirmBulkAction = async () => {
    setLoading(true)
    setShowBulkActionDialog(false)
    let additionalData
    if (bulkAction === "extend") {
      additionalData = { days: extendDays }
    }

    const result = await bulkActionDiscountCodesAction(
      bulkAction as "activate" | "deactivate" | "delete" | "extend",
      Array.from(selectedCodes),
      additionalData,
    )
    setLoading(false)

    if (result.success || result.successCount > 0) {
      toast({ title: "Massenaktion erfolgreich", description: result.message })
      setSelectedCodes(new Set()) // Clear selection
    } else {
      toast({ title: "Massenaktion fehlgeschlagen", description: result.message, variant: "destructive" })
    }
  }

  const handleExport = async () => {
    setLoading(true)
    // Construct filters based on current UI state to pass to export action
    const currentFilters: DiscountCodeFilter = {
      search: searchQuery || undefined,
      status: statusFilter !== "all" ? (statusFilter as DiscountCodeFilter["status"]) : undefined,
      scope: scopeFilter !== "all" ? (scopeFilter as DiscountCodeFilter["scope"]) : undefined,
      // Note: export usually ignores pagination, sortBy, sortDirection from client
    }
    const result = await exportDiscountCodesAction(currentFilters)
    setLoading(false)
    if (result.success && result.data) {
      const blob = new Blob([result.data], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob)
        link.setAttribute("href", url)
        link.setAttribute("download", result.filename || "discount_codes.csv")
        link.style.visibility = "hidden"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
      toast({ title: "Export erfolgreich", description: "Rabattcodes werden heruntergeladen." })
    } else {
      toast({
        title: "Export fehlgeschlagen",
        description: result.error || "Unbekannter Fehler.",
        variant: "destructive",
      })
    }
  }

  const handleGenerateCodes = async () => {
    // This would typically open a dialog to configure generation options
    // For a simple example, let's generate 5 generic codes
    setLoading(true)
    const result = await generateDiscountCodesAction(5, { description: "Automatisch generiert" })
    setLoading(false)
    if (result.success) {
      toast({ title: "Codes generiert", description: `${result.data?.length || 0} Codes erfolgreich erstellt.` })
    } else {
      toast({ title: "Generierung fehlgeschlagen", description: result.error, variant: "destructive" })
    }
  }

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "—"
    try {
      return new Date(dateString).toLocaleDateString("de-DE", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    } catch (e) {
      return "Ungültiges Datum"
    }
  }

  const getStatusBadge = (code: DiscountCode) => {
    const now = new Date()
    if (!code.is_active)
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-800">
          <X className="h-3 w-3 mr-1" />
          Inaktiv
        </Badge>
      )
    if (code.starts_at && new Date(code.starts_at) > now)
      return (
        <Badge variant="outline" className="bg-blue-100 text-blue-800">
          <Calendar className="h-3 w-3 mr-1" />
          Geplant
        </Badge>
      )
    if (code.expires_at && new Date(code.expires_at) < now)
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
          <Calendar className="h-3 w-3 mr-1" />
          Abgelaufen
        </Badge>
      )
    if (code.max_uses !== null && (code.current_uses || 0) >= code.max_uses)
      return (
        <Badge variant="outline" className="bg-orange-100 text-orange-800">
          <ShoppingCart className="h-3 w-3 mr-1" />
          Aufgebraucht
        </Badge>
      )
    return (
      <Badge variant="outline" className="bg-green-100 text-green-800">
        <Check className="h-3 w-3 mr-1" />
        Aktiv
      </Badge>
    )
  }

  const getScopeBadge = (code: DiscountCode) => {
    switch (code.scope) {
      case "product":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800">
            <Tag className="h-3 w-3 mr-1" />
            Produkt
          </Badge>
        )
      case "category":
        return (
          <Badge variant="outline" className="bg-indigo-100 text-indigo-800">
            <Tag className="h-3 w-3 mr-1" />
            Kategorie
          </Badge>
        )
      case "customer":
        return (
          <Badge variant="outline" className="bg-pink-100 text-pink-800">
            <User className="h-3 w-3 mr-1" />
            Kunde
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            <Tag className="h-3 w-3 mr-1" />
            Alle
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Filter & Aktionen</CardTitle>
          <CardDescription>Filtern, suchen und verwalten Sie Ihre Rabattcodes.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Suche Code/Beschreibung..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={loading}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter} disabled={loading}>
              <SelectTrigger>
                <SelectValue placeholder="Status filtern" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Status</SelectItem>
                <SelectItem value="active">Aktiv</SelectItem>
                <SelectItem value="inactive">Inaktiv</SelectItem>
                <SelectItem value="expired">Abgelaufen</SelectItem>
                <SelectItem value="scheduled">Geplant</SelectItem>
                <SelectItem value="used_up">Aufgebraucht</SelectItem>
              </SelectContent>
            </Select>
            <Select value={scopeFilter} onValueChange={setScopeFilter} disabled={loading}>
              <SelectTrigger>
                <SelectValue placeholder="Bereich filtern" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Bereiche</SelectItem>
                <SelectItem value="product">Produkt</SelectItem>
                <SelectItem value="category">Kategorie</SelectItem>
                <SelectItem value="customer">Kunde</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setStatusFilter("all")
                setScopeFilter("all")
                setSortBy("created_at")
                setSortDirection("desc")
              }}
              disabled={loading}
            >
              <ListFilter className="h-4 w-4 mr-2" />
              Filter zurücksetzen
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Link href="/admin/discount-codes/new" className="flex-1">
              <Button className="w-full" disabled={loading}>
                <Plus className="h-4 w-4 mr-2" />
                Neu
              </Button>
            </Link>
            <Button onClick={handleGenerateCodes} variant="outline" className="flex-1" disabled={loading}>
              <FilePlus className="h-4 w-4 mr-2" /> Codes generieren
            </Button>
            <Button onClick={handleExport} variant="outline" className="flex-1" disabled={loading}>
              <Download className="h-4 w-4 mr-2" /> Exportieren (CSV)
            </Button>
            <Button onClick={refreshDiscountCodes} variant="outline" className="flex-1" disabled={loading}>
              <RefreshCw className="h-4 w-4 mr-2" /> Aktualisieren
            </Button>
          </div>
        </CardContent>
      </Card>

      {selectedCodes.size > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Massenaktionen für {selectedCodes.size} ausgewählte Codes</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-2 items-center">
            <Select value={bulkAction} onValueChange={setBulkAction} disabled={loading}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Aktion wählen..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="activate">Aktivieren</SelectItem>
                <SelectItem value="deactivate">Deaktivieren</SelectItem>
                <SelectItem value="delete">Löschen</SelectItem>
                <SelectItem value="extend">Verlängern</SelectItem>
              </SelectContent>
            </Select>
            {bulkAction === "extend" && (
              <Input
                type="number"
                value={extendDays}
                onChange={(e) => setExtendDays(Number.parseInt(e.target.value))}
                placeholder="Tage"
                className="w-24"
                min="1"
                disabled={loading}
              />
            )}
            <Button onClick={handleBulkAction} className="flex-1 sm:flex-initial" disabled={loading || !bulkAction}>
              Ausführen
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={(checked) => handleSelectAllCodes(Boolean(checked))}
                      aria-label="Alle auswählen"
                      disabled={loading}
                    />
                  </TableHead>
                  <TableHead className="min-w-[120px]">
                    <Button
                      variant="ghost"
                      className="p-0 font-medium"
                      onClick={() => handleSort("code")}
                      disabled={loading}
                    >
                      Code <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="min-w-[150px]">Beschreibung</TableHead>
                  <TableHead className="min-w-[100px]">
                    <Button
                      variant="ghost"
                      className="p-0 font-medium"
                      onClick={() => handleSort("discount_percent")}
                      disabled={loading}
                    >
                      Rabatt <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="min-w-[100px]">
                    <Button
                      variant="ghost"
                      className="p-0 font-medium"
                      onClick={() => handleSort("current_uses")}
                      disabled={loading}
                    >
                      Nutzung <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="min-w-[100px]">Bereich</TableHead>
                  <TableHead className="min-w-[120px]">
                    <Button
                      variant="ghost"
                      className="p-0 font-medium"
                      onClick={() => handleSort("expires_at")}
                      disabled={loading}
                    >
                      Gültig bis <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="min-w-[100px]">Status</TableHead>
                  <TableHead className="text-right min-w-[120px]">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && paginatedCodes.length === 0 ? ( // Show loading only if no items yet
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      Lade Rabattcodes...
                    </TableCell>
                  </TableRow>
                ) : paginatedCodes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      Keine Rabattcodes gefunden.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedCodes.map((code) => (
                    <TableRow key={code.id} data-state={selectedCodes.has(code.id) ? "selected" : ""}>
                      <TableCell>
                        <Checkbox
                          checked={selectedCodes.has(code.id)}
                          onCheckedChange={(checked) => handleSelectCode(code.id, Boolean(checked))}
                          aria-label={`Code ${code.code} auswählen`}
                          disabled={loading}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{code.code}</TableCell>
                      <TableCell className="truncate max-w-xs">{code.description || "—"}</TableCell>
                      <TableCell>
                        {code.discount_percent !== null
                          ? `${code.discount_percent}%`
                          : code.discount_amount !== null
                            ? `${code.discount_amount.toFixed(2)}€`
                            : "—"}
                      </TableCell>
                      <TableCell>
                        {code.current_uses || 0} / {code.max_uses ?? "∞"}
                      </TableCell>
                      <TableCell>{getScopeBadge(code)}</TableCell>
                      <TableCell>{formatDate(code.expires_at)}</TableCell>
                      <TableCell>{getStatusBadge(code)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end items-center space-x-1">
                          <Switch
                            checked={code.is_active}
                            onCheckedChange={(checked) => handleStatusChange(code.id, checked)}
                            disabled={loading}
                            aria-label={code.is_active ? "Deaktivieren" : "Aktivieren"}
                          />
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0" disabled={loading}>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <Link href={`/admin/discount-codes/${code.id}`}>
                                <DropdownMenuItem disabled={loading}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Bearbeiten
                                </DropdownMenuItem>
                              </Link>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDelete(code)}
                                disabled={loading}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Löschen
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between pt-6">
          <div className="text-sm text-muted-foreground">
            Zeige {Math.min((currentPage - 1) * itemsPerPage + 1, filteredAndSortedCodes.length)}-
            {Math.min(currentPage * itemsPerPage, filteredAndSortedCodes.length)} von {filteredAndSortedCodes.length}{" "}
            Einträgen
          </div>
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1 || loading}
                  />
                </PaginationItem>
                {/* Simplified pagination links for brevity, ideally generate a few around current page */}
                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i + 1}>
                    <PaginationLink
                      onClick={() => setCurrentPage(i + 1)}
                      isActive={currentPage === i + 1}
                      disabled={loading}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages || loading}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </CardFooter>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rabattcode "{codeToDelete?.code}" wirklich löschen?</AlertDialogTitle>
            <AlertDialogDescription>
              Diese Aktion kann nicht rückgängig gemacht werden. Wenn der Code bereits verwendet wurde, wird er
              stattdessen deaktiviert.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700" disabled={loading}>
              {loading ? "Lösche..." : "Löschen/Deaktivieren"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showBulkActionDialog} onOpenChange={setShowBulkActionDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Massenaktion bestätigen</AlertDialogTitle>
            <AlertDialogDescription>
              Sind Sie sicher, dass Sie die Aktion "{bulkAction}" für {selectedCodes.size} Rabattcode(s) ausführen
              möchten?
              {bulkAction === "extend" && ` (Verlängerung um ${extendDays} Tage)`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBulkAction} disabled={loading}>
              {loading ? "Wird ausgeführt..." : "Bestätigen"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
