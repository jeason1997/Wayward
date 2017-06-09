/*
 Copyright Unlok, Vaughn Royko 2011-2014
 http://www.unlok.ca

 Credits & Thanks:
 /www.unlok.ca/wiki/wayward/credits-thanks/

 Wayward is a copyrighted and licensed work. Please read the license before attempting to modify:
 /www.unlok.ca/wayward-license/
 */

/*
 Contained within this file is the full english text in Wayward. This file is never loaded. It is a template to do a full translation of the game. It can then be loaded as a modification (for now) to load in a different or edited language.

 To see the differences of this file from version to version, use a tool like /www.diffchecker.com/ to do a new translation without needing to re-do the entire file.
 */

//Overwrite Messages definitions
Messages = {
    savedManually: "游戏已经手动存档成功.",
    saved: "游戏已存储.",
    restarted: "游戏已经重新开始.",
    deleteSavedData: "删除所有保存数据。之后请刷新此页.",
    nextSongPlaying: "下一首歌曲即将播放...",
    soundDisabled: "音乐或音效已被禁用.",
    gatheringDisabled: "自动收集已禁用.",
    gatheringEnabled: "自动收集已开启.",
    pickupDisabled: "自动拾取已禁用.",
    pickupEnabled: "自动拾取已开启.",
    hintsDisabled: "提示已禁用.",
    hintsEnabled: "提示已开启.",
    fileNotFound: "文件没有找到!",
    fileNotReadable: "文件不能读取!",
    fileError: "读取该文件出错.",
    modLoaded: "MOD已被载入!",
    notSupported: "你的浏览器不支持此功能.",
    cannotSee: "你不能看到任何东西.",
    youSeeTile: "你看 _0_.",
    youSeeMonster: "你看 _0_.",
    youSeeAberrantMonster: "你看 _0_, 但是看起来不正确.",
    creatureHealthy: "这个生物看起来很健康.",
    creatureUnhealthy: "这个生物看起来不太健康.",
    creatureUnimpaired: "这个生物看起来没受伤.",
    creatureHurt: "这个生物看起来很痛苦.",
    creatureVeryInjured: "这个生物看起来受了很严重的伤.",
    creatureUndamaged: "这个生物很健康，而且没有受伤.",
    creatureBarelyHurt: "这个生物看起来几乎没有受伤.",
    creatureInjured: "这个生物看起来受伤了.",
    creatureDamaged: "这个生物看起来受了非常严重的伤.",
    creatureHealth: "这个生物只有 _0_% 生命.",
    youSeeItems: "你发现 _0_.",
    youSeeContainer: "你发现 _0_.",
    containerItems: "这包括: _0_.",
    youUnequip: "你卸下了 _0_.",
    equipToShoot: '你需要装备它来进行设计!',
    noRoom: '在这里没有下降的空间!',
    inTheWay: "有一些东西放在这里阻碍了道路.",
    waterDrop: '你下降到 _0_ 的伸出.',
    waterStir: '你在深处惊醒了一个生物!',
    fireDrop: '你下降到 _0_ 进入了火中.',
    fireDropAll: '你试图把所有 _0_ 扔进火里.',
    cannotDrop: '你不能把 _0_ 扔在这里!',
    dropAllGround: '你试图把所有 _0_ 扔在地上!',
    dropItem: '你把 _0_ 扔在地上!',
    noRoomContainer: "没有更多的空间来容纳这个物品.",
    containerContainer: "你不能在一个容器中放置另一个容器.",
    dropAllContainer: '你试图把所有的 _0_ 放进容器中!',
    dropContainer: '你把 _0_ 放进容器中.',
    containerBackpack: '你把容器的物品转移到了背包!',
    error: "发生了一个错误.",
    craftsSortedName: "制作物品按名称排序.",
    craftsSortedSkill: "制作物品按技能排序.",
    inventory: "背包",
    container: "容器",
    sortName: "_0_ 按名称排序.",
    sortGroup: "_0_ 按类别排序.",
    sortWeight: "_0_ 按重量排序.",
    sortOldest: "_0_ 按最旧的排序.",
    sortNewest: "_0_ 按最新的排序.",
    gameSavedMB: "你的游戏已存储! 你的游戏存档已占用 _0_MB.",
    cannotSave: "保存失败，因为你的浏览器不支持本地存储.",
    musicMuted: "音乐静音.",
    musicUnmuted: "取消音乐静音.",
    soundsMuted: "全部声音静音.",
    soundsUnmuted: "全部声音取消静音.",
    sounds50: "全部声音设置为 50% 音量.",
    sounds100: "全部声音设置为 100% 音量.",
    fireExtinguished: "火几乎熄灭.",
    fireStruggling: "火努力的燃烧着.",
    fireHealthy: "火非常正常.",
    fireRaging: "火焰很狂暴.",
    plantNotFertile: "这个植物看起来产量不高.",
    plantFertile: "这个植物很高产.",
    plantVeryHealthy: "这个植物非常健康而且高产.",
    awakeContinue: "你醒来后发现自己在你最后离开的地方...",
    awake: "当你清醒过来的时候，你却发现你不再是公司里的原来的那个好员工，你也不在那个精美的航船上. 相反，你却发现你破烂的衣服的口袋内却装满了一些低劣的物品，财宝？......看来你似乎还记得一些关于宝藏的事情.",
    experienceBenefits: "你之前的经验能为你的生存提供益处.",
    endGame: "将财产放回家后, 你又出发了...",
    killed: "你被杀死了!",
    burned: "你被严重烧伤! 你失去了 _0_ 生命!",
    burnedEquipment: "火焰吞噬了你, 但是你的装备令你免收火焰的灼烧.",
    trampleFire: "你把火踩灭了!",
    killedMonster: "你击杀了 _0_!",
    overburdened: "你背了太多东西，太沉了!",
    locked: "这个对象被锁定了.",
    trapInjured: "你因为碰到陷阱而受伤了!",
    trapNoDamage: "你将陷阱解除了，但是它们并没有伤害你.",
    trapNoActivation: "你移动了这些陷阱，但是并没有将它解除!",
    burningPainEnd: "你不再感觉到燃烧产生的疼痛!",
    trampling: "Y你踩坏了 _0_.",
    trampled: "你踩坏了 _0_ 在地上.",
    monsterTrample: "_0_ 踩坏了 _1_ 在地上.",
    destroyed: "_0_ 因为使用已被摧毁.",
    needRepair: "_0_ 需要修复.",
    caveEntrance: "你发现了一个山洞入口!",
    milestoneEarned: "你已经赢得了一个里程碑, _0_! _1_",
    itemCrafted: "你制作了 _0_!",
    itemCooked: "你烹调了 _0_!",
    itemPickup: "你拿起了 _0_.",
    recipeLearned: "你已经了解了如何创造 _0_!",
    itemEnvironmentalRequired: "这一物品需要你面对在 _0_ 手动创造它.",
    cannotCraft: "你不能在这制造.",
    craftFail: "你不能 _0_ _1_.",
    monsterIdol: "这个怪物神像将吸引其他的生物.",
    monsterHit: "_0_ 给你带来了 _1_ 伤害! _2_",
    bleedingStart: "你开始血流不止!",
    poisonedStart: "你已经中毒!",
    monsterMiss: "_0_ 没对你造成任何伤害.",
    monsterTrapHurt: "_0_ 踩到陷阱受到伤害!",
    monsterYourTrapHurt: "_0_ 受到你的陷阱的攻击!",
    starvingStart: "你饿死了!",
    dehydrationStart: "你快死于脱水!",
    automaticSave: "自动保存你的游戏...",
    bleedingEnd: "已经止血了!",
    bleedingDamage: "你快因流血过多而死了! 你失去了 _0_ 生命!",
    poisonEnd: "The poison has worked its course!",
    poisonDamage: "你快因中毒而亡了! 你失去了 _0_ 生命!",
    burningDamage: "你感觉到灼痛! 你失去了 _0_ 生命!",
    itemDecay: "你的 _0_ 腐烂了.",
    overEating: "你已经吃太多了! 你失去了 10 耐力.",
    overHydrating: "你喝太多了! 你失去了 10 耐力.",
    gainedHealth: "你获得了 _0_ 生命.",
    lostHealth: "你失去了 _0_ 生命.",
    gainedStamina: "你获得了 _0_ 耐力.",
    lostStamina: "你失去了 _0_ 耐力.",
    gainedHunger: "你获得了 _0_ 饥饿.",
    lostHunger: "你失去了 _0_ 饥饿.",
    gainedThirst: "你获得了 _0_ 口渴.",
    lostThirst: "你失去了 _0_ 口渴.",
    skillGain: "你的技能 _0_ 经验增长效果 _1_%!",
    exhaustion: "你工作到精疲力尽!",
    dexterityGain: "你感觉自己变得更加敏捷了!",
    metabolismGain: "你的新陈代谢变缓了!",
    strengthGain: "你感觉到自己变得更加强壮了!",
    noUse: "你想不到方法来直接使用这个.",
    equipItem: "你装备了 _0_.",
    cantEquipThere: "你不能在这里装备这个!",
    cantEquip: "你不能装备这个!",
    fireAmmoObstacle: "你放火 _0_ 来阻碍它.",
    fireAmmo: "你点燃了 _0_.",
    brokenAmmo: "_0_ 射击时被打破!",
    noAmmo: '你没有任何弹药,武器装备在你的包裹或容器!',
    notEnoughStrength: '你没有足够的力量来投掷这个!',
    throwObstacle: "你投掷 _0_ 来阻碍它.",
    throwItem: "你投掷了 _0_!",
    brokenImpact: '_0_ 打破了影响!',
    immuneMonster: "你用_0_ 似乎没有对 _1_造成伤害.",
    healMonster: "_0_ 从 _1_ 汲取能量!",
    noDamage: "_1_ 没有给 _0_造成伤害! _2_",
    weaponDamagedMonster: "你攻击_0_ 造成 _1_ 伤害利用 _2_! _3_",
    slimeSplit: "_0_ 裂开了.",
    hurtHands: "攻击 _0_ 导致你的手受伤了因为你没有任何武器!",
    missedMonster: "你用 _1_ 攻击 _0_，但是它躲过去了!",
    inWayCarving: "这里有些东西挡住了你的道路!",
    carveCorpse: "你切开并砍碎了尸体.",
    cannotPickupWithItems: "你不能将里面的物品捡起!",
    cannotPickupWhenLit: "你不能当它点燃时将它捡起.",
    nothingToCarve: "这里没有任何东西可以切开!",
    noMap: "这张地图不是这个地区的.",
    guardians: "你召唤出了宝藏的守护者.",
    treasureNet: "你需要一个渔网，才能够得到这件珍宝.",
    treasureShovel: "你需要一把铲子，以便能够挖这个宝藏.",
    treasureBlocked: "你找到了藏宝点，但是它却被堵塞了.",
    decodeMapFull: "你已经完全解锁了全地图.",
    decodeMapPartial: "你已经解锁了部分地图.",
    treasureExact: "你目前正处在宝藏的确切埋藏点.",
    treasureWalking: "你的宝藏点距离你只有几步之遥.",
    treasureFar: "你的宝藏点距离你十分的遥远.",
    treasureNoWhereNear: "你的附近没有藏宝点.",
    cantDecipher: "你不能破译地图.",
    inWayDigging: "这里有一些有关于你挖掘的事情!",
    inWayDiggingCorpse: "这里有一些有关于你挖掘的事情.你必须先切开它.",
    cannotDigState: "你当前不能进行挖掘.",
    cannotDigWithItems: "你不能挖掘里面的物品!",
    cannotDig: "你不能挖这里!",
    itemUse: '你使用了 _0_!',
    curedBleeding: '你已经停止流血!',
    drank: '你喝了 _0_!',
    curedPoison: '你成功解毒!',
    curedBurning: '你燃烧所产生的痛感有所减轻!',
    ate: '你吃了 _0_!',
    noWaterStill: "这里仍然没有水.",
    requiresFireStill: "这仍然需要在开始净化水的时候，在它下面点燃火焰.",
    notEnoughWaterStill: "这里仍然没有足够多的可用纯净水.",
    fireWaitStill: "你必须等到火熄灭时，才能得到可用的纯净水.",
    waterFill: "你装满了 _0_.",
    noWaterToFill: "这里没有任何东西可以填满 _0_.",
    castLineFish: "你把你的线扔到 _0_ .",
    cantFish: "你不能为了_0_钓鱼.",
    inWayFish: "路上有一些东西堵住了去路，你不能通过这里去钓鱼!",
    shadowInWaterFish: "你看见水里出现了一个阴影.",
    seaweedFish: "你把一个黏糊糊的水藻拖出了水面!",
    noWaterFish: "没有水是很难抓到鱼的，试着创造一些水!",
    noFish: "这个位置目前没有鱼!",
    catchFish: '你抓住了一条鱼!',
    failFish: "你不能抓住一条鱼!",
    hurtGathering: "你伤到了你的手，因为你没有用工具便进行采集.",
    fireNoGathering: "你不能从那里进行收集，因为它着火了!",
    requiresFacingFire: "这个物品需要你拿着它面向火源，以光源照亮它.",
    noLockpick: "你不会面对一个锁定的对象.",
    lockpick: "你解锁了木箱，并可以检查里面的内容.",
    lockpickFail: "你不能撬锁将其打开.",
    spyglass: "你这个小望远镜向远方进行窥视，看到了遥远的地平线.",
    spyglassUnderground: "你看不清地下的远处有些什么东西.",
    noSun: "这里十分阴暗，没有太阳可以生火.",
    sunNotBrightEnough: "太阳不够明亮，以至于不足以在这里进行生火!",
    noKindling: "你没有引火物可以生火.",
    noTinder: "你没有易燃物可以生火.",
    noFuellike: "你没有任何可以生火的物品.",
    noWaterPurifyStill: "这水仍然没有被净化!",
    cannotStartFire: "你不能在这里放火!",
    startFire: "你放了火!",
    startFireFail: "你不能放火!",
    bottleOpen: "你在瓶子中发现了 _0_ !",
    bottleMush: "潮湿的纸张被你触摸后变成了浆糊.",
    cannotPlaceFromHere: "你不能把东西安置在这里.",
    inWayOfPlacing: "应该把东西放置在这里.",
    landNeeded: '你应该在放置物品之前在此建立一个水坑.',
    cannotPlace: '你不能在这个地方.',
    waterTravel: "你需要在海中开始你的旅行.",
    cannotTravel: "你需要在户外开始你的旅行.",
    //noLandRaft: "You cannot see any land in that direction.", //Removed 1.8.2
    raft: "你开始使用木筏.",
    masterOfCrafts: "你是一个真正的工艺品大师, 卷轴将为你提供任何有用的信息.",
    reinforce: "你强化了这个物品.",
    failReinforce: "你对这个物品的强化失败.",
    cannotReinforce: "这个物品不能被强化.",
    noItemReinforce: "你并没有对有效的物品进行强化.",
    breakRepair: "该物品被摔成了碎片，无法被修复.",
    repair: "你修复了这个道具.",
    failRepair: "你不能修复这个道具.",
    fullyRepair: "这个道具已经被完全修复.",
    cannotRepair: "这个道具不能被修复.",
    noItemRepair: "你不能对一个有效的物品进行修复.",
    cannotRest: "你不能在这里休息.",
    restBegin: "你开始休息...",
    restWarm: "面对火焰，你感到温暖和欣慰.",
    restTurns: "你休息了 _0_ 小时.",
    restInterrupted: "你的休息被中断!",
    feelRested: "你感觉需要休息更长时间.",
    timeMidDay: "似乎到中午了.",
    timeSunSetting: "太阳正在移动.",
    timeDusk: "似乎有些昏暗.",
    timeNight: "似乎到晚上了.",
    timeSunRising: "太阳正在升起.",
    timeDawn: "似乎到黎明了.",
    dayThird: "它目前正处于第三季中的白天.",
    dayFourth: "它目前正处于第四季中的白天.",
    dayFirst: "它目前正处于第一季中的白天.",
    daySecond: "它目前正处于第二季中的白天.",
    nightFirst: "它目前正处于第一季中的晚上.",
    nightSecond: "它目前正处于第二季中的晚上.",
    nightThird: "它目前正处于第三季中的晚上.",
    nightFourth: "它目前正处于第四季中的晚上.",
    transmogrify: "你转变了这个物品.",
    failTransmogrify: "你转变这个物品失败.",
    cannotTransmogrify: "这个物品不能被转变.",
    noItemTransmogrify: "你面对的不是一个有效的转变物品.",
    noTreasure: "你没有足够的财宝可以回家.",
    cannotPlant: '你不能将 _0_ 种植在这里!',
    plantItem: '你将 _0_ 种在地上.',
    failPlant: '你不能把 _0_ 种在地上.',
    stokeFire: "你向火添加了燃料! 火变得更旺盛了.",
    noStokeFire: "这里没有助燃物 _0_ 可以加入火中!",
    noGardenEffect: "土壤会对这种植物没有影响.",
    garden: "你使种植植物的土壤的肥力得到了提高.",
    noGarden: "这个花园里没有任何东西和 _0_ 在这!",
    cannotPlaceThis: '你不能把_0_ 放在这里!',
    buildItem: "你设置了 _0_.",
    noBuild: "你不能在这里建造 _0_ !",
    freshWaterStill: '这种水不需要进行脱盐处理!',
    waterInStill: '这里仍然还有一些水!',
    noWaterEffect: "水会对这种植物没有影响.",
    pourWater: "你把水倒出来.",
    pourWaterStill: "你仍然再把水倒入.",
    pourExtinguish: "你熄灭了火焰.",
    pourFertility: "你用水来提高植物的土壤肥力.",
    removeFromContainer: "删除容器中的物品",
    removeAllFromContainer: "删除容器中的所有物品",
    unEquip: "脱下",
    equipTo: "装备 ",
    removeFromQuickslot: "从快捷栏中移除",
    addToQuickslot: "添加进快捷栏",
    dropInOpenedContainer: "丢弃打开的容器里的东西",
    dropAllInOpenedContainer: "丢弃打开的容器里的全部东西",
    throw: "投掷",
    drop: "丢弃",
    dropAll: "丢弃全部",
    hiddenMilestone: "这个里程碑是隐藏的.",
    invisibleMilestone: "这个里程碑是无形的.",
    health: "生命: _0_",
    stamina: "耐力: _0_",
    hunger: "饥饿: _0_",
    thirst: "口渴: _0_",
    bleeding: "出血, ",
    poisoned: "中毒, ",
    burningPain: "灼痛, ",
    nearDeath: "接近死亡, ",
    exhausted: "疲惫, ",
    starving: "饥饿, ",
    dehydrated: "脱水, ",
    healthy: "健康",
    suicide: "你确定你想要杀死这个角色并失去所有的进度吗?",
    deleteSave: "你确定要永久删除所有保存数据吗?",
    travelAway: "你确定你想远离这片土地去旅行吗?你永远不能回头。一定要带够你所需要的!",
    beta: "测试版",
    begin: "点击/空格键 开始",
    copyright: "任意岛 ? 2014 Unlok.",
    playAtYourOwnRisk: "你正在使用 _0_ _1_. 任何问题由你们自己承担!",
    unknownBrowser: "未知浏览器种类! 任何问题由你们自己承担!",
    browser: "你正在使用 _0_ _1_.",
    win: "你赢了!",
    restart: "点击/空格键 重新开始",
    lost: "你死了!",
    talent: "天赋: _0_",
    turns: "时间: _0_",
    score: "分数: _0_",
    disableHints: "禁用提示",
    previousHint: "之前的提示",
    nextHint: "下一个提示",
    grabAll: "抓起全部",
    //sortContainer: "Sort Container", //Removed 1.7.4
    yes: "是",
    no: "不",
    //sortInventory: "Sort Inventory", //Removed 1.7.4
    //sortCrafts: "Sort Crafts", //Removed 1.7.4
    clearMessages: "清理信息",
    volume100: "100% 音量",
    volume50: "50% 音量",
    soundOn: "音效 开",
    soundOff: "音效 关",
    musicOn: "音乐 开",
    musicOff: "音乐 关",
    autoGatherOn: "自动收集 开",
    autoGatherOff: "自动收集 关",
    autoPickupOn: "自动拾取 开",
    autoPickupOff: "自动拾取 关",
    enableHints: "启用提示",
    pixelFont: "像素字体",
    alternateFont: "备用字体",
    fullGameSize: "最大游戏尺寸",
    smallGameSize: "816x816 游戏尺寸",
    windowedMode: "窗口模式",
    fullscreen: "全屏",
    animationsOn: "动画 开",
    animationsOff: "动画 关",
    smoothMovementOn: "烟雾平滑处理 开",
    smoothMovementOff: "烟雾平滑处理 关",
    use: "使用:",
    uses: "用途:",
    equip: "装备:",
    rangedDamage: "伤害范围:",
    attack: "攻击",
    defense: "防御",
    notAvailable: "N/A",
    ranged: "射程:",
    range: "范围:",
    rangedAttack: "攻击射程:",
    onEquip: "已装备:",
    grouping: "分组:",
    weight: "重量:",
    maximumWeight: "最大重量:",
    weightReduction: "W减重:",
    durability: "耐久:",
    decay: "腐烂:",
    consumed: "消耗",
    environmentalRequired: "环境需求:",
    skill: "技能:",
    level: "等级:",
    requires: "需求:",
    //loading: "Loading...", //Removed 1.7.4
    mainMenu: "主菜单",
    wayward: "任意岛测试版 " + game.release, //Edited 1.7.3
    startGame: "开始游戏",
    continueGame: "继续游戏",
    dailyChallengeMode: "极限挑战模式(不能存档)", //Edited 1.9
    returnToGame: "返回游戏",
    saveAndContinue: "保存并继续",
    saveAndExit: "保存并退出",
    endCurrentGame: "结束当前游戏 (自杀)",
    reset: "删除全部游戏数据",
    skills: "技能",
    milestones: "里程碑",
    //filterInventory: "Filter Inventory", //Removed 1.9
    equipment: "装备",
    hands: "手",
    head: "头",
    neck: "颈",
    rightHand: "右手 (握住)",
    chest: "胸",
    leftHand: "左手 (握住)",
    belt: "腰带",
    legs: "腿",
    feet: "脚",
    back: "背",
    crafting: "制作",
    //filterCrafting: "Filter Crafting", //Removed 1.9
    messages: "讯息",
    options: "选项",
    nextSong: "下一首歌",
    gameOptions: "游戏选项",
    zoomIn: "放大 +",
    zoomOut: "缩小 -",
    modding: "模组 (试验)",
    trustedMods: "只载入你信任的模组文件!",
    hints: "提示",
    version: "版本不同", //Edited 1.7.4
    versionInfo: '保存内容检测到与此游戏版本不同，无法兼容.如果你想继续玩这个版本的游戏，请您选择新游戏重新开始.<br/><br/>或者, 你可以从 <a href="/www.indiedb.com/games/wayward/downloads">下载一个离线的与你存档版本相同版本的游戏</a> 以便你可以继续你的存档进行游戏. 或许你可以 在<a href="/www.unlok.ca/wayward-mods/">进行修改</a> 以使你可以从备份文件中可以保存或加载你的游戏.<br/><br/>你是否想删除你的旧存档并继续游戏?',
    help: "帮助",
    attackLabel: "攻击:",
    defenseLabel: "防御:",
    talentLabel: "天赋:",
    statusLabel: "状态:",
    tooDamaged: "_0_ 袭击造成了大量损伤对于 _1_.",
    place: "地点",
    build: "建造",
    plant: "种植",
    //Added All 1.7.2
    treasureDig: "你挖到宝藏了.",
    thereIsBadWater: "这里仍然有未净化的水.",
    thereIsGoodWater: "这里仍然有净化过的水.",
    cannotPickupWhenFull: "你不能当它装满水时将它拿起.",
    //End Added
    sound: "音效",
    sort: "分类",
    dropOnGatherOn: "收集掉落物 打开",
    dropOnGatherOff: "收集掉落物 关闭",
    //Added All 1.8.2
    noMaps: "你并没有任何的藏宝图!",
    noTreasureRange: "你不在埋藏宝藏的范围内!",
    raftTravel: "需要在深海才能使用救生筏.",
    raftStop: "你停止使用救生筏.",
    //End Added
    showHiddenMob: "_0_ 出现!",
    //Added All 1.8.4
    code: "代码",
    runCode: "运行代码",
    runningCode: "正在运行代码...",
    //End Added
    //Added All 1.8.5
    actions: "动作",
    inspect: "检查",
    drink: "喝",
    carvingNeeded: "雕刻工具需要获得一具尸体.",
    pickUp: "提取",
    gather: "收集",
    //End Added
    //Added All 1.8.6
    cannotSleep: "你不能在这里睡觉.",
    sleepBegin: "你开始睡觉...",
    sleepTurns: "你睡了 _0_ 小时.",
    sleepInterrupted: "你的睡眠被打断!",
    rest: "休息",
    staminaFull: "你的耐力已经满了,你不需要休息了.",
    //End Added
    //Added All 1.9
    slashing: "劈砍",
    blunt: "钝击",
    piercing: "刺穿",
    fire: "火",
    simple: "简单",
    intermediate: "中级",
    advanced: "高级",
    expert: "专家",
    held: "握住",
    filter: "过滤",
    effective: "这似乎是有效的.",
    ineffective: "它似乎是无效的.",
    effectiveIneffective: "这似乎是有效和无效的不同的方式.",
    fist: "你的拳头",
    //End Added
    //Added All 1.9.1
    travel: "你旅行到遥远的土地...",
    youOpenThe: "你打开了 _0_.",
    helpDocumentation: "帮助文档",
    donations: "捐赠",
    removeBlood: "你移除了鲜血.",
    //End Added
    //Added All 1.9.2
    base: "基础: ",
    resists: "抵抗: ",
    vulnerabilities: "缺陷: ",
    with: "with",
    bluntLabel: "钝击抵抗:",
    piercingLabel: "刺穿抵抗:",
    slashingLabel: "劈砍抵抗:",
    fireLabel: "火焰抵抗:",
    defenseParryLabel: "来自于格挡的防御力:",
    defenseBaseLabel: "基础防御力:",
    attackTacticsLabel: "来自战术的攻击力:",
    attackBaseLabel: "基础攻击力:",
    rightHandLabel: "右手攻击力:",
    leftHandLabel: "左手攻击力:",
    resistant: "你的护甲抵抗了攻击伤害.",
    vulnerable: "你的护甲易受到攻击伤害.",
    noBlackPowder: "你没有任何能射击的黑火药武器.",
    preserve: "你腌制了食物.",
    failPreserve: "你不能腌制食物.",
    cannotPreserve: "这个物品不能被腌制.",
    noItemPreserve: "你面对的不是一个可腌制的食物.",
    alreadyPreserve: "这个食物已经腌制的很好了."
    //End Added
};

