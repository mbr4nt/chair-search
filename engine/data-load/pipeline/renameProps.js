export async function renameProp(model) {
    let processed = {};
    for(let key in model) {
        processed[rename(key)] = model[key];
    }
    return processed;
}

function rename(propName) {
  switch (propName) {
    case 'uSDPrice':
      return 'usdPrice';
    case 'cADPrice':
      return 'cadPrice';
    case 'uSDCatalogue':
      return 'usdCatalogue';
    case 'cADCatalogue':
      return 'cadCatalogue';
    default:
      return propName;
  }
}
  