export async function deleteSomeProps(model) {
    //removing some columns we don't want
    delete model.images;
    return model;
}