//Environmentals
environmentals.mushrooms_ground.name = "普通的蘑菇";
environmentals.redmushroom_ground.name = "红斑蘑菇";
environmentals.yellowflowers.name = "黄花";
environmentals.grassseeds_ground.name = "种植草籽";
environmentals.thistle.name = "蓟";
environmentals.vines.name = "葡萄藤";
environmentals.seaweed_ground.name = "海藻";
environmentals.blood.name = "鲜血";
environmentals.sapling_ground.name = "小树苗";
environmentals.brambles.name = "荆棘";
environmentals.cactus.name = "仙人掌";
environmentals.bush.name = "灌木";
environmentals.fire.name = "火";
environmentals.rockpatch.name = "岩石";
environmentals.bear_corpse.name = "一头熊的尸体";
environmentals.rabbit_corpse.name = "一个兔子的尸体";
environmentals.giantrat_corpse.name = "一个巨型老鼠的尸体";
environmentals.greywolf_corpse.name = "一个灰狼的尸体";
environmentals.vampirebat_corpse.name = "一个吸血蝙蝠的尸体";
environmentals.snake_corpse.name = "一个蛇的尸体";
environmentals.slime_corpse.name = "一个史莱姆的尸体";
environmentals.jellycube_corpse.name = "一个巨型史莱姆的尸体";
environmentals.giantspider_corpse.name = "一个巨型蜘蛛的尸体";
environmentals.zombie_corpse.name = "一个僵尸的尸体";
environmentals.imp_corpse.name = "一个小恶魔的尸体";
environmentals.bogling_corpse.name = "一个令人害怕的尸体";
environmentals.livingrock_corpse.name = "一个岩石傀儡的尸体";
environmentals.shark_corpse.name = "一个鲨鱼的尸体";
environmentals.campfire_unlit.name = "一个熄灭的篝火";
environmentals.campfire_lit.name = "一个点燃的篝火";
environmentals.furnace_unlit.name = "一个熄灭的炉子";
environmentals.furnace_lit.name = "一个点燃的炉子";
environmentals.kiln_unlit.name = "一个熄灭的烧窑";
environmentals.kiln_lit.name = "一个点燃的烧窑";
environmentals.rat_corpse.name = "一个老鼠的尸体";
environmentals.skeleton_corpse.name = "一个骸骨尸体";
environmentals.pirateghost_corpse.name = "一个海盗幽灵的尸体";
environmentals.timeskitter_corpse.name = "一个古老的尸体";
environmentals.chicken_corpse.name = "一个鸡的尸体";
environmentals.forgeandanvil_unlit.name = "一个熄灭的锻炉和铁毡";
environmentals.forgeandanvil_lit.name = "一个燃烧的锻炉和铁毡";
environmentals.woodenchest_unlocked.name = "一个木箱";
environmentals.woodenchest_locked.name = "一个上锁的木箱";
environmentals.tallgrass.name = "草丛";
environmentals.pineappleplant.name = "一个菠萝";
environmentals.trapdoorspider_corpse.name = "一个活板门的蜘蛛尸体";
environmentals.fireelemental_corpse.name = "一堆灰烬";
environmentals.wildonion_ground.name = "一个野洋葱";
environmentals.torchstand_unlit.name = "熄灭的火炬架";
environmentals.torchstand_lit.name = "燃烧的火炬架";
environmentals.cotton_ground.name = "棉花";
environmentals.hobgoblin_corpse.name = "怪物的尸体";
environmentals.deadfall_set.name = "设置一个大型陷阱";
environmentals.snare_set.name = "设置一个小型陷阱";
environmentals.snare_set_monster.name = "设置一个小型陷阱";
environmentals.solarstill_set.name = "太阳能蒸馏器";
environmentals.stonewaterstill_unlit.name = "熄灭的蒸馏水器";
environmentals.stonewaterstill_lit.name = "点燃蒸馏水器";
environmentals.livingmushroom_corpse.name = "一个活生生的蘑菇的尸体";
environmentals.kraken_corpse.name = "一个海怪的尸体";
environmentals.monsteridol.name = "一个怪物的神像";
environmentals.woodenfence.name = "木栅栏";
environmentals.harpy_corpse.name = "一个鹰身女妖的尸体"; //Added 1.7.4
environmentals.firesource.name = "火源";

