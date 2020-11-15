/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...fields) => {
  const newObj = {};
  const arrOfObjEntries = Object.entries(obj);
  for (const [key, value] of arrOfObjEntries) {
    if (fields.includes(key)) {
      newObj[key] = value;
    }
  }
  return newObj;
};
