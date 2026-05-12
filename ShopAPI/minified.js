/**@typedef{`${number}`}PlayerId*/
/**
 * @template {(...args:any)=>any} T
 * @typedef {T extends (...args: infer P)=>any ? P : never} Parameters_
 */
/**@typedef{{
title?:string,
autoSelected?:boolean,
redDot?:boolean,
description?:string,
sortPriority?:number,
}} SHOP_CONFIG*/
/**@template{"global"|PlayerId}TARGET*/
class t{
/**@param{string}id@param{SHOP_CONFIG}config@param{TARGET}target*/
constructor(t,i,o){if(t.includes(":"))throw new Error("Do not pass a id with a : in it.");this.id=t,"global"!==i.for&&i.for?api.configureShopCategoryForPlayer(i.for,t,{autoSelectCategory:i.autoSelected,customTitle:i.title,redDot:i.redDot,forceRemoveRedDot:!i.redDot,sortPriority:i.sortPriority,description:i.description}):api.configureShopCategory(t,{autoSelectCategory:i.autoSelected,customTitle:i.title,redDot:i.redDot,forceRemoveRedDot:!i.redDot,sortPriority:i.sortPriority,description:i.description}),this.kap=[i.autoSelected,i.title,i.redDot,i.sortPriority,i.description,i.for],this.Item=class extends e{
/**@param{string}name
            @param{{[x:PlayerId]:ITEM_CONFIG,"global":ITEM_CONFIG&{for?:PlayerId|"global"}}[TARGET]}config*/
constructor(e,i){super(t,i.for??"global",e,i)}}}id;kap;get autoSelect(){return this.kap[0]}
/**@param{boolean}value*/set autoSelect(t){this.kap[0]=t,api.configureShopCategory(this.id,{autoSelectCategory:t})}get title(){return this.kap[1]}
/**@param{string}value*/set title(t){this.kap[1]=t,api.configureShopCategory(this.id,{customTitle:t})}get redDot(){return this.kap[2]}
/**@param{boolean}value*/set redDot(t){this.kap[2]=t,api.configureShopCategory(this.id,{redDot:t,forceRemoveRedDot:!t})}get sortPriority(){return this.kap[3]}
/**@param{number}value*/set sortPriority(t){this.kap[3]=t,api.configureShopCategory(this.id,{sortPriority:t})}get description(){return this.kap[4]}
/**@param{string}value*/set description(t){this.kap[4]=t,api.configureShopCategory(this.id,{description:t})}
/**@returns{boolean}*/get target(){return this.kap[5]}}class e{
/**
 * @template {PlayerId|"global"} TARGET
 @param{string}id
 @param{string}name
 * @param {TARGET} target
 * @param {{[x:PlayerId]:ITEM_CONFIG,"global":ITEM_CONFIG&{for?:PlayerId|"global"}}[TARGET]} config
 */
constructor(t,i,o,r){if(o.includes(":"))throw new Error("Do not pass a name with a : in it.");this.target=i,this.config=r,this.id=t,this.name=o,e.establish(t,o,i,r),e.items[`${t}::${o}`]={a:r.price,b:r.currency,c:[],d:[],e:[],f:r.onBoughtMessage}}id;name;static establish(t,i,o,r){"global"!==o||"global"!==r.for&&r.for?"global"===o&&"global"!==r.for?api.createShopItemForPlayer(r.for,t,i,e.convertConfigToShopItemConfig(i,r)):api.createShopItemForPlayer(o,t,i,e.convertConfigToShopItemConfig(i,r)):api.createShopItem(t,i,e.convertConfigToShopItemConfig(i,r))}update(){e.establish(this.id,this.name,this.target,this.config)}set title(t){this.config.title=t}get title(){return this.config.title}set price(t){this.config.price=t,e.items[`${this.id}::${this.name}`].a=t}get price(){return this.config.price}set onBoughtMessage(t){this.config.onBoughtMessage=t,e.items[`${this.id}::${this.name}`].f=t}get onBoughtMessage(){return this.config.onBoughtMessage}set currency(t){this.config.currency=t,e.items[`${this.id}::${this.name}`].b=t}get currency(){return this.config.currency}set badge(t){this.config.badge=t}get badge(){return this.config.badge}set buyButtonText(t){this.config.buyButtonText=t}get buyButtonText(){return this.config.buyButtonText}set disabled(t){this.config.disabled=t}get disabled(){return this.config.disabled}set redDot(t){this.config.redDot=t}get redDot(){return this.config.redDot}set hidden(t){this.config.hidden=t}get hidden(){return this.config.hidden}set image(t){this.config.image=t}get image(){return this.config.image}set description(t){this.config.description=t}get description(){return this.config.description}set sortPriority(t){this.config.sortPriority=t}get sortPriority(){return this.config.sortPriority}set userInput(t){this.config.userInput=t}get userInput(){return this.config.userInput}
/**@param{typeof Shop["TypeHelper"]["onC"]}fn*/onClick(t){e.items[`${this.id}::${this.name}`].c.push(t)}
/**@param{typeof Shop["TypeHelper"]["onBF"]}fn*/onFail(t){e.items[`${this.id}::${this.name}`].e.push(t)}
/**@param{typeof Shop["TypeHelper"]["onBF"]}fn*/onSuccess(t){e.items[`${this.id}::${this.name}`].d.push(t)}
/**@param{ITEM_CONFIG}config*/static convertConfigToShopItemConfig(t,e){
/**@type{ShopItem}*/
const i={badge:e.badge,customTitle:e.title,image:e.image?.icon,imageColour:e.image?.color,isRewardedAd:e.currency?.ad,description:e.description,canBuy:!e.disabled,hidden:e.hidden,buyButtonText:e.buyButtonText,redDot:e.redDot,forceRemoveRedDot:!e.redDot,sortPriority:e.sortPriority,userInput:e.userInput};return e.badge&&(i.badge=e.badge),("string"==typeof e.onBoughtMessage||e.onBoughtMessage?.[0])&&(i.buyButtonText=e.onBoughtMessage),i}
/**@type{Record<`${string}::${string}`,{a:number,b:CURRENCY,c:(typeof Shop["TypeHelper"]["onC"])[],d:(typeof Shop["TypeHelper"]["onBF"])[],e:(typeof Shop["TypeHelper"]["onBF"])[],f:ONBOUGHTMESSAGE}>}*/static items={}
/**@param{@param{PlayerId}playerId@param{string}cat@param{string}key@param{string}item@param{string}ui*/;static onPlayerBoughtShopItem(t,i,o,r,s){const n=e.items[`${i}::${o}`];if(n){let e=!1;n.b&&("string"==typeof n.b?api.getInventoryItemAmount(t,n.b)<n.a?e=!0:api.removeItemName(t,n.b,n.a):n.b.getCurrency&&(n.b.getCurrency(t)<n.a?e=!0:n.b.subtractCurrency(t,n.a))),n.c.forEach(i=>i(t,s,!e)),n[e?"e":"d"].forEach(e=>e(t,s)),n.f&&(n.f.success?api.sendOverShopInfo(t,e?n.f.fail?.(t,s):n.f.success?.(t,s)):api.sendOverShopInfo(t,n.f))}}target;config}onPlayerBoughtShopItem=e.onPlayerBoughtShopItem,t.TypeHelper={
/**@param{PlayerId}playerId@param{ShopItemUserInput}userInput}thisItem*/
OBM(t,e){},
/**@param{PlayerId}playerId@param{number}currency@returns{void}*/
sc(t,e){},
/**@param{string}playerId@param{ShopItemUserInput}userInput@param{boolean}buyWasSuccessful*/
onC(t,e,i){},
/**@param{string}playerId@param{ShopItemUserInput}userInput*/
onBF(t,e){}}
/**@typedef{{
getCurrency:(playerId)=>number,
subtractCurrency:typeof Shop["TypeHelper"]["sc"],
}|ItemName|{ad?:boolean}}CURRENCY*/
/**@typedef{{
success?:typeof Shop["TypeHelper"]["OBM"],
fail?:typeof Shop["TypeHelper"]["OBM"]
}|string|CustomTextStyling}ONBOUGHTMESSAGE*/
/**@typedef{{text:string|CustomTextStyling,type:"lucky"|"new"}}BADGE*/
/**@typedef{{
title?:string,
price?: number,
onBoughtMessage?: ONBOUGHTMESSAGE,
currency?: CURRENCY,
badge?:BADGE,
buyButtonText?: string|CustomTextStyling,
disabled?:boolean,
redDot?:boolean,
hidden?:boolean,
image?:{icon:string,color?:string},
description?:string,
userInput?: ShopItemUserInput,
sortPriority?:number
}}ITEM_CONFIG*/,globalThis.Shop=t;
