/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...fields) => {
  let newObj = {}
  let objKeys = Object.keys(obj);
  for (let i = 0; i < fields.length; i++) {
    if (objKeys.includes(fields[i])){
      newObj[fields[i]] = obj[fields[i]];
    }
  }
  return newObj;
};