//Items
items.amber.name = "琥珀";
items.animalskull.name = "一个动物的头骨";
items.arrow.name = "一支箭";
items.arrowhead.name = "一个石头箭头";
items.ashpile.name = "一堆灰烬";
items.barkleggings.name = "树皮紧身裤";
items.barkshield.name = "树皮盾";
items.barktunic.name = "一件树皮外衣";
items.bone.name = "一根骨头";
items.branch.name = "一根树枝";
items.cactusspines.name = "仙人掌的刺";
items.charcoal.name = "木炭";
//items.cobblestonefloor.name = "Cobblestone Flooring"; //Removed 1.8.1
items.cobblestone.name = "鹅卵石地板"; //Added 1.8.1
items.cookedmeat.name = "熟肉";
items.earthworm.name = "蚯蚓";
items.feather.name = "一根羽毛";
items.fertilesoil.name = "肥沃的土壤";
items.seawaterwaterskin.name = "装满海水的革制水袋";
items.fireplough.name = "火犁";
items.flowerseeds.name = "花种";
items.fossil.name = "一块化石";
items.goldcoins.name = "金币";
items.goldenchalice.name = "黄金圣杯";
items.goldenring.name = "黄金戒指";
items.goldensword.name = "黄金之剑";
items.grassseeds.name = "草种";
items.ironore.name = "铁矿石";
items.kindling.name = "引火物";
items.largerock.name = "大石头";
items.leafbedroll.name = "叶子铺盖";
items.leather.name = "皮革睡袋";
items.leaves.name = "树叶";
items.limestone.name = "石灰岩";
items.log.name = "原木";
items.mortarandpestle.name = "研钵及研杵";
items.mushrooms.name = "常见的蘑菇";
items.nopal.name = "仙人掌";
items.peat.name = "泥煤";
items.sandstone.name = "砂岩";
items.pileofgravel.name = "堆砾石";
items.pileofsand.name = "沙洲堆积图";
items.woodenarrow.name = "木箭";
items.stoneaxe.name = "石斧";
items.bandage.name = "绷带";
items.wovenfabric.name = "织物";
items.cactusneedle.name = "仙人掌的针";
items.stoneshovel.name = "石铲";
items.woodenspear.name = "木矛";
items.suture.name = "缝合线";
items.raft.name = "救生筏";
items.rawmeat.name = "生肉";
items.redberries.name = "红浆果";
items.redmushroom.name = "斑点红色蘑菇";
items.rope.name = "绳索";
items.sapling.name = "树苗";
items.seaweed.name = "海藻";
items.sharpglass.name = "锋利的玻璃";
items.sharprock.name = "锋利的岩石";
items.skullcap.name = "无沿便帽";
items.smoothrock.name = "流沙岩石";
items.soil.name = "泥土";
items.spear.name = "石矛"; //Edited 1.9
items.stones.name = "石头";
items.stonewall.name = "石墙";
items.string.name = "细绳";
items.strippedbark.name = "剥落的树皮";
items.tannedleather.name = "粗鞣革";
items.tannin.name = "鞣制";
items.thistleseeds.name = "蓟种子";
items.treebark.name = "树皮";
items.treefungus.name = "白木耳";
items.treevine.name = "葡萄树";
items.twigs.name = "细树枝";
items.waterskin.name = "革制水袋";
items.woodenpole.name = "木杆";
items.peatbandage.name = "泥炭绷带";
items.bow.name = "弓";
items.bowdrill.name = "弓钻";
items.fishingnet.name = "渔网";
items.rawtrout.name = "生鲑鱼";
items.cookedtrout.name = "煮熟的鲑鱼";
items.campfire.name = "篝火";
items.treevinewhip.name = "葡萄树鞭";
items.pileofsnow.name = "一堆血";
items.barktorch.name = "树皮火炬";
items.barktorch_lit.name = "树皮点燃的火炬";
items.handdrill.name = "手钻";
items.smallbag.name = "小包";
items.shale.name = "页岩";
items.sharpenedbone.name = "磨骨";
items.grindstone.name = "磨石";
items.rawfishsteak.name = "生鱼片";
items.cookedfishsteak.name = "煮熟的鱼排";
items.desalinatedwaterwaterskin.name = "装满淡水的革制水袋";
items.boatpaddle.name = "木浆";
items.bullboat.name = "大船";
items.refinedsand.name = "精制沙";
items.spyglass.name = "小望远镜";
items.flask.name = "烧瓶";
items.rawclay.name = "未加工的粘土";
items.rawclayblowpipe.name = "生粘土吹管";
items.clayblowpipe.name = "粘土吹管";
items.leatherbelt.name = "皮带";
items.leathertunic.name = "皮革束腰外衣";
items.leatherboots.name = "皮靴";
items.leathercap.name = "皮帽";
items.leathergorget.name = "皮革饰领";
items.leatherpants.name = "皮裤";
items.leathergloves.name = "皮手套";
items.furnace.name = "炉子";
items.kiln.name = "窑";
items.irontongs.name = "铁钳";
items.talc.name = "滑石";
items.talcumpowder.name = "滑石粉";
items.sandcastflask.name = "砂型铸造瓶";
items.lens.name = "透镜";
items.plantroots.name = "植物根"; //Edited 1.9.1
items.lockpick.name = "撬锁工具";
items.boneneedle.name = "骨针";
items.pineapple.name = "菠萝";
items.tatteredmap.name = "破烂的地图";
items.coal.name = "煤";
items.wroughtiron.name = "熟铁";
items.limestonepowder.name = "石灰石粉";
items.ironingot.name = "铁锭";
items.backpack.name = "双肩背包";
items.rottenmeat.name = "烂肉";
items.stonehammer.name = "石锤";
items.rawchicken.name = "生鸡肉";
items.cookedchicken.name = "熟鸡肉";
items.forgeandanvil.name = "熔炉和铁砧";
items.woodenchest.name = "木制外衣";
items.ironsword.name = "铁剑";
items.ironbreastplate.name = "钢铁胸甲";
items.ironboots.name = "铁靴";
items.ironhelmet.name = "钢盔";
items.irongorget.name = "钢铁颈甲";
items.irongreaves.name = "铁渣";
items.irongauntlets.name = "钢铁手套";
items.ironshield.name = "钢盾";
items.sandstonewall.name = "沙墙";
items.sandstonefloor.name = "砂岩地板";
items.spidersilk.name = "蜘蛛丝";
items.animalfat.name = "动物油";
items.animalfattorch.name = "动物油火炬";
items.clayflakes.name = "粘土片";
items.greensand.name = "湿沙";
items.oldinstructionalscroll.name = "旧的指引卷轴";
items.slimegelatin.name = "史莱姆凝胶";
items.glue.name = "胶水";
items.cookedspider.name = "熟蜘蛛";
items.deadspider.name = "死蜘蛛";
items.ironlockpick.name = "铁质撬锁工具";
items.rottingvegetation.name = "腐烂的植物";
items.wildonion.name = "野生圆葱";
items.ironhammer.name = "铁锤";
items.ironspear.name = "铁矛";
items.ironshovel.name = "铁铲";
items.irondoubleaxe.name = "铁质双刃斧";
items.ironpickaxe.name = "铁质丁字斧";
items.torchstand.name = "放置火炬";
items.coconut.name = "椰子";
items.palmleaf.name = "棕榈叶";
items.offal.name = "内脏";
items.bones.name = "骨骼";
items.poletorch_lit.name = "点燃的火炬";
items.cotton.name = "棉花";
items.cottonseeds.name = "棉花种子";
items.cottonfabric.name = "棉布";
items.bonepole.name = "骨杆";
items.tourniquet.name = "止血带";
items.wroughtironpickaxe.name = "熟铁丁字斧";
items.wroughtirondoubleaxe.name = "熟铁双刃斧";
items.wroughtironshovel.name = "熟铁铁铲";
items.wroughtironspear.name = "熟铁长矛";
items.wroughtironhammer.name = "熟铁铁锤";
items.wroughtironlockpick.name = "熟铁撬锁工具";
items.wroughtironshield.name = "熟铁盾牌";
items.wroughtirongauntlets.name = "熟铁手套";
items.wroughtirongreaves.name = "熟铁残渣";
items.wroughtirongorget.name = "熟铁颈甲";
items.wroughtironhelmet.name = "熟铁头盔";
items.wroughtironboots.name = "熟铁长靴";
items.wroughtironbreastplate.name = "熟铁胸甲";
items.wroughtironsword.name = "熟铁长剑";
items.woodenwall.name = "木墙";
items.woodenfloor.name = "木质地板";
items.woodendoor.name = "木门";
items.fishingrod.name = "鱼竿";
items.messageinabottle.name = "唱片";
items.carbonpowder.name = "碳粉";
items.pileofcompost.name = "堆肥";
items.meltedamber.name = "融化的琥珀";
items.tinder.name = "火绒";
items.deadfall.name = "陷阱";
items.snare.name = "圈套";
items.medicinalwaterwaterskin.name = "装满药水的革制水袋";
items.charcoalbandage.name = "木炭绷带";
items.woodentongs.name = "木钳";
items.wroughtirontongs.name = "熟铁钳";
items.sheetofglass.name = "一片玻璃";
items.solarstill.name = "太阳能蒸馏器";
items.stonewaterstill.name = "石质蒸馏器";
items.sundial.name = "日冕";
items.animalfattorch_lit.name = "点燃的动物油脂火炬";
items.sinew.name = "蹄筋";
items.shortbow.name = "短弓";
items.longbow.name = "长弓";
items.compositebow.name = "复合弓";
items.purifiedfreshwaterwaterskin.name = "装满纯净水的革制水袋";
items.unpurifiedfreshwaterwaterskin.name = "装满未净化的淡水的革制水袋";
items.glassbottle.name = "玻璃瓶";
items.cork.name = "软木塞";
items.seawaterglassbottle.name = "装满海水的玻璃瓶";
items.desalinatedwaterglassbottle.name = "装满淡水的玻璃瓶";
items.medicinalwaterglassbottle.name = "装满药水的玻璃瓶";
items.purifiedfreshwaterglassbottle.name = "装满纯净水的玻璃瓶";
items.unpurifiedfreshwaterglassbottle.name = "装满未净化淡水的玻璃瓶";
items.wroughtironarrow.name = "熟铁箭";
items.ironarrow.name = "铁箭";
items.stonebullet.name = "石弹";
items.wroughtironbullet.name = "熟铁子弹";
items.ironbullet.name = "铁子弹";
items.leatherquiver.name = "皮革箭袋";
items.ectoplasm.name = "外胚质层";
items.magicalessence.name = "神奇的精华"; //Edited 1.9.2
items.woodenfence.name = "木栅栏";
items.monsteridol.name = "怪物偶像";
items.cordedsling.name = "吊绳";
items.leathersling.name = "皮革吊绳";
items.wroughtironarrowhead.name = "熟铁箭头";
items.ironarrowhead.name = "铁箭头";
items.hammock.name = "吊床";
items.cottonbedroll.name = "棉花铺盖";
items.featherbedroll.name = "羽毛铺盖";
items.rawtaintedmeat.name = "被污染的生肉";
items.cookedtaintedmeat.name = "煮熟的有毒肉";
items.stoneknife.name = "石匕首";
items.rawblindfish.name = "生盲鱼";
items.cookedblindfish.name = "熟盲鱼";
items.pemmican.name = "干肉饼"; //Added 1.9
items.preparedpemmican.name = "精制干肉饼"; //Added 1.9
//Added All 1.9.1
items.sail.name = "帆";
items.sailboat.name = "帆船";
items.egg.name = "鸡蛋";
items.boiledegg.name = "水煮蛋";
//End Added
//Added All 1.9.2
items.grassblades.name = "小叶子";
items.niter.name = "硝石";
items.saltpeter.name = "硝酸钾";
items.blackpowder.name = "黑火药";
items.flintlockpistol.name = "弗林特锁手枪";
//End Added
groups.sharpeneditem.name = "尖锐的";
groups.polelike.name = "杆";
groups.rocklike.name = "石头";
groups.fuellike.name = "油";
groups.needlelike.name = "针";
groups.hammerlike.name = "铁锤";
groups.torchlike.name = "光源";
groups.bonelike.name = "骨骼";
groups.fabriclike.name = "面料";
groups.ropelike.name = "绳索";
groups.insect.name = "昆虫";
groups.carbons.name = "碳";
groups.compost.name = "堆肥";
groups.medicinal.name = "药水";
groups.tongs.name = "钳子";
groups.water.name = "水";
groups.potablewaterskin.name = "装满饮用水的革制水袋";
groups.potablebottle.name = "装满饮用水的玻璃瓶";
groups.container.name = "容器";
groups.arrow.name = "箭";
groups.bullet.name = "子弹";
groups.sharpenedrock.name = "尖锐的岩石";
groups.meat.name = "肉"; //Added 1.9
groups.treasure.name = "财宝"; //Added 1.9.1
//Added All 1.9.2
groups.repair.name = "维修";
groups.transmogrify.name = "变形";
groups.reinforce.name = "加强";
groups.preserve.name = "腌制";
//End Added
descriptions.rest.name = "休息";
descriptions.rest.description = "休息一段时间可以恢复你的健康和耐力，恢复时间基于你的野营技巧等级，当恢复体力达到最大时，将自动停止."; //Edited 1.8.6
descriptions.eat.name = "吃";
descriptions.eat.description = "当使用时，消耗食物，减少饥饿，和口渴的程度，也会恢复你的健康和耐力.";
descriptions.drink.name = "喝";
descriptions.drink.description = "当使用时，会消耗饮水，并减少口渴程度，但当你饮用海水或不干净的饮水时将会得到一个负面的状态BUFF.";
descriptions.carve.name = "切开";
descriptions.carve.description = "用于切开动物的尸体或将附在地面上的东西切除.";
descriptions.dig.name = "挖";
descriptions.dig.description = "用于挖掘资源或从地下挖掘物品.";
//descriptions.cast.name = "Cast"; //Removed 1.8.6
//descriptions.cast.description = "Find a fish in a body of water and attempt to cast your line or net to catch it."; //Removed 1.8.6
descriptions.shoot.name = "射击";
descriptions.shoot.description = "你可以用这个物品进行射箭.";
//descriptions.setDown.name = "Set Down"; //Removed 1.8.6
//descriptions.setDown.description = "Using this item will place it over top of what ever tile is present in your facing direction. This is different than just dropping the item. It can also be used to extinguish fires."; //Removed 1.8.6
descriptions.sling.name = "吊起";
descriptions.sling.description = "你可以把子弹吊在这个物品上."; //Edited 1.8.6
//descriptions.drift.name = "Drift"; //Removed 1.8.6
//descriptions.drift.description = "Used to fast travel across water to other islands in your current area in the direction used."; //Removed 1.8.6
descriptions.startFire.name = "放火";
descriptions.startFire.description = "用来生火.这不能用于一些非干瓷砖和没有燃料的情况下.可以用于点燃篝火、 炉、 窑等.使用此操作需要消耗你库存中的需要点燃火种、 燃料等类似物品，视情况而定.";
//descriptions.gatherWater.name = "Gather Water"; //Removed 1.8.6
//descriptions.gatherWater.description = "Used to gather water into the item."; //Removed 1.8.6
descriptions.lockpick.name = "撬锁";
descriptions.lockpick.description = "用于打开锁住的箱子.";
descriptions.repair.name = "维修";
descriptions.repair.description = "用于打开锁住的箱子.";
descriptions.heal.name = "治愈";
descriptions.heal.description = "使用消耗物品，用于恢复不同程度的健康.";
descriptions.travel.name = "旅行";
descriptions.travel.description = "用于旅行到新的、 未开发的土地，并留下你当前的周围坏境."; //Edited 1.9.1
descriptions.look.name = "观察";
descriptions.look.description = "用于观看你远离当前面对方向的完整地图，并显示在你的小地图上.";
descriptions.decode.name = "解码";
descriptions.decode.description = "用于尝试来解读地图.解读宝藏位置离你所在方位多远或者在你附近.使用时将可以所面朝的方向的确切地点进行挖宝.";
//descriptions.ignite.name = "Ignite"; //Removed 1.8.6
//descriptions.ignite.description = "Use this item on a fire source to start it on fire."; //Removed 1.8.6
descriptions.read.name = "阅读";
descriptions.read.description = "使用消耗物品,阅读可以提供有用的知识.";
descriptions.reinforce.name = "加强";
descriptions.reinforce.description = "使用消耗物品，可以使损坏的物品得到强化，试图增加其总体最高和最低的耐久性，成功率基于用于该物品的技能等级.";
descriptions.openContainer.name = "打开容器";
descriptions.openContainer.description = "你可以使用并打开它，或把物品从里面拖出，减少重量和减少奖金同样也适用于里面的物品.";
//descriptions.open.name = "Open"; //Removed 1.8.6
//descriptions.open.description = "Consumed on use. Using this will open it, providing new and unknown items."; //Removed 1.8.6
descriptions.cure.name = "治疗";
descriptions.cure.description = "使用消耗物品. 用来治疗中毒或燃烧的痛苦，同时有时会提供其他的健康益处.";
descriptions.tellTime.name = "报时";
descriptions.tellTime.description = "用于测量白天或晚上的时间.";
descriptions.transmogrify.name = "变形";
descriptions.transmogrify.description = "对于一个可装备的物品使用，注入魔力，并赋予装备神奇的属性.";
descriptions.stokeFire.name = "引发火灾";
descriptions.stokeFire.description = "用于火源，并增加火焰的力量.";
descriptions.pour.name = "倾倒";
descriptions.pour.description = "将它倒在火上可以熄灭火焰， 倒出里面的水，可以过滤水中的杂质,倒在合适的植物上可以增加植物的健康，旺盛的生长，或者只是简单的把里面的水倒出，空出来而已.";
descriptions.plant.name = "种植";
descriptions.plant.description = "试图种植他们，在你面朝的方向. 有些植物可能需要某些特殊的地面类型或条件被种植.";
descriptions.garden.name = "栽培";
descriptions.garden.description = "在种植地区使用，可以提高其肥力.只可在某些植物类型.";
descriptions.build.name = "建造";
descriptions.build.description = "试图建造或组装你面朝方向的物品.";
descriptions.gatherTreasure.name = "收集财宝"; //Added 1.8.2
descriptions.gatherTreasure.description = "试图将收集解码藏宝图使用附近的宝藏.收集的范围取决于你的采矿技能."; //Added 1.8.2 //Edited 1.8.4
//Added All 1.8.6
descriptions.sleep.name = "睡觉";
descriptions.sleep.description = "睡上一段时间便可以恢复你的健康和耐力，持续时间将基于你野营技巧等级和所消耗的时间， 对面临火灾和被点燃的目标时将给予额外的影响奖励(包括持续时间) ，当睡觉时，你的饥饿感和口渴程度将会缓慢地增长.";
descriptions.fishing.name = "垂钓";
descriptions.fishing.description = "在水里找到一条鱼，用鱼线或者渔网来抓到它.";
descriptions.placeTile.name = "放下";
descriptions.placeTile.description = "使用这个物品，并将在顶部的砖面向在你面对的方向.这是不同于只是将它落下，它也可以用于灭火.";
descriptions.raft.name = "漂流";
descriptions.raft.description = "用于快速穿越其他岛屿在当前区域的方向.";
descriptions.fillWater.name = "收集水";
descriptions.fillWater.description = "用于将水收集到物品中.";
descriptions.lightItem.name = "点燃";
descriptions.lightItem.description = "将物品放在火源上，并点燃它.";
descriptions.openBottle.name = "打开";
descriptions.openBottle.description = "使用消耗物品.使用之后会打开它，可能会提供新的和未知的新物品.";
//End Added
descriptions.sailHome.name = "驾舟还家"; //Added 1.9.1
descriptions.sailHome.description = "收集足够的宝藏后, 可以返回家园并沉浸于你的财富和名声的荣耀或开始新的冒险!"; //Added 1.9.1
//Added All 1.9.2
descriptions.preserve.name = "腌制";
descriptions.preserve.description = "与食品一起使用，可以延长其寿命及延缓其衰变的速度.";
descriptions.fire.name = "开火";
descriptions.fire.description = "使用一个黑火药子弹，你可以利用武器来发射它.";
//End Added

