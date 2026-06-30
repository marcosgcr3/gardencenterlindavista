"use client";

import React, { useState, useEffect, use, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  Plus,
  Trash2,
  Sparkles,
  Sun,
  Droplet,
  Eye,
  Settings2,
  Copy,
  Check,
  AlertCircle,
  UploadCloud,
  Loader2,
  FileImage
} from "lucide-react";
import { plants, Plant } from "@/data/plants";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function EditarPlantaPage({ params }: PageProps) {
  const router = useRouter();
  const { slug } = use(params);

  const [isLoading, setIsLoading] = useState(true);
  const [plantFound, setPlantFound] = useState(true);

  // Form State
  const [name, setName] = useState("");
  const [scientificName, setScientificName] = useState("");
  const [category, setCategory] = useState("Interior");
  const [difficulty, setDifficulty] = useState("Bajo");
  const [description, setDescription] = useState("");
  const [light, setLight] = useState("");
  const [temp, setTemp] = useState("");
  const [humidity, setHumidity] = useState("");
  
  // Watering
  const [waterGeneral, setWaterGeneral] = useState("");
  const [waterSummer, setWaterSummer] = useState("");
  const [waterWinter, setWaterWinter] = useState("");

  // Care and diseases
  const [care, setCare] = useState("");
  const [diseases, setDiseases] = useState("");
  
  // Image URL
  const [imageUrl, setImageUrl] = useState("");
  
  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Hidden/Extra metrics we want to preserve
  const [wateringLevel, setWateringLevel] = useState(2);
  const [sunLevel, setSunLevel] = useState(2);
  const [tempLevel, setTempLevel] = useState(60);
  const [funFact, setFunFact] = useState("");

  // Characteristics list
  const [charInput, setCharInput] = useState("");
  const [characteristics, setCharacteristics] = useState<string[]>([]);

  // Submission & Modal States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showFallbackModal, setShowFallbackModal] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [copied, setCopied] = useState(false);

  // Load plant details
  useEffect(() => {
    let activePlants = [...plants];
    
    // Load local plants too
    if (typeof window !== "undefined") {
      const local = localStorage.getItem("local_plants");
      if (local) {
        try {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed)) {
            parsed.forEach((localPlant: Plant) => {
              const idx = activePlants.findIndex(p => p.slug === localPlant.slug);
              if (idx !== -1) {
                activePlants[idx] = localPlant;
              } else {
                activePlants.push(localPlant);
              }
            });
          }
        } catch (e) {
          console.error(e);
        }
      }
    }

    const currentPlant = activePlants.find(p => p.slug === slug);
    if (currentPlant) {
      setName(currentPlant.name);
      setScientificName(currentPlant.scientificName);
      setCategory(currentPlant.category);
      setDifficulty(currentPlant.difficulty);
      setDescription(currentPlant.description);
      setLight(currentPlant.light);
      setTemp(currentPlant.temperature || "15°C - 25°C");
      setHumidity(currentPlant.humidity || "Media");
      
      setWaterGeneral(currentPlant.watering?.general || "Moderado");
      setWaterSummer(currentPlant.watering?.summer || "Cada 3-4 días");
      setWaterWinter(currentPlant.watering?.winter || "Cada 10-12 días");
      
      setCare(currentPlant.care);
      setDiseases(currentPlant.diseases);
      setImageUrl(currentPlant.imageUrl);
      setCharacteristics(currentPlant.characteristics || []);

      setWateringLevel(currentPlant.wateringLevel || 2);
      setSunLevel(currentPlant.sunLevel || 2);
      setTempLevel(currentPlant.tempLevel || 60);
      setFunFact(currentPlant.funFact || "");
      
      setPlantFound(true);
    } else {
      setPlantFound(false);
    }
    setIsLoading(false);
  }, [slug]);

  const addCharacteristic = () => {
    if (charInput.trim()) {
      setCharacteristics([...characteristics, charInput.trim()]);
      setCharInput("");
    }
  };

  const removeCharacteristic = (index: number) => {
    setCharacteristics(characteristics.filter((_, i) => i !== index));
  };

  // Handle local file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("El archivo excede el límite de 10MB.");
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setFilePreview(url);
    setImageUrl(`Archivo local: ${file.name}`);
  };

  // Generate copyable code for fallback modal
  const generateTypeScriptCode = () => {
    return `  {
    slug: "${slug}",
    name: "${name}",
    scientificName: "${scientificName}",
    category: "${category}",
    description: "${description}",
    characteristics: [
      ${characteristics.map(c => `"${c}"`).join(",\n      ")}
    ],
    care: "${care}",
    diseases: "${diseases}",
    watering: {
      summer: "${waterSummer || "Riego regular"}",
      winter: "${waterWinter || "Riego reducido"}",
      general: "${waterGeneral}"
    },
    light: "${light}",
    difficulty: "${difficulty}",
    imageUrl: "${imageUrl}",
    temperature: "${temp}",
    humidity: "${humidity}",
    wateringLevel: ${wateringLevel},
    sunLevel: ${sunLevel},
    tempLevel: ${tempLevel},
    funFact: "${funFact}"
  }`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    let currentImageUrl = imageUrl;

    // 1. Upload local file if one was selected
    if (selectedFile) {
      setIsUploadingImage(true);
      const savedPassword = localStorage.getItem("gclv_admin_pass") || "";
      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        const uploadRes = await fetch("/api/admin/plants/upload", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${savedPassword}`
          },
          body: formData
        });

        const uploadData = await uploadRes.json();
        if (uploadRes.ok && uploadData.imageUrl) {
          currentImageUrl = uploadData.imageUrl;
          setImageUrl(currentImageUrl);
        } else {
          throw new Error(uploadData.error || "Fallo en la subida de imagen");
        }
      } catch (err: any) {
        console.error("Error uploading image:", err);
        setErrorMsg("Error al subir la imagen al servidor. ¿Contraseña correcta?");
        setIsSubmitting(false);
        setIsUploadingImage(false);
        return;
      } finally {
        setIsUploadingImage(false);
      }
    }

    const plantPayload = {
      originalSlug: slug,
      name,
      scientificName,
      category,
      difficulty,
      description,
      light,
      temperature: temp,
      humidity,
      watering: {
        general: waterGeneral,
        summer: waterSummer || "Riego regular según calor",
        winter: waterWinter || "Riego reducido al mínimo"
      },
      care,
      diseases,
      imageUrl: currentImageUrl,
      characteristics,
      wateringLevel,
      sunLevel,
      tempLevel,
      funFact
    };

    const adminPass = typeof window !== "undefined" ? localStorage.getItem("gclv_admin_pass") || "" : "";
    try {
      const response = await fetch("/api/plants", {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${adminPass}`
        },
        body: JSON.stringify(plantPayload)
      });

      const data = await response.json();

      if (response.ok) {
        // Update in localStorage
        const existingLocal = localStorage.getItem("local_plants") || "[]";
        let localPlants = [];
        try {
          localPlants = JSON.parse(existingLocal);
        } catch (e) {
          localPlants = [];
        }
        localPlants = localPlants.filter((p: any) => p.slug !== slug);
        localPlants.push({ ...plantPayload, slug });
        localStorage.setItem("local_plants", JSON.stringify(localPlants));

        // Redirect to admin plants catalog list
        router.push("/admin/plantas");
      } else {
        console.warn("API write failed, preparing fallback code:", data.error);
        
        // Update in localStorage
        const existingLocal = localStorage.getItem("local_plants") || "[]";
        let localPlants = [];
        try {
          localPlants = JSON.parse(existingLocal);
        } catch (e) {
          localPlants = [];
        }
        localPlants = localPlants.filter((p: any) => p.slug !== slug);
        localPlants.push({ ...plantPayload, slug });
        localStorage.setItem("local_plants", JSON.stringify(localPlants));

        setGeneratedCode(generateTypeScriptCode());
        setShowFallbackModal(true);
      }
    } catch (err: any) {
      setErrorMsg("Error de conexión. Se guardó una copia en la sesión local del navegador.");
      
      // Update in localStorage
      const existingLocal = localStorage.getItem("local_plants") || "[]";
      let localPlants = JSON.parse(existingLocal);
      localPlants = localPlants.filter((p: any) => p.slug !== slug);
      localPlants.push({ ...plantPayload, slug });
      localStorage.setItem("local_plants", JSON.stringify(localPlants));

      setGeneratedCode(generateTypeScriptCode());
      setShowFallbackModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "Bajo": return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-200/50";
      case "Medio": return "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border-amber-200/50";
      case "Alto": return "bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 border-rose-200/50";
      default: return "bg-zinc-50 text-zinc-700";
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-10 h-10 text-brand animate-spin" />
        <span className="text-sm text-zinc-500 font-light">Cargando datos de la planta...</span>
      </div>
    );
  }

  if (!plantFound) {
    return (
      <div className="bg-white dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-900 rounded-3xl p-16 text-center shadow-xs flex flex-col items-center justify-center gap-4">
        <AlertCircle className="w-16 h-16 text-rose-500 animate-bounce" />
        <h3 className="text-xl font-bold text-zinc-850 dark:text-white mt-2">Planta no encontrada</h3>
        <p className="text-zinc-550 dark:text-zinc-400 text-sm max-w-md font-light leading-relaxed">
          No se pudo encontrar ninguna planta con el identificador <code className="font-mono bg-zinc-100 dark:bg-zinc-900 px-1 py-0.5 rounded text-brand">{slug}</code>.
        </p>
        <button
          onClick={() => router.push("/admin/plantas")}
          className="mt-2 bg-brand text-white text-xs font-bold px-4 py-2 rounded-xl"
        >
          Volver a la lista
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20 animate-fade-in">
      
      {/* Left Column: Form */}
      <form onSubmit={handleSubmit} className="lg:col-span-8 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-3xl p-6 sm:p-10 shadow-sm flex flex-col gap-6">
        <div className="flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-900 pb-5">
          <span className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center shrink-0">
            <Settings2 className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white">Editar Ficha de Planta</h1>
            <p className="text-zinc-500 text-xs sm:text-sm font-light mt-0.5">Modifica los detalles y cuidados de la planta.</p>
          </div>
        </div>

        {errorMsg && (
          <div className="bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 p-4 rounded-xl border border-rose-100/50 flex items-center gap-3 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Section 1: Identity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase">Nombre Común</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:border-brand text-zinc-800 dark:text-zinc-200"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase">Nombre Científico</label>
            <input
              type="text"
              required
              value={scientificName}
              onChange={(e) => setScientificName(e.target.value)}
              className="px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:border-brand text-zinc-800 dark:text-zinc-200"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase">Categoría</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:border-brand text-zinc-800 dark:text-zinc-200"
            >
              <option value="Interior">Interior</option>
              <option value="Exterior">Exterior</option>
              <option value="Suculentas">Suculentas</option>
              <option value="Árboles">Árboles y Arbustos</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase">Dificultad de Cuidado</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className="px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:border-brand text-zinc-800 dark:text-zinc-200"
            >
              <option value="Bajo">Bajo</option>
              <option value="Medio">Medio</option>
              <option value="Alto">Alto</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase">Breve Descripción</label>
          <textarea
            required
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:border-brand text-zinc-800 dark:text-zinc-200"
          />
        </div>

        <div className="h-px bg-zinc-100 dark:bg-zinc-900" />

        {/* Section 2: Care metrics */}
        <h2 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Parámetros de Cuidado</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase">Iluminación</label>
            <input
              type="text"
              required
              value={light}
              onChange={(e) => setLight(e.target.value)}
              className="px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:border-brand text-zinc-800 dark:text-zinc-200"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase">Temperatura</label>
            <input
              type="text"
              required
              value={temp}
              onChange={(e) => setTemp(e.target.value)}
              className="px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:border-brand text-zinc-800 dark:text-zinc-200"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase">Humedad</label>
            <input
              type="text"
              required
              value={humidity}
              onChange={(e) => setHumidity(e.target.value)}
              className="px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:border-brand text-zinc-800 dark:text-zinc-200"
            />
          </div>
        </div>

        {/* Section 3: Watering Plan */}
        <h2 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Plan de Riego</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase">Riego General</label>
            <input
              type="text"
              required
              value={waterGeneral}
              onChange={(e) => setWaterGeneral(e.target.value)}
              className="px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:border-brand text-zinc-800 dark:text-zinc-200"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase">Primavera - Verano</label>
            <input
              type="text"
              required
              value={waterSummer}
              onChange={(e) => setWaterSummer(e.target.value)}
              className="px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:border-brand text-zinc-800 dark:text-zinc-200"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase">Otoño - Invierno</label>
            <input
              type="text"
              required
              value={waterWinter}
              onChange={(e) => setWaterWinter(e.target.value)}
              className="px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:border-brand text-zinc-800 dark:text-zinc-200"
            />
          </div>
        </div>

        <div className="h-px bg-zinc-100 dark:bg-zinc-900" />

        {/* Section 4: Care details and diseases */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase">Cuidados Recomendados</label>
            <textarea
              required
              rows={3}
              value={care}
              onChange={(e) => setCare(e.target.value)}
              className="px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:border-brand text-zinc-800 dark:text-zinc-200"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase">Enfermedades y Plagas</label>
            <textarea
              required
              rows={3}
              value={diseases}
              onChange={(e) => setDiseases(e.target.value)}
              className="px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:border-brand text-zinc-800 dark:text-zinc-200"
            />
          </div>
        </div>

        {/* Section 4.5: Extras / Metricas (Preservar o ajustar) */}
        <h2 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Parámetros Gráficos y Extras</h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase">Nivel de Riego (1-3)</label>
            <input
              type="number"
              min={1}
              max={3}
              required
              value={wateringLevel}
              onChange={(e) => setWateringLevel(Number(e.target.value))}
              className="px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:border-brand text-zinc-800 dark:text-zinc-200"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase">Nivel de Sol (1-3)</label>
            <input
              type="number"
              min={1}
              max={3}
              required
              value={sunLevel}
              onChange={(e) => setSunLevel(Number(e.target.value))}
              className="px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:border-brand text-zinc-800 dark:text-zinc-200"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase">Temp. Indicador (0-100)</label>
            <input
              type="number"
              min={0}
              max={100}
              required
              value={tempLevel}
              onChange={(e) => setTempLevel(Number(e.target.value))}
              className="px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:border-brand text-zinc-800 dark:text-zinc-200"
            />
          </div>

          <div className="flex flex-col gap-2 sm:col-span-1">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase">Dato Curioso / Dato Extra</label>
            <input
              type="text"
              value={funFact}
              placeholder="Ej. Purifica toxinas..."
              onChange={(e) => setFunFact(e.target.value)}
              className="px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:border-brand text-zinc-800 dark:text-zinc-200"
            />
          </div>
        </div>

        <div className="h-px bg-zinc-100 dark:bg-zinc-900" />

        {/* Section 5: Image Setup (URL and File Upload) */}
        <h2 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Imagen de la Planta</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* File input drag and drop styling */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase">Subir desde el ordenador</label>
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 hover:border-brand rounded-2xl p-6 text-center cursor-pointer transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900/30 flex flex-col items-center justify-center gap-3 relative min-h-[140px]"
            >
              {filePreview ? (
                <div className="relative w-full h-28 rounded-lg overflow-hidden">
                  <img src={filePreview} alt="Preview" className="object-contain w-full h-full" />
                </div>
              ) : (
                <>
                  <UploadCloud className="w-8 h-8 text-zinc-400" />
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Elige un archivo local</span>
                    <span className="text-[10px] text-zinc-400">JPG, PNG, WEBP o GIF (Máx. 10MB)</span>
                  </div>
                </>
              )}
              
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            {selectedFile && (
              <span className="text-[10px] text-zinc-500 truncate max-w-[250px]">
                Seleccionado: {selectedFile.name}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase">O introducir URL de Imagen</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setSelectedFile(null);
                  setFilePreview(null);
                }}
                className="px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:border-brand text-zinc-800 dark:text-zinc-200"
              />
            </div>
            <div className="flex flex-col gap-1 text-[11px] text-zinc-400 font-light leading-relaxed">
              <FileImage className="w-3.5 h-3.5 inline mr-1 text-brand shrink-0" />
              <span>Si subes un archivo local, este reemplazará automáticamente la URL escrita al guardar la planta.</span>
            </div>
          </div>
        </div>

        <div className="h-px bg-zinc-100 dark:bg-zinc-900" />

        {/* Section 6: Characteristics list editor */}
        <div className="flex flex-col gap-3">
          <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase">Rasgos / Características de la Ficha</label>
          
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Añade un rasgo (ej. Hojas de color verde intenso)"
              value={charInput}
              onChange={(e) => setCharInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCharacteristic(); } }}
              className="flex-grow px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:border-brand text-zinc-800 dark:text-zinc-200"
            />
            <button
              type="button"
              onClick={addCharacteristic}
              className="bg-brand hover:bg-brand-dark text-white p-3 rounded-xl transition-colors shrink-0"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <ul className="flex flex-col gap-2 mt-2">
            {characteristics.map((char, index) => (
              <li key={index} className="flex justify-between items-center gap-4 bg-zinc-50/50 dark:bg-zinc-900/10 border border-zinc-100 dark:border-zinc-900/50 px-4 py-2.5 rounded-xl text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
                <span className="truncate">{char}</span>
                <button
                  type="button"
                  onClick={() => removeCharacteristic(index)}
                  className="text-zinc-400 hover:text-rose-500 transition-colors p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <button
            type="button"
            onClick={() => router.push("/admin/plantas")}
            className="sm:w-1/3 bg-zinc-100 hover:bg-zinc-150 text-zinc-700 font-bold py-4 px-6 rounded-2xl transition-all text-center cursor-pointer text-sm"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isUploadingImage}
            className="flex-grow bg-brand hover:bg-brand-dark text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 shadow-md shadow-brand/10 hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{isUploadingImage ? "Subiendo Imagen..." : "Guardando Cambios..."}</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Guardar Cambios</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Right Column: Live Preview */}
      <aside className="lg:col-span-4 lg:sticky lg:top-28 flex flex-col gap-6">
        <div className="flex items-center gap-2 text-zinc-500 font-semibold text-sm">
          <Eye className="w-4 h-4" />
          <span>Vista Previa de Tarjeta</span>
        </div>

        <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-3xl overflow-hidden shadow-md flex flex-col w-full">
          <div className="relative aspect-video overflow-hidden bg-zinc-100 dark:bg-zinc-900">
            <img
              src={filePreview || imageUrl || "https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=600&auto=format&fit=crop"}
              alt={name || "Previsualización"}
              className="object-cover w-full h-full"
            />
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 items-start">
              <span className="bg-white/95 dark:bg-zinc-950/95 text-zinc-800 dark:text-zinc-200 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md backdrop-blur-sm border border-zinc-200/20 w-fit">
                {category}
              </span>
              <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md backdrop-blur-sm w-fit ${getDifficultyColor(difficulty)}`}>
                Dificultad: {difficulty}
              </span>
            </div>
          </div>

          <div className="p-6 flex flex-col gap-4">
            <div>
              <span className="italic text-brand text-xs font-semibold uppercase tracking-wider block truncate">
                {scientificName || "Nombre científico"}
              </span>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-1 truncate">
                {name || "Nombre común"}
              </h2>
            </div>

            <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed line-clamp-3 font-light">
              {description || "Escribe una descripción para ver cómo se encuadra en la tarjeta."}
            </p>

            <div className="h-px bg-zinc-100 dark:bg-zinc-900/60" />

            <div className="grid grid-cols-2 gap-4 text-xs font-medium text-zinc-500 dark:text-zinc-400 py-1">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-brand shrink-0" />
                <span className="truncate">{light || "Iluminación"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Droplet className="w-4 h-4 text-brand shrink-0" />
                <span className="truncate">{waterGeneral || "Riego"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/40 dark:bg-zinc-900/20 border border-dashed border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-5 flex items-start gap-3 text-xs leading-relaxed text-zinc-500 font-light">
          <Sparkles className="w-4 h-4 text-brand shrink-0 mt-0.5" />
          <div>
            Estás editando una ficha de planta existente. El identificador permanente de URL (`slug`) se mantendrá idéntico para que todas las etiquetas físicas de códigos QR impresas sigan funcionando.
          </div>
        </div>
      </aside>

      {/* Fallback Copy/Paste Modal */}
      {showFallbackModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-900 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl flex flex-col gap-6 animate-slide-up">
            <div className="flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-900 pb-4">
              <span className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-500 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Persistencia Manual (Servidor Remoto)</h3>
                <p className="text-zinc-500 text-xs mt-0.5">El archivo local es de solo lectura en este entorno de producción.</p>
              </div>
            </div>

            <p className="text-zinc-650 dark:text-zinc-400 text-sm leading-relaxed font-light">
              ¡Los cambios de la planta se han guardado en la memoria de este navegador! Para guardarlos permanentemente en el código de tu repositorio en producción, copia el siguiente fragmento de código y utilízalo para reemplazar la entrada correspondiente de la planta en el archivo <code className="font-mono bg-zinc-100 dark:bg-zinc-900 text-xs px-1.5 py-0.5 rounded text-brand">src/data/plants.ts</code>:
            </p>

            <div className="relative bg-zinc-900 dark:bg-zinc-900/60 rounded-xl border border-zinc-800 p-4 max-h-60 overflow-y-auto text-zinc-300 font-mono text-xs leading-relaxed select-all">
              <button
                type="button"
                onClick={handleCopyCode}
                className="absolute top-3 right-3 bg-zinc-800/80 hover:bg-zinc-700 hover:scale-103 text-white p-2 rounded-lg transition-all"
                title="Copiar código"
              >
                {copied ? <Check className="w-4 h-4 text-brand" /> : <Copy className="w-4 h-4" />}
              </button>
              <pre className="whitespace-pre">{generatedCode}</pre>
            </div>

            <button
              onClick={() => {
                setShowFallbackModal(false);
                router.push("/admin/plantas");
              }}
              className="w-full bg-zinc-950 hover:bg-zinc-900 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-bold py-3.5 rounded-2xl transition-all duration-300 cursor-pointer text-center"
            >
              Entendido y Volver al Panel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
