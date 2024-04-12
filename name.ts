import { compileFromFile } from "json-schema-to-typescript";
import { promises as fs } from "fs";
import path from "path";

// Define the directory where the JSON schemas are located
const SCHEMA_DIR = path.join(__dirname, "../src/schemas");

// Function to convert JSON Schemas to TypeScript definitions
const convertSchemasToTypescript = async () => {
  try {
    // Read the list of files in the schema directory
    const files = await fs.readdir(SCHEMA_DIR);

    // Filter for .json files only
    const jsonSchemas = files.filter((file) => file.endsWith(".json"));

    // Process each JSON Schema file
    for (const fileSchema of jsonSchemas) {
      const filePath = path.join(SCHEMA_DIR, fileSchema);
      const baseName = path.basename(filePath, ".json");

      // Compile the schema to TypeScript definition file
      const tsFileContent = await compileFromFile(filePath, {
        enableConstEnums: true,
        format: true,
        unknownAny: true,
        unreachableDefinitions: true
      });

      // Write the TypeScript file to the destination directory
      const tsFilePath = path.join('src/types', `${baseName}.ts`);
      await fs.writeFile(tsFilePath, tsFileContent, { encoding: "utf-8" });
    }

    console.log("All JSON schemas have been converted to TypeScript definitions.");
  } catch (error) {
    console.error("Error converting JSON schemas to TypeScript:", error);
  }
};

// Execute the conversion
convertSchemasToTypescript();
