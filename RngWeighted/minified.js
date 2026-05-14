/**@template{Record<string,number>}T
@param{T}weights
@returns{keyof T}*/
globalThis.rngWeighted=function(n){let t=0;for(const e in n)t+=n[e];let e=Math.random()*t;for(const t in n)if(e-=n[t],e<=0)return t}
/**
@template{Record<string, `${number}%`>}T
 * @param {T} weights
 * @returns {keyof T}
 */,globalThis.rngWeightedPercent=function(n){const t={};for(const e in n)t[e]=parseFloat(n[e]);return rngWeighted(t)};
