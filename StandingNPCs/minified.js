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
globalThis.NPC=class i{
/**@param{NPC_CONFIG}config*/
constructor(t){this.idle=t.idleAnimation,this.pos=t.position,this.skin="string"==typeof t.skin?{head:t.skin,back:t.skin,body:t.skin,eyebrows:t.skin,eyes:t.skin,hat:t.skin,legs:t.skin,shoes:t.skin,skin:t.skin}:t.skin??void 0;try{this.id=api.attemptCreateMeshEntity("Person",{textures:this.skin,pose:t.pose,size:t.size}),api.setPosition(this.id,...t.position),this.mobHitbox=api.attemptSpawnMob("NPC",...t.position,{playSoundOnSpawn:!1});api.setTargetedPlayerSettingForEveryone(this.mobHitbox,"opacity",.01,!0),api.applyEffect(this.mobHitbox,"Frozen",null,{inbuiltLevel:1}),i.mobHitboxes[this.mobHitbox]=[],this.setName(t.name??"")}catch(t){throw new i.Error("Failed to spawn NPC."+t)}}mobHitbox;static Error=class extends globalThis.Error{constructor(i){super(i),this.name="NPC.Error",this.stack="NPC Engine by ObiloxYT"}};id;skin;pos;name;idle;isIdle=!0;static resetAnimations(i){const t={timeline:[]};api.animateEntity(i,{nodeAnimations:{TorsoNode:t,ArmRightMesh:t,ArmLeftMesh:t,HeadMesh:t,LegLeftMesh:t,LegRightMesh:t},animationDurationMs:1})}
/**@param{boolean}bool*/setIdle(t){t?(this.isIdle=!0,api.animateEntity(this.id,{animation_length:this.idle.length,["normal"===this.idle.type?"nodeAnimations":"bones"]:this.idle.animationSchema})):(this.isIdle=!1,i.resetAnimations(this.id))}
/**@param{Pos}pos*/setPosition(i){api.setPosition(this.id,i)}
/**@param{PREDEFINED_SKIN|Partial<Cosmetics>}skin*/setSkin(i){this.skin=i,this.skin="string"==typeof i?{head:i,back:i,body:i,eyebrows:i,eyes:i,hat:i,legs:i,shoes:i,skin:i}:i,api.updateMeshEntity(this.id,"Person",{textures:this.skin})}static mobHitboxes={};static onPlayerDamagingMob(t,e){if(i.mobHitboxes[e])return i.mobHitboxes[e].forEach(i=>i()),"preventDamage"}
/**@param{Function}fn*/onInteract(t){i.mobHitboxes[this.mobHitbox].push(t)}
/**@param{PlayerPose}pose*/setPose(i){api.updateMeshEntity(this.id,"Person",{pose:i})}
/**@param{number|Vec3}size*/setSize(i){api.updateMeshEntity(this.id,"Person",{size:i})}
/**@param{string}name*/setName(i){this.name=i,api.setTargetedPlayerSettingForEveryone(this.id,"nameTagInfo",{content:[{str:i}]},!0)}
/**@param{CustomTextStyling|string}dialogue@param{number}time*/speak(t,e){i.dialogues[this.id]??=[],i.dialogues[this.id].push({name:this.name,text:t,set:!1,time:e})}lookAtPlayer(i){api.setEntityRotation(this.id,...api.getPlayerFacingInfo(i).dir.map(i=>-i))}destroy(){api.deleteMeshEntity(this.id),delete i.dialogues[this.id],delete i.mobHitboxes[this.mobHitbox],api.despawnMob(this.mobHitbox)}stopTalking(){i.dialogues[this.id]=[]}
/**@param{ANIMATE_CONFIG<"blockbench"|"normal">}animation*/playAnimation(t){if(this.isIdle)throw new i.Error("NPC is currently idle.");api.animateEntity(this.id,{animation_length:t.length,["normal"===t.type?"nodeAnimations":"bones"]:t.animationSchema})}static dialogues={};static tick(){for(const[t,e]of Object.entries(i.dialogues))if(e?.[0]&&e[0].time)if(--e[0].time<=0){const i=e[0]?.name;e.splice(0,1),0===e.length&&api.setTargetedPlayerSettingForEveryone(t,"nameTagInfo",{content:[{str:i??""}]})}else e[0].set||(api.setTargetedPlayerSettingForEveryone(t,"nameTagInfo",{content:[{str:e[0].name??""}],subtitle:[{str:e[0].text}]}),e[0].set=!0)}};
