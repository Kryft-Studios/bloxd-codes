
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
globalThis.WALK_ON_PATH_MODULE = {
    /**@type{{m:MobId,c:CONFIG_STORED}[]}*/
    walkingMobs: [],
    isNotGoingToPos(entity) {
        return !(["walkingToPosition", "runningToPosition"].includes(api.getMobAiState(entity).state));
    },
    alive(entity) {
        try {
            api.getPosition(entity);
            return true;
        } catch (e) {
            return false;
        }
    },
    /**@param{MobId}mob@param{CONFIG}config*/
    path(mob,config){
        WALK_ON_PATH_MODULE.walkingMobs.push({m:mob,c:{...config,flagStarted:false}})
    },
    /**@param{MobId}@param{CONFIG[]}paths*/
    paths(mob,paths){
        paths.forEach(aaeae=>{WALK_ON_PATH_MODULE.path(mob,aaeae)})
    },
    // Hi App Leh
    // hi
    tick() {
        let on = WALK_ON_PATH_MODULE.walkingMobs.length;
        for (const walking of [...WALK_ON_PATH_MODULE.walkingMobs].reverse()) {
            on -= 1;
            if (walking.c.wait <= 0) {
                if (!WALK_ON_PATH_MODULE.alive(walking.m)) {
                    WALK_ON_PATH_MODULE.walkingMobs.splice(on, 1);
                    continue;
                } else if (WALK_ON_PATH_MODULE.isNotGoingToPos(walking.m)&&walking.c.flagStarted) {
                    WALK_ON_PATH_MODULE.walkingMobs.splice(on, 1);
                    WALK_ON_PATH_MODULE.resetAnimations(walking.m)
                    continue;
                } else if(!walking.c.flagStarted){
                if(walking.c.animation)api.animateEntity(walking.m,{[walking.c.animation.type==="normal"?"nodeAnimations":"bones"]:walking.c.animation.animationSchema,"animation_length":walking.c.animation.length,loop:true})
                api.setMobAiState(walking.m,walking.c.type==="run"?"runningToPosition":"walkingToPosition",{pos:walking.c.pos})
                WALK_ON_PATH_MODULE.walkingMobs[on].c.flagStarted=true
                }
                else {
                    const pos = api.getPosition(walking.m).map(bb=>Math.floor(bb));

const reached =
    Math.abs(pos[0]-walking.c.pos[0]) < 0.5 &&
    Math.abs(pos[2]-walking.c.pos[2]) < 0.5;
                    if(reached){
                    WALK_ON_PATH_MODULE.walkingMobs.splice(on, 1);
                     WALK_ON_PATH_MODULE.resetAnimations(walking.m)
                    continue;
                }}
            } else {
                WALK_ON_PATH_MODULE.walkingMobs[on].c.wait-=1;
                continue;
            }
        }
    },
    resetAnimations(id){
        const rot0={timeline:[]}
        api.animateEntity(id,{"nodeAnimations":{"TorsoNode":rot0,"ArmRightMesh":rot0,"ArmLeftMesh":rot0,"HeadMesh":rot0,"LegLeftMesh":rot0,"LegRightMesh":rot0},"animationDurationMs":1})
        api.setMobAiState(id,"idle",null)
    },
};


