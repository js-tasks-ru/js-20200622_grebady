/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export const omit = (obj, ...fields) => {
  const resultObj = {}
  const arrOfObjEntries = Object.entries(obj);
  for (let i = 0; i < arrOfObjEntries.length; i++) {
    if (!fields.includes(arrOfObjEntries[i][1])){
      resultObj[arrOfObjEntries[i][0]] = arrOfObjEntries[i][1];
    }
  }
  return resultObj;
};
