// write or paste code here
export const PROMPT_FRAMEWORK=Object.freeze(/**@type{const}*/{MessageType:{STANDARD_MESSAGE:0,INPUT_MESSAGE:1,OPTION_MESSAGE:2,CLICK_PROMPT:3},typewriterEffect:{},
/**@type {Record<string, QUEUE>}*/
queue:{},onPlayerLeave(e){delete PROMPT_FRAMEWORK.queue[e],delete PROMPT_FRAMEWORK.playerMessage[e],delete PROMPT_FRAMEWORK.typewriterEffect[e],delete PROMPT_FRAMEWORK.selectedMessage[e]},onPlayerJoin(e){PROMPT_FRAMEWORK.queue[e]={queued:[]}},
/**@type {TAKE_BACK_HELPER}*/
takeBackHelper:{error:e=>[0,e],success:()=>[1,""],ResultCode:{ERROR:0,SUCCESS:1}},
/**@param{MESSAGES}messages@param{(myId: string)=>void}onDone*/
queuem(e,s,R){PROMPT_FRAMEWORK.queue[e].queued.push({currProg:0,onDone:R,alreadyBegan:!1,currentType:s[0].type,messages:s})},z_setterInputMessage(e,s,R){PROMPT_FRAMEWORK.z_setMessage(e,s,PROMPT_FRAMEWORK.z_createInputMessage(s,"\nInput: [ "+R+" ]","Type your input in chat"))},z_setterClickPrompt(e,s,R){const t={...s,message:R};PROMPT_FRAMEWORK.z_setMessage(e,s,PROMPT_FRAMEWORK.z_createInputMessage(t,"","Click to continue"))},
/**@param{STANDARD_MESSAGE}options*/
z_beginStandardMessage(e,s){if(s.onStart){const R=PROMPT_FRAMEWORK.z_runFenced(s.onStart,e,PROMPT_FRAMEWORK.takeBackHelper);if(R.ok&&0===R.res?.[0])return!1}return s.typewritted?PROMPT_FRAMEWORK.typewriterEffect[e]=PROMPT_FRAMEWORK.z_tpwritedTypewrittedEffect(e,s,PROMPT_FRAMEWORK.z_setMessage):PROMPT_FRAMEWORK.z_setMessage(e,s,s.message),!0},
/**@param{QUEUE}queue*/
z_pollQueued(e,s){if(0===s.queued.length)return;const R=s.queued[0];R.currentType!==PROMPT_FRAMEWORK.MessageType.STANDARD_MESSAGE||R.messages[0].typewritted||++R.currProg>=R.messages[0].time&&(PROMPT_FRAMEWORK.z_endStandardMessage(e,R.messages[0]),PROMPT_FRAMEWORK.z_endLast(e,s))},tick(){for(const e of api.getPlayerIds())PROMPT_FRAMEWORK.z_pollQueued(e,PROMPT_FRAMEWORK.queue[e]),PROMPT_FRAMEWORK.z_processNextInQueue(e,PROMPT_FRAMEWORK.queue[e]),PROMPT_FRAMEWORK.z_tickTypewriterEffect(e)},
/**@param{STANDARD_MESSAGE}options*/
z_endStandardMessage(e,s){const R=PROMPT_FRAMEWORK.z_runFenced(s.onDone,e);if(R.ok&&void 0!==R.res?.length){const s=PROMPT_FRAMEWORK.queue[e].queued[0].messages.shift();PROMPT_FRAMEWORK.queue[e].queued[0].messages.unshift(s,...R)}PROMPT_FRAMEWORK.z_setMessage(e,s,"")},z_tickTypewriterEffect(e){const s=PROMPT_FRAMEWORK.typewriterEffect[e];s&&s.next().done&&delete PROMPT_FRAMEWORK.typewriterEffect[e]},
/**@param{QUEUE}queue*/
z_endLast(e,s){const R=s.queued[0];if(R.messages.shift(),delete PROMPT_FRAMEWORK.typewriterEffect[e],0===R.messages.length)return PROMPT_FRAMEWORK.z_runFenced(R.onDone,e),void s.queued.shift();R.alreadyBegan=!1,R.currentType=R.messages[0].type},z_runFenced(e,...s){if(void 0===e)return{ok:!1,res:null};try{return{ok:!0,res:e(...s)}}catch(e){return console.log("[PROMPT_FRAMEWORK: FENCED FAIL] "+Object.entries(e)),{ok:!1,res:null}}},skipTypeWriterChars:new Set([" ","\n"]),*z_tpwritedTypewrittedEffect(e,s,R){if("string"==typeof s.message){let t="";for(let M=0;M<s.message.length;M++)t+=s.message[M],R(e,s,t),yield}else{const t="content"in s.message,M=t?s.message.content:s.message;let n=[];const r=M=>R(e,s,t?{...s.message,content:M}:M);for(let e=0;e<M.length;e++){const s=M[e];if("string"==typeof s.str){n.push({...s,str:""});for(let R=0;R<s.str.length;R++)n[e].str+=s.str[R],r(n),PROMPT_FRAMEWORK.skipTypeWriterChars.has(s.str[R])||(yield)}else n.push(s),r(n)}}s.typewritted=!1},
/**@param{INPUT_MESSAGE}options*/
z_beginInputMessage(e,s){if(s.onStart){const R=PROMPT_FRAMEWORK.z_runFenced(s.onStart,e,PROMPT_FRAMEWORK.takeBackHelper);if(R.ok&&0===R.res?.[0])return!1}return PROMPT_FRAMEWORK.z_setMessage(e,s,PROMPT_FRAMEWORK.z_createInputMessage(s,"\nInput: [  ]","Type your input in chat")),api.setClientOption(e,"customButtons",[{id:"ok_im",description:"OK",icon:"play",keycode:"KeyE"}]),!0},selectedMessage:{},
/**@param{OPTIONS_PROMPT}options*/
z_beginOptionMessage(e,s){if(s.options.length>=10)return console.log("Doesn't support options over length 10"),!1;if(s.onStart){const R=PROMPT_FRAMEWORK.z_runFenced(s.onStart,e,PROMPT_FRAMEWORK.takeBackHelper);if(R.ok&&0===R.res?.[0])return!1}return PROMPT_FRAMEWORK.z_setMessage(e,s,PROMPT_FRAMEWORK.z_createInputMessage(s,"\nSelected: [  ]","Press number keys to select options, or click the option")),api.setClientOption(e,"customButtons",[...s.options.map((e,s)=>({keycode:"Digit"+s,id:""+s,description:e,icon:"arrow-left"})),{description:"OK",id:"ok_om",keycode:"KeyE",icon:"play"}]),!0},
/**@param{MESSAGE}options*/
z_setMessage(e,s,R){api.setClientOption(e,s.messageOn??"middleTextLower",R)},
/**@param{CLICK_MESSAGE}clickMessage*/
z_beginClickPrompt(e,s){if(s.onStart){const R=PROMPT_FRAMEWORK.z_runFenced(s.onStart,e,PROMPT_FRAMEWORK.takeBackHelper);if(R.ok&&0===R.res?.[0])return!1}return s.typewritted?PROMPT_FRAMEWORK.typewriterEffect[e]=PROMPT_FRAMEWORK.z_tpwritedTypewrittedEffect(e,s,PROMPT_FRAMEWORK.z_setterClickPrompt):PROMPT_FRAMEWORK.z_setMessage(e,s,PROMPT_FRAMEWORK.z_createInputMessage(s,"","Click to continue")),!0},
/**@param{CLICK_MESSAGE}options*/
z_endClickPrompt(e,s){if(s.onDone){const R=PROMPT_FRAMEWORK.z_runFenced(s.onDone,e,PROMPT_FRAMEWORK.takeBackHelper);if(R.ok){if(0===R.res?.[0])return PROMPT_FRAMEWORK.z_setMessage(e,s,PROMPT_FRAMEWORK.z_inputMessageError("",s,R.res[1],"Click to continue")),!1;if(void 0!==R.res?.[0]?.type){const s=PROMPT_FRAMEWORK.queue[e].queued[0].messages.shift();PROMPT_FRAMEWORK.queue[e].queued[0].messages.unshift(s,...R.res)}}if(!R.ok)return PROMPT_FRAMEWORK.z_setMessage(e,s,PROMPT_FRAMEWORK.z_inputMessageError("",s,"Internal callback error","Click to continue")),!1}return PROMPT_FRAMEWORK.z_setMessage(e,s,""),delete PROMPT_FRAMEWORK.typewriterEffect[e],!0},onPlayerClick(e){PROMPT_FRAMEWORK.queue[e].queued.length>0&&PROMPT_FRAMEWORK.queue[e].queued[0].currentType===PROMPT_FRAMEWORK.MessageType.CLICK_PROMPT&&PROMPT_FRAMEWORK.z_endClickPrompt(e,PROMPT_FRAMEWORK.queue[e].queued[0].messages[0])&&PROMPT_FRAMEWORK.z_endLast(e,PROMPT_FRAMEWORK.queue[e])},
/**@param{INPUT_MESSAGE}options*/
z_createInputMessage:(e,s,R)=>"string"!=typeof e.message&&"content"in e.message?{showBackground:e.message.showBackground,content:[{str:R+"\n",style:{color:"gray"}},..."string"==typeof e.message.content?[e.message.content]:e.message.content,..."string"==typeof s?[s]:s]}:[{str:R+"\n",style:{color:"gray"}},..."string"==typeof e.message?[e.message]:e.message,..."string"==typeof s?[s]:s],playerMessage:{},onPlayerChat(e,s){if(PROMPT_FRAMEWORK.queue[e].queued.length>0&&PROMPT_FRAMEWORK.queue[e].queued[0].currentType===PROMPT_FRAMEWORK.MessageType.INPUT_MESSAGE)return PROMPT_FRAMEWORK.playerMessage[e]=s,PROMPT_FRAMEWORK.z_setMessage(e,PROMPT_FRAMEWORK.queue[e].queued[0].messages[0],PROMPT_FRAMEWORK.z_createInputMessage(PROMPT_FRAMEWORK.queue[e].queued[0].messages[0],"\nInput: [ "+s+" ]","Type your input in chat")),!1},z_inputMessageError:(e,s,R,t)=>PROMPT_FRAMEWORK.z_createInputMessage(s,[e,{str:"\n"+R,style:{color:"red"}}],t),
/**@param{INPUT_MESSAGE}options*/
z_endInputMessage(e,s){const R=PROMPT_FRAMEWORK.playerMessage[e];if(void 0===R)return PROMPT_FRAMEWORK.z_setMessage(e,s,PROMPT_FRAMEWORK.z_inputMessageError("\nInput: [ "+PROMPT_FRAMEWORK.playerMessage[e]+" ]",s,"No input given","Type your input in chat")),!1;if(s.onDone){const t=PROMPT_FRAMEWORK.z_runFenced(s.onDone,e,PROMPT_FRAMEWORK.takeBackHelper,R);if(t.ok){if(0===t.res?.[0])return PROMPT_FRAMEWORK.z_setMessage(e,s,PROMPT_FRAMEWORK.z_inputMessageError("\nInput: [ "+PROMPT_FRAMEWORK.playerMessage[e]+" ]",s,t.res[1],"Type your input in chat")),!1;if(void 0!==t.res?.[0]?.type){const s=PROMPT_FRAMEWORK.queue[e].queued[0].messages.shift();PROMPT_FRAMEWORK.queue[e].queued[0].messages.unshift(s,...t.res)}}if(!t.ok)return PROMPT_FRAMEWORK.z_setMessage(e,s,PROMPT_FRAMEWORK.z_inputMessageError("\nInput: [ "+PROMPT_FRAMEWORK.playerMessage[e]+" ]",s,"Internal callback error","Type your input in chat")),!1}return delete PROMPT_FRAMEWORK.playerMessage[e],PROMPT_FRAMEWORK.z_setMessage(e,s,""),api.setClientOption(e,"customButtons",[]),!0},
/**@param{OPTIONS_PROMPT}options*/
z_endOptionsMessage(e,s){const R=PROMPT_FRAMEWORK.selectedMessage[e];if(void 0===R)return PROMPT_FRAMEWORK.z_setMessage(e,s,PROMPT_FRAMEWORK.z_inputMessageError("\nSelected: [ "+PROMPT_FRAMEWORK.selectedMessage[e]+" ]",s,"No input given","Press number keys to select options, or click the option")),!1;if(s.onDone){const t=PROMPT_FRAMEWORK.z_runFenced(s.onDone,e,PROMPT_FRAMEWORK.takeBackHelper,R);if(t.ok){if(0===t.res?.[0])return PROMPT_FRAMEWORK.z_setMessage(e,s,PROMPT_FRAMEWORK.z_inputMessageError("\nSelected: [ "+PROMPT_FRAMEWORK.selectedMessage[e]+" ]",s,t.res[1],"Press number keys to select options, or click the option")),!1;if(void 0!==t.res?.[0]?.type){const s=PROMPT_FRAMEWORK.queue[e].queued[0].messages.shift();PROMPT_FRAMEWORK.queue[e].queued[0].messages.unshift(s,...t.res)}}if(!t.ok)return PROMPT_FRAMEWORK.z_setMessage(e,s,PROMPT_FRAMEWORK.z_inputMessageError("\nSelected: [ "+PROMPT_FRAMEWORK.selectedMessage[e]+" ]",s,"Internal callback error","No input given","Press number keys to select options, or click the option")),!1}return delete PROMPT_FRAMEWORK.selectedMessage[e],PROMPT_FRAMEWORK.z_setMessage(e,s,""),api.setClientOption(e,"customButtons",[]),!0},onPlayerPressedButton(e,s){"ok_im"===s&&PROMPT_FRAMEWORK.queue[e].queued.length>0&&PROMPT_FRAMEWORK.queue[e].queued[0].currentType===PROMPT_FRAMEWORK.MessageType.INPUT_MESSAGE?PROMPT_FRAMEWORK.z_endInputMessage(e,PROMPT_FRAMEWORK.queue[e].queued[0].messages[0])&&PROMPT_FRAMEWORK.z_endLast(e,PROMPT_FRAMEWORK.queue[e]):!Number.isNaN(Number(s))&&PROMPT_FRAMEWORK.queue[e].queued.length>0&&PROMPT_FRAMEWORK.queue[e].queued[0].currentType===PROMPT_FRAMEWORK.MessageType.OPTION_MESSAGE?(PROMPT_FRAMEWORK.z_setMessage(e,PROMPT_FRAMEWORK.queue[e].queued[0].messages[0],PROMPT_FRAMEWORK.z_createInputMessage(PROMPT_FRAMEWORK.queue[e].queued[0].messages[0],"\nInput: [ "+PROMPT_FRAMEWORK.queue[e].queued[0].messages[0].options[Number(s)]+" ]","Press number keys to select options, or click the option")),PROMPT_FRAMEWORK.selectedMessage[e]=Number(s)):"ok_om"===s&&PROMPT_FRAMEWORK.queue[e].queued.length>0&&PROMPT_FRAMEWORK.queue[e].queued[0].currentType===PROMPT_FRAMEWORK.MessageType.OPTION_MESSAGE&&PROMPT_FRAMEWORK.z_endOptionsMessage(e,PROMPT_FRAMEWORK.queue[e].queued[0].messages[0])&&PROMPT_FRAMEWORK.z_endLast(e,PROMPT_FRAMEWORK.queue[e])},
/**@param{QUEUE}queue*/
z_processNextInQueue(e,s){if(s.queued.length<=0)return;const R=s.queued[0];if(!R.alreadyBegan){if(R.currentType===PROMPT_FRAMEWORK.MessageType.STANDARD_MESSAGE){if(!PROMPT_FRAMEWORK.z_beginStandardMessage(e,R.messages[0]))return PROMPT_FRAMEWORK.z_endLast(e,s),void PROMPT_FRAMEWORK.z_processNextInQueue(e,s)}else if(R.currentType===PROMPT_FRAMEWORK.MessageType.INPUT_MESSAGE){if(!PROMPT_FRAMEWORK.z_beginInputMessage(e,R.messages[0]))return PROMPT_FRAMEWORK.z_endLast(e,s),void PROMPT_FRAMEWORK.z_processNextInQueue(e,s)}else if(R.currentType===PROMPT_FRAMEWORK.MessageType.CLICK_PROMPT){if(!PROMPT_FRAMEWORK.z_beginClickPrompt(e,R.messages[0]))return PROMPT_FRAMEWORK.z_endLast(e,s),void PROMPT_FRAMEWORK.z_processNextInQueue(e,s)}else if(R.currentType===PROMPT_FRAMEWORK.MessageType.OPTION_MESSAGE&&!PROMPT_FRAMEWORK.z_beginOptionMessage(e,R.messages[0]))return PROMPT_FRAMEWORK.z_endLast(e,s),void PROMPT_FRAMEWORK.z_processNextInQueue(e,s);R.currProg=0,R.currentType=R.messages[0].type,R.alreadyBegan=!0}}})
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
messageOn?: "middleTextLower" | "middleTextTop" | "middleTextUpper",
type: PROMPT_FRAMEWORK["MessageType"]["STANDARD_MESSAGE"]
typewritted?:boolean
}} STANDARD_MESSAGE
@typedef {{
message: string | CustomTextStyling | TextWithDisplayOptions,
onStart?:(myId: string, a: TAKE_BACK_HELPER)=> void |  TAKEBACK_RESULT,
onDone?:(myId: string, a: TAKE_BACK_HELPER, res: string)=>void|TAKEBACK_RESULT|MESSAGES,
messageOn?: "middleTextLower" | "middleTextTop" | "middleTextUpper",
type: PROMPT_FRAMEWORK["MessageType"]["INPUT_MESSAGE"],
}} INPUT_MESSAGE
@typedef {{
message: string | CustomTextStyling | TextWithDisplayOptions,
onStart?:(myId: string, a: TAKE_BACK_HELPER)=> void |  TAKEBACK_RESULT,
onDone?:(myId: string, a: TAKE_BACK_HELPER, res: string)=>void|TAKEBACK_RESULT|MESSAGES,
messageOn?: "middleTextLower" | "middleTextTop" | "middleTextUpper",
type: PROMPT_FRAMEWORK["MessageType"]["OPTION_MESSAGE"],
options: string[],
}} OPTIONS_PROMPT
@typedef {{
message: string | CustomTextStyling | TextWithDisplayOptions,
onStart?:(myId: string, a: TAKE_BACK_HELPER)=> void |  TAKEBACK_RESULT,
onDone?:(myId: string, a: TAKE_BACK_HELPER)=>void|TAKEBACK_RESULT|MESSAGES,
messageOn?: "middleTextLower" | "middleTextTop" | "middleTextUpper",
type: PROMPT_FRAMEWORK["MessageType"]["CLICK_PROMPT"],
typewritted?: boolean
}} CLICK_MESSAGE
@typedef{STANDARD_MESSAGE|INPUT_MESSAGE|CLICK_MESSAGE|OPTIONS_PROMPT}MESSAGE
@typedef {MESSAGE[]} MESSAGES
*/;
