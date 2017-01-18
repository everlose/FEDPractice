(function (win) {
    //数组去重
    function getArrUnique (arr) {
        var set = new Set(arr);
        return Array.from(set);
    };
    //获取数组重复项
    function getArrRepeatItem (arr) {
        var ret = [];
        var len = arr.length;
        var tmp = {};
        for (var i = 0; i < len; i++) {
            if (!tmp[arr[i]]) {
                tmp[arr[i]] = true;
            } else {
                ret.push(arr[i]);
            }
        }
        return ret;
    };
    //两数组中取不重复项
    function getArrSplice (arr1, arr2) {
        var res = [];
        var len = arr1.length;
        var index = 0;
        for (var i = 0; i < len; i++) {
            index = arr2.indexOf(arr1[i]);
            if (index === -1) {
                res.push(arr1[i]);
            }
        }
        return res;
    };

    //所有属性
    var propertyAll = ['普', '地', '岩', '钢', '毒', '虫', '鬼',
            '飞', '斗', '超', '火', '水', '草', '冰', '龙', '恶', '电'];

    //所有规则，克制restraint，弱点weak，抵抗resist，无视ignore
    var ruleAll = [
        {
            name: '普', restraint: [], weak: ['斗'], resist: [], ignore: ['鬼']
        },
        {
            name: '地', restraint: ['岩', '毒', '斗', '火', '电'], weak: ['水', '草', '冰'], resist: ['岩', '毒'], ignore: ['电']
        },
        {
            name: '岩', restraint: ['虫', '飞', '火'], weak: ['地', '钢', '斗', '水', '草', '冰'], resist: ['普', '飞', '火'], ignore: []
        },
        {
            name: '钢', restraint: ['岩', '虫'], weak: ['斗', '火'], resist: ['普', '岩', '钢', '虫', '鬼', '飞', '超', '草', '冰', '龙', '恶'], ignore: ['毒']
        },
        {
            name: '毒', restraint: ['草'], weak: ['地', '超'], resist: ['毒', '虫', '草'], ignore: []
        },
        {
            name: '虫', restraint: ['超', '草', '恶'], weak: ['岩', '钢', '飞', '火'], resist: ['地', '虫', '草'], ignore: []
        },
        {
            name: '鬼', restraint: ['鬼', '超'], weak: ['鬼', '恶'], resist: [], ignore: ['普', '斗']
        },
        {
            name: '飞', restraint: ['虫', '斗', '草'], weak: ['岩', '冰', '电'], resist: ['斗', '虫', '草'], ignore: ['地']
        },
        {
            name: '斗', restraint: ['普', '岩', '钢', '冰', '恶'], weak: ['地', '飞', '超'], resist: ['恶'], ignore: []
        },
        {
            name: '超', restraint: ['毒', '斗'], weak: ['虫', '鬼', '恶'], resist: ['斗', '超'], ignore: []
        },
        {
            name: '火', restraint: ['钢', '虫', '草', '冰'], weak: ['地', '岩', '水'], resist: ['钢', '火', '草', '冰'], ignore: []
        },
        {
            name: '水', restraint: ['地', '岩', '火'], weak: ['草', '电'], resist: ['钢', '火', '冰'], ignore: []
        },
        {
            name: '草', restraint: ['地', '岩', '水'], weak: ['毒', '虫', '飞', '火', '冰'], resist: ['地', '水', '草', '电'], ignore: []
        },
        {
            name: '冰', restraint: ['地', '岩', '飞', '草', '龙'], weak: ['斗', '火'], resist: ['钢', '冰'], ignore: []
        },
        {
            name: '龙', restraint: ['龙'], weak: ['冰', '龙'], resist: ['斗', '火', '水', '草', '电'], ignore: []
        },
        {
            name: '恶', restraint: ['鬼', '超'], weak: ['虫', '斗'], resist: ['鬼'], ignore: ['超']
        },
        {
            name: '电', restraint: ['飞', '水'], weak: ['地'], resist: ['钢', '飞', '电'], ignore: []
        }
    ];

    //属性克制
    function getPropertyInfo (prt1, prt2) {

        var res = ruleAll[propertyAll.indexOf(prt1)];
        res.weak4Time = [];
        res.resist4Time = [];

        if (prt2) {
            var prt2Obj = ruleAll[propertyAll.indexOf(prt2)];
            res.name = res.name + '、' + prt2;

            //初步筛选出各属性克制
            console.log(res.restraint, prt2Obj.restraint);
            res.restraint = getArrUnique(res.restraint.concat(prt2Obj.restraint));
            

            res.weak = res.weak.concat(prt2Obj.weak);
            res.weak4Time = getArrRepeatItem(res.weak);
            res.weak = getArrUnique(res.weak);

            res.resist = res.resist.concat(prt2Obj.resist);
            res.resist4Time = getArrRepeatItem(res.resist);
            res.resist = getArrUnique(res.resist);

            res.ignore = getArrUnique(res.ignore.concat(prt2Obj.ignore));

            //进一步处理2倍弱点或抵抗不重复于4倍的，无视和弱点不重复
            res.weak = getArrSplice(res.weak, res.ignore);
            res.weak = getArrSplice(res.weak, res.weak4Time);

            res.resist = getArrSplice(res.resist, res.ignore);
            res.resist = getArrSplice(res.resist, res.resist4Time);

            //最后一步修正2倍弱点和2倍抵抗的抵消
            var temp = getArrSplice(res.resist, res.weak);
            res.weak = getArrSplice(res.weak, res.resist);
            res.resist = temp;
        }

        var resStr = '\n属性：' + res.name + '\n';
        if (res.restraint.length > 0) {
            resStr += '克制：' + res.restraint.join('、') + '\n';
        }
        if (res.weak.length > 0) {
            resStr += '弱点：' + res.weak.join('、') + '\n';
        }
        if (res.weak4Time.length > 0) {
            resStr += '4倍弱点：' + res.weak4Time.join('、') + '\n';
        }
        if (res.resist.length > 0) {
            resStr += '抵抗：' + res.resist.join('、') + '\n';
        }
        if (res.resist4Time.length > 0) {
            resStr += '4倍抵抗：' + res.resist4Time.join('、') + '\n';
        }
        if (res.ignore.length > 0) {
            resStr += '无视：' + res.ignore.join('、') + '\n';
        }
        return resStr;
    }

    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = getPropertyInfo;
        } else {
            exports.getPropertyInfo = getPropertyInfo;
        }
    } else {
        this.getPropertyInfo = getPropertyInfo;
    }
})(window);
