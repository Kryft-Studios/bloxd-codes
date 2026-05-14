
globalThis.economy = {};

globalThis.ECONOMY = {
    setup(myId) {
        economy[myId] = api.getPlayerDbValue(myId, "coinsEconomy") ?? 0;
        api.setClientOption(myId, "lobbyLeaderboardInfo", Object.assign(api.getClientOption(myId, "lobbyLeaderboardInfo"), { "coins": { displayName: "Coins", "sortOrder":"descending", "hidden": false } }));
        /**@type{LobbyLeaderboardInfo}*/
        api.setTargetedPlayerSettingForEveryone(myId, "lobbyLeaderboardValues", { ...api.getOtherEntitySetting(myId, myId, "lobbyLeaderboardValues"), "coins": economy[myId] ?? 0 }, true);
        api.applyEffect(myId, `${economy[myId]} Coins`, null, { icon: "Gold Coin" });
    },
    save(myId){
        api.setPlayerDbValue(myId, "coinsEconomy", economy[myId]);
    },
    close(myId) {
        this.save(myId)
        economy[myId] = null;
    }, // lemme save bro
    set(myId, amt) {
        api.removeEffect(myId, `${economy[myId]} Coins`);
        economy[myId] = amt;
        api.setTargetedPlayerSettingForEveryone(myId, "lobbyLeaderboardValues", { ...api.getOtherEntitySetting(myId, myId, "lobbyLeaderboardValues"), "coins": economy[myId] ?? 0 }, true);
        api.applyEffect(myId, `${economy[myId]} Coins`, null, { icon: "Gold Coin" });
    },
    get(myId) {
        return economy[myId];
    },
    add(myId, amt) {
        return ECONOMY.set(myId, economy[myId] + amt);
    },
    subtract(myId, amt) {
        return ECONOMY.set(myId,Math.max(economy[myId] - amt, 0));
    },
    has(myId,amt){
        return ECONOMY.get(myId)>=amt
    }
};
