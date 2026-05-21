class ISF {
static queued=[]
static queue(yieldFn){
ISF.queued.push(yieldFn)
}
static tick(){
while(ISF.queued[0]&&!api.isNearInterrupt()){
if(ISF.queued[0].next().done)ISF.queued.shift()
}
}
}
globalThis.ISF=ISF;
tick=ISF.tick
