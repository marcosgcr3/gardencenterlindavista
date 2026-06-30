import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    // Verificar autenticación
    const authHeader = request.headers.get("Authorization");
    const EXPECTED_PASSWORD = process.env.ADMIN_PASSWORD || process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "lindavista2026";
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "No autorizado. Acceso denegado." },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    if (token !== EXPECTED_PASSWORD) {
      return NextResponse.json(
        { error: "No autorizado. Contraseña incorrecta." },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validar campos obligatorios
    if (
      !body.name ||
      !body.scientificName ||
      !body.category ||
      !body.description ||
      !body.care ||
      !body.diseases ||
      !body.watering ||
      !body.watering.summer ||
      !body.watering.winter ||
      !body.watering.general ||
      !body.light ||
      !body.difficulty
    ) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios en el formulario" },
        { status: 400 }
      );
    }

    // Generar slug a partir del nombre
    const slug = body.name
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
      .replace(/[^\w\s-]/g, "") // Eliminar caracteres especiales
      .replace(/[\s_]+/g, "-") // Reemplazar espacios por guiones
      .replace(/^-+|-+$/g, ""); // Eliminar guiones al inicio/fin

    const newPlant = {
      slug,
      name: body.name,
      scientificName: body.scientificName,
      category: body.category,
      description: body.description,
      characteristics: body.characteristics || [],
      care: body.care,
      diseases: body.diseases,
      watering: {
        summer: body.watering.summer,
        winter: body.watering.winter,
        general: body.watering.general,
      },
      light: body.light,
      difficulty: body.difficulty,
      imageUrl: body.imageUrl || "https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=600&auto=format&fit=crop",
      temperature: body.temperature || "15°C - 25°C",
      humidity: body.humidity || "Media",
    };

    // Ruta física de plants.ts
    const filePath = path.join(process.cwd(), "src", "data", "plants.ts");

    // Leer el archivo existente
    const fileContent = await fs.readFile(filePath, "utf-8");

    // Buscar el final del array "plants" (el último ];)
    const lastIndex = fileContent.lastIndexOf("];");
    if (lastIndex === -1) {
      return NextResponse.json(
        { error: "No se pudo encontrar la estructura del catálogo en plants.ts" },
        { status: 500 }
      );
    }

    // Formatear el nuevo objeto para insertarlo
    const newPlantString = `,\n  {\n    slug: "${newPlant.slug}",\n    name: "${newPlant.name}",\n    scientificName: "${newPlant.scientificName}",\n    category: "${newPlant.category}",\n    description: "${newPlant.description}",\n    characteristics: [\n      ${newPlant.characteristics.map((char: string) => `"${char}"`).join(",\n      ")}\n    ],\n    care: "${newPlant.care}",\n    diseases: "${newPlant.diseases}",\n    watering: {\n      summer: "${newPlant.watering.summer}",\n      winter: "${newPlant.watering.winter}",\n      general: "${newPlant.watering.general}"\n    },\n    light: "${newPlant.light}",\n    difficulty: "${newPlant.difficulty}",\n    imageUrl: "${newPlant.imageUrl}",\n    temperature: "${newPlant.temperature}",\n    humidity: "${newPlant.humidity}"\n  }`;

    // Construir el nuevo contenido del archivo
    const updatedContent = 
      fileContent.slice(0, lastIndex) + 
      newPlantString + 
      "\n" + 
      fileContent.slice(lastIndex);

    // Escribir en el archivo
    await fs.writeFile(filePath, updatedContent, "utf-8");

    return NextResponse.json({ success: true, plant: newPlant });
  } catch (error: any) {
    console.error("Error al escribir nueva planta en plants.ts:", error);
    return NextResponse.json(
      { error: `Error en el servidor: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    // 1. Verify authentication
    const authHeader = request.headers.get("Authorization");
    const EXPECTED_PASSWORD = process.env.ADMIN_PASSWORD || process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "lindavista2026";
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No autorizado. Acceso denegado." }, { status: 401 });
    }

    const token = authHeader.substring(7);
    if (token !== EXPECTED_PASSWORD) {
      return NextResponse.json({ error: "No autorizado. Contraseña incorrecta." }, { status: 401 });
    }

    const body = await request.json();

    if (!body.originalSlug) {
      return NextResponse.json({ error: "Falta el slug original de la planta a editar" }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), "src", "data", "plants.ts");
    const fileContent = await fs.readFile(filePath, "utf-8");

    const startToken = "export const plants: Plant[] = [";
    const startIndex = fileContent.indexOf(startToken);

    if (startIndex === -1) {
      return NextResponse.json({ error: "No se pudo encontrar la estructura del catálogo en plants.ts" }, { status: 500 });
    }

    const arrayCode = fileContent.slice(startIndex + "export const plants: Plant[] =".length).trim();
    const cleanedCode = arrayCode.endsWith(";") ? arrayCode.slice(0, -1) : arrayCode;

    let plantsList: any[] = [];
    try {
      plantsList = new Function(`return ${cleanedCode}`)();
    } catch (e: any) {
      return NextResponse.json({ error: `Error al parsear el catálogo: ${e.message}` }, { status: 500 });
    }

    const index = plantsList.findIndex((p: any) => p.slug === body.originalSlug);
    if (index === -1) {
      return NextResponse.json({ error: "No se encontró la planta especificada en el catálogo" }, { status: 404 });
    }

    // Update fields while preserving values that may not be in the form
    const updatedPlant = {
      ...plantsList[index],
      name: body.name || plantsList[index].name,
      scientificName: body.scientificName || plantsList[index].scientificName,
      category: body.category || plantsList[index].category,
      description: body.description || plantsList[index].description,
      characteristics: body.characteristics || plantsList[index].characteristics || [],
      care: body.care || plantsList[index].care,
      diseases: body.diseases || plantsList[index].diseases,
      watering: {
        summer: body.watering?.summer || plantsList[index].watering?.summer,
        winter: body.watering?.winter || plantsList[index].watering?.winter,
        general: body.watering?.general || plantsList[index].watering?.general
      },
      light: body.light || plantsList[index].light,
      difficulty: body.difficulty || plantsList[index].difficulty,
      imageUrl: body.imageUrl || plantsList[index].imageUrl,
      temperature: body.temperature || plantsList[index].temperature,
      humidity: body.humidity || plantsList[index].humidity,
      wateringLevel: body.wateringLevel !== undefined ? body.wateringLevel : plantsList[index].wateringLevel,
      sunLevel: body.sunLevel !== undefined ? body.sunLevel : plantsList[index].sunLevel,
      tempLevel: body.tempLevel !== undefined ? body.tempLevel : plantsList[index].tempLevel,
      funFact: body.funFact !== undefined ? body.funFact : plantsList[index].funFact
    };

    // Replace the plant in the array
    plantsList[index] = updatedPlant;

    // Serialize and write back
    const updatedFileContent = serializePlants(plantsList);
    await fs.writeFile(filePath, updatedFileContent, "utf-8");

    return NextResponse.json({ success: true, plant: updatedPlant });
  } catch (error: any) {
    console.error("Error al actualizar la planta en plants.ts:", error);
    return NextResponse.json({ error: `Error en el servidor: ${error.message}` }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    // 1. Verify authentication
    const authHeader = request.headers.get("Authorization");
    const EXPECTED_PASSWORD = process.env.ADMIN_PASSWORD || process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "lindavista2026";
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No autorizado. Acceso denegado." }, { status: 401 });
    }

    const token = authHeader.substring(7);
    if (token !== EXPECTED_PASSWORD) {
      return NextResponse.json({ error: "No autorizado. Contraseña incorrecta." }, { status: 401 });
    }

    const body = await request.json();

    if (!body.slug) {
      return NextResponse.json({ error: "Falta el slug de la planta a eliminar" }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), "src", "data", "plants.ts");
    const fileContent = await fs.readFile(filePath, "utf-8");

    const startToken = "export const plants: Plant[] = [";
    const startIndex = fileContent.indexOf(startToken);

    if (startIndex === -1) {
      return NextResponse.json({ error: "No se pudo encontrar la estructura del catálogo en plants.ts" }, { status: 500 });
    }

    const arrayCode = fileContent.slice(startIndex + "export const plants: Plant[] =".length).trim();
    const cleanedCode = arrayCode.endsWith(";") ? arrayCode.slice(0, -1) : arrayCode;

    let plantsList: any[] = [];
    try {
      plantsList = new Function(`return ${cleanedCode}`)();
    } catch (e: any) {
      return NextResponse.json({ error: `Error al parsear el catálogo: ${e.message}` }, { status: 500 });
    }

    const index = plantsList.findIndex((p: any) => p.slug === body.slug);
    if (index === -1) {
      return NextResponse.json({ error: "No se encontró la planta especificada en el catálogo" }, { status: 404 });
    }

    // Filter out the plant
    const updatedPlantsList = plantsList.filter((p: any) => p.slug !== body.slug);

    // Serialize and write back
    const updatedFileContent = serializePlants(updatedPlantsList);
    await fs.writeFile(filePath, updatedFileContent, "utf-8");

    return NextResponse.json({ success: true, message: "Planta eliminada correctamente" });
  } catch (error: any) {
    console.error("Error al eliminar la planta de plants.ts:", error);
    return NextResponse.json({ error: `Error en el servidor: ${error.message}` }, { status: 500 });
  }
}

function serializePlants(plantsList: any[]) {
  const items = plantsList.map(plant => {
    const chars = (plant.characteristics || []).map((c: string) => `      ${JSON.stringify(c)}`).join(",\n");
    return `  {
    slug: ${JSON.stringify(plant.slug)},
    name: ${JSON.stringify(plant.name)},
    scientificName: ${JSON.stringify(plant.scientificName)},
    category: ${JSON.stringify(plant.category)},
    description: ${JSON.stringify(plant.description)},
    characteristics: [
\n${chars}\n    ],
    care: ${JSON.stringify(plant.care)},
    diseases: ${JSON.stringify(plant.diseases)},
    watering: {
      summer: ${JSON.stringify(plant.watering.summer)},
      winter: ${JSON.stringify(plant.watering.winter)},
      general: ${JSON.stringify(plant.watering.general)}
    },
    light: ${JSON.stringify(plant.light)},
    difficulty: ${JSON.stringify(plant.difficulty)},
    imageUrl: ${JSON.stringify(plant.imageUrl)},
    temperature: ${JSON.stringify(plant.temperature)},
    humidity: ${JSON.stringify(plant.humidity)},
    wateringLevel: ${Number(plant.wateringLevel) || 1},
    sunLevel: ${Number(plant.sunLevel) || 1},
    tempLevel: ${Number(plant.tempLevel) || 50},
    funFact: ${JSON.stringify(plant.funFact || "")}
  }`;
  }).join(",\n");

  return `export interface Plant {
  slug: string;
  name: string;
  scientificName: string;
  category: "Interior" | "Exterior" | "Suculentas" | "Árboles";
  description: string;
  characteristics: string[];
  care: string;
  diseases: string;
  watering: {
    summer: string;
    winter: string;
    general: string;
  };
  light: string;
  difficulty: "Bajo" | "Medio" | "Alto";
  imageUrl: string;
  temperature: string;
  humidity: string;
  wateringLevel: number;
  sunLevel: number;
  tempLevel: number;
  funFact: string;
}

export const plants: Plant[] = [
${items}
];
`;
}