//NPCs
npcs.slime.name = "一个史莱姆";
npcs.jellycube.name = "一个果冻魔方";
npcs.giantspider.name = "一个巨大蜘蛛";
npcs.bear.name = "一头熊";
npcs.rabbit.name = "一只野兔";
npcs.snake.name = "一条蛇";
npcs.giantrat.name = "一只大老鼠";
npcs.rat.name = "一只小老鼠";
npcs.vampirebat.name = "一只吸血蝙蝠";
npcs.greywolf.name = "一只灰太狼";
npcs.imp.name = "一个小鬼";
npcs.bogling.name = "一个幽灵";
npcs.livingrock.name = "一块原生岩石";
npcs.shark.name = "一头鲨鱼";
npcs.zombie.name = "一只僵尸";
npcs.skeleton.name = "一只骷髅怪";
npcs.pirateghost.name = "一个海盗幽灵";
npcs.timeskitter.name = "一次飞掠而过";
npcs.chicken.name = "一只鸡";
npcs.trapdoorspider.name = "一只陷阱蜘蛛";
npcs.fireelemental.name = "一个火元素";
npcs.trout.name = "一条鲑鱼";
npcs.hobgoblin.name = "一头大地精";
npcs.livingmushroom.name = "一个原生蘑菇";
npcs.kraken.name = "一头海怪";
npcs.blindfish.name = "一条盲鱼";
npcs.harpy.name = "一头鸟身女妖"; //Added 1.7.4

