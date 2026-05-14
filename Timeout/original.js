
class IDSystem {
    static nextID = 1;

    static freeIDs = [];

    static activeCount = 0;

    static create() {
        let id;

        if (this.freeIDs.length > 0) {
            id = this.freeIDs.pop();
        } else {
            id = this.nextID++;
        }

        this.activeCount++;
        return id;
    }

    static release(id) {
        if (id <= 0) return;

        this.freeIDs.push(id);
        this.activeCount--;
    }

    static getActiveCount() {
        return this.activeCount;
    }

    static getPoolSize() {
        return this.freeIDs.length;
    }

    static reset() {
        this.nextID = 1;
        this.freeIDs.length = 0;
        this.activeCount = 0;
    }
}
globalThis.IDSystem = IDSystem;
/**@typedef{}*/
class Timeout {
    /**@param {Function} callback @param {number} ticks*/
    constructor(callback, ticks) {
        this.id = IDSystem.create();

        this.timeat = Timeout.currentTime + ticks;

        if (!Timeout.TimeoutTimeRequired[this.timeat]) {
            Timeout.TimeoutTimeRequired[this.timeat] = new Set();
        }

        Timeout.TimeoutTimeRequired[this.timeat].add(this.id);

        Timeout.TimeoutCallback[this.id] = callback;
    }

    id;
    timeat;

    static currentTime = 0;

    /** @type {Record<number, Set<number>>} */
    static TimeoutTimeRequired = {};

    /** @type {Record<number, Function>} */
    static TimeoutCallback = {};

    /** @param {Timeout} timeout */
    static clear(timeout) {
        IDSystem.release(timeout.id);
        const set = Timeout.TimeoutTimeRequired[timeout.timeat];
        if (set) {
            set.delete(timeout.id);
            if (set.size === 0) {
                delete Timeout.TimeoutTimeRequired[timeout.timeat];
            }
        }
        delete Timeout.TimeoutCallback[timeout.id];
    }

    static tick() {
        const time = ++Timeout.currentTime;
        const set = Timeout.TimeoutTimeRequired[time];
        if (set) {
            for (const id of set) {
                const cb = Timeout.TimeoutCallback[id];
                if (cb) cb();
                delete Timeout.TimeoutCallback[id];
            }
            delete Timeout.TimeoutTimeRequired[time];
        }
    }
}
const otick = typeof tick !== "undefined" ? tick : () => { };
tick = () => { otick(); Timeout.tick() ;};
globalThis.Timeout = Timeout;//????????????????????????????????????????????????????
