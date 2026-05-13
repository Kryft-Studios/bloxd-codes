class Text3D {
    /**@param{pos}Pos@param{{subtitle?:{color?:string,styling:CustomTextStyling},content:{color?:string,styling:CustomTextStyling}}}styling*/
    constructor(pos,styling){
        this.style=styling,this.ent=Text3D.create(pos,styling)
    }
    ent
    style
    static create(pos,style){
        const ent=api.attemptCreateMeshEntity("Box",{width:0,height:0,depth:0})
        api.setPosition(ent,...pos)
        Text3D.setNameTagFromStyling(ent,style)
        return ent;
    }
    static setNameTagFromStyling(ent,style){
        api.setTargetedPlayerSettingForEveryone(ent,"nameTagInfo",{subtitle:style.subtitle?.styling,"subtitleBackgroundColor":style.subtitle?.color,content:style.content?.styling,backgroundColor:style.content?.color},true)
    }
    set styling(value){this.style=value;Text3D.setNameTagFromStyling(this.ent,value)}
    get styling(){return this.style}
    
}
globalThis.Text3D=Text3D