//Tiles
tiletypes.ash.name = "灰";
tiletypes.cobblestone.name = "鹅卵石";
tiletypes.darkness.name = "黑暗";
tiletypes.deepwater.name = "深深的海水";
tiletypes.dirt.name = "尘埃";
tiletypes.exit.name = "一个入口";
tiletypes.forest.name = "树";
tiletypes.grass.name = "草";
tiletypes.gravel.name = "砂砾";
tiletypes.highrock.name = "高高的岩石";
tiletypes.rock.name = "岩石";
tiletypes.sand.name = "沙子";
tiletypes.sandstone.name = "砂岩";
tiletypes.shallowwater.name = "浅浅的海水";
tiletypes.snow.name = "雪";
tiletypes.stonewall.name = "石墙";
//tiletypes.stonewall_north.name = "Stone Wall"; //Removed 1.7.2
tiletypes.swamp.name = "沼泽";
tiletypes.water.name = "海水";
tiletypes.clay.name = "黏土";
tiletypes.sandstonewall.name = "砂岩墙";
//tiletypes.sandstonewall_north.name = "Sandstone Wall"; //Removed 1.7.2
tiletypes.sandstonefloor.name = "砂岩地板";
tiletypes.palm.name = "棕榈树";
tiletypes.barepalm.name = "裸露的棕榈树";
tiletypes.bareforest.name = "裸露的树";
tiletypes.woodenwall.name = "木墙";
//tiletypes.woodenwall_north.name = "Wooden Wall"; //Removed 1.7.2
tiletypes.woodenfloor.name = "木质地板";
tiletypes.woodendoor.name = "木门";
tiletypes.freshdeepwater.name = "深深的淡水";
tiletypes.freshshallowwater.name = "浅浅的淡水";
tiletypes.freshwater.name = "淡水";
//Added All 1.7.2
tiletypes.ironrock.name = "岩石与铁";
tiletypes.ironsandstone.name = "砂岩与铁";
tiletypes.talcrock.name = "岩石与滑石";
tiletypes.limestonerock.name = "岩石与石灰岩";
tiletypes.berryforest.name = "树与浆果";
tiletypes.fungusforest.name = "树与白木耳";
tiletypes.vineforest.name = "树与葡萄";
tiletypes.coconutpalm.name = "棕榈树与椰子";
//End Added
tiletypes.coalrock.name = "岩石与煤"; //Added 1.8.1
tiletypes.nitersandstone.name = "砂岩与硝石"; //Added 1.9.2

