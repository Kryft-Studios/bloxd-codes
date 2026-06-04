



/**@typedef{(StaticDialogue|SelectionPromptDialogue<string[]>|ClickPromptDialogue)[]}ConversationSchema*/
/**@typedef{ConversationSchema|void}DialogueReturn*/
/**@typedef{{type:"Static",message:string,duration:number}}StaticDialogue*/
/**@template{string[]}Options
@typedef{{type:"SelectionPrompt",message:string,options:Options,onSelect:(myId:PlayerId,option: typeof Options[number])=>DialogueReturn}}SelectionPromptDialogue*/
/**@typedef{{type:"ClickPrompt",message:string,onClick:(myId:PlayerId)=>DialogueReturn}}ClickPromptDialogue*/
/**@typedef{{lastStatic?:QueuedCommandId,arr:ConversationSchema,isRunningPrompt:boolean,onComplete:(myId:PlayerId)=>any}} DiagStored*/ // Fixed missing }

globalThis.PROMPT = {
    /**@type{Record<PlayerId,DiagStored>}*/
    dialogues: {},

    /**@param{StaticDialogue}dia*/
    runStatic(myId, dia) {
        return PROMPT.dialogues[myId].lastStatic = api.queueMiddleTextLower(myId, dia.message, dia.duration);
    },

    guessAndRunNext(myId) {
        const diag = PROMPT.dialogues[myId];
        if (!diag || diag.isRunningPrompt) return;
        if (!PROMPT.poll(myId)) return;
        const next = diag.arr?.[0];
        if (!next) return;

        if (next.type === "Static") { return this.runNextStatic(myId); }
        if (next.type === "ClickPrompt") { return this.waitClickPrompt(myId); }
        if (next.type==="SelectionPrompt"){return this.startSelectPrompt(myId)}
    },
    /**@type{Record<PlayerId,{j:number,pos:0,ld:number}>}*/
    selectPrompts: {},
    startSelectPrompt(myId) {
        const dia = PROMPT.dialogues[myId];
        dia.isRunningPrompt = true;
        const currentDia = dia.arr[0];
        PROMPT.selectPrompts[myId] = {j:api.getClientOption(myId,"jumpAmount"),pos:0,ld:Date.now()};
        api.setClientOption(myId,"jumpAmount",1)
        const msgText = currentDia.message;
        api.setClientOption(myId, "middleTextLower", [
            ...(typeof msgText === "string" ? [{ str: msgText, style: { color: "#cef3ff" } }] : msgText),
            "\n",
            { icon: "mouse" },
            " Click to continue with your option | Press the jump button to move your cursor up | Press the crouch button to move your cursor down",
        ]);
        PROMPT.renderCrosshairText(myId,currentDia.options,0)
    },
    moveCursorUp(myId){
    const dia=PROMPT.dialogues[myId].arr[0].options
    const selectp=PROMPT.selectPrompts[myId]
    selectp.pos++
    if(selectp.pos<0)selectp.pos=dia.length-1
    else if(selectp.pos>=dia.length)selectp.pos=0
    return PROMPT.renderCrosshairText(myId,dia,selectp.pos)
    },
    moveCursorDown(myId){
    const dia=PROMPT.dialogues[myId].arr[0].options
    const selectp=PROMPT.selectPrompts[myId]
    selectp.pos--
    if(selectp.pos<0)selectp.pos=dia.length-1
    else if(selectp.pos>=dia.length)selectp.pos=0
    return PROMPT.renderCrosshairText(myId,dia,selectp.pos)
    },
    renderCrosshairText(myId,options,cursorPos){
    const opts=[...options]
    opts[cursorPos]="> "+opts[cursorPos]
    api.setClientOption(myId,"middleTextUpper",opts.join("\n"))
    },
    onPlayerJump(myId){
    if(PROMPT.selectPrompts[myId])PROMPT.moveCursorUp(myId)
    },
    handleSelectPromptTick(myId){
    if(PROMPT.selectPrompts[myId]&&api.isPlayerCrouching(myId)&&((Date.now()-PROMPT.selectPrompts[myId].ld)>=1000)){PROMPT.selectPrompts[myId].ld=Date.now();PROMPT.moveCursorDown(myId)}
    },
    /**@type{Record<PlayerId,true>}*/
    clickPrompts: {},

    waitClickPrompt(myId) {
        const dia = PROMPT.dialogues[myId];
        dia.isRunningPrompt = true;

        const currentDia = dia.arr[0];
        PROMPT.clickPrompts[myId] = true;

        const msgText = currentDia.message;
        api.setClientOption(myId, "middleTextLower", [
            ...(typeof msgText === "string" ? [{ str: msgText, style: { color: "#cef3ff" } }] : msgText),
            "\n",
            { icon: "mouse" },
            " Click anywhere to continue."
        ]);
    },

    onPlayerClick(myId) {
        if (PROMPT.clickPrompts[myId]) {
            api.setClientOption(myId, "middleTextLower", "");
            delete PROMPT.clickPrompts[myId];
            PROMPT.dialogues[myId].isRunningPrompt = false;

            const res = PROMPT.dialogues[myId].arr[0].onClick(myId);
            if (res) {
                PROMPT.dialogues[myId].arr = res;
            } else {
                PROMPT.dialogues[myId].arr.shift();
            }
        } else if(PROMPT.selectPrompts[myId]){
            const selectP=PROMPT.selectPrompts[myId]
            const dia=PROMPT.dialogues[myId]
            const ld=+selectP.pos
            api.setClientOptions(myId,{middleTextLower:"","middleTextUpper":"",jumpAmount:selectP.j})
            delete PROMPT.selectPrompts[myId]
            PROMPT.dialogues[myId].isRunningPrompt=false;
            const res =dia.arr[0].onSelect(myId,dia.arr[0].options[ld]);
            if (res) {
                PROMPT.dialogues[myId].arr = res;
            } else {
                PROMPT.dialogues[myId].arr.shift();
            }
        }
    },

    onPlayerLeave(myId) {
        delete PROMPT.clickPrompts[myId];
        delete PROMPT.dialogues[myId];
        delete PROMPT.selectPrompts[myId]
    },

    runNextStatic(myId) {
        if (!PROMPT.dialogues[myId]) return false;

        while (PROMPT.dialogues[myId].arr?.[0]?.type === "Static") {
            PROMPT.runStatic(myId, PROMPT.dialogues[myId].arr[0]);
            PROMPT.dialogues[myId].arr.shift();
        }
        return true;
    },

    /**
    * Polls dialogue completion.
    */
    ifdpolldel(myId) {
        const diagData = PROMPT.dialogues[myId];
        if (!diagData) return true;
        const poll = PROMPT.poll(myId);
        if (!poll) return false;
        if (PROMPT.dialogues[myId].arr.length === 0) {
            PROMPT.onAllComplete(myId);
        } else {
            delete PROMPT.dialogues[myId].lastStatic;
        }
        return poll;
    },

    onAllComplete(myId) {
        api.setClientOption(myId, "middleTextLower", "");
        if (PROMPT.dialogues[myId]?.onComplete) {
            PROMPT.dialogues[myId].onComplete(myId);
        }
        delete PROMPT.dialogues[myId];
    },

    poll(myId) {
        const d = PROMPT.dialogues[myId];
        if (!d || !d.lastStatic) return true;

        const status = api.getQueuedStatus(d.lastStatic);
        return status === "NOT_IN_QUEUE";
    },

    tick() {
        for (const myId of api.getPlayerIds()) {
            PROMPT.ifdpolldel(myId);
            PROMPT.guessAndRunNext(myId);
            PROMPT.handleSelectPromptTick(myId)
        }
    },

    /**@param{ConversationSchema}schema @param{(myId:PlayerId)=>any}onComplete*/
    dialogue(myId, schema, onComplete) {
        PROMPT.dialogues[myId] = { arr: schema, "isRunningPrompt": false, onComplete };
    },
};

tick = PROMPT.tick;
onPlayerClick = PROMPT.onPlayerClick;
onPlayerLeave = PROMPT.onPlayerLeave;
onPlayerJump=PROMPT.onPlayerJump
