// write or paste code here


export const PROMPT_FRAMEWORK = Object.freeze(/**@type{const}*/{
MessageType: {
STANDARD_MESSAGE: 0,
INPUT_MESSAGE: 1,
OPTION_MESSAGE: 2,
CLICK_PROMPT: 3,
},
typewriterEffect: {},
/**@type {Record<string, QUEUE>}*/
queue: {},
onPlayerLeave(myId){
delete PROMPT_FRAMEWORK.queue[myId];
delete PROMPT_FRAMEWORK.playerMessage[myId]
delete PROMPT_FRAMEWORK.typewriterEffect[myId]
delete PROMPT_FRAMEWORK.selectedMessage[myId]
},
    onPlayerJoin(myId){
        PROMPT_FRAMEWORK.queue[myId]={queued:[]}
    },
/**@type {TAKE_BACK_HELPER}*/
takeBackHelper: {
error(string){return[0,string]},
success:()=>{return [1, ""]},
ResultCode: {
ERROR: 0,
SUCCESS: 1
}
},
/**@param{MESSAGES}messages@param{(myId: string)=>void}onDone*/
queuem(myId, messages, onDone){
PROMPT_FRAMEWORK.queue[myId].queued.push({
currProg: 0,
onDone,
alreadyBegan: false,
currentType: messages[0].type,
messages
})
},
z_setterInputMessage(myId,options,message){
PROMPT_FRAMEWORK.z_setMessage(myId,options,PROMPT_FRAMEWORK.z_createInputMessage(options,"\nInput: [ "+message+" ]","Type your input in chat"))
},
z_setterClickPrompt(myId,options,message){
const copy = {...options,message}
PROMPT_FRAMEWORK.z_setMessage(myId,options,PROMPT_FRAMEWORK.z_createInputMessage(copy,"","Click to continue"))
},
/**@param{STANDARD_MESSAGE}options*/
z_beginStandardMessage(myId, options){
if(options.onStart){
const osRes = PROMPT_FRAMEWORK.z_runFenced(options.onStart,myId, PROMPT_FRAMEWORK.takeBackHelper);
if(osRes.ok&&osRes.res?.[0]===0)return false;}
if(options.typewritted){
PROMPT_FRAMEWORK.typewriterEffect[myId] = PROMPT_FRAMEWORK.z_tpwritedTypewrittedEffect(myId, options, PROMPT_FRAMEWORK.z_setMessage);
}
else PROMPT_FRAMEWORK.z_setMessage(myId, options, options.message)
return true;
},
/**@param{QUEUE}queue*/
z_pollQueued(myId, queue){
if(queue.queued.length === 0)return;
const queued = queue.queued[0]
if(queued.currentType===PROMPT_FRAMEWORK.MessageType.STANDARD_MESSAGE&&!queued.messages[0].typewritted){        
if(++queued.currProg>=queued.messages[0].time){
PROMPT_FRAMEWORK.z_endStandardMessage(myId, queued.messages[0])
PROMPT_FRAMEWORK.z_endLast(myId, queue);
}
}
},
tick(){
for(const a of api.getPlayerIds()){
PROMPT_FRAMEWORK.z_pollQueued(a, PROMPT_FRAMEWORK.queue[a]);
PROMPT_FRAMEWORK.z_processNextInQueue(a, PROMPT_FRAMEWORK.queue[a])
PROMPT_FRAMEWORK.z_tickTypewriterEffect(a);
}
},
/**@param{STANDARD_MESSAGE}options*/
z_endStandardMessage(myId, options){
const done = PROMPT_FRAMEWORK.z_runFenced(options.onDone, myId)
if(done.ok&&done.res?.length!==undefined){
const _ = PROMPT_FRAMEWORK.queue[myId].queued[0].messages.shift()
PROMPT_FRAMEWORK.queue[myId].queued[0].messages.unshift(_,...done)
}
PROMPT_FRAMEWORK.z_setMessage(myId, options, "")
},
z_tickTypewriterEffect(myId){
    const effect = PROMPT_FRAMEWORK.typewriterEffect[myId]
    if(!effect)return;

    const result = effect.next();

    if(result.done){
        delete PROMPT_FRAMEWORK.typewriterEffect[myId];
    }
},
/**@param{QUEUE}queue*/
z_endLast(myId, queue){
const q = queue.queued[0]
q.messages.shift();
delete PROMPT_FRAMEWORK.typewriterEffect[myId]
if(q.messages.length===0){
PROMPT_FRAMEWORK.z_runFenced(q.onDone, myId)
queue.queued.shift();
return
}
q.alreadyBegan=false
q.currentType=q.messages[0].type
},
z_runFenced(fn, ...params){
if(fn===undefined)return {ok:false,res:null}
try{
const a = fn(...params)
return {ok: true, res: a}
}catch(e){
console.log("[PROMPT_FRAMEWORK: FENCED FAIL] "+Object.entries(e))
return {ok:false,res:null}
}
},
skipTypeWriterChars: new Set([" ","\n"]),
*z_tpwritedTypewrittedEffect(myId,options,setter){
if(typeof options.message === "string"){
let message = ""
for(let i=0;i<options.message.length;i++){
message+=options.message[i]
setter(myId,options,message)
yield
}
}else{
const isTWDO = "content" in options.message
const content = isTWDO ? options.message.content : options.message
let message = []
const set = mes => setter(myId,options,isTWDO ? {...options.message,content:mes} : mes)
for(let i=0;i<content.length;i++){
const segment = content[i]
if(typeof segment.str === "string"){
message.push({...segment,str:""})
for(let y=0;y<segment.str.length;y++){
message[i].str+=segment.str[y]
set(message)
if(!PROMPT_FRAMEWORK.skipTypeWriterChars.has(segment.str[y]))yield
}
}else{
message.push(segment)
set(message)
}
}
}
options.typewritted=false
},
/**@param{INPUT_MESSAGE}options*/
z_beginInputMessage(myId, options){
if(options.onStart){const a = PROMPT_FRAMEWORK.z_runFenced(options.onStart, myId, PROMPT_FRAMEWORK.takeBackHelper)
if(a.ok&&a.res?.[0]===0)return false;}
PROMPT_FRAMEWORK.z_setMessage(myId, options, PROMPT_FRAMEWORK.z_createInputMessage(options, "\nInput: [  ]", "Type your input in chat"))
api.setClientOption(myId, "customButtons", [{id: "ok_im", "description": "OK", "icon": "play","keycode": "KeyE"}])
return true
},
selectedMessage: {},
/**@param{OPTIONS_PROMPT}options*/
z_beginOptionMessage(myId, options){
if(options.options.length>=10){
console.log("Doesn't support options over length 10")
return false
}
if(options.onStart){const a = PROMPT_FRAMEWORK.z_runFenced(options.onStart, myId, PROMPT_FRAMEWORK.takeBackHelper)
if(a.ok&&a.res?.[0]===0)return false;}
PROMPT_FRAMEWORK.z_setMessage(myId, options, PROMPT_FRAMEWORK.z_createInputMessage(options, "\nSelected: [  ]", "Press number keys to select options, or click the option"))
api.setClientOption(myId, "customButtons", [...options.options.map((a,i)=>({keycode: "Digit"+i, id: ""+i,description:a,"icon":"arrow-left"})), {description: "OK", id: "ok_om", "keycode":"KeyE","icon": "play"}])
return true
},
/**@param{MESSAGE}options*/
z_setMessage(myId, options, message){
    if(options.messageOn === "dialogue"){
        if(message === ""){
            api.setClientOption(myId, "dialogue", null);
            return;
        }

        const content = message.content ?? message;
        api.setClientOption(myId, "dialogue", {
            line: "",
            speakerName: content
        });
    } else {
        api.setClientOption(myId, options.messageOn ?? "middleTextLower", message);
    }
},
/**@param{CLICK_MESSAGE}clickMessage*/
z_beginClickPrompt(myId, options){
if(options.onStart){const a = PROMPT_FRAMEWORK.z_runFenced(options.onStart, myId, PROMPT_FRAMEWORK.takeBackHelper)
if(a.ok&&a.res?.[0]===0)return false;}
if(!options.typewritted)PROMPT_FRAMEWORK.z_setMessage(myId, options, PROMPT_FRAMEWORK.z_createInputMessage(options, "", "Click to continue"))
else {
PROMPT_FRAMEWORK.typewriterEffect[myId] = PROMPT_FRAMEWORK.z_tpwritedTypewrittedEffect(myId, options, PROMPT_FRAMEWORK.z_setterClickPrompt)
}
return true;
},
/**@param{CLICK_MESSAGE}options*/
z_endClickPrompt(myId, options){
if(options.onDone){
const res = PROMPT_FRAMEWORK.z_runFenced(options.onDone,myId,PROMPT_FRAMEWORK.takeBackHelper)
if(res.ok){if(res.res?.[0] === 0){PROMPT_FRAMEWORK.z_setMessage(myId, options,PROMPT_FRAMEWORK.z_inputMessageError("", options, res.res[1], "Click to continue"));return false}else if(res.res?.[0]?.type!==undefined){
const _ = PROMPT_FRAMEWORK.queue[myId].queued[0].messages.shift()
PROMPT_FRAMEWORK.queue[myId].queued[0].messages.unshift(_,...res.res)
}}
if(!res.ok){
PROMPT_FRAMEWORK.z_setMessage(myId,options,PROMPT_FRAMEWORK.z_inputMessageError("", options, "Internal callback error", "Click to continue"))
return false
}
}
PROMPT_FRAMEWORK.z_setMessage(myId, options, "")
delete PROMPT_FRAMEWORK.typewriterEffect[myId]
return true;
},
onPlayerClick(myId){
if(PROMPT_FRAMEWORK.queue[myId].queued.length>0&&PROMPT_FRAMEWORK.queue[myId].queued[0].currentType===PROMPT_FRAMEWORK.MessageType.CLICK_PROMPT){
if(PROMPT_FRAMEWORK.z_endClickPrompt(myId, PROMPT_FRAMEWORK.queue[myId].queued[0].messages[0])){
PROMPT_FRAMEWORK.z_endLast(myId, PROMPT_FRAMEWORK.queue[myId])
}
}
},
/**@param{INPUT_MESSAGE}options*/
z_createInputMessage(options, extra, instructions){
   
return (typeof options.message!=="string"&&("content" in options.message)) ? {showBackground: options.message.showBackground, content: 
[{str: instructions+"\n", style: {color: "gray"}}, ...(typeof options.message.content === "string" ? [options.message.content] : options.message.content), ...(typeof extra === "string" ? [extra] : extra)]
} : [{str: instructions+"\n", style: {color: "gray"}}, ...(typeof options.message === "string" ? [options.message] : options.message),...(typeof extra === "string" ? [extra] : extra)] 
},
playerMessage: {},
onPlayerChat(myId, message){
if(PROMPT_FRAMEWORK.queue[myId].queued.length>0&&PROMPT_FRAMEWORK.queue[myId].queued[0].currentType===PROMPT_FRAMEWORK.MessageType.INPUT_MESSAGE){
PROMPT_FRAMEWORK.playerMessage[myId] = message;
PROMPT_FRAMEWORK.z_setMessage(myId, PROMPT_FRAMEWORK.queue[myId].queued[0].messages[0], PROMPT_FRAMEWORK.z_createInputMessage(PROMPT_FRAMEWORK.queue[myId].queued[0].messages[0], "\nInput: [ "+message+" ]", "Type your input in chat"))
return false;
}
},
z_inputMessageError(extra, options, error, instructions){
return PROMPT_FRAMEWORK.z_createInputMessage(options, [extra, {str: "\n"+error, style: {color: "red"}}], instructions)
},
/**@param{INPUT_MESSAGE}options*/
z_endInputMessage(myId, options){
const input = PROMPT_FRAMEWORK.playerMessage[myId]
if(input === undefined){PROMPT_FRAMEWORK.z_setMessage(myId, options,PROMPT_FRAMEWORK.z_inputMessageError("\nInput: [ "+ PROMPT_FRAMEWORK.playerMessage[myId] + " ]", options, "No input given", "Type your input in chat"));return false}
if(options.onDone){
const res = PROMPT_FRAMEWORK.z_runFenced(options.onDone,myId,PROMPT_FRAMEWORK.takeBackHelper,input)
if(res.ok){if(res.res?.[0] === 0){PROMPT_FRAMEWORK.z_setMessage(myId, options,PROMPT_FRAMEWORK.z_inputMessageError("\nInput: [ "+ PROMPT_FRAMEWORK.playerMessage[myId] + " ]", options, res.res[1], "Type your input in chat"));return false}else if(res.res?.[0]?.type!==undefined){
const _ = PROMPT_FRAMEWORK.queue[myId].queued[0].messages.shift()
PROMPT_FRAMEWORK.queue[myId].queued[0].messages.unshift(_,...res.res)
}}
if(!res.ok){
PROMPT_FRAMEWORK.z_setMessage(myId,options,PROMPT_FRAMEWORK.z_inputMessageError("\nInput: [ "+ PROMPT_FRAMEWORK.playerMessage[myId] + " ]", options, "Internal callback error", "Type your input in chat"))
return false
}
}
delete PROMPT_FRAMEWORK.playerMessage[myId]
PROMPT_FRAMEWORK.z_setMessage(myId, options, "")
api.setClientOption(myId, "customButtons", [])

return true
},
/**@param{OPTIONS_PROMPT}options*/
z_endOptionsMessage(myId, options){
const input = PROMPT_FRAMEWORK.selectedMessage[myId]
if(input === undefined){PROMPT_FRAMEWORK.z_setMessage(myId, options,PROMPT_FRAMEWORK.z_inputMessageError("\nSelected: [ "+ PROMPT_FRAMEWORK.selectedMessage[myId] + " ]", options, "No input given", "Press number keys to select options, or click the option"));return false}
if(options.onDone){
const res = PROMPT_FRAMEWORK.z_runFenced(options.onDone,myId,PROMPT_FRAMEWORK.takeBackHelper,input)
if(res.ok){if(res.res?.[0] === 0){PROMPT_FRAMEWORK.z_setMessage(myId, options,PROMPT_FRAMEWORK.z_inputMessageError("\nSelected: [ "+ PROMPT_FRAMEWORK.selectedMessage[myId] + " ]", options, res.res[1], "Press number keys to select options, or click the option"));return false}else if(res.res?.[0]?.type!==undefined){
const _ = PROMPT_FRAMEWORK.queue[myId].queued[0].messages.shift()
PROMPT_FRAMEWORK.queue[myId].queued[0].messages.unshift(_,...res.res)
}}
if(!res.ok){
PROMPT_FRAMEWORK.z_setMessage(myId,options,PROMPT_FRAMEWORK.z_inputMessageError("\nSelected: [ "+ PROMPT_FRAMEWORK.selectedMessage[myId] + " ]", options, "Internal callback error", "No input given", "Press number keys to select options, or click the option"))
return false
}
}
delete PROMPT_FRAMEWORK.selectedMessage[myId]
PROMPT_FRAMEWORK.z_setMessage(myId, options, "")
api.setClientOption(myId, "customButtons", [])

return true
},
onPlayerPressedButton(myId, id){
if(id==="ok_im"&&PROMPT_FRAMEWORK.queue[myId].queued.length>0&&PROMPT_FRAMEWORK.queue[myId].queued[0].currentType===PROMPT_FRAMEWORK.MessageType.INPUT_MESSAGE){
if(PROMPT_FRAMEWORK.z_endInputMessage(myId, PROMPT_FRAMEWORK.queue[myId].queued[0].messages[0])){
PROMPT_FRAMEWORK.z_endLast(myId, PROMPT_FRAMEWORK.queue[myId])
}
}else if(!Number.isNaN(Number(id))&&PROMPT_FRAMEWORK.queue[myId].queued.length>0&&PROMPT_FRAMEWORK.queue[myId].queued[0].currentType===PROMPT_FRAMEWORK.MessageType.OPTION_MESSAGE){
PROMPT_FRAMEWORK.z_setMessage(myId, PROMPT_FRAMEWORK.queue[myId].queued[0].messages[0], PROMPT_FRAMEWORK.z_createInputMessage(PROMPT_FRAMEWORK.queue[myId].queued[0].messages[0], "\nSelected: [ "+PROMPT_FRAMEWORK.queue[myId].queued[0].messages[0].options[Number(id)]+" ]", "Press number keys to select options, or click the option"))
PROMPT_FRAMEWORK.selectedMessage[myId]=Number(id)
}else if(id==="ok_om"&&PROMPT_FRAMEWORK.queue[myId].queued.length>0&&PROMPT_FRAMEWORK.queue[myId].queued[0].currentType===PROMPT_FRAMEWORK.MessageType.OPTION_MESSAGE){
if(PROMPT_FRAMEWORK.z_endOptionsMessage(myId, PROMPT_FRAMEWORK.queue[myId].queued[0].messages[0])){
PROMPT_FRAMEWORK.z_endLast(myId, PROMPT_FRAMEWORK.queue[myId])
}
}
},
/**@param{QUEUE}queue*/
z_processNextInQueue(myId, queue){
if(queue.queued.length<=0)return;
const queued = queue.queued[0]
if(queued.alreadyBegan)return;
if(queued.currentType===PROMPT_FRAMEWORK.MessageType.STANDARD_MESSAGE){
if(!PROMPT_FRAMEWORK.z_beginStandardMessage(myId, queued.messages[0])){
PROMPT_FRAMEWORK.z_endLast(myId, queue);
PROMPT_FRAMEWORK.z_processNextInQueue(myId, queue)
return;
};
} else if(queued.currentType===PROMPT_FRAMEWORK.MessageType.INPUT_MESSAGE){
    if(!PROMPT_FRAMEWORK.z_beginInputMessage(myId,queued.messages[0])){
    PROMPT_FRAMEWORK.z_endLast(myId, queue);
PROMPT_FRAMEWORK.z_processNextInQueue(myId, queue)
return;
    }
}else if (queued.currentType===PROMPT_FRAMEWORK.MessageType.CLICK_PROMPT){
    if(!PROMPT_FRAMEWORK.z_beginClickPrompt(myId,queued.messages[0])){
    PROMPT_FRAMEWORK.z_endLast(myId, queue);
PROMPT_FRAMEWORK.z_processNextInQueue(myId, queue)
return;
    }    
    }else if (queued.currentType===PROMPT_FRAMEWORK.MessageType.OPTION_MESSAGE){
    if(!PROMPT_FRAMEWORK.z_beginOptionMessage(myId,queued.messages[0])){
    PROMPT_FRAMEWORK.z_endLast(myId, queue);
PROMPT_FRAMEWORK.z_processNextInQueue(myId, queue)
return;
    }    
    }
queued.currProg=0;
queued.currentType=queued.messages[0].type
queued.alreadyBegan = true;
},
})
/**
@typedef{import("@bloxd").CustomTextStyling}CustomTextStyling
@typedef{import("@bloxd").TextWithDisplayOptions}TextWithDisplayOptions
@typedef{{queued: QUEUED[]}}QUEUE
@typedef {{
currProg: number,
onDone?: (myId: string)=>void,
currentType: PROMPT_FRAMEWORK["MessageType"],
messages: MESSAGES,alreadyBegan: boolean
}} QUEUED
@typedef {{
error(string: string): [0, string]
success(): [1, ""],
ResultCode: PROMPT_FRAMEWORK["TakeBackResultCode"]
}} TAKE_BACK_HELPER
@typedef {[PROMPT_FRAMEWORK["TakeBackResultCode"], string]} TAKEBACK_RESULT
@typedef {{
message: string | CustomTextStyling | TextWithDisplayOptions,
time: number,
onDone?:(myId: string)=> void|MESSAGES,
onStart?:(myId: string, a: TAKE_BACK_HELPER)=> void |  TAKEBACK_RESULT,
messageOn?: "middleTextLower" | "middleTextTop" | "middleTextUpper" | "dialogue",
type: PROMPT_FRAMEWORK["MessageType"]["STANDARD_MESSAGE"]
typewritted?:boolean
}} STANDARD_MESSAGE
@typedef {{
message: string | CustomTextStyling | TextWithDisplayOptions,
onStart?:(myId: string, a: TAKE_BACK_HELPER)=> void |  TAKEBACK_RESULT,
onDone?:(myId: string, a: TAKE_BACK_HELPER, res: string)=>void|TAKEBACK_RESULT|MESSAGES,
messageOn?: "middleTextLower" | "middleTextTop" | "middleTextUpper" | "dialogue",
type: PROMPT_FRAMEWORK["MessageType"]["INPUT_MESSAGE"],
}} INPUT_MESSAGE
@typedef {{
message: string | CustomTextStyling | TextWithDisplayOptions,
onStart?:(myId: string, a: TAKE_BACK_HELPER)=> void |  TAKEBACK_RESULT,
onDone?:(myId: string, a: TAKE_BACK_HELPER, res: string)=>void|TAKEBACK_RESULT|MESSAGES,
messageOn?: "middleTextLower" | "middleTextTop" | "middleTextUpper" | "dialogue",
type: PROMPT_FRAMEWORK["MessageType"]["OPTION_MESSAGE"],
options: string[],
}} OPTIONS_PROMPT
@typedef {{
message: string | CustomTextStyling | TextWithDisplayOptions,
onStart?:(myId: string, a: TAKE_BACK_HELPER)=> void |  TAKEBACK_RESULT,
onDone?:(myId: string, a: TAKE_BACK_HELPER)=>void|TAKEBACK_RESULT|MESSAGES,
messageOn?: "middleTextLower" | "middleTextTop" | "middleTextUpper" | "dialogue",
type: PROMPT_FRAMEWORK["MessageType"]["CLICK_PROMPT"],
typewritted?: boolean
}} CLICK_MESSAGE
@typedef{STANDARD_MESSAGE|INPUT_MESSAGE|CLICK_MESSAGE|OPTIONS_PROMPT}MESSAGE
@typedef {MESSAGE[]} MESSAGES
*/
