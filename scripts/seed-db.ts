import "dotenv/config";
import { prisma } from "../src/lib/db";
import { plants } from "../src/data/plants";

async function main() {
  console.log("Iniciando sembrado de base de datos...");
  
  for (const plant of plants) {
    console.log(`Sembrando planta: ${plant.name} (${plant.slug})`);
    
    // Convert characteristics to array of strings
    const characteristics = Array.isArray(plant.characteristics) 
      ? plant.characteristics 
      : [];

    await prisma.plant.upsert({
      where: { slug: plant.slug },
      update: {
        name: plant.name,
        scientificName: plant.scientificName,
        category: plant.category,
        description: plant.description,
        characteristics,
        care: plant.care,
        diseases: plant.diseases,
        watering: {
          summer: plant.watering?.summer || "Cada 3-4 días",
          winter: plant.watering?.winter || "Cada 10-12 días",
          general: plant.watering?.general || "Moderado"
        },
        light: plant.light,
        difficulty: plant.difficulty,
        imageUrl: plant.imageUrl,
        temperature: plant.temperature,
        humidity: plant.humidity,
        wateringLevel: Number(plant.wateringLevel) || 2,
        sunLevel: Number(plant.sunLevel) || 2,
        tempLevel: Number(plant.tempLevel) || 60,
        funFact: plant.funFact || "",
      },
      create: {
        slug: plant.slug,
        name: plant.name,
        scientificName: plant.scientificName,
        category: plant.category,
        description: plant.description,
        characteristics,
        care: plant.care,
        diseases: plant.diseases,
        watering: {
          summer: plant.watering?.summer || "Cada 3-4 días",
          winter: plant.watering?.winter || "Cada 10-12 días",
          general: plant.watering?.general || "Moderado"
        },
        light: plant.light,
        difficulty: plant.difficulty,
        imageUrl: plant.imageUrl,
        temperature: plant.temperature,
        humidity: plant.humidity,
        wateringLevel: Number(plant.wateringLevel) || 2,
        sunLevel: Number(plant.sunLevel) || 2,
        tempLevel: Number(plant.tempLevel) || 60,
        funFact: plant.funFact || "",
      }
    });
  }

  console.log("--- ¡SEMBRADO COMPLETADO CON ÉXITO! ---");
}

main()
  .catch((e) => {
    console.error("Error durante el sembrado:", e);
    process.exit(1);
  });
