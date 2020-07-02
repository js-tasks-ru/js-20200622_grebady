/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export const omit = (obj, ...fields) => {
  let newObj = {}
  let objKeys = Object.keys(obj);
  for (let i = 0; i < fields.length; i++) {
    if (objKeys.includes(fields[i])){
      objKeys.splice(objKeys.indexOf(fields[i]),1);
    }
  }
  for (let i = 0; i < objKeys.length; i++) {
    newObj[objKeys[i]] = obj[objKeys[i]];
  }
  return newObj;
};