//Player
//Edited All 1.7.2
player.skillTypes.lumberjacking.name = "伐木";
player.skillTypes.lumberjacking.description = "增加砍伐树木获得资源的几率.<br />降低砍伐树木时所消耗的耐力.";
player.skillTypes.mining.name = "采矿";
player.skillTypes.mining.description = "增加的采矿时获得资源的几率.<br />降低采矿时所消耗的耐力.<br />增加你搜集宝藏的范围."; //Edited 1.8.2
player.skillTypes.cooking.name = "烹饪";
player.skillTypes.cooking.description = "减缓煮熟的食物的腐坏速度.";
player.skillTypes.camping.name = "露营";
player.skillTypes.camping.description = "当你在睡袋中休息时，提高每回合在睡袋中的睡眠质量.";
player.skillTypes.tinkering.name = "铸补";
player.skillTypes.tinkering.description = "制作的方法和制作的材料影响其修复质量，项目的成功率.";
player.skillTypes.tactics.name = "战术";
player.skillTypes.tactics.description = "增加你的基础攻击值.<br />增加在战斗时击中敌人的几率.<br />降低在战斗时消耗耐力的几率.";
player.skillTypes.parrying.name = "盾防";
player.skillTypes.parrying.description = "增加你基地的防御值.<br />增加你在战斗时减少伤害的几率.";
player.skillTypes.mycology.name = "真菌学";
player.skillTypes.mycology.description = "增加种植蘑菇的机会.<br />增加吃蘑菇型消耗品时的有效性.<br />当你不小心践踏到蘑菇时，减少踩到蘑菇的几率.";
player.skillTypes.botany.name = "植物学";
player.skillTypes.botany.description = "提高种植植物的几率.<br />提高吃植物型消耗品时带来的有效性.<br />减少踩到植物的几率.";
player.skillTypes.throwing.name = "投掷";
player.skillTypes.throwing.description = "增加投掷时的攻击力，准确性和最大的攻击范围.";
player.skillTypes.swimming.name = "游泳";
player.skillTypes.swimming.description = "增加在水里的移动速度.<br />降低在水里移动时消耗的耐力的几率.";
player.skillTypes.fletching.name = "造箭 & 弓箭制作";
player.skillTypes.fletching.description = "箭，弓和吊索的技能等级影响他们的质量和维修成功率.";
player.skillTypes.woodworking.name = "木工";
player.skillTypes.woodworking.description = "制作木工制品时使用的材料质量，决定你制作成品的质量，维修和成功率.";
player.skillTypes.blacksmithing.name = "锻造";
player.skillTypes.blacksmithing.description = "锻造时使用的金属质量决定了锻造品的成功率，修理和品质.";
player.skillTypes.stonecrafting.name = "石艺";
player.skillTypes.stonecrafting.description = "当制作石头制品时，你所使用的石头质量将决定你石头制品的质量，维修和成功率.";
player.skillTypes.tailoring.name = "裁缝";
player.skillTypes.tailoring.description = "制作布制品时使用的材料质量，决定你制作成品的质量，维修和成功率.";
player.skillTypes.leatherworking.name = "制革";
player.skillTypes.leatherworking.description = "制作皮革时使用的材料质量，影响制革成品的质量，维修和成功率.";
player.skillTypes.fishing.name = "钓鱼";
player.skillTypes.fishing.description = "增加成功抓到鱼的几率. 当使用钓竿时，增加使用的最大范围.<br />增加你可以搜集宝藏的范围."; //Edited 1.8.2
player.skillTypes.archery.name = "箭术";
player.skillTypes.archery.description = "当使用弓和箭时增加攻击力、 精度和最大值范围.";
player.skillTypes.alchemy.name = "炼金";
player.skillTypes.alchemy.description = "使用的化学混合物品影响制作成品的成功率和质量.";
player.skillTypes.claythrowing.name = "史莱姆投掷者";
player.skillTypes.claythrowing.description = "制陶时使用的陶土质量决定了制造品的成功率和品质.";
player.skillTypes.glassblowing.name = "烧制玻璃";
player.skillTypes.glassblowing.description = "当烧制玻璃时使用的材料质量会影响玻璃成品的质量和成功率.";
player.skillTypes.lockpicking.name = "撬锁";
player.skillTypes.lockpicking.description = "增加成功打开箱子的几率.";
player.skillTypes.cartography.name = "绘图";
player.skillTypes.cartography.description = "增加成功读取破解地图的几率.<br />减少阅读破旧地图时的模糊.";
player.skillTypes.anatomy.name = "解剖";
player.skillTypes.anatomy.description = "提高动物健康的精度 (通过右键点击).<br />减少出血的机会.<br />提高健康药剂的效果.";
player.skillTypes.trapping.name = "诱捕";
player.skillTypes.trapping.description = "增加捕捉生物的成功率和伤害.<br />减少设置陷阱的几率和陷阱对你造成的伤害.";
player.milestones.abnormalizer.name = "反常";
player.milestones.abnormalizer.description = "击杀25只异常的生物.";
player.milestones.chef.name = "厨师";
player.milestones.chef.description = "烹调25个食物.";
player.milestones.crafter.name = "工匠";
player.milestones.crafter.description = "制作250件道具.";
player.milestones.extincteur.name = "灭火器";
player.milestones.extincteur.description = "击杀1000只生物.";
player.milestones.gardener.name = "园丁";
player.milestones.gardener.description = "种植50个植物或是蘑菇.";
player.milestones.gatherer.name = "采集者";
player.milestones.gatherer.description = "采集1000次.";
player.milestones.hunter.name = "猎人";
player.milestones.hunter.description = "击杀100只生物.";
player.milestones.modder.name = "Mod达人";
player.milestones.modder.description = "载入10个Mod.";
player.milestones.locksmith.name = "锁匠";
player.milestones.locksmith.description = "撬开10把锁.";
player.milestones.reaperofsouls.name = "灵魂修复";
player.milestones.reaperofsouls.description = "击杀50只幽灵并收割他们的尸体.";
player.milestones.survivor.name = "幸存者";
player.milestones.survivor.description = "生存10000回合.";
player.milestones.thrower.name = "投掷者";
player.milestones.thrower.description = "投掷500个道具.";
player.milestones.trapper.name = "看门工";
player.milestones.trapper.description = "利用陷阱伤害10只生物.";
player.milestones.treasurehunter.name = "宝藏猎人";
player.milestones.treasurehunter.description = "挖掘或钓到10个财宝箱.";
//End Edited

