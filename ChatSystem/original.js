
const CHAT = /**@type{const}*/({
    RANKS:/**@type{const}*/({
  "DEV": { icon: "wrench", color: "#cef3ff" },     
  "PEASANT": { icon: "user", color: "#4fed4f" },
  "ADMIN": { icon: "gear", color: "#ff9d87" },
    "OWNER": {icon:"crown",color:"#f3f351"},
        "CLUMSY": {icon:"RPG",color:"green"}
}),
    DEFAULT:"PEASANT",
    SPECIAL: {
        "ObiloxYT":["DEV","ADMIN","OWNER"],
        "kotkot_12":["ADMIN"],
        "CobraxRebelGuyDev":["ADMIN"],
        "Aarow445":['ADMIN',"CLUMSY"],
        "luffy_in_gear_5":["ADMIN"]
    },
    onPlayerChat(myId,chatmessage,chanel){
    let isSuper = false;
    if(api.getPlayerCosmetic(myId,"nameColour")!=="default"){
        isSuper=true
    }
        let a = []
        if(isSuper)a.push({str:"[",style:{color:"yellow"}},{icon:"super",style:{color:"yellow"}},{str:"]",style:{color:"yellow"}})
        const spec=CHAT.SPECIAL[api.getEntityName(myId)]
        if(spec){
            spec.forEach((d,i)=>{
                            d=CHAT.RANKS[d]
a.push({str:"[",style:{color:d.color}},{icon:d.icon,style:{color:d.color}},{str:`]`,style:{color:d.color}})})
        }
        const norm = CHAT.RANKS[CHAT.DEFAULT]
        a.push({str:"[",style:{color:norm.color}},{icon:norm.icon,style:{color:norm.color}},{str:`]`,style:{color:norm.color}})
        a.push({str:" "+api.getEntityName(myId),style:{color:"#cef3ff"}},{str:": "+chatmessage})
        CHAT.CHATS.push(a)
        return false
    },
    CHATS:[],
    tick(){
        while(CHAT.CHATS[0]&&!api.isNearInterrupt()){
            api.broadcastMessage(CHAT.CHATS[0])
            CHAT.CHATS.shift()
        }
    }
})
const originalTick = typeof tick!=="undefined"?tick:(()=>{})
tick = ()=>{originalTick();CHAT.tick()}
onPlayerChat = CHAT.onPlayerChat
