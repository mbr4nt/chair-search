export async function transformPriceToNumber(model) {
    model.usdPrice = parseFloat(model.usdPrice);
    model.cadPrice = parseFloat(model.cadPrice);
    return model;
}  