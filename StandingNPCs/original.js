/**@typedef{"chef"|"farmer"|"farmer_gill"|"monster_hunter_lorenzo"|"painter_spencer"|"piggy_banker"|"portal_mage"|"trader"|"trader_black"|"trader_blue"|"wizard"|"zombie"}PREDEFINED_SKIN*/
/**@typedef{Readonly<Record<EntityNamedNode,{rotation:BlockbenchAnimationTimelineSchema}>>}BLOCKBENCH_ANIMATION*/
/**@typedef{Readonly<Record<EntityNamedNode,{timeline:AnimationTimelineSchema}>>}ANIMATION*/
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
/**@typedef{{
name?:string,
position:Pos,
idleAnimation?:ANIMATE_CONFIG<"blockbench"|"normal">,
skin?:PREDEFINED_SKIN|Partial<Cosmetics>,
pose?:PlayerPose,
size?:number|Vec3
}}NPC_CONFIG*/
globalThis.NPC=class NPC{
    /**@param{NPC_CONFIG}config*/
    constructor(config){
        this.idle=config.idleAnimation
        this.pos=config.position
        this.skin=typeof config.skin==="string"?{
            head:config.skin,
            back:config.skin,
            body:config.skin,
            eyebrows:config.skin,
            eyes:config.skin,
            hat:config.skin,
            legs:config.skin,
            shoes:config.skin,
            skin:config.skin
        }:config.skin??undefined
        try{
        this.id=api.attemptCreateMeshEntity("Person",{textures:this.skin,pose:config.pose,size:config.size})
            api.setPosition(this.id,...config.position)
            this.mobHitbox=api.attemptSpawnMob("NPC",...config.position,{playSoundOnSpawn:false})
            const _0=[2,2,2]
            api.setTargetedPlayerSettingForEveryone(this.mobHitbox,"opacity",0.01,true)
            api.applyEffect(this.mobHitbox,"Frozen",null,{inbuiltLevel:1})
            NPC.mobHitboxes[this.mobHitbox]=[]
        this.setName(config.name??"")
        }catch(e){
            throw new NPC.Error("Failed to spawn NPC."+e)
        }
    }
    mobHitbox
    static Error = class extends globalThis.Error {
        constructor(message){
            super(message)
            this.name="NPC.Error"
            this.stack="NPC Engine by ObiloxYT"
        }
    }
    id
    skin
    pos
    name 
    idle
    isIdle=true
    static resetAnimations(id){
        const rot0={timeline:[]}
        api.animateEntity(id,{"nodeAnimations":{"TorsoNode":rot0,"ArmRightMesh":rot0,"ArmLeftMesh":rot0,"HeadMesh":rot0,"LegLeftMesh":rot0,"LegRightMesh":rot0},"animationDurationMs":1})
    }
    /**@param{boolean}bool*/
    setIdle(bool){
        if(bool){
            this.isIdle=true;
            api.animateEntity(this.id,{animation_length:this.idle.length,[this.idle.type==="normal"?"nodeAnimations":"bones"]:this.idle.animationSchema})
        } else {
            this.isIdle=false;
            NPC.resetAnimations(this.id)
        }
    }
    /**@param{Pos}pos*/
    setPosition(pos){api.setPosition(this.id,pos)}
    /**@param{PREDEFINED_SKIN|Partial<Cosmetics>}skin*/
    setSkin(skin){
        this.skin=skin
this.skin=typeof skin==="string"?{
            head:skin,
            back:skin,
            body:skin,
            eyebrows:skin,
            eyes:skin,
            hat:skin,
            legs:skin,
            shoes:skin,
            skin:skin
        }:skin
        api.updateMeshEntity(this.id,"Person",{textures:this.skin})
    }
    static mobHitboxes={}
    static onPlayerDamagingMob(myId,damaging){
        if(NPC.mobHitboxes[damaging]){
            NPC.mobHitboxes[damaging].forEach(fn=>fn())
            return "preventDamage"
        }
    }
    /**@param{Function}fn*/
    onInteract(fn){NPC.mobHitboxes[this.mobHitbox].push(fn)}
    /**@param{PlayerPose}pose*/
    setPose(pose){
        api.updateMeshEntity(this.id,"Person",{pose})
    }
    /**@param{number|Vec3}size*/
    setSize(size){
        api.updateMeshEntity(this.id,"Person",{size})
    }
    /**@param{string}name*/
    setName(name){
    this.name=name;
       api.setTargetedPlayerSettingForEveryone(this.id,"nameTagInfo",{"content":[{str:name}]},true)
    }
    /**@param{CustomTextStyling|string}dialogue@param{number}time*/
    speak(dialogue,time){
        NPC.dialogues[this.id]??=[]
        NPC.dialogues[this.id].push({name:this.name,text:dialogue,set:false,time})
    }
    lookAtPlayer(playerId){
        api.setEntityRotation(this.id,...api.getPlayerFacingInfo(playerId).dir.map(a=>-a))
    }
    destroy(){
        api.deleteMeshEntity(this.id)
        delete NPC.dialogues[this.id];
        delete NPC.mobHitboxes[this.mobHitbox];
        api.despawnMob(this.mobHitbox)
    }
    stopTalking(){
        NPC.dialogues[this.id]=[]
    }
    /**@param{ANIMATE_CONFIG<"blockbench"|"normal">}animation*/
    playAnimation(animation){
        if(this.isIdle)throw new NPC.Error("NPC is currently idle.")
        api.animateEntity(this.id,{animation_length:animation.length,[animation.type==="normal"?"nodeAnimations":"bones"]:animation.animationSchema})
    }
    static dialogues={}
    static tick(){
        for(const [key,dialogues] of Object.entries(NPC.dialogues)){
            if(!dialogues?.[0])continue;
            if(dialogues[0].time){
        if(--dialogues[0].time<=0){
            const nameCached=dialogues[0]?.name
            dialogues.splice(0,1)
            if(dialogues.length===0){
                api.setTargetedPlayerSettingForEveryone(key,"nameTagInfo",{"content":[{str:nameCached??""}]})
            }
        } else {
            if(!dialogues[0].set){
                api.setTargetedPlayerSettingForEveryone(key,"nameTagInfo",{"content":[{str:dialogues[0].name??""}],"subtitle":[{str:dialogues[0].text}]})
                dialogues[0].set=true;
            }
        }
        }}
    }
}

const originalTick = typeof tick !== "undefined" ? tick : (() => { });
tick = () => { originalTick(); CHAT.tick(); };
onPlayerChat = CHAT.onPlayerChat;
