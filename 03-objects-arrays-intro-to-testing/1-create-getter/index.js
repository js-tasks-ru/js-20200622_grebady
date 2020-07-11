/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  return function (obj) {
    for (const level of path.split('.')) {
      if (obj === undefined) {return undefined;}
      obj = obj[level];
    }
    return obj;
  };
}
