/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const currentPath = path.split('.');
  return  obj => {
    for (const level of currentPath) {
      if (!obj) return undefined;
      obj = obj[level];
    }
    return obj;
  };
}
