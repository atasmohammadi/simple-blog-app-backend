import fs from "fs-extra";
import path from "path";

const DATA_PATH = path.join(__dirname, "../data");

async function ensureDataDirExists() {
  try {
    await fs.ensureDir(DATA_PATH); // Create data directory if it doesn't exist
  } catch (error) {
    // Ignore errors if directory already exists
    if ((error as NodeJS.ErrnoException).code !== "EEXIST") {
      console.error("Error creating data directory:", error);
      throw error;
    }
  }
}

async function readDbFile(filename: string) {
  await ensureDataDirExists(); // Ensure data directory exists
  const filePath = path.join(DATA_PATH, filename);
  try {
    const data = await fs.readJson(filePath);
    return data;
  } catch (error) {
    // If file doesn't exist, create an empty file and return null
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      await fs.writeJson(filePath, {}, { spaces: 2 }); // Create empty file
      return null;
    } else {
      console.error(`Error reading the database file: ${filename}`, error);
      throw error;
    }
  }
}

async function writeDbFile(filename: string, data: any) {
  await ensureDataDirExists(); // Ensure data directory exists
  try {
    const filePath = path.join(DATA_PATH, filename);
    await fs.writeJson(filePath, data, { spaces: 2 });
  } catch (error) {
    console.error(`Error writing the database file: ${filename}`, error);
    throw error;
  }
}

export const db = {
  readDbFile,
  writeDbFile,
};
