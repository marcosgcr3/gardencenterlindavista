import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Helper for Authentication
const checkAuth = (request: Request) => {
  const authHeader = request.headers.get("Authorization");
  const EXPECTED_PASSWORD = process.env.ADMIN_PASSWORD || process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "lindavista2026";
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false;
  }
  const token = authHeader.substring(7);
  return token === EXPECTED_PASSWORD;
};

// GET /api/plants
export async function GET() {
  try {
    const plantsList = await prisma.plant.findMany({
      orderBy: { id: "asc" }
    });
    return NextResponse.json(plantsList);
  } catch (error: any) {
    console.error("Error al obtener plantas de la BD:", error);
    return NextResponse.json({ error: "Error al obtener catálogo" }, { status: 500 });
  }
}

// POST /api/plants
export async function POST(request: Request) {
  try {
    if (!checkAuth(request)) {
      return NextResponse.json({ error: "No autorizado. Acceso denegado." }, { status: 401 });
    }

    const body = await request.json();

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
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
    }

    const slug = body.name
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const newPlant = await prisma.plant.create({
      data: {
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
          general: body.watering.general
        },
        light: body.light,
        difficulty: body.difficulty,
        imageUrl: body.imageUrl || "https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=600&auto=format&fit=crop",
        temperature: body.temperature || "15°C - 25°C",
        humidity: body.humidity || "Media",
        wateringLevel: Number(body.wateringLevel) || 2,
        sunLevel: Number(body.sunLevel) || 2,
        tempLevel: Number(body.tempLevel) || 60,
        funFact: body.funFact || "",
      }
    });

    return NextResponse.json({ success: true, plant: newPlant });
  } catch (error: any) {
    console.error("Error al crear planta en la BD:", error);
    return NextResponse.json({ error: `Error en el servidor: ${error.message}` }, { status: 500 });
  }
}

// PUT /api/plants
export async function PUT(request: Request) {
  try {
    if (!checkAuth(request)) {
      return NextResponse.json({ error: "No autorizado. Acceso denegado." }, { status: 401 });
    }

    const body = await request.json();

    if (!body.originalSlug) {
      return NextResponse.json({ error: "Falta el slug original" }, { status: 400 });
    }

    const plant = await prisma.plant.findUnique({
      where: { slug: body.originalSlug }
    });

    if (!plant) {
      return NextResponse.json({ error: "No se encontró la planta especificada" }, { status: 404 });
    }

    const updatedPlant = await prisma.plant.update({
      where: { slug: body.originalSlug },
      data: {
        name: body.name || plant.name,
        scientificName: body.scientificName || plant.scientificName,
        category: body.category || plant.category,
        description: body.description || plant.description,
        characteristics: body.characteristics || plant.characteristics || [],
        care: body.care || plant.care,
        diseases: body.diseases || plant.diseases,
        watering: {
          summer: body.watering?.summer || (plant.watering as any)?.summer,
          winter: body.watering?.winter || (plant.watering as any)?.winter,
          general: body.watering?.general || (plant.watering as any)?.general
        },
        light: body.light || plant.light,
        difficulty: body.difficulty || plant.difficulty,
        imageUrl: body.imageUrl || plant.imageUrl,
        temperature: body.temperature || plant.temperature,
        humidity: body.humidity || plant.humidity,
        wateringLevel: body.wateringLevel !== undefined ? Number(body.wateringLevel) : plant.wateringLevel,
        sunLevel: body.sunLevel !== undefined ? Number(body.sunLevel) : plant.sunLevel,
        tempLevel: body.tempLevel !== undefined ? Number(body.tempLevel) : plant.tempLevel,
        funFact: body.funFact !== undefined ? body.funFact : plant.funFact
      }
    });

    return NextResponse.json({ success: true, plant: updatedPlant });
  } catch (error: any) {
    console.error("Error al actualizar planta en la BD:", error);
    return NextResponse.json({ error: `Error en el servidor: ${error.message}` }, { status: 500 });
  }
}

// DELETE /api/plants
export async function DELETE(request: Request) {
  try {
    if (!checkAuth(request)) {
      return NextResponse.json({ error: "No autorizado. Acceso denegado." }, { status: 401 });
    }

    const body = await request.json();

    if (!body.slug) {
      return NextResponse.json({ error: "Falta el slug" }, { status: 400 });
    }

    await prisma.plant.delete({
      where: { slug: body.slug }
    });

    return NextResponse.json({ success: true, message: "Planta eliminada correctamente" });
  } catch (error: any) {
    console.error("Error al eliminar planta de la BD:", error);
    return NextResponse.json({ error: `Error en el servidor: ${error.message}` }, { status: 500 });
  }
}
