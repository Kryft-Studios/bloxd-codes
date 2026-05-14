/**@template{Record<string,number>}T
@param{T}weights
@returns{keyof T}*/
globalThis.rngWeighted = function rngWeighted(weights) {
    let total = 0;

    for (const key in weights) {
        total += weights[key];
    }

    let r = Math.random() * total;

    for (const key in weights) {
        r -= weights[key];
        if (r <= 0) return key;
    }
}
/**
@template{Record<string, `${number}%`>}T
 * @param {T} weights
 * @returns {keyof T}
 */
function rngWeightedPercent(weights) {

    const converted = {};

    for (const key in weights) {
        converted[key] = parseFloat(weights[key]);
    }

    return rngWeighted(converted);
}