//Hints
hints.welcometowayward.name = "欢迎来到任意岛";
hints.welcometowayward.description = '欢迎来到预发布的任意岛! 任意岛当前处于Beta测试阶段并且很多东西都会随着时间推移而改变. 这些提示窗口将会在游戏中弹出. 如果你需要进一步的帮助, 访问 <a target="_blank" href="/www.unlok.ca/wayward/documentation.html">官方文档</a>.<br /><br />如果你想要始终玩到最新版的任意岛, 请访问 <a target="_blank" href="/www.unlok.ca/forums/">论坛</a>, <a target="_blank" href="/www.unlok.ca/category/wayward/">博客</a> 或 <a target="_blank" href="/www.reddit.com/r/Wayward/">子板</a>.<br /><br />想要帮助任意岛? 宣传我们, 或者访问以下网址: <a target="_blank" href="https://www.facebook.com/waywardgame">Facebook</a>, <a target="_blank" href="/www.indiedb.com/games/wayward">IndieDB</a>, <a target="_blank" href="/steamcommunity.com/sharedfiles/filedetails/?id=151680542">Steam 青睐绿光.'; //Edited 1.9.1
hints.controls.name = "控制"; //Added 1.8.1
hints.controls.description = "<strong>移动</strong><br />关于移动, 你可以使用 W,A,S,D, 方向键, VI键 (H,J,K,L), 或者左键单击/轻敲游戏屏幕上你想要移动的方向. 跳过这个回合，或捡起你现在正站在的面前的物品，按空格或左键点击你屏幕画面里的角色.<br /><br /><strong>使用道具</strong><br />使用一个物品，你可以点击它或点击弹出的菜单，把你所想使用的物品拖到快捷栏中，快捷栏有相对应的数字按钮(1.2.3等).<br /><br /><strong>物品使用，掉落和信息</strong><br />一些物品可能有更多使用方法，这些方法会出现在该物品的菜单栏中,你可以右键点击该物品让它自动掉落，不用使用菜单逐一将他们丢掉,如果你正面对一个容器,想要将物品放入里面。您可以使用转移(或alt)+右击(或从菜单中使用“丢弃”)将同一类的多个项目(注:shift +右击在Firefox无法使用,请使用alt).如果你想了解更多信息，可以用鼠标右键点击你也可以右键点击游戏屏里你想了解的东西，不管是物品，怪物还是地点等.<br /><br /><strong>更多信息</strong><br />将鼠标悬停在屏幕上，有时可以获得更多相关的有用信息.  小提示将显示在物品上。悬停在合成物品前，将显示 工艺合成所需要使用的物品 （按库存/设备/快捷顺序排序） .<br /><br /><strong>物品管理</strong><br />除了可以把物品拖入放到你的快捷栏中, 只要你装备的物品适合放入该快捷栏中，你也可以用这种方式进行装备物品. 拖动物品时需要移动容器窗口和库存物品 (除了右键点击将物品放置在地上的容器里). 另外，右键点击一个在你装备列表中，快捷栏中或容器窗口中的物品，可以将它庄一刀你的库存中.<br /><br /><strong>Window快捷方式</strong><br />Esc = 主菜单<br />I = 道具<br />E = 装备<br />C = 制作<br />/ = 帮助<br />X = 技能<br />M = 信息<br />O = 选项<br />Q = 动作"; //Edited 1.8.5
hints.corpsecarving.name = "尸体搜刮者";
hints.corpsecarving.description = "看起来任何尸体都有隐藏起来的宝藏，不知道？用把锋利的武器小心地切开他们吧，你可以双击一个锋利的物品并使用它.";
hints.environmentalpickup.name = "环境道具"; //Edited 1.8.5
hints.environmentalpickup.description = '捡起或收集任何环境中的物品/对象，例如,植物或放置在地面上的炉火，篝火等，你可以做下列操作之一:<br />1. 面对物品时，单击它或点击“行动”快捷键，并选择“捡起”选项.<br />2. 使用某些物品时可以使用“挖掘”命令，例如铁铲.<br />3. 使用某些物品时可以使用“切开”命令，例如锋利的石头. 当你的双手没装备工具时 ，(选项1) 有时可能会伤害到你. 使用工具时 (选项2和3) 会消耗工具的耐久性. 有些物品可能会需要 "切开"的工具， 例如切开尸体.'; //Edited 1.8.5
hints.cavedarkness.name = "黑暗洞穴";
hints.cavedarkness.description = "看起来这里像是一个隐藏宝藏的好地方，但是这里一片漆黑，探索前请使用火或照明工具.";
hints.nightfall.name = "黄昏";
hints.nightfall.description = "对付夜晚的好办法!寻找一个安全的区域用来露营，或者请准备充足的回血道具支撑到白天的来临吧!";
hints.staminareplenishment.name = "耐力补充";
hints.staminareplenishment.description = "你已经很累了，快使用吊床或铺盖去休息一会让耐力回复吧. 您也可以通过进入操作菜单，然后单击休息，进行休息; 当然，休息时使用适当的物品将会产生更好的再生作用. 休息和睡觉是不同的，当你的耐力值空了时，你将只能进行休息，或者你也可以按住空格或点击你的角色，跳过这个回合."; //Edited 1.8.6
hints.healthreplenishment.name = "健康问题";
hints.healthreplenishment.description = "你现在受伤了，请使用可以恢复健康的食品或物品. 一些状态效果将降低你的健康恢复，例如出血和中毒. 另外，你也可以试着睡觉或休息，恢复健康."; //Edited 1.8.6
hints.bleeding.name = "出血";
hints.bleeding.description = "你正在流血！你肯定刚做完一个简易的手术或和一个可怕的怪物战斗过.请使用一个物品进行止血，例如，绷带或止血带.出血将导致你饥饿感和口渴程度快速增加，并减少你生命恢复速度，并让你的健康度不再增加.";
hints.poisoned.name = "中毒";
hints.poisoned.description = "你中毒了！可能是吃错了食物或者受到某些有毒的怪物攻击. 请使用物品进行解毒，例如木炭绷带或医药水水. 中毒将导致你口渴程度快速增加，并减少你生命恢复速度，并让你的健康度不再增加.";
hints.dehydration.name = "脱水";
hints.dehydration.description = "你已经脱水了，有很多种办法都可以进行补水，当然，请不要喝海水. 你必须饮用净化过的水或无不良效果的瓶装水，才能保证你不会有事. 或者你可以找到一个新的可用水源，例如，洞穴内、小湖泊、绿洲、沼泽或池塘等. 煮过的水比直接过滤的水更加安全.";
hints.useatool.name = "使用工具";
hints.useatool.description = "徒手收集资源，将会十分困难，甚至有时还会伤害到自己，请使用工具或装备，以免自己受伤. 如果你是矿工或者伐木工人，你装备的武器攻击值也将决定你采集物品的速度. 当挖掘时，钝武器将帮助你更快的在挖掘时搜集物品，同样，当你伐木时，锋利的武器也可以帮助你更快的在伐木时搜集物品."; //Edited 1.8.5
hints.durability.name = "耐久度";
hints.durability.description = "你任何一种的工具，武器和防具在处于耐力的最低时，如果你还不将它进行修复，它就会彻底坏掉.";
hints.death.name = "死亡";
hints.death.description = "死亡是件很可怕的事，因为你无法回头后悔你刚才做的愚蠢的决定，但值得庆幸的是，你之前发现的所有配方都将在你重生时，得到它们.";
hints.weightlimit.name = "最小重量";
hints.weightlimit.description = "你的负重过重，当超过最大负重时，你的移动速度将会变慢，而且你的耐力会快速流失. 用鼠标右键单击，可以从您的库存中删除物品。你可以使用 shift （或 alt） + 右击扔掉相同类型的多个物品.";
hints.eatingbadthings.name = "食用腐败的东西";
hints.eatingbadthings.description = "哦！天呐，并不是所有的东西都是可以吃的，至少在它们没有腐烂的情况下. 当然有时为了获得一些好的状态，你可以冒险吃下这些腐烂的食物，但是当你吃下腐败的食物时，你也可能会中毒.";
hints.fastpickup.name = "快速提取";
hints.fastpickup.description = "你刚才地面上捡起了一个物品，当地面上有多个物品时. 按下空格或点击你的角色，让他进行收集多个物品，收集时，角色无法移动.";
hints.bugs.name = "漏洞!";
hints.bugs.description = '你发现一个漏洞？快速联系我们，我们会将此漏洞尽快修复，以防对玩家们造成不好的影响。 你可以通过编辑 <a target="_blank" href="/www.unlok.ca/wiki/wayward/bug-list/">Bug 列表</a>.'; //Edited 1.8.1
hints.helditems.name = "持有道具";
hints.helditems.description = "你的左手和右手装备槽可以互换. 你可以让两个武器，两个工具，两个盾牌之间进行任何组合. 小心损坏装备的物品，例如，当你装备火炬或盾牌时，请不要同时收集或攻击。请小心当你一只手装备攻击或装备时，另一只手不要收集或攻击，不然它将会使你的装备受损，但在战斗中最好使用两只手进行装备武器，因为在战斗中可以同时使用两只手."; //Edited 1.8.2
hints.milestones.name = "里程碑";
hints.milestones.description = "里程碑是个性化的目标和成就。每次通关，你都会有所新的发现和更好的努力方向.里程碑都会在每次通关或死亡后保存游戏，完成的越多，每次游玩时你都有机会在开始得到更好物品和更多的技能点.";
hints.burning.name = "燃烧";
hints.burning.description = "你正在燃烧! 这种持续的灼烧痛感可能是你在没保护的情况下碰到了火焰，也可能是其他来源造成的, 请使用治疗物品治疗自己，例如木炭绷带或医药水水，这将有助于缓解疼痛，当然，去游泳也可以减少灼烧的疼痛。如果你不进行治疗的话，疼痛感的时间会持续十分久，并让你的健康值不再恢复."; //Edited 1.8.2
hints.crafting.name = "制作"; //Added 1.8.1
hints.crafting.description = "手工制作虽然很简单，但却有很多规则!<br /><br />当鼠标悬停在工艺制作的对话框时, 你将会看到在你库存，快捷栏，装备窗口中制作所需要的物品的高亮边框显示（按此顺序设置优先级） , 只需拖动围绕着你的库存中物料的订单，在工艺中使用不同的道具 .<br /><br />制作物品时，如果你使用的物品耐久度较低，这也将影响你制作的物品耐久。耐用度为0的物品不能加入制作之中，此外在制作中使用非凡，卓越和创奇等的物品进行制造时，也会影响制造品的品质.可腐烂性的物品（如食物）的增益，在制作的时候也会受到制作物品的质量的影响。<br /><br />你可以从以下方法中找到新的各具特色配方： 收集你的库存需要的物品，通过制定和发现新的配方，或寻找旧指导卷轴."; //Added 1.8.1

