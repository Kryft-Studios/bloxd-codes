/**@template{number}LENGTH
@template{any?}TYPE
@typedef{TYPE[]&{length:LENGTH}}ARRAY<LENGTH,TYPE>*/
/**@typedef{ARRAY<3,number>}POSITION*/
/**@typedef{"walk"|"run"}WALK_TYPE*/
/**@type{BlockbenchAnimationTimelineSchema}*/
/**@typedef{Readonly<Record<EntityNamedNode,{rotation:BlockbenchAnimationTimelineSchema}>>}BLOCKBENCH_ANIMATION*/
/**@typedef{Readonly<Record<EntityNamedNode,{timeline:AnimationTimelineSchema}>>}ANIMATION*/
/**@typedef{{
pos:POSITION,
type:WALK_TYPE,
animation?:ANIMATE_CONFIG,
wait: number
}}CONFIG*/
/**
 * @template {"blockbench"|"normal"} TYPE
 * @typedef {{
 *   type: TYPE,
 *   length: number,
 *   animationSchema: ({
 *     "blockbench": BLOCKBENCH_ANIMATION,
 *     "normal": ANIMATION
 *   })[TYPE]
 * }} ANIMATE_CONFIG
 */
/**@typedef{CONFIG&{flagStarted:boolean}}CONFIG_STORED*/
globalThis.WALK_ON_PATH_MODULE={
/**@type{{m:MobId,c:CONFIG_STORED}[]}*/
walkingMobs:[],isNotGoingToPos:i=>!["walkingToPosition","runningToPosition"].includes(api.getMobAiState(i).state),alive(i){try{return api.getPosition(i),!0}catch(i){return!1}},
/**@param{MobId}i@param{CONFIG}t*/
path(i,t){WALK_ON_PATH_MODULE.walkingMobs.push({m:i,c:{...t,flagStarted:!1}})},
/**@param{MobId}i@param{CONFIG[]}t*/
paths(i,t){t.forEach(t=>{WALK_ON_PATH_MODULE.path(i,t)})},
// Hi App Leh
// hi
tick(){let i=WALK_ON_PATH_MODULE.walkingMobs.length;for(const t of[...WALK_ON_PATH_MODULE.walkingMobs].reverse())if(i-=1,t.c.wait<=0)if(WALK_ON_PATH_MODULE.alive(t.m))if(WALK_ON_PATH_MODULE.isNotGoingToPos(t.m)&&t.c.flagStarted)WALK_ON_PATH_MODULE.walkingMobs.splice(i,1),WALK_ON_PATH_MODULE.resetAnimations(t.m);else if(t.c.flagStarted){const a=api.getPosition(t.m).map(i=>Math.floor(i));if(Math.abs(a[0]-t.c.pos[0])<.5&&Math.abs(a[2]-t.c.pos[2])<.5){WALK_ON_PATH_MODULE.walkingMobs.splice(i,1),WALK_ON_PATH_MODULE.resetAnimations(t.m);continue}}else t.c.animation&&api.animateEntity(t.m,{["normal"===t.c.animation.type?"nodeAnimations":"bones"]:t.c.animation.animationSchema,animation_length:t.c.animation.length,loop:!0}),api.setMobAiState(t.m,"run"===t.c.type?"runningToPosition":"walkingToPosition",{pos:t.c.pos}),WALK_ON_PATH_MODULE.walkingMobs[i].c.flagStarted=!0;else WALK_ON_PATH_MODULE.walkingMobs.splice(i,1);else WALK_ON_PATH_MODULE.walkingMobs[i].c.wait-=1},resetAnimations(i){const t={timeline:[]};api.animateEntity(i,{nodeAnimations:{TorsoNode:t,ArmRightMesh:t,ArmLeftMesh:t,HeadMesh:t,LegLeftMesh:t,LegRightMesh:t},animationDurationMs:1}),api.setMobAiState(i,"idle",null)}};
