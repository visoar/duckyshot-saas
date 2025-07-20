#!/usr/bin/env tsx

import { db } from "@/database";
import { AIStyleService } from "@/lib/database/ai";
import { DEFAULT_AI_STYLES } from "@/lib/ai/styles";

async function seedAIStyles() {
  console.log("🎨 Seeding AI Styles for DuckyShot...");

  try {
    // Upsert all default styles
    for (const style of DEFAULT_AI_STYLES) {
      console.log(`📝 Upserting style: ${style.name} (${style.id})`);
      
      await AIStyleService.upsertStyle({
        id: style.id,
        name: style.name,
        description: style.description,
        category: style.category,
        previewImageUrl: style.previewImageUrl,
        isActive: style.isActive,
        sortOrder: style.sortOrder,
        metadata: style.metadata,
      });
      
      console.log(`✅ Style "${style.name}" upserted successfully`);
    }

    console.log("\n🎉 AI Styles seeding completed!");
    console.log(`📊 Total styles processed: ${DEFAULT_AI_STYLES.length}`);
    
    // Show summary by category
    const categories = [...new Set(DEFAULT_AI_STYLES.map(s => s.category))];
    console.log("\n📋 Styles by category:");
    
    for (const category of categories) {
      const stylesInCategory = DEFAULT_AI_STYLES.filter(s => s.category === category);
      console.log(`  • ${category}: ${stylesInCategory.length} styles`);
    }

  } catch (error) {
    console.error("❌ Error seeding AI styles:", error);
    process.exit(1);
  }
}

// Run the seeder
if (require.main === module) {
  seedAIStyles()
    .then(() => {
      console.log("🏁 Seeding process finished successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Seeding process failed:", error);
      process.exit(1);
    });
}

export { seedAIStyles };