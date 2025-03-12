import { deleteData } from "./deleteData.js";
import { requestAndWait } from "./requestAndWait.js";

export async function indexData(models, currency) {
    // /await deleteData();
    const index = {
        key: `${currency}`
    };

    const url = `/indexes/${index.key}/documents`;
    const verb = "PUT";
    const body = models;
    const bearerToken = process.env.MEILI_MASTER_KEY;
    const categoriesToFilter = ["categories", "series", "price", "armType", "baseType", "backMaterial", "backHeight", "tilterProp"];

    try {
        let response = await requestAndWait(url, verb, body, bearerToken);
        console.log("index response", response);
        response = await requestAndWait(`/indexes/${index.key}/settings/filterable-attributes`, "PUT", categoriesToFilter, bearerToken);
        console.log("filterable-attributes response", response);

    } catch (error) {
        console.error("Request failed:", error.message);
    }
}
