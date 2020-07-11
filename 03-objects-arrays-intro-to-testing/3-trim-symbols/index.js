/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  let returnedStr = '';
  if (size === 0) return returnedStr;
  if (size === undefined) return string;
  let counter = 0;
  let lastChar = null;
  for (const char of string) {
    if (lastChar === char) {
      counter++;
      if (size > counter) returnedStr += char;
    } else {
      lastChar = char;
      counter = 0;
      returnedStr += char;
    }
  }
  return returnedStr;
}
