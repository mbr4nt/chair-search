export async function transformPriceToNumber(model) {
    model.price = parseFloat(model.price);
    return model;
}  