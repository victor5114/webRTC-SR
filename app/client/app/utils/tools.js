// Mutate function
export function removeElem (array, elem) {
    if (!array) { throw new Error('array must be an array') }

    if (!elem) { return array }

    const index = array.indexOf(elem)
    if (index > -1) { array.splice(index, 1) }
    return array
}
