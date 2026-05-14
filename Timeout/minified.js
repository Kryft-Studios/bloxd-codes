class t{static nextID=1;static freeIDs=[];static activeCount=0;static create(){let t;return t=this.freeIDs.length>0?this.freeIDs.pop():this.nextID++,this.activeCount++,t}static release(t){t<=0||(this.freeIDs.push(t),this.activeCount--)}static getActiveCount(){return this.activeCount}static getPoolSize(){return this.freeIDs.length}static reset(){this.nextID=1,this.freeIDs.length=0,this.activeCount=0}}globalThis.IDSystem=t;
/**@typedef{}*/
class e{
/**@param {Function} callback @param {number} ticks*/
constructor(i,s){this.id=t.create(),this.timeat=e.currentTime+s,e.TimeoutTimeRequired[this.timeat]||(e.TimeoutTimeRequired[this.timeat]=new Set),e.TimeoutTimeRequired[this.timeat].add(this.id),e.TimeoutCallback[this.id]=i}id;timeat;static currentTime=0;
/** @type {Record<number, Set<number>>} */
static TimeoutTimeRequired={};
/** @type {Record<number, Function>} */
static TimeoutCallback={};
/** @param {Timeout} timeout */
static clear(i){t.release(i.id);const s=e.TimeoutTimeRequired[i.timeat];s&&(s.delete(i.id),0===s.size&&delete e.TimeoutTimeRequired[i.timeat]),delete e.TimeoutCallback[i.id]}static tick(){const t=++e.currentTime,i=e.TimeoutTimeRequired[t];if(i){for(const t of i){const i=e.TimeoutCallback[t];i&&i(),delete e.TimeoutCallback[t]}delete e.TimeoutTimeRequired[t]}}}const i="undefined"!=typeof tick?tick:()=>{};tick=()=>{i(),e.tick()},globalThis.Timeout=e;//????????????????????????????????????????????????????
