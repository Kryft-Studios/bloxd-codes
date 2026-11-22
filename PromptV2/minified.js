export const PROMPT_FRAMEWORK=Object.freeze(/**@type{const}*/{MessageType:{STANDARD_MESSAGE:0,INPUT_MESSAGE:1,OPTION_MESSAGE:2,CLICK_PROMPT:3},typewriterEffect:{},
/**@type {Record<string, QUEUE>}*/
queue:{},onPlayerLeave(e){delete PROMPT_FRAMEWORK.queue[e],delete PROMPT_FRAMEWORK.playerMessage[e],delete PROMPT_FRAMEWORK.typewriterEffect[e]},onPlayerJoin(e){PROMPT_FRAMEWORK.queue[e]={queued:[]}},
/**@type {TAKE_BACK_HELPER}*/
takeBackHelper:{error:e=>[0,e],success:()=>[1,""],ResultCode:{ERROR:0,SUCCESS:1}},
/**@param{MESSAGES}messages@param{(myId: string)=>void}onDone*/
queuem(e,s,t){PROMPT_FRAMEWORK.queue[e].queued.push({currProg:0,onDone:t,alreadyBegan:!1,currentType:s[0].type,messages:s})},z_setterInputMessage(e,s,t){PROMPT_FRAMEWORK.z_setMessage(e,s,PROMPT_FRAMEWORK.z_createInputMessage(s,"\nInput: [ "+t+" ]","Type your input in chat"))},z_setterClickPrompt(e,s,t){const R={...s,message:t};PROMPT_FRAMEWORK.z_setMessage(e,s,PROMPT_FRAMEWORK.z_createInputMessage(R,"","Click to continue"))},
/**@param{STANDARD_MESSAGE}options*/
z_beginStandardMessage(e,s){if(s.onStart){const t=PROMPT_FRAMEWORK.z_runFenced(s.onStart,e,PROMPT_FRAMEWORK.takeBackHelper);if(t.ok&&0===t.res?.[0])return!1}return s.typewritted?PROMPT_FRAMEWORK.typewriterEffect[e]=PROMPT_FRAMEWORK.z_tpwritedTypewrittedEffect(e,s,PROMPT_FRAMEWORK.z_setMessage):PROMPT_FRAMEWORK.z_setMessage(e,s,s.message),!0},
/**@param{QUEUE}queue*/
z_pollQueued(e,s){if(0===s.queued.length)return;const t=s.queued[0];t.currentType!==PROMPT_FRAMEWORK.MessageType.STANDARD_MESSAGE||t.messages[0].typewritted||++t.currProg>=t.messages[0].time&&(PROMPT_FRAMEWORK.z_endStandardMessage(e,t.messages[0]),PROMPT_FRAMEWORK.z_endLast(e,s))},tick(){for(const e of api.getPlayerIds())PROMPT_FRAMEWORK.z_pollQueued(e,PROMPT_FRAMEWORK.queue[e]),PROMPT_FRAMEWORK.z_processNextInQueue(e,PROMPT_FRAMEWORK.queue[e]),PROMPT_FRAMEWORK.z_tickTypewriterEffect(e)},
/**@param{STANDARD_MESSAGE}options*/
z_endStandardMessage(e,s){const t=PROMPT_FRAMEWORK.z_runFenced(s.onDone,e);if(t.ok&&void 0!==t.res?.length){const s=PROMPT_FRAMEWORK.queue[e].queued[0].messages.shift();PROMPT_FRAMEWORK.queue[e].queued[0].messages.unshift(s,...t)}PROMPT_FRAMEWORK.z_setMessage(e,s,"")},z_tickTypewriterEffect(e){const s=PROMPT_FRAMEWORK.typewriterEffect[e];if(!s)return;s.next().done&&delete PROMPT_FRAMEWORK.typewriterEffect[e]},
/**@param{QUEUE}queue*/
z_endLast(e,s){const t=s.queued[0];if(t.messages.shift(),delete PROMPT_FRAMEWORK.typewriterEffect[e],0===t.messages.length)return PROMPT_FRAMEWORK.z_runFenced(t.onDone,e),void s.queued.shift();t.alreadyBegan=!1,t.currentType=t.messages[0].type},z_runFenced(e,...s){if(void 0===e)return{ok:!1,res:null};try{return{ok:!0,res:e(...s)}}catch(e){return console.log("[PROMPT_FRAMEWORK: FENCED FAIL] "+Object.entries(e)),{ok:!1,res:null}}},skipTypeWriterChars:new Set([" ","\n"]),*z_tpwritedTypewrittedEffect(e,s,t){if("string"==typeof s.message){let R="";for(let M=0;M<s.message.length;M++)R+=s.message[M],t(e,s,R),yield}else{const R="content"in s.message,M=R?s.message.content:s.message;let n=[];const r=M=>t(e,s,R?{...s.message,content:M}:M);for(let e=0;e<M.length;e++){const s=M[e];if("string"==typeof s.str){n.push({...s,str:""});for(let t=0;t<s.str.length;t++)n[e].str+=s.str[t],r(n),PROMPT_FRAMEWORK.skipTypeWriterChars.has(s.str[t])||(yield)}else n.push(s),r(n)}}s.typewritted=!1},
/**@param{INPUT_MESSAGE}options*/
z_beginInputMessage(e,s){if(s.onStart){const t=PROMPT_FRAMEWORK.z_runFenced(s.onStart,e,PROMPT_FRAMEWORK.takeBackHelper);if(t.ok&&0===t.res?.[0])return!1}return PROMPT_FRAMEWORK.z_setMessage(e,s,PROMPT_FRAMEWORK.z_createInputMessage(s,"\nInput: [  ]","Type your input in chat")),api.setClientOption(e,"customButtons",[{id:"ok_im",description:"OK",icon:"play",keycode:"KeyE"}]),!0},selectedMessage:{},
/**@param{OPTIONS_PROMPT}options*/
z_beginOptionMessage(e,s){if(s.options.length>=10)return console.log("Doesn't support options over length 10"),!1;if(s.onStart){const t=PROMPT_FRAMEWORK.z_runFenced(s.onStart,e,PROMPT_FRAMEWORK.takeBackHelper);if(t.ok&&0===t.res?.[0])return!1}return PROMPT_FRAMEWORK.z_setMessage(e,s,PROMPT_FRAMEWORK.z_createInputMessage(s,"\nSelected: [  ]","Press number keys to select options, or click the option")),api.setClientOption(e,"customButtons",[...s.options.map((e,s)=>({keycode:"Digit"+s,id:""+s,description:e,icon:"arrow-left"})),{description:"OK",id:"ok_om",keycode:"KeyE",icon:"play"}]),!0},
/**@param{MESSAGE}options*/
z_setMessage(e,s,t){api.setClientOption(e,s.messageOn??"middleTextLower",t)},
/**@param{CLICK_MESSAGE}clickMessage*/
z_beginClickPrompt(e,s){if(s.onStart){const t=PROMPT_FRAMEWORK.z_runFenced(s.onStart,e,PROMPT_FRAMEWORK.takeBackHelper);if(t.ok&&0===t.res?.[0])return!1}return s.typewritted?PROMPT_FRAMEWORK.typewriterEffect[e]=PROMPT_FRAMEWORK.z_tpwritedTypewrittedEffect(e,s,PROMPT_FRAMEWORK.z_setterClickPrompt):PROMPT_FRAMEWORK.z_setMessage(e,s,PROMPT_FRAMEWORK.z_createInputMessage(s,"","Click to continue")),!0},
/**@param{CLICK_MESSAGE}options*/
z_endClickPrompt(e,s){if(s.onDone){const t=PROMPT_FRAMEWORK.z_runFenced(s.onDone,e,PROMPT_FRAMEWORK.takeBackHelper);if(t.ok){if(0===t.res?.[0])return PROMPT_FRAMEWORK.z_setMessage(e,s,PROMPT_FRAMEWORK.z_inputMessageError("",s,t.res[1],"Click to continue")),!1;if(void 0!==t.res?.[0]?.type){const s=PROMPT_FRAMEWORK.queue[e].queued[0].messages.shift();PROMPT_FRAMEWORK.queue[e].queued[0].messages.unshift(s,...t.res)}}if(!t.ok)return PROMPT_FRAMEWORK.z_setMessage(e,s,PROMPT_FRAMEWORK.z_inputMessageError("",s,"Internal callback error","Click to continue")),!1}return PROMPT_FRAMEWORK.z_setMessage(e,s,""),delete PROMPT_FRAMEWORK.typewriterEffect[e],!0},onPlayerClick(e){PROMPT_FRAMEWORK.queue[e].queued.length>0&&PROMPT_FRAMEWORK.queue[e].queued[0].currentType===PROMPT_FRAMEWORK.MessageType.CLICK_PROMPT&&PROMPT_FRAMEWORK.z_endClickPrompt(e,PROMPT_FRAMEWORK.queue[e].queued[0].messages[0])&&PROMPT_FRAMEWORK.z_endLast(e,PROMPT_FRAMEWORK.queue[e])},
/**@param{INPUT_MESSAGE}options*/
z_createInputMessage:(e,s,t)=>"string"!=typeof e.message&&"content"in e.message?{showBackground:e.message.showBackground,content:[{str:t+"\n",style:{color:"gray"}},..."string"==typeof e.message.content?[e.message.content]:e.message.content,..."string"==typeof s?[s]:s]}:[{str:t+"\n",style:{color:"gray"}},..."string"==typeof e.message?[e.message]:e.message,..."string"==typeof s?[s]:s],playerMessage:{},onPlayerChat(e,s){if(PROMPT_FRAMEWORK.queue[e].queued.length>0&&PROMPT_FRAMEWORK.queue[e].queued[0].currentType===PROMPT_FRAMEWORK.MessageType.INPUT_MESSAGE)return PROMPT_FRAMEWORK.playerMessage[e]=s,PROMPT_FRAMEWORK.z_setMessage(e,PROMPT_FRAMEWORK.queue[e].queued[0].messages[0],PROMPT_FRAMEWORK.z_createInputMessage(PROMPT_FRAMEWORK.queue[e].queued[0].messages[0],"\nInput: [ "+s+" ]","Type your input in chat")),!1},z_inputMessageError:(e,s,t,R)=>PROMPT_FRAMEWORK.z_createInputMessage(s,[e,{str:"\n"+t,style:{color:"red"}}],R),
/**@param{INPUT_MESSAGE}options*/
z_endInputMessage(e,s){const t=PROMPT_FRAMEWORK.playerMessage[e];if(void 0===t)return PROMPT_FRAMEWORK.z_setMessage(e,s,PROMPT_FRAMEWORK.z_inputMessageError("\nInput: [ "+PROMPT_FRAMEWORK.playerMessage[e]+" ]",s,"No input given","Type your input in chat")),!1;if(s.onDone){const R=PROMPT_FRAMEWORK.z_runFenced(s.onDone,e,PROMPT_FRAMEWORK.takeBackHelper,t);if(R.ok){if(0===R.res?.[0])return PROMPT_FRAMEWORK.z_setMessage(e,s,PROMPT_FRAMEWORK.z_inputMessageError("\nInput: [ "+PROMPT_FRAMEWORK.playerMessage[e]+" ]",s,R.res[1],"Type your input in chat")),!1;if(void 0!==R.res?.[0]?.type){const s=PROMPT_FRAMEWORK.queue[e].queued[0].messages.shift();PROMPT_FRAMEWORK.queue[e].queued[0].messages.unshift(s,...R.res)}}if(!R.ok)return PROMPT_FRAMEWORK.z_setMessage(e,s,PROMPT_FRAMEWORK.z_inputMessageError("\nInput: [ "+PROMPT_FRAMEWORK.playerMessage[e]+" ]",s,"Internal callback error","Type your input in chat")),!1}return delete PROMPT_FRAMEWORK.playerMessage[e],PROMPT_FRAMEWORK.z_setMessage(e,s,""),api.setClientOption(e,"customButtons",[]),!0},
/**@param{OPTIONS_PROMPT}options*/
z_endOptionsMessage(e,s){const t=PROMPT_FRAMEWORK.selectedMessage[e];if(void 0===t)return PROMPT_FRAMEWORK.z_setMessage(e,s,PROMPT_FRAMEWORK.z_inputMessageError("\nSelected: [ "+PROMPT_FRAMEWORK.selectedMessage[e]+" ]",s,"No input given","Press number keys to select options, or click the option")),!1;if(s.onDone){const R=PROMPT_FRAMEWORK.z_runFenced(s.onDone,e,PROMPT_FRAMEWORK.takeBackHelper,t);if(R.ok){if(0===R.res?.[0])return PROMPT_FRAMEWORK.z_setMessage(e,s,PROMPT_FRAMEWORK.z_inputMessageError("\nSelected: [ "+PROMPT_FRAMEWORK.selectedMessage[e]+" ]",s,R.res[1],"Press number keys to select options, or click the option")),!1;if(void 0!==R.res?.[0]?.type){const s=PROMPT_FRAMEWORK.queue[e].queued[0].messages.shift();PROMPT_FRAMEWORK.queue[e].queued[0].messages.unshift(s,...R.res)}}if(!R.ok)return PROMPT_FRAMEWORK.z_setMessage(e,s,PROMPT_FRAMEWORK.z_inputMessageError("\nSelected: [ "+PROMPT_FRAMEWORK.selectedMessage[e]+" ]",s,"Internal callback error","No input given","Press number keys to select options, or click the option")),!1}return delete PROMPT_FRAMEWORK.selectedMessage[e],PROMPT_FRAMEWORK.z_setMessage(e,s,""),api.setClientOption(e,"customButtons",[]),!0},onPlayerPressedButton(e,s){"ok_im"===s&&PROMPT_FRAMEWORK.queue[e].queued.length>0&&PROMPT_FRAMEWORK.queue[e].queued[0].currentType===PROMPT_FRAMEWORK.MessageType.INPUT_MESSAGE?PROMPT_FRAMEWORK.z_endInputMessage(e,PROMPT_FRAMEWORK.queue[e].queued[0].messages[0])&&PROMPT_FRAMEWORK.z_endLast(e,PROMPT_FRAMEWORK.queue[e]):!Number.isNaN(Number(s))&&PROMPT_FRAMEWORK.queue[e].queued.length>0&&PROMPT_FRAMEWORK.queue[e].queued[0].currentType===PROMPT_FRAMEWORK.MessageType.OPTION_MESSAGE?(PROMPT_FRAMEWORK.z_setMessage(e,PROMPT_FRAMEWORK.queue[e].queued[0].messages[0],PROMPT_FRAMEWORK.z_createInputMessage(PROMPT_FRAMEWORK.queue[e].queued[0].messages[0],"\nInput: [ "+PROMPT_FRAMEWORK.queue[e].queued[0].messages[0].options[Number(s)]+" ]","Press number keys to select options, or click the option")),PROMPT_FRAMEWORK.selectedMessage[e]=Number(s)):"ok_om"===s&&PROMPT_FRAMEWORK.queue[e].queued.length>0&&PROMPT_FRAMEWORK.queue[e].queued[0].currentType===PROMPT_FRAMEWORK.MessageType.CLICK_PROMPT&&PROMPT_FRAMEWORK.z_endOptionsMessage(e,PROMPT_FRAMEWORK.queue[e].queued[0].messages[0])&&PROMPT_FRAMEWORK.z_endLast(e,PROMPT_FRAMEWORK.queue[e])},
/**@param{QUEUE}queue*/
z_processNextInQueue(e,s){if(s.queued.length<=0)return;const t=s.queued[0];if(!t.alreadyBegan){if(t.currentType===PROMPT_FRAMEWORK.MessageType.STANDARD_MESSAGE){if(!PROMPT_FRAMEWORK.z_beginStandardMessage(e,t.messages[0]))return PROMPT_FRAMEWORK.z_endLast(e,s),void PROMPT_FRAMEWORK.z_processNextInQueue(e,s)}else if(t.currentType===PROMPT_FRAMEWORK.MessageType.INPUT_MESSAGE){if(!PROMPT_FRAMEWORK.z_beginInputMessage(e,t.messages[0]))return PROMPT_FRAMEWORK.z_endLast(e,s),void PROMPT_FRAMEWORK.z_processNextInQueue(e,s)}else if(t.currentType===PROMPT_FRAMEWORK.MessageType.CLICK_PROMPT){if(!PROMPT_FRAMEWORK.z_beginClickPrompt(e,t.messages[0]))return PROMPT_FRAMEWORK.z_endLast(e,s),void PROMPT_FRAMEWORK.z_processNextInQueue(e,s)}else if(t.currentType===PROMPT_FRAMEWORK.MessageType.OPTION_MESSAGE&&!PROMPT_FRAMEWORK.z_beginOptionMessage(e,t.messages[0]))return PROMPT_FRAMEWORK.z_endLast(e,s),void PROMPT_FRAMEWORK.z_processNextInQueue(e,s);t.currProg=0,t.currentType=t.messages[0].type,t.alreadyBegan=!0}}})
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
