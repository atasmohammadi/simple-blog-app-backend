import fs from "fs-extra";
import path from "path";

const DATA_PATH = path.join(__dirname, "../data");

async function readDbFile(filename: string) {
  try {
    const filePath = path.join(DATA_PATH, filename);
    const data = await fs.readJson(filePath);
    return data;
  } catch (error) {
    console.error(`Error reading the database file: ${filename}`, error);
    throw error;
  }
}

async function writeDbFile(filename: string, data: any) {
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
