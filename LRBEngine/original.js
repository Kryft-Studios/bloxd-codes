

class LRBEngine {
static lookup=[
    "Air",
"Dirt",
    "Grass Block",
    "Maple Log",
    "Maple Leaves"
]
/**@type{BLOCK<1|2>[]}*/
static blocks=[];
/**@param{Pos}pos@param{LRB}LRB*/
static place(pos,LRB){
this.analyzationQueue.push({pos,LRB})
}
/**@type{{pos:Pos,LRB:LRB}[]}*/
static analyzationQueue = []
static analyzeProcess(){
while(!api.isNearInterrupt()&&LRBEngine.analyzationQueue[0]){
const LRB = LRBEngine.analyzationQueue[0]
const bundle=[]
let LC=0;
let RC=0;
let BC=0;
const pos=LRB.pos
for(const Layer of LRB.LRB){
const Y=(LC++)+pos[1]
for (const Row of Layer) {
const X = (RC++) + pos[0]

let runBlock = null
let runStart = 0
/**@type{BLOCK<1|2>[]}*/
const runs = []

for (const Block of Row) {
  const Z = (BC++) + pos[2]

  if (Block === false) {
    if (runBlock !== null) {
      runs.push([runBlock, [X, Y, runStart], [X, Y, Z - 1]])
      runBlock = null
    }
    continue
  }

  if (runBlock === null) {
    runBlock = Block
    runStart = Z
    continue
  }

  if (Block !== runBlock) {
    runs.push([runBlock, [X, Y, runStart], [X, Y, Z - 1]])
    runBlock = Block
    runStart = Z
    continue
  }

  if ((Z - runStart) >= 360) {
  runs.push([runBlock, [X, Y, runStart], [X, Y, Z - 1]])
  runStart = Z
}
}

if (runBlock !== null) {
const lastZ = BC  + pos[2]
runs.push([runBlock, [X, Y, runStart],[X,Y,lastZ-1]])
}
bundle.push(...runs)
BC = 0
}
RC=0;
}
LRBEngine.blocks.push(...bundle)
LRBEngine.analyzationQueue.shift()
}
}
static buildProcess(){
while(!api.isNearInterrupt()&&(LRBEngine.blocks[0])){
const block=LRBEngine.blocks[0]
if(block.length===3){
api.setBlockRect(block[1],block[2],LRBEngine.lookup[block[0]])
}else{
api.setBlock(block[1],LRBEngine.lookup[block[0]])
}
LRBEngine.blocks.shift()
}
}
static tick(){
LRBEngine.analyzeProcess()
LRBEngine.buildProcess()
}
}
globalThis.LRBEngine=LRBEngine
tick=LRBEngine.tick
/**@template{1|2}TYPE@typedef{TYPE extends 1?[number,Pos,Pos]:[number,Pos]}BLOCK*/
