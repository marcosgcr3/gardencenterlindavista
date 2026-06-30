"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Printer, 
  Sprout, 
  Filter, 
  AlertCircle,
  ExternalLink
} from "lucide-react";
import { plants, Plant } from "@/data/plants";

export default function AdminPlantasPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [allPlants, setAllPlants] = useState<Plant[]>(plants);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Load plants from localStorage as well
  useEffect(() => {
    if (typeof window !== "undefined") {
      let merged = [...plants];
      
      const local = localStorage.getItem("local_plants");
      if (local) {
        try {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed)) {
            parsed.forEach((localPlant: Plant) => {
              const idx = merged.findIndex(p => p.slug === localPlant.slug);
              if (idx !== -1) {
                merged[idx] = localPlant;
              } else {
                merged.push(localPlant);
              }
            });
          }
        } catch (e) {
          console.error("Error loading local plants:", e);
        }
      }

      const deleted = localStorage.getItem("deleted_plants");
      if (deleted) {
        try {
          const parsedSlugs = JSON.parse(deleted);
          if (Array.isArray(parsedSlugs)) {
            merged = merged.filter(p => !parsedSlugs.includes(p.slug));
          }
        } catch (e) {
          console.error("Error loading deleted plants:", e);
        }
      }

      setAllPlants(merged);
    }
  }, []);

  const categories = ["Todas", "Interior", "Exterior", "Suculentas", "Árboles"];

  // Filter plants based on search and category
  const filteredPlants = useMemo(() => {
    return allPlants.filter(plant => {
      const matchesSearch = 
        plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plant.scientificName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === "Todas" || plant.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [allPlants, searchTerm, selectedCategory]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("Todas");
  };

  // Handle delete plant
  const handleDelete = async (slug: string, name: string) => {
    const confirmDelete = window.confirm(`¿Estás seguro de que deseas eliminar la planta "${name}" de forma permanente?`);
    if (!confirmDelete) return;

    setIsDeleting(slug);
    setErrorMsg("");
    setSuccessMsg("");

    const adminPass = typeof window !== "undefined" ? localStorage.getItem("gclv_admin_pass") || "" : "";

    try {
      const response = await fetch("/api/plants", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${adminPass}`
        },
        body: JSON.stringify({ slug })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMsg(`Planta "${name}" eliminada correctamente del servidor.`);
        // Remove from local state
        setAllPlants(prev => prev.filter(p => p.slug !== slug));
        
        // Also remove from localStorage if it exists there
        if (typeof window !== "undefined") {
          const local = localStorage.getItem("local_plants");
          if (local) {
            try {
              const parsed = JSON.parse(local);
              if (Array.isArray(parsed)) {
                const updated = parsed.filter((p: any) => p.slug !== slug);
                localStorage.setItem("local_plants", JSON.stringify(updated));
              }
            } catch (e) {}
          }
          // Save to deleted_plants
          const deleted = localStorage.getItem("deleted_plants") || "[]";
          let deletedList = [];
          try {
            deletedList = JSON.parse(deleted);
          } catch (e) {
            deletedList = [];
          }
          if (Array.isArray(deletedList) && !deletedList.includes(slug)) {
            deletedList.push(slug);
            localStorage.setItem("deleted_plants", JSON.stringify(deletedList));
          }
        }
      } else {
        // Fallback for Vercel/production: delete from localStorage only
        console.warn("Server delete failed, deleting from local session:", data.error);
        setSuccessMsg(`Planta "${name}" eliminada de la sesión del navegador.`);
        setAllPlants(prev => prev.filter(p => p.slug !== slug));

        if (typeof window !== "undefined") {
          const local = localStorage.getItem("local_plants");
          if (local) {
            try {
              const parsed = JSON.parse(local);
              if (Array.isArray(parsed)) {
                const updated = parsed.filter((p: any) => p.slug !== slug);
                localStorage.setItem("local_plants", JSON.stringify(updated));
              }
            } catch (e) {}
          }
          // Save to deleted_plants
          const deleted = localStorage.getItem("deleted_plants") || "[]";
          let deletedList = [];
          try {
            deletedList = JSON.parse(deleted);
          } catch (e) {
            deletedList = [];
          }
          if (Array.isArray(deletedList) && !deletedList.includes(slug)) {
            deletedList.push(slug);
            localStorage.setItem("deleted_plants", JSON.stringify(deletedList));
          }
        }
      }
    } catch (err: any) {
      setErrorMsg("Error de conexión al intentar eliminar. Se borró solo localmente.");
      setAllPlants(prev => prev.filter(p => p.slug !== slug));
      
      if (typeof window !== "undefined") {
        const local = localStorage.getItem("local_plants");
        if (local) {
          try {
            const parsed = JSON.parse(local);
            if (Array.isArray(parsed)) {
              const updated = parsed.filter((p: any) => p.slug !== slug);
              localStorage.setItem("local_plants", JSON.stringify(updated));
            }
          } catch (e) {}
        }
        // Save to deleted_plants
        const deleted = localStorage.getItem("deleted_plants") || "[]";
        let deletedList = [];
        try {
          deletedList = JSON.parse(deleted);
        } catch (e) {
          deletedList = [];
        }
        if (Array.isArray(deletedList) && !deletedList.includes(slug)) {
          deletedList.push(slug);
          localStorage.setItem("deleted_plants", JSON.stringify(deletedList));
        }
      }
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in mb-16">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
            <Sprout className="w-8 h-8 text-brand" />
            Gestión de Catálogo
          </h1>
          <p className="text-zinc-500 mt-1 text-sm font-light">
            Visualiza, edita o elimina las plantas y árboles del vivero físico y de la web.
          </p>
        </div>

        <Link
          href="/admin/nueva-planta"
          className="inline-flex items-center justify-center gap-2 bg-brand hover:bg-brand-dark text-white font-bold px-5 py-3 rounded-xl transition-all duration-300 shadow-md shadow-brand/10 hover:shadow-lg hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          Añadir Planta
        </Link>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 p-4 rounded-xl border border-emerald-100/50 flex items-center gap-3 text-sm">
          <Sprout className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 p-4 rounded-xl border border-rose-100/50 flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 p-4 rounded-2xl shadow-xs">
        <div className="relative w-full md:flex-grow">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Buscar por nombre común o científico..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:border-brand text-zinc-800 dark:text-zinc-200 font-light"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto shrink-0 overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-zinc-400 shrink-0 ml-1" />
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? "bg-brand/10 text-brand border border-brand/20"
                  : "bg-zinc-50 hover:bg-zinc-150 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 border border-transparent"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Plants */}
      {filteredPlants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlants.map(plant => (
            <div 
              key={plant.slug}
              className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group"
            >
              {/* Image & Category */}
              <div className="relative aspect-video overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                <img
                  src={plant.imageUrl}
                  alt={plant.name}
                  className="object-cover w-full h-full group-hover:scale-102 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-white/90 dark:bg-zinc-950/90 text-zinc-800 dark:text-zinc-200 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md backdrop-blur-xs border border-zinc-200/20">
                  {plant.category}
                </span>
              </div>

              {/* Body */}
              <div className="p-6 flex flex-col gap-4 flex-grow">
                <div>
                  <span className="italic text-brand text-xs font-medium uppercase tracking-wider block truncate">
                    {plant.scientificName}
                  </span>
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-white mt-0.5 truncate">
                    {plant.name}
                  </h2>
                </div>

                <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed line-clamp-2 font-light flex-grow">
                  {plant.description}
                </p>

                <div className="h-px bg-zinc-100 dark:bg-zinc-900/60" />

                {/* Actions */}
                <div className="flex items-center justify-between gap-2 mt-auto">
                  <Link
                    href={`/plantas/${plant.slug}`}
                    target="_blank"
                    className="p-2.5 rounded-xl bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors border border-zinc-200/20 shadow-xs"
                    title="Ver ficha pública"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/imprimir-qr?slug=${plant.slug}`}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand/5 hover:bg-brand/10 text-brand text-xs font-bold transition-all border border-brand/10"
                      title="Imprimir código QR"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Etiqueta</span>
                    </Link>

                    <Link
                      href={`/admin/editar-planta/${plant.slug}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-850 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white text-xs font-bold transition-all"
                      title="Editar ficha"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Editar</span>
                    </Link>

                    <button
                      onClick={() => handleDelete(plant.slug, plant.name)}
                      disabled={isDeleting === plant.slug}
                      className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/20 dark:text-rose-450 dark:hover:bg-rose-950/40 transition-colors border border-rose-100/30 cursor-pointer disabled:opacity-50"
                      title="Eliminar planta"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-900 rounded-3xl p-16 text-center shadow-xs flex flex-col items-center justify-center gap-4">
          <Sprout className="w-16 h-16 text-zinc-350 dark:text-zinc-700 animate-pulse" />
          <h3 className="text-xl font-bold text-zinc-850 dark:text-white mt-2">No se encontraron plantas</h3>
          <p className="text-zinc-550 dark:text-zinc-400 text-sm max-w-md font-light leading-relaxed">
            Prueba a buscar otro término o pulsa en "Añadir Planta" para crear una nueva ficha desde cero.
          </p>
          <button
            onClick={resetFilters}
            className="mt-2 text-xs font-bold text-brand hover:underline cursor-pointer"
          >
            Limpiar filtros y buscador
          </button>
        </div>
      )}
    </div>
  );
}
