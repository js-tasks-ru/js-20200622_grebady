/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  const objTypeSort = {
    asc: 1,
    desc: -1,
  };

  return [...arr].sort((str1, str2) =>
    objTypeSort[param] * str1.localeCompare(str2, "ru", {caseFirst: "upper"}));

}