//No translation changes needed below, but always replace with newer version's contents, new changes will not be noted

//Change all HTML definitions
$mainMenu = $('#main-menu');
$mainMenu.attr('title', Messages.mainMenu)
    .find('h3').text(Messages.wayward);
$mainMenu.find('.ui-dialog-titlebar').find('span').text(Messages.mainMenu);
$('#continue-game').text(Messages.startGame);
$('#daily-challenge-mode').text(Messages.dailyChallengeMode);
$('#returnToGame').text(Messages.returnToGame);
$('#saveAndContinue').text(Messages.saveAndContinue);
$('#saveAndExit').text(Messages.saveAndExit);
$('#endGame').text(Messages.endCurrentGame);
$('#help-extra').text(Messages.helpDocumentation);
$('#donations-extra').text(Messages.donations);
$('#options-extra').text(Messages.options);
$('#reset').text(Messages.reset);
$skillsWindow = $('#skillswindow');
$skillsWindow.attr('title', Messages.skills);
$skillsWindow.find('.ui-dialog-titlebar').find('span').text(Messages.skills);
$milestonesWindow = $('#milestoneswindow');
$milestonesWindow.attr('title', Messages.milestones);
$milestonesWindow.find('.ui-dialog-titlebar').find('span').text(Messages.milestones);
$inventoryWlindow = $('#inventorywindow');
$inventoryWlindow.attr('title', Messages.inventory);
$inventoryWlindow.find('.ui-dialog-titlebar').find('span').text(Messages.inventory);
$('#invfilter').attr('placeholder', Messages.filter);
$equipmentWindow = $('#equipmentwindow');
$equipmentWindow.attr('title', Messages.equipment);
$equipmentWindow.find('.ui-dialog-titlebar').find('span').text(Messages.equipment);
$('#hands').data('name', Messages.hands);
$('#head').data('name', Messages.head);
$('#neck').data('name', Messages.neck);
$('#righthand').data('name', Messages.rightHand);
$('#chest').data('name', Messages.chest);
$('#lefthand').data('name', Messages.leftHand);
$('#belt').data('name', Messages.belt);
$('#legs').data('name', Messages.legs);
$('#feet').data('name', Messages.feet);
$('#back').data('name', Messages.back);
$craftWindow = $('#craftwindow');
$craftWindow.attr('title', Messages.crafting);
$craftWindow.find('.ui-dialog-titlebar').find('span').text(Messages.crafting);
$('#craftfilter').attr('placeholder', Messages.filter);
$containerWindow = $('#containerwindow');
$containerWindow.attr('title', Messages.container);
$containerWindow.find('.ui-dialog-titlebar').find('span').text(Messages.container);
$optionsWindow = $('#optionswindow');
$optionsWindow.attr('title', Messages.options);
$optionsWindow.find('.ui-dialog-titlebar').find('span').text(Messages.options);
$('#sound').text(Messages.sound);
$('#volumeopt').text(Messages.volume100);
$('#soundopt').text(Messages.soundOn);
$('#musicopt').text(Messages.musicOn);
$('#nextsong').text(Messages.nextSong);
$('#game-options').text(Messages.gameOptions);
$('#autogather').text(Messages.autoGatherOn);
$('#dropongather').text(Messages.dropOnGatherOn);
$('#autopickup').text(Messages.autoPickupOn);
$('#hintsopt').text(Messages.disableHints);
$('#fontstyle').text(Messages.pixelFont);
$('#gamesize').text(Messages.fullGameSize);
$('#animations').text(Messages.animationsOn);
$('#smoothmovement').text(Messages.smoothMovementOff);
$('#zoomin').text(Messages.zoomIn);
$('#zoomout').text(Messages.zoomOut);
$('#trusted').text(Messages.trustedMods);
$hintsWindow = $('#hintswindow');
$hintsWindow.attr('title', Messages.hints);
$hintsWindow.find('.ui-dialog-titlebar').find('span').text(Messages.hints);
$versionWindow = $('#versionwindow');
$versionWindow.attr('title', Messages.version)
    .find('p').text(Messages.versionInfo);
$versionWindow.find('.ui-dialog-titlebar').find('span').text(Messages.version);
$('#menuopen').text(Messages.mainMenu);
$('#helpopen').text(Messages.help);
$('#milestonesopen').text(Messages.milestones);
$('#messagesopen').text(Messages.messages);
$('#optionsopen').text(Messages.options);
$('#inventoryopen').text(Messages.inventory);
$('#craftopen').text(Messages.crafting);
$('#equipmentopen').text(Messages.equipment);
$('#skillsopen').text(Messages.skills);
$('#attack-label').text(Messages.attackLabel);
$('#defense-label').text(Messages.defenseLabel);
$('#talent-label').text(Messages.talentLabel);
$('#weight-label').text(Messages.weight);
$('#status-label').text(Messages.statusLabel);
$('#code').attr('placeholder', Messages.code);
$('#run-code').text(Messages.runCode);
$('#actionsopen').text(Messages.actions);
$('#modding').text(Messages.modding);

//Change font to default sans-serif for better localized character support
ui.options.fontStyle = false;
ui.$body.addClass("fontstyle");
updateOptionButtonText();
