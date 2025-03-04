import neatCsv from "neat-csv";
import fs from "fs/promises";
import { pipeline } from "./pipeline.js";
import { indexData } from "./indexData.js";
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { waitForMeilisearch } from "./waitForMeilisearch.js";
import { generateCadModel } from "./generateCadModel.js";
import { generateUsdModel } from "./generateUsdModel.js";

// Get the directory name of the current module file
const __dirname = dirname(fileURLToPath(import.meta.url));

// Read CSV file
const csvString = await fs.readFile(join(__dirname, "./input/models.csv"), "utf-8");

// Convert CSV to JSON Object
const jsonObject = await neatCsv(csvString);

let models = [];
for(let model of jsonObject) {
    models.push(await pipeline(model));
}

let processed = {
    models
};

let processedUsd = {
    models: await generateUsdModel(models)
};

let processedCad = {
    models: await generateCadModel(models)
};

// Write JSONObject to file
await fs.writeFile(join(__dirname, "./processed/models.json"), JSON.stringify(processed, null, 2));
await fs.writeFile(join(__dirname, "./processed/models-usd.json"), JSON.stringify(processedUsd, null, 2));
await fs.writeFile(join(__dirname, "./processed/models-cad.json"), JSON.stringify(processedCad, null, 2));

await waitForMeilisearch();

// Push modelsUsd to indexData
await indexData(processedUsd.models, 'usd');

// Push modelsCad to indexData
await indexData(processedCad.models, 'cad');

//await takeDump();

console.log("My job here is done. I now return to the void from whence I came.");