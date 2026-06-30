import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    // 1. Authenticate using Bearer token or custom header
    const authHeader = request.headers.get("Authorization");
    const adminPasswordHeader = request.headers.get("x-admin-password");
    
    const EXPECTED_PASSWORD = process.env.ADMIN_PASSWORD || process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "lindavista2026";
    
    let token = "";
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    } else if (adminPasswordHeader) {
      token = adminPasswordHeader;
    }
    
    if (token !== EXPECTED_PASSWORD) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // 2. Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó ningún archivo" }, { status: 400 });
    }

    // 3. Validate image extension
    const ext = path.extname(file.name).toLowerCase();
    if (!['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext)) {
      return NextResponse.json({ error: "Formato de imagen no soportado (use JPG, PNG, WEBP o GIF)" }, { status: 400 });
    }

    // 4. Generate unique filename
    const timestamp = Date.now();
    const newFilename = `plant_${timestamp}${ext}`;
    const publicDirPath = path.join(process.cwd(), "public", "plants");
    
    // Ensure public/plants folder exists
    await fs.mkdir(publicDirPath, { recursive: true });
    
    const filePath = path.join(publicDirPath, newFilename);
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Write file to public/plants
    await fs.writeFile(filePath, buffer);

    return NextResponse.json({ 
      success: true,
      imageUrl: `/plants/${newFilename}` 
    });
  } catch (error: any) {
    console.error("Error al subir imagen de planta:", error);
    return NextResponse.json({ error: "Error interno del servidor al procesar la subida" }, { status: 500 });
  }
}
