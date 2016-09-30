/**
* @public
* @function removeElem
* @description Utility method to remove first occurence of a elem from array.
* @param {Array} array - An array
* @param {string} elem - elem
* @return {Array} array - New array. Don't mutate the first one
*/
export function removeElem (array, elem) {
    if (!array) { throw new Error('array must be an array') }

    if (!elem) { return array }

    const index = array.indexOf(elem)
    if (index > -1) { array.splice(index, 1) }
    return array
}
