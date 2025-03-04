export async function generateCadModel(models) {
    let filteredModel = models.filter(model => model.cadPrice);
    let cadModel = [];
    for(let model of filteredModel) {
        let newModel = {
            ...model,
            price: model.cadPrice,
            catalogue: model.cadCatalogue,
        };
        delete newModel.usdPrice;
        delete newModel.cadPrice;
        delete newModel.usdCatalogue;
        delete newModel.cadCatalogue;
        cadModel.push(newModel);
    }
    return cadModel;
}