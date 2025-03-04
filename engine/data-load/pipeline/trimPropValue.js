export async function trimPropValue(model) {
    let trimmedModel = {};
    for (let key in model) {
        if (typeof model[key] === 'string') {
            trimmedModel[key] = model[key].trim();
        } else {
            trimmedModel[key] = model[key];
        }
    }
    return trimmedModel;
}  