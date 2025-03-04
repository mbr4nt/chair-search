export async function generateUsdModel(models) {
    let filteredModel = models.filter(model => model.usdPrice);
    let usdModel = [];
    for(let model of filteredModel) {
        let newModel = {
            ...model,
            price: model.usdPrice,
            catalogue: model.usdCatalogue,
        };
        delete newModel.usdPrice;
        delete newModel.cadPrice;
        delete newModel.usdCatalogue;
        delete newModel.cadCatalogue;
        usdModel.push(newModel);
    }
    return usdModel;
}