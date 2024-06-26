/********************
腳本名:VelFun
版本號:4-4.60
通  道:Release
作　者:龍翔翎(Velade)

更新日期:2024-06-11
********************/
; (function (window, undefined) {
    const isOffline = !location.origin.match(/^(http:|https:)\/\//);
    const version = "4-4.60";
    const channel = "Release";
    const author = "Velade";
    const releaseDate = "2024-06-11";

    /**
     * @typedef {object} velfunEle VelFun元素
     */

    /**
     * VelFun 入口&选择器
     * @param {string|HTMLElement} selector 主选择器 
     * @param {string|HTMLElement|velfunEle} context 父级（上下文）选择器 
     * @returns {velfunEle}
     */
    const velfun = function (selector, context) {

        if (_.info.isIE()) {
            return false;
        }

        return new velfun.fn.init(selector, context);
    }

    velfun.private = new Object();
    velfun.msgtype = Object.freeze({
        MSG_OK: "MSG_OK",
        MSG_OK_Cancel: "MSG_OK_Cancel",
        MSG_YES_NO: "MSG_YES_NO"
    })

    /**
     * 将文本类型的html代码转换为HTMLElement对象
     * @param {string} html 文本类型的html代码
     * @param {function} callback 回调，可选利用回调异步执行或同步执行，二者同时存在，也可以同时使用。
     * @returns {HTMLElement} 返回html对象
     */
    velfun.htmltodom = function (html, callback) {
        const template = document.createElement('template');
        let range = document.createRange();
        range.selectNodeContents(template);

        if (callback !== undefined) {
            callback.call(range.createContextualFragment(html), range.createContextualFragment(html));
        }

        return range.createContextualFragment(html);
    }
    /**
     * 将事件绑定到元素，默认绑定到document的版本，是_(document).bind()的简化写法
     * @param {string} ev 事件名称，不包括on（和addEventListener一样）
     * @param {string} selector 子元素选择器，用以指定具体元素，此处只接受字符串类型，在使用委托/代理模式捕捉动态元素时有效
     * @param {function} func 事件触发的函数
     * @param {boolean} pop 允许间接触发？默认值 False，子元素的事件不会传递给父元素。
     * @returns {velfunEle} 返回该元素
     */
    velfun.bind = function (ev, selector, func, bubbling) {
        const _this = _(document);
        if (typeof ev == "object") {
            const _args = ev;
            ev = _args.event;
            selector = _args.selector;
            func = _args.callback;
            bubbling = _args.bubbling;
        }

        if (typeof func == "boolean" && bubbling == undefined) {
            bubbling = func;

            func = undefined;
        }
        if (typeof selector == "function" && func == undefined) {
            func = selector;
            selector = undefined;
        }
        if(bubbling == undefined) bubbling = false;
        if (typeof func === "function") {
            let eventKey = "";
            do {
                eventKey = "ev_" + velfun.random(100000000000,999999999999);
            } while(Object.keys(velfun.global.Events).includes(eventKey));

            if(selector) {
                velfun.global.Events[eventKey] = function (e) {
                    if (e.target.matches(selector) || bubbling) func.call(_(e.target), e, _this);
                };
            }else {
                velfun.global.Events[eventKey] = function (e) {
                    func.call(_(e.target), e, _this);
                };
            }

            _this.each((i,th)=>{
                th.self = th;
                th.addEventListener(ev, velfun.global.Events[eventKey])
            })
            return eventKey;
        } else {
            try {
                console.error("%cVelFun%cError%c\n    %cbind%c No valid callback function found.","background-color: black; color:white;padding: 0 5px; border-radius: 1000px 0 0 1000px;","background-color: red; color:white;padding: 0 5px; border-radius: 0 1000px 1000px 0;","","background-color: red; color:white;padding: 0 5px; border-radius: 1000px;","");
            } catch (e) {
                document.writeln("VelFun Error:\n    bind:No valid callback function found.");
            }
        }

        return _this;
    }
    /**
     * 解除绑定的事件，解除绑定到document的版本，是_(document).unbind()的简化写法
     * @param {String} ev 要解绑的事件
     * @param {String} funcID 要解绑的事件对应ID（之前绑定时返回的值）
     */
    velfun.unbind = function (ev,funcID) {
        document.removeEventListener(ev,velfun.global.Events[funcID]);
    }
    /**
     * 提示框
     * @param {string} Message 消息内容，支持html
     * @param {string} Title 弹窗标题，可以省略
     * @param {string} Type 按钮类型：MSG_OK 默认 仅确定；MSG_YES_NO 是、否两个按钮；MSG_OK_Cancel 确定、取消两个按钮
     * @param {array} Position 弹窗的座标，[x, y]的格式
     * @param {function} callback 按下按钮后的回调，参数1为按钮是否是「肯定」的，即OK YES按钮为肯定，其他为否定。
     */
    velfun.Msgbox = async function (Message, Title, Type, Position, callback) {

        if (typeof Message == "object") {
            const _args = Message;
            Message = _args.Message || _args.message;
            Title = _args.Title || _args.title;
            Type = _args.Type || _args.type;
            Position = _args.Position || _args.position;
            callback = _args.callback;
        }

        msgboxList.push(function () { return Msgbox_do(Message, Title, Type, Position, callback); });

        if (_("#_MessageBox_").length == 0) {
            const fun = msgboxList.shift();
            fun();
        }
    }
    /**
     * 提示框-精简版 为低配电脑而设计，去除了一些效果和所有动画
     * @param {string} Message 消息内容，支持html
     * @param {string} Title 弹窗标题，可以省略
     * @param {string} Type 按钮类型：MSG_OK 默认 仅确定；MSG_YES_NO 是、否两个按钮；MSG_OK_Cancel 确定、取消两个按钮
     * @param {array} Position 弹窗的座标，[x, y]的格式
     * @param {function} callback 按下按钮后的回调，参数1为按钮是否是「肯定」的，即OK YES按钮为肯定，其他为否定。
     */
    velfun.Msgbox_lite = async function (Message, Title, Type, Position, callback) {

        if (typeof Message == "object") {
            const _args = Message;
            Message = _args.Message || _args.message;
            Title = _args.Title || _args.title;
            Type = _args.Type || _args.type;
            Position = _args.Position || _args.position;
            callback = _args.callback;
        }

        msgboxList.push(function () { return Msgbox_lite_do(Message, Title, Type, Position, callback); });

        if (_("#_MessageBox_").length == 0) {
            const fun = msgboxList.shift();
            fun();
        }
    }
    /**
     * 全屏显示的选择项
     * @param {object} opt_arr JSON格式的选项，具体格式请参考官网手册
     * @param {string} title 标题，可以省略，省略后不显示标题
     */
    velfun.Options = function (opt_arr, title) {

        optionsList.push(function () { Options_do(opt_arr, title); });

        if (_("#_OPTIONS_").length == 0) {
            const fun = optionsList.shift();
            fun();
        }
    }
    /**
     * 整数随机数
     * @param {number} min 两个参数时为最小值，但只指定一个参数时为最大值
     * @param {number} max 最大值，省略时min视为最大值
     * @returns {number} 随机的结果
     */
    velfun.random = function (min, max) {
        let vel_minval, vel_maxval, vel_randomval;

        if (typeof min == 'number' & typeof max == 'number') {
            vel_minval = min;
            vel_maxval = max - min;
            vel_randomval = Math.round(Math.random() * vel_maxval + vel_minval);

        } else if (typeof min == 'number' & max === undefined) {
            vel_minval = 0;
            vel_maxval = min;
            vel_randomval = Math.round(Math.random() * vel_maxval);
        } else {
            try {
                console.error("%cVelFun%cError%c\n    %crandom%c The parameter is missing or is not a number.","background-color: black; color:white;padding: 0 5px; border-radius: 1000px 0 0 1000px;","background-color: red; color:white;padding: 0 5px; border-radius: 0 1000px 1000px 0;","","background-color: red; color:white;padding: 0 5px; border-radius: 1000px;","");
            } catch (e) {
                document.writeln("VelFun Error:\n    random:The parameter is missing or is not a number.");
            }
        }

        return vel_randomval;
    }
    const hexColors = [
        "#EBD9CB", "#F9F6F1", "#DBE2EC", "#8D91AA", "#E2E2E2", "#DECECE",
        "#F7F0EA", "#E7ADAC", "#78677A", "#D8B0B0", "#F0F0F2", "#E7E7E5",
        "#ACD4D6", "#797979", "#DFDFDF", "#EBC1A8", "#EBDAC8", "#F6F2F1",
        "#CAC0B7", "#D2D3D5", "#A2886D", "#C3BAB1", "#F1E2DB", "#DACCC1",
        "#BFCAC2", "#013E41", "#C6DEE0", "#F7EDEB", "#A6BAAF", "#4A475C",
        "#CEAEB9", "#E9CEC3", "#EED9D4", "#8D7477", "#6E4740", "#5E5D65",
        "#CB9B8F", "#F6E1DC", "#B5BAC0", "#5B7493", "#E3BCB5", "#A7BEC6",
        "#F4F4F4", "#B98A82", "#F5F4F0", "#BFBFC1", "#B4A29E", "#E0D3C3",
        "#EBE8E3", "#E4DBD2", "#BEA8AA", "#9AA2AD", "#9B8D8C", "#DECFCC",
        "#C0B9B2", "#ACA39A", "#94938E", "#817F7C", "#6F6C69", "#5D5A57",
        "#4B4844", "#393631", "#27241E", "#D1C4B6", "#B8A999", "#9F8E7C",
        "#867460", "#6D5943", "#544E37", "#3B422A", "#E0D5C1", "#C7BBA3",
        "#AE9F85", "#958367", "#7C6749", "#63502C", "#4A3910", "#F0E6CD",
        "#D7CCAF", "#BEB191", "#A59673", "#8C7B55", "#736038", "#5A451B",
        "#EDE3D9", "#D4C9C0", "#BBB0A7", "#A2968E", "#897D75", "#70635C",
        "#574A43", "#3E312A", "#E7E5E1", "#CECDC9", "#B5B4B1", "#9C9B99",
        "#838281", "#6A6969", "#514F51", "#383638"
      ];      
    const rgbColors = HexToRgb(hexColors);
    function HexToRgb (colors){
        let rgbs = [];
        colors.forEach(c => {
            let cs = c.replace("#","");
            cs = cs.match(/.{2}/g);
            let _tmp = [];
            cs.forEach(e=>{
                _tmp.push(parseInt(e,16));
            })
            rgbs.push(_tmp);
        });
        return rgbs;
    }
    function RgbToHsl(colors) {
        let hsls = [];
        colors.forEach(c => {
            if(!Array.isArray(c)) c = c.split(",");
            let r = c[0] / 255;
            let g = c[1] / 255;
            let b = c[2] / 255;

            let max = Math.max(r, g, b);
            let min = Math.min(r, g, b);
            let h, s, l = (max + min) / 2;

            if(max == min){
                h = s = 0; // 无色彩
            } else {
                let d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch(max){
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }
                h /= 6;
            }

            h = Math.round(h * 360);
            s = Math.round(s * 100);
            l = Math.round(l * 100);

            hsls.push([h,s,l]);
        })
    
        return hsls;
    }
    function RgbToHex (colors){
        let hexs = [];
        colors.forEach(c => {
            if(!Array.isArray(c)) c = c.split(",");
            hexs.push(`#${parseInt(c[0]).toString(16).toUpperCase()}${parseInt(c[1]).toString(16).toUpperCase()}${parseInt(c[2]).toString(16).toUpperCase()}`);
        });
        return hexs;
    }
    function closeColor(source,targets) {
        let topRScore = 99999999;
        let topGScore = 99999999;
        let topBScore = 99999999;
        let topColor = 0;
        for (const key in targets) {
            let rgbColor = targets[key];
            if(typeof rgbColor == "string"){
                rgbColor = rgbColor.match(/\d+/g);
            }
            let scoreR = Math.abs(source[0] - rgbColor[0]);
            let scoreG = Math.abs(source[1] - rgbColor[1]);
            let scoreB = Math.abs(source[2] - rgbColor[2]);
            if(scoreR <= topRScore && scoreG <= topGScore && scoreB <= topBScore){
                topRScore = scoreR;
                topGScore = scoreG;
                topBScore = scoreB;
                topColor = targets[key];
            }
        }
        return topColor;
    }
    function getLofColor(targetLight, colors) {
        let minABS = 99999999;
        let topColor = null;
        for (const key in Object.values(colors)) {
            let _hsl = RgbToHsl([colors[key]])[0];
            if(Math.abs(_hsl[2] - targetLight) < minABS) {
                minABS = Math.abs(_hsl[2] - targetLight);
                topColor = colors[key];
            }
        }
        return topColor;
    }
    /**
     * 获取主题色
     * @param {String} url 图片的路径，支持dataUri
     * @param {String} format 输出的格式，默认RGB，支持RGB HEX HSL 
     */
    velfun.getMainColors = velfun.getmaincolors = velfun.gmc = function (url,format = "rgb"){
        return new Promise((resolve,reject)=>{
            let colorsCounter = [];
            let ti = document.createElement("canvas");
            let ctxt = ti.getContext("2d");
            let img = new Image;
            img.crossOrigin = 'anonymous';
            img.onload = ()=>{
                ctxt.canvas.width = img.width;
                ctxt.canvas.height = img.height;
                ctxt.drawImage(img, 0, 0);
                let data = ctxt.getImageData(img.width * 0.25,img.height * 0.25,img.width * 0.75, img.height * 0.75).data;
                data = Array.from(data);
                let imgPixels = [];
                for(let i = 0;i < data.length;i += 4){
                    imgPixels.push(data.slice(i,i+4));
                }
                let pointsNum = 0;
                for (let i = 0; i < imgPixels.length; i += parseInt(imgPixels.length / 5000)) {
                    let topColor = closeColor(imgPixels[i],rgbColors);
                    if(!colorsCounter[topColor]) colorsCounter[topColor] = 0;
                    colorsCounter[topColor] ++;
                    pointsNum ++;
                }

                const entries = Object.entries(colorsCounter);
                entries.sort((a, b) => b[1] - a[1]);
                let mainColors = Object.keys(Object.fromEntries(entries));
                mainColors = mainColors.slice(0,mainColors.length * 0.25);

                let mainColor = mainColors[0];
                let darkColor = getLofColor(10,mainColors);
                let midColor = getLofColor(60,mainColors);
                let lightColor = getLofColor(90,mainColors);
                
                if(format.toUpperCase() == "RGB") {
                    resolve({
                        "mainColor":mainColor,
                        "darkColor":darkColor,
                        "midColor":midColor,
                        "lightColor":lightColor,
                        "0%":getLofColor(0,mainColors),
                        "25%":getLofColor(25,mainColors),
                        "50%":getLofColor(50,mainColors),
                        "75%":getLofColor(75,mainColors),
                        "100%":getLofColor(100,mainColors)
                    });
                }else if(format.toUpperCase() == "HSL") {
                    let _hslColors = RgbToHsl([
                        mainColor,
                        darkColor,
                        midColor,
                        lightColor,
                        getLofColor(0,mainColors),
                        getLofColor(25,mainColors),
                        getLofColor(50,mainColors),
                        getLofColor(75,mainColors),
                        getLofColor(100,mainColors)
                    ]);
                    resolve({
                        "mainColor":_hslColors[0],
                        "darkColor":_hslColors[1],
                        "midColor":_hslColors[2],
                        "lightColor":_hslColors[3],
                        "0%":_hslColors[4],
                        "25%":_hslColors[5],
                        "50%":_hslColors[6],
                        "75%":_hslColors[7],
                        "100%":_hslColors[8]
                    });
                }else if(format.toUpperCase() == "HEX") {
                    let _hslColors = RgbToHex([
                        mainColor,
                        darkColor,
                        midColor,
                        lightColor,
                        getLofColor(0,mainColors),
                        getLofColor(25,mainColors),
                        getLofColor(50,mainColors),
                        getLofColor(75,mainColors),
                        getLofColor(100,mainColors)
                    ]);
                    resolve({
                        "mainColor":_hslColors[0],
                        "darkColor":_hslColors[1],
                        "midColor":_hslColors[2],
                        "lightColor":_hslColors[3],
                        "0%":_hslColors[4],
                        "25%":_hslColors[5],
                        "50%":_hslColors[6],
                        "75%":_hslColors[7],
                        "100%":_hslColors[8]
                    });
                }else {
                    reject("Wrong format");
                }
                
            }
            img.src = url;
        })
    }
    /**
     * [已废弃] 初始化上传控件，上传控件现在移动到libvelui库，此处的已不再维护，并很快将彻底移除
     * @deprecated since version 4.50
     * @returns
     */
    velfun.initUpload = function () {
        var veluploads = _("v-upload");
        if (veluploads.length > 0) {
            try {
                console.error("%cVelFun%cDeprecated Error%c\n    %cinitUpload%c This function is deprecated, You can use it under 4.40 version only.","background-color: black; color:white;padding: 0 5px; border-radius: 1000px 0 0 1000px;","background-color: red; color:white;padding: 0 5px; border-radius: 0 1000px 1000px 0;","","background-color: gray; color:white;padding: 0 5px; border-radius: 1000px;","");
            } catch (e) { }
        }
        return false;
    }
    /**
     * 弹出提示
     * @param {string} content 弹出提示的内容
     * @param {string} title 提示的标题
     * @param {number} duration 多久自动关闭，单位毫秒，默认三秒
     */
    velfun.Tip = function (content, title, duration) {
        if (typeof content == "object") {
            const _args = content;
            content = _args.content;
            title = _args.title;
            duration = _args.duration;
        }
        tipList.push(function () { Tip_do(content, title, duration); });
        if (tipReady) {
            tipReady = false;
            const fun = tipList.shift();
            fun();
        }
    }
    /**
     * 手动初始化所有v-coloricon元素
     */
    velfun.setColoricon = function () {
        const coloricons = _("v-coloricon");
        for (let i = 0; i < coloricons.length; i++) {

            const thisicon = _(coloricons[i]);

            if (_("img", thisicon).length > 0) continue;
            const width = thisicon.attr("width") || thisicon.css("width");
            const height = thisicon.attr("height") || thisicon.css("height");
            const src = thisicon.attr("src");
            thisicon.css("width:" + width + "px;height:" + height + "px;overflow:hidden;display:inline-block;text-indent:0px;padding:0px;");
            thisicon.append("<img src='" + src + "' style='width:" + width + "px;height:" + height + "px;position:relative;left:-" + width + "px;border-right:1px solid transparent;filter:drop-shadow(" + width + "px 0 0 black)'>");
        }
    }
    /**
     * 设置网页语言（需要网页以VelFun多语言方式开发）
     * @param {string} langfile 指定语言文件路径
     * @returns
     */
    velfun.setLang = function (langfile = "") {
        if (isOffline) return;
        if (langfile == "") return;

        if (_.observer != undefined) _.observer.disconnect();

        _.io.get(langfile, function (langfiledata) {

            _.langdata = JSON.parse(langfiledata);

            /**调用时强制更新**/

            const nl = _.getTextNodes(_("html")[0]);
            for (const tn of nl) {
                if (tn.nodeValue.trim() == "") continue;
                if (tn.tempStr == undefined) {
                    tn.tempStr = tn.nodeValue.trim();
                } else {
                    tn.nodeValue = tn.tempStr;
                }

                for (const key in _.langdata) {
                    const nt = _.langdata[key];
                    tn.nodeValue = tn.nodeValue.replaceAll(`@t-${key};`, nt);
                }
            }


            const al = _("[title],[placeholder],[value]");
            al.each(function () {
                velfun.private.setAttrsLang(this, _.langdata);
            });

            _.observer.observe(_.obbody, _.obconfig);
        });
    }
    /**
         * 获取元素下所有纯文本节点
         * @param {HTMLElement} ele 父元素对象
         * @returns {array} 所有#TEXT节点
         */
    velfun.getTextNodes = function (ele) {
        if (ele.nodeType == 3) return [ele];
        const nodes = ele.childNodes;
        const textnodes = [];
        for (const i in nodes) {
            if (nodes[i].nodeType == 3) {
                textnodes.push(nodes[i]);
            } else {

                const r = _.getTextNodes(nodes[i]);
                for (const tn of r) {
                    textnodes.push(tn);
                }
            }
        }
        return textnodes;
    }
    /**
         * 数组/对象深度拷贝
         * @param {array} from 从那个数组/对象拷贝
         * @returns {array} 得到的独立的新数组/对象
         */
    velfun.deepCopy = function (from) {
        let new_obj = new Object();
        if (Array.isArray(from)) {
            new_obj = new Array();
        }
        for (const key in from) {
            let val = from[key];
            if (typeof val == "object") {
                new_obj[key] = velfun.deepCopy(val);
            } else {
                new_obj[key] = val;
            }
        }

        return new_obj;
    }

    velfun.global = {};
    velfun.version = {
        velfun: version,
        channel: channel,
        author: author,
        releaseDate: releaseDate
    };

    //Init
    velfun.fn = velfun.prototype = {
        length: 0,
        velfun: "4",
        version: version,
        channel: channel,
        author: author,
        releaseDate: releaseDate,
        selector: "",
        init: function (selector, context) {
            const _this = this;
            _this.velfun = "4";
            _this.version = version;
            _this.channel = channel;
            _this.author = author;
            _this.releaseDate = releaseDate;
            try {
                if (selector === undefined) {
                    console.error("%cVelFun%cError%c\n    %cSelector%c The selector cannot be empty and an empty object was returned!","background-color: black; color:white;padding: 0 5px; border-radius: 1000px 0 0 1000px;","background-color: red; color:white;padding: 0 5px; border-radius: 0 1000px 1000px 0;","","background-color: red; color:white;padding: 0 5px; border-radius: 1000px;","");
                    _this.length = 0;
                    _this.selector = "";
                    return _this;
                }
                if (selector.velfun !== undefined) {
                    return selector;
                }
                if (typeof selector === "function") {
                    window.addEventListener("load", function () {
                        //Callback

                        selector.call(_(document));
                    });
                    return _this;
                }
                let doms;
                let parent = document;
                if (context !== undefined) {

                    parent = _(context)[0];
                }
                if (typeof selector === "string") {
                    if (parent === undefined) {
                        return;
                    }
                    doms = parent.querySelectorAll(selector);
                } else if (typeof selector === "object") {
                    _this.length = 1;
                    _this.selector = "DOM";
                    _this[0] = selector;
                    return _this;
                } else {
                    try {
                        console.error("%cVelFun%cError%c\n    %cSelector%c Not support selector","background-color: black; color:white;padding: 0 5px; border-radius: 1000px 0 0 1000px;","background-color: red; color:white;padding: 0 5px; border-radius: 0 1000px 1000px 0;","","background-color: red; color:white;padding: 0 5px; border-radius: 1000px;","");
                    } catch (e) {
                        document.writeln("VelFun Error:\n    Selector:Not support selector");
                    }
                    _this.length = 0;
                    _this.selector = "";
                    return _this;
                }
                _this.length = doms.length;
                _this.selector = selector;
                for (let i = 0; i < doms.length; i++) {
                    _this[i] = doms[i];
                }
                return _this;
            } catch (e) {
                try {
                    console.error("%cVelFun%cError%c\n    %cSelector%c An error occurred and an empty object was returned!","background-color: black; color:white;padding: 0 5px; border-radius: 1000px 0 0 1000px;","background-color: red; color:white;padding: 0 5px; border-radius: 0 1000px 1000px 0;","","background-color: red; color:white;padding: 0 5px; border-radius: 1000px;","", e);
                } catch (e) {
                    document.writeln("VelFun Error:\n    Selector:An error occurred and an empty object was returned!");
                }

                _this.length = 0;
                _this.selector = "";
                return _this;
            }
        }
    }

    //Object Function
    /**
     * 获取或设定元素属性
     * @param {string} attrname 属性名
     * @param {string} attrvalue 属性值，如果省略此参数，则为读取
     * @returns {velfunEle|string} 如果为设定则返回元素对象。如果为读取则返回属性值，返回的属性值一律为字符串类型
     */
    velfun.fn.attr = function (attrname, attrvalue) {
        const _this = this;
        if (_this.length == 0) return this;
        let values = [];

        _this.each((i, item) => {
            if (item.nodeType == 3) return;
            if (attrvalue === undefined) {
                values.push((item.getAttribute) ? item.getAttribute(attrname) : null);
            } else {
                if (attrvalue === "") {
                    item.removeAttribute(attrname);
                } else if (attrvalue === attrname) {
                    item.setAttribute(attrname, "");
                } else {
                    item.setAttribute(attrname, attrvalue);
                }
            }
        })
        if (attrvalue === undefined) {
            if (values.length == 1) return values[0];
            else if (values.length == 0) return null;
            else return values;
        } else {
            return _this;
        }
    }
    /**
     * 判断元素是否具有某个属性
     * @param {string} attrname 属性名 
     * @returns {boolean} 属性是否存在
     */
    velfun.fn.hasAttr = function (attrname) {

        if (this.length == 0) return this;
        return (this.attr(attrname) !== null) ? true : false;
    }
    /**
     * 获取或设定元素的值
     * @param {string} value 值，省略时为获取元素的值 
     * @returns {string|velfunEle} 获取时获取元素的值，设定时返回元素对象
     */
    velfun.fn.val = function (value) {
        if (this.length == 0) return this;
        const _this = this;
        let values = [];

        _this.each((i, item) => {
            if (_this[0].tagName.toLowerCase() == "v-select") {
                if (value === undefined) {

                    values.push(_("input[type='hidden']", item).attr("value"));
                } else {
                    if (!_this[0].hasAttr("readonly") && !_this[0].hasAttr("disable")) {

                        _("v-option[value='" + value + "']", item).trigger("click");
                    }
                }
            } else {
                if (value === undefined) {
                    values.push(item.value);
                } else {
                    item.value = value;
                }
            }
        })
        if (value === undefined) {
            if (values.length == 1) return values[0];
            else if (values.length == 0) return null;
            else return values;
        } else {
            return _this;
        }
    }
    /**
     * 获取或设定元素样式
     * @param {string} css 样式，设定时同style写法，获取时填写样式属性名，获取只能单个获取 
     * @param {number} index 第几个元素，以0开始，仅用于获取，未指定时默认读取第一个元素的属性
     * @returns {string|velfunEle} 设定时返回元素对象，获取时返回获取的值
     */
    velfun.fn.css = function (css, index) {
        if (this.length == 0) return this;
        const _this = this;
        let isRead = false;

        // 轉譯dataurl中的特殊符號

        css = css.replaceAll(/data:(.+?);base64,/g, "data[Colon]$1[Semicolon]base64,");

        css = css.replace(/\s*?:\s*?/, ":");
        css = css.replace(/\s*?;\s*?/, ";");
        let newstyles = css.split(";");
        newstyles = newstyles.filter(Boolean);
        if (newstyles.length <= 1) {
            if (newstyles[0]) {
                const tmp_NaA = newstyles[0].split(":");
                if (!tmp_NaA[1]) {
                    isRead = true;
                }
            } else if (css) {

                const tmp_NaA = css[0].split(":");
                if (!css[1]) {
                    isRead = true;
                }
            }
        }
        if (isRead) {
            //Read css
            if (index === undefined) {
                index = 0;
            }
            let re = null;
            switch (css) {
                case "transform":
                    re = _this[0].style.transform;
                    break;
                default:
                    re = window.getComputedStyle(_this[index]).getPropertyValue(css);
            }
            return re;
        } else {
            //Write css
            for (let i = 0; i < _this.length; i++) {
                if (_this.hasOwnProperty(i)) {

                    let tostyle = _(_this[i]).attr("style");
                    let oldstyles = {};
                    if (tostyle != null) {
                        tostyle = tostyle.replaceAll(/data:(.+?);base64,/g, "data[Colon]$1[Semicolon]base64,");
                        tostyle = tostyle.replace(/\s*?:\s*?/, ":");
                        tostyle = tostyle.replace(/\s*?;\s*?/, ";");
                        oldstyles = tostyle.split(";");
                        oldstyles = oldstyles.filter(Boolean);
                    }
                    let newstyles_a = {}, oldstyles_a = {};
                    for (const i2 in newstyles) {
                        if (newstyles.hasOwnProperty(i2)) {
                            let NaA = newstyles[i2].split(":");
                            NaA = NaA.filter(Boolean);
                            let cssvals = [];
                            for (let n = 1; n <= NaA.length; n++) {
                                if (NaA[n]) {

                                    cssvals.push(NaA[n].replaceAll(/data\[Colon\](.+?)\[Semicolon\]base64,/g, "data:$1;base64,"));
                                }
                            }
                            newstyles_a[NaA[0].trim()] = cssvals.join(":");
                        }
                    }
                    for (const i2 in oldstyles) {
                        if (oldstyles.hasOwnProperty(i2)) {
                            let NaA = oldstyles[i2].split(":");
                            NaA = NaA.filter(Boolean);
                            let cssvals = [];
                            for (let n = 1; n <= NaA.length; n++) {
                                if (NaA[n]) {
                                    cssvals.push(NaA[n].replaceAll(/data\[Colon\](.+?)\[Semicolon\]base64,/g, "data:$1;base64,"));
                                }
                            }
                            oldstyles_a[NaA[0].trim()] = cssvals.join(":");
                        }
                    }
                    for (const key in newstyles_a) {
                        if (newstyles_a.hasOwnProperty(key)) {
                            oldstyles_a[key] = newstyles_a[key];
                        }
                    }
                    let newstyles_s = "";
                    for (const key in oldstyles_a) {
                        if (oldstyles_a.hasOwnProperty(key)) {
                            newstyles_s += key + ":" + oldstyles_a[key] + ";";
                        }
                    }

                    _(_this[i]).attr("style", newstyles_s);
                }
            }
            return this;
        }
    }
    /**
     * 获取或设定对象html内容/代码
     * @param {string} html 文本类型的html代码，用于设定
     * @param {number} index 第几个元素，以0开始，仅用于获取，未指定时默认读取第一个元素的属性
     * @returns {string|velfunEle} 获取时返回文本类型的html代码，设定时返回该元素对象（非设定/添加的html对象）
     */
    velfun.fn.html = function (html, index) {
        if (this.length == 0) return this;
        const _this = this;
        if (html === undefined) {
            //ReadHTML
            if (index === undefined) {
                return this[0].innerHTML;
            } else {
                return this[index].innerHTML;
            }

        } else {
            //WriteHTML
            for (let i = 0; i < _this.length; i++) {
                if (_this.hasOwnProperty(i)) {
                    const tdom = _this[i];
                    tdom.innerHTML = html;
                }
            }
            return _this;
        }
    }
    /**
     * 获取或设定对象纯文本内容
     * @param {string} text 要设定的纯文本， 即使包含html内容，也会被转换为文本直接显示出来
     * @param {number} index 第几个元素，以0开始，仅用于获取，未指定时默认读取第一个元素的属性
     * @returns {string|velfunEle} 获取时返回文本，设定时返回该元素对象
     */
    velfun.fn.text = function (text, index) {
        if (this.length == 0) return this;
        const _this = this;
        if (text === undefined) {
            //ReadTEXT
            if (index === undefined) {
                return this[0].innerText;
            } else {
                return this[index].innerText;
            }
        } else {
            //WriteTEXT
            for (let i = 0; i < _this.length; i++) {
                if (_this.hasOwnProperty(i)) {
                    const tdom = _this[i];
                    tdom.innerText = text;
                }
            }
            return _this;
        }
    }
    /**
     * 获取元素类名
     * @param {number} index 第几个元素，以0开始，仅用于获取，未指定时默认读取第一个元素的属性
     * @returns {DOMTokenList} 返回元素类名的数组
     */
    velfun.fn.getClass = velfun.fn.getclass = function (index) {

        if (this.length == 0) return this;
        index = index || 0;
        return this[index].classList;
    }
    /**
     * 判断元素是否存在/包含类名
     * @param {string} classname 要查询的类名
     * @returns {boolean} 返回元素是否包含查询的类名
     */
    velfun.fn.hasClass = velfun.fn.hasclass = function (classname) {

        if (this.length == 0) return this;
        const classes = this.getClass();
        return classes.contains(classname);
    }
    /**
     * 为元素添加类名
     * @param {string} classname 要添加的类名
     * @returns {velfunEle} 返回该元素
     */
    velfun.fn.addClass = velfun.fn.addclass = function (classname) {
        if (this.length == 0) return this;
        const _this = this;

        _this.each((i, item) => {

            const nowClasses = _(item).getclass();
            if (!nowClasses.contains(classname)) {
                nowClasses.add(classname);

                _(item)[0].classList = nowClasses;
            }
        })
        return _this;
    }
    /**
     * 从元素移除类名
     * @param {string} classname 要移除的类名
     * @returns {velfunEle} 返回该元素
     */
    velfun.fn.removeClass = velfun.fn.removeclass = function (classname) {
        if (this.length == 0) return this;
        const _this = this;

        _this.each((i, item) => {

            const nowClasses = _(item).getclass();
            nowClasses.remove(classname);

            _(item)[0].classList = nowClasses;
        })

        return _this;
    }
    /**
     * 替换元素类名
     * @param {string} oldclass 要被替换的旧类名 
     * @param {string} newclass 要替换的新类名
     * @returns {velfunEle} 返回该元素
     */
    velfun.fn.replaceClass = velfun.fn.replaceclass = function (oldclass, newclass) {
        if (this.length == 0) return this;
        const _this = this;

        _this.each((i, item) => {

            const nowClasses = _(item).getclass();
            nowClasses.replace(oldclass, newclass);

            _(item)[0].classList = nowClasses;
        })
        return this;
    }
    velfun.global.Events = new Object();
    /**
     * 将事件绑定到元素
     * @param {string} ev 事件名称，不包括on（和addEventListener一样）
     * @param {string} selector 子元素选择器，用以指定具体元素，此处只接受字符串类型，在使用委托/代理模式捕捉动态元素时有效
     * @param {function} func 事件触发的函数
     * @param {boolean} pop 允许间接触发？默认值 False，子元素的事件不会传递给父元素。
     * @returns {velfunEle} 返回该元素
     */
    velfun.fn.bind = function (ev, selector, func, bubbling) {
        if (typeof ev == "object") {
            const _args = ev;
            ev = _args.event;
            selector = _args.selector;
            func = _args.callback;
            bubbling = _args.bubbling;
        }

        if (this.length == 0) return this;
        const _this = this;
        if (typeof func == "boolean" && bubbling == undefined) {
            bubbling = func;

            func = undefined;
        }
        if (typeof selector == "function" && func == undefined) {
            func = selector;
            selector = undefined;
        }
        if(bubbling == undefined) bubbling = false;
        if (typeof func === "function") {
            let eventKey = "";
            do {
                eventKey = "ev_" + velfun.random(100000000000,999999999999);
            } while(Object.keys(velfun.global.Events).includes(eventKey));

            
            if(selector) {
                velfun.global.Events[eventKey] = function (e) {
                    if (e.target.matches(selector) || bubbling) func.call(_(e.target), e, this);
                };
            }else {
                velfun.global.Events[eventKey] = function (e) {
                    func.call(_(e.target), e, this);
                };
            }

            _this.each((i,th)=>{
                th.self = th;
                th.addEventListener(ev, velfun.global.Events[eventKey])
            })
            return eventKey;
        } else {
            try {
                console.error("%cVelFun%cError%c\n    %cbind%c No valid callback function found.","background-color: black; color:white;padding: 0 5px; border-radius: 1000px 0 0 1000px;","background-color: red; color:white;padding: 0 5px; border-radius: 0 1000px 1000px 0;","","background-color: red; color:white;padding: 0 5px; border-radius: 1000px;","");
            } catch (e) {
                document.writeln("VelFun Error:\n    bind:No valid callback function found.");
            }
        }

        return _this;
    }
    /**
     * 解除绑定的事件
     * @param {String} ev 要解绑的事件
     * @param {String} funcID 要解绑的事件对应ID（之前绑定时返回的值）
     */
    velfun.fn.unbind = function (ev,funcID) {
        const _this = this;
        _this.each((i,item)=>{
            item.removeEventListener(ev,velfun.global.Events[funcID]);
        })
    }
    /**
     * 触发元素事件，注意因为浏览器安全设计，部份事件通过代码产生的触发是无效的，而部份事件需要用户有明确交互（点击、输入等）后才能通过代码触发
     * @param {string} event 事件名称，不包含on
     * @returns {velfunEle} 返回该元素
     */
    velfun.fn.trigger = function (event) {
        if (this.length == 0) return this;
        const _this = this;
        for (let i = 0; i < _this.length; i++) {
            const th = _this[i];
            if (typeof th[event] == "function") {
                th[event]();
            } else {
                th.dispatchEvent(new Event(event));
            }
        }

        return _this;
    }
    /**
     * [已废弃] 单独的click事件绑定，请统一使用.bind()实现
     * @deprecated since version 4.50
     * @param {function} func 事件触发的函数 
     * @returns {velfunEle} 返回该元素
     */

    velfun.fn.click = function (func) {
        try {
            console.error("%cVelFun%cDeprecated Error%c\n    %cclick%c This function is deprecated, You can use it under 4.40 version only.","background-color: black; color:white;padding: 0 5px; border-radius: 1000px 0 0 1000px;","background-color: red; color:white;padding: 0 5px; border-radius: 0 1000px 1000px 0;","","background-color: red; color:white;padding: 0 5px; border-radius: 1000px;","");
        } catch (e) { }
        return false;
    }
    /**
     * 在元素（外部）之后追加
     * @param {string} html 要追加的html代码
     * @returns {velfunEle} 返回该元素
     */
    velfun.fn.after = function (html) {
        if (this.length == 0) return this;
        const dom = this[0];

        _.htmltodom(html, function (elem) {
            if (dom.parentNode) {
                dom.parentNode.insertBefore(elem, dom.nextSibling);
            }
        })
        return this;
    }
    /**
     * 在元素（外部）之前插入
     * @param {string} html 要追加的html代码
     * @returns {velfunEle} 返回该元素
     */
    velfun.fn.before = function (html) {
        if (this.length == 0) return this;
        const dom = this[0];

        _.htmltodom(html, function (elem) {
            if (dom.parentNode) {
                dom.parentNode.insertBefore(elem, dom);
            }
        })
        return this;
    }
    /**
     * 在元素（内部）最后追加
     * @param {string} html 要追加的html代码
     * @returns {velfunEle} 返回该元素
     */
    velfun.fn.append = function (html) {
        if (this.length == 0) return this;
        const dom = this[0];

        _.htmltodom(html, function (elem) {
            if (dom.parentNode) {
                dom.appendChild(elem);
            }
        })
        return this;
    }
    /**
     * 在元素（内部）开头插入
     * @param {string} html 要追加的html代码
     * @returns {velfunEle} 返回该元素
     */
    velfun.fn.prepend = function (html) {
        if (this.length == 0) return this;
        const dom = this[0];

        _.htmltodom(html, function (elem) {
            if (dom.parentNode) {
                dom.insertBefore(elem, dom.firstChild);
            }
        })
        return this;
    }
    /**
     * 移除元素本身
     * @returns {boolean} 成功
     */
    velfun.fn.remove = function () {

        if (this.length == 0) return this;
        const _this = this;
        for (let i = 0; i < _this.length; i++) {
            const dom = _this[i];
            dom.parentNode.removeChild(dom);
        }
        return true;
    }
    /**
     * 清空元素所有子节点，即清空内部内容
     * @returns {velfunEle} 返回该元素
     */
    velfun.fn.empty = function () {
        if (this.length == 0) return this;
        const _this = this;
        for (let i = 0; i < _this.length; i++) {
            const dom = _this[i];
            while (dom.hasChildNodes()) {
                dom.removeChild(dom.firstChild);
            }
        }
        return _this;
    }
    /**
     * 查找元素父元素
     * @param {number} times 查找次数/级数，默认向上查找一级，通过此参数可以向上查找任意级数 
     * @returns {HTMLElement|null} 找到的元素，非VelFun元素
     */
    velfun.fn.parent = function (times = 1) {

        if (this.length == 0) return this;
        let parent = this[0];
        for (let i = 0; i < times; i++) {
            parent = parent.parentElement;
        }
        return _(parent);
    }
    /**
     * 返回元素的下一个元素，注意不是节点，因此#TEXT节点不会被捕获
     * @param {number} times 向下查找的次数，默认一次
     * @returns {HTMLElement|null} 找到的元素，非VelFun元素
     */
    velfun.fn.next = function (times = 1) {

        if (this.length == 0) return this;
        let next = this[0];
        for (let i = 0; i < times; i++) {
            next = next.nextElementSibling;
        }
        return _(next);
    }
    /**
     * 返回元素的上一个元素，注意不是节点，因此#TEXT节点不会被捕获
     * @param {number} times 向上查找的次数，默认一次
     * @returns {HTMLElement|null} 找到的元素，非VelFun元素
     */
    velfun.fn.prev = function (times = 1) {

        if (this.length == 0) return this;
        let prev = this[0];
        for (let i = 0; i < times; i++) {
            prev = prev.previousElementSibling;
        }
        return _(prev);
    }
    /**
     * 遍历VelFun对象
     * @param {function} func 每次遍历要执行的函数，函数第一个参数是元素序号，第二个参数是元素对象（非VelFun对象）
     * @returns {velfunEle} 返回该对象
     */
    velfun.fn.each = function (func) {
        if (this.length == 0) return this;
        const _this = this;
        if (typeof func != "function") {
            return false;
        }
        for (let i = 0; i < _this.length; i++) {
            const item = _this[i];
            const index = i;
            if (func.call(item, index, item) === false) break;
        }
        return _this;
    }
    /**
     * 将元素置于背景（Z轴距离）
     * @param {number} size 后退的距离，默认每级后退5个单位 
     * @returns {velfunEle} 返回该元素
     */
    velfun.fn.back = function (size = 5) {
        if (this.length == 0) return this;
        clearTimeout(velfun.global.unbacktimer);
        const _this = this;
        if (_this[0].tagName.toLowerCase() == "body") {

            _("html").addClass("html_alt_back");
            if (window.getComputedStyle(_this[0]).background.match(/rgba\s*?\(\d+?,\s*?\d+?,\s*?\d+?,\s*?0\)/i)) {
                _this.addClass("body_alt_back");
            }
        }

        let nowLaySize = _this.attr("data-laysizes");
        if (!nowLaySize) {
            nowLaySize = size;
            _this.attr("data-start-opacity", _this.css("opacity"));
        } else {
            nowLaySize += "," + size;
        }
        _this.attr("data-laysizes", nowLaySize);

        const oldTransform = _this.css("transform");
        const oldTZ = oldTransform.match(/.*?translateZ\((.+?)\).*?/);
        const nowTZ = (oldTZ) ? parseInt(oldTZ[1]) : 0;

        const newsize = nowTZ - size;

        const newOpa = 1 - Math.min((Math.abs(newsize) / 25), 1);
        let newTransform;
        if (oldTZ) {
            newTransform = oldTransform.replace(/.*?translateZ\((.+?)\).*?/, "translateZ(" + newsize + "px)");
        } else {
            if (oldTransform) {
                newTransform = oldTransform.split(" ");
                newTransform.unshift("translateZ(" + newsize + "px)");
                newTransform = newTransform.join(" ");
            } else {
                newTransform = "translateZ(" + newsize + "px)";
            }
        }
        _this.css("transform: " + newTransform + ";opacity: " + newOpa + ";");
        if (newsize !== 0) {
            _this.addClass("body_inback");
        }

        return _this;
    }
    /**
     * 将元素从背景回到前景，每次恢复之前一次back操作
     * @returns {velfunEle} 返回该元素
     */
    velfun.fn.unback = function () {
        if (this.length == 0) return this;
        const _this = this;

        const nowLaySize = _this.attr("data-laysizes");
        if (!nowLaySize) {
            return _this;
        }
        const nowLaySizes = nowLaySize.split(",");
        const size = nowLaySizes.pop();

        if (nowLaySizes.length > 0) {
            _this.attr("data-laysizes", nowLaySizes.join(","));
        } else {
            _this.attr("data-laysizes", "");
        }

        const oldTransform = _this.css("transform");
        const oldTZ = parseInt((oldTransform.match(/.*?translateZ\((.+?)\).*?/))[1]);

        const newsize = parseFloat(oldTZ) + parseFloat(size);

        const newOpa = 1 - Math.min((Math.abs(newsize) / 25), 1);
        const newTransform = oldTransform.replace(/.*?translateZ\((.+?)\).*?/, "translateZ(" + newsize + "px)");
        _this.css("transform: " + newTransform + ";opacity: " + newOpa + ";");

        if (nowLaySizes.length === 0) {
            const startOpacity = _this.attr("data-start-opacity");
            _this.attr("data-start-opacity", "");
            _this.css("opacity:" + startOpacity + ";");
            if (_this[0].tagName.toLowerCase() == "body") {
                velfun.global.unbacktimer = setTimeout(function () {

                    _("html").removeClass("html_alt_back");
                    _this.removeClass("body_inback");
                    _this.removeClass("body_alt_back");
                }, 300);
            }
        }

        return _this;
    }
    /**
     * 一次性取消之前所有back操作
     * @returns {velfunEle} 返回该对象
     */
    velfun.fn.resetback = function () {
        if (this.length == 0) return this;
        const _this = this;

        const nowLaySize = _this.attr("data-laysizes");
        if (!nowLaySize) {
            return _this;
        }
        const nowLaySizes = nowLaySize.split(",");
        let size = 0;
        for (let i = 0; i < nowLaySizes.length; i++) {
            size += parseFloat(nowLaySizes[i]);
        }

        _this.attr("data-laysizes", "");

        const oldTransform = _this.css("transform");
        const oldTZ = parseInt((oldTransform.match(/.*?translateZ\((.+?)\).*?/))[1]);

        const newsize = parseFloat(oldTZ) + parseFloat(size);

        const newOpa = 1 - Math.min((Math.abs(newsize) / 25), 1);
        const newTransform = oldTransform.replace(/.*?translateZ\((.+?)\).*?/, "translateZ(" + newsize + "px)");
        _this.css("transform: " + newTransform + ";opacity: " + newOpa + ";");

        const startOpacity = _this.attr("data-start-opacity");
        _this.attr("data-start-opacity", "");
        _this.css("opacity:" + startOpacity + ";");
        if (_this[0].tagName.toLowerCase() == "body") {
            velfun.global.unbacktimer = setTimeout(function () {

                _("html").removeClass("html_alt_back");
                _this.removeClass("body_inback");
                _this.removeClass("body_alt_back");
            }, 300);
        }
        return _this;
    }
    /**
     * [已废弃]执行代码，自动选择是否同步执行
     * @deprecated since version 4.50
     * @param {Function} func 要执行的函数
     * @param {number} delay 延迟执行，单位为毫秒，当设定延迟时将会异步执行，否则同步执行
     * @returns {velfunEle} 返回该元素
     */

    velfun.fn.exec = function (func, delay) {
        try {
            console.error("%cVelFun%cDeprecated Error%c\n    %cexec%c This function is deprecated, You can use it under 4.40 version only.","background-color: black; color:white;padding: 0 5px; border-radius: 1000px 0 0 1000px;","background-color: red; color:white;padding: 0 5px; border-radius: 0 1000px 1000px 0;","","background-color: red; color:white;padding: 0 5px; border-radius: 1000px;","");
        } catch (e) { }
        return false;
    }
    /**
     * 绑定鼠标悬浮在该元素触发的事件
     * @param {function} func1 当鼠标进入时触发
     * @param {function} func2 当鼠标移出时触发（可省略）
     * @returns {velfunEle} 返回该元素
     */
    velfun.fn.hover = function (func1, func2) {
        if (this.length == 0) return this;
        if (func1 === undefined) {
            try {
                console.error("%cVelFun%cError%c\n    %chover%c You need to set at least one function to be executed!"),"background-color: black; color:white;padding: 0 5px; border-radius: 1000px 0 0 1000px;","background-color: red; color:white;padding: 0 5px; border-radius: 0 1000px 1000px 0;","","background-color: red; color:white;padding: 0 5px; border-radius: 1000px;","";
            } catch (e) {
                document.writeln("VelFun Error:\n    hover:You need to set at least one function to be executed!");
            }
            return this;
        }
        if (func2 === undefined) {
            func2 = function () { };
        }

        if (typeof func1 !== "function" || typeof func2 !== "function") {
            try {
                console.error("%cVelFun%cError%c\n    %chover%c The parameter not a function!","background-color: black; color:white;padding: 0 5px; border-radius: 1000px 0 0 1000px;","background-color: red; color:white;padding: 0 5px; border-radius: 0 1000px 1000px 0;","","background-color: red; color:white;padding: 0 5px; border-radius: 1000px;","");
            } catch (e) {
                document.writeln("VelFun Error:\n    hover:The parameter not a function!");
            }
            return this;
        }
        this.bind("mouseover", func1);
        this.bind("mouseout", func2);

        return this;
    }

    let vel_menufuns = new Object();
    /**
     * 为静态对象绑定上下文选单（右键选单）
     * @param {object} funarr JSON格式的对象，具体格式请参考官网手册
     */
    velfun.fn.CustomContextmenu = velfun.fn.ccm = function (funarr) {
        if (this.length == 0) return this;
        const _this = this;
        for (let index = 0; index < _this.length; index++) {

            const vel_funthis = _(_this[index]);
            const vel_funthisid = Math.floor(Math.random() * 89999999 + 10000000);
            vel_funthis.attr("data-contextmenuid", vel_funthisid);
            let backgroundStyle = "background-color: var(--bg-color);";
            if (CSS.supports("backdrop-filter", "blur(30px)") || CSS.supports("-webkit-backdrop-filter", "blur(30px)")) {
                backgroundStyle = "background-color: var(--bg-color-blur);";
            }
            let menucontant = "<ul class='_Velfun_Contextmenu_' style='" + backgroundStyle + "' for='" + vel_funthisid + "'>";
            vel_menufuns[vel_funthisid] = new Object();
            for (const i in funarr) {
                if (i.match(/^\-{3}/)) {
                    menucontant += `<li style="width:calc(100% - 10px);height:1px;background-color:#DDD;margin:5px auto;padding: 0 10px;"></li>`;
                } else {
                    const imgurl = i.match(/icon\((.+?)\)/);
                    const ifc = i.match(/\sif\((.+)\)/);
                    let lititle = i;
                    let append = "";

                    if (imgurl) {
                        lititle = lititle.replace(/icon\((.+?)\)/, '');
                        append += "<img style='width: 16px;height: 16px;margin-right: 5px;margin-top: -2px;vertical-align: middle;border:none;' src='" + imgurl[1] + "'>";
                    }

                    if (ifc) {
                        lititle = lititle.replace(/\sif\((.+)\)/, '');
                        if (!eval(ifc[1])) continue;
                    }
                    vel_menufuns[vel_funthisid][lititle] = funarr[i];
                    menucontant += "<li class='_Velfun_Contextmenu_option' style='width: 100%;height: 30px;line-height: 30px;transition: background 200ms;padding: 0 10px;margin: 0 auto;list-style-type: none;text-align: left;float: none;user-select: none;-moz-user-select: none;-webkit-user-select: none;-ms-user-select: none;cursor: default;'>" + append + lititle + "</li>";
                }
            }

            menucontant += '</ul>';

            _("body").append(menucontant);


            _(_this).bind("contextmenu", function (e) {
                e.preventDefault();
            })


            _("[data-contextmenuid='" + vel_funthisid + "']").bind("mousedown", function (e) {
                if (e.button == 2) {
                    let X = e.pageX;
                    let Y = e.pageY;
                    const thisid = this.attr("data-contextmenuid");

                    _("._Velfun_Contextmenu_[data-open]").css("opacity:0;");

                    _("._Velfun_Contextmenu_[data-open]").css("display:none;");

                    _("._Velfun_Contextmenu_[data-open]").attr("data-open", "");


                    _("._Velfun_Contextmenu_[for='" + thisid + "']").css("display:block;left:" + X + "px; top:" + Y + "px;");


                    if (Y + parseInt(_("._Velfun_Contextmenu_[for='" + thisid + "']").css("height")) > parseInt(_("body").css("height"))) {

                        Y -= parseInt(_("._Velfun_Contextmenu_[for='" + thisid + "']").css("height"));

                        _("._Velfun_Contextmenu_[for='" + thisid + "']").css("top:" + Y + "px;");
                    }


                    if (X + parseInt(_("._Velfun_Contextmenu_[for='" + thisid + "']").css("width")) > parseInt(_("body").css("width"))) {

                        X -= parseInt(_("._Velfun_Contextmenu_[for='" + thisid + "']").css("width"));

                        _("._Velfun_Contextmenu_[for='" + thisid + "']").css("left:" + X + "px;");
                    }

                    setTimeout(function (thisid) {

                        _("._Velfun_Contextmenu_[for='" + thisid + "']").css("opacity:1;");

                        _("._Velfun_Contextmenu_[for='" + thisid + "']").attr("data-open", "data-open");
                    }, 10, thisid);
                }
            })


            _("._Velfun_Contextmenu_[for='" + vel_funthisid + "'] ._Velfun_Contextmenu_option").bind("click",function () {

                const th_p = _(this).parent();

                const ft_id = _(th_p).attr("for");

                if (typeof vel_menufuns[ft_id][_(this).text()] === "function") {

                    vel_menufuns[ft_id][_(this).text()].call(_("[data-contextmenuid='" + ft_id + "']"));
                }
            })
        }
    }

    let vel_dynamic_menus = new Object();
    /**
     * 为动态对象绑定上下文选单（右键选单），需要将此功能绑定到静态的父级，然后通过funarr中的选择器自动应用在动态添加的子元素上。
     * @param {object | Map} funarr JSON格式的对象，具体格式请参考官网手册
     */
    velfun.fn.CustomContextmenuDynamic = velfun.fn.ccmd = function (funarr) {
        if (this.length == 0) return this;
        let _this = this;
        let menuids = [];
        for (let index = 0; index < _this.length; index++) {

            const vel_funthis = _(_this[index]);
            let vel_funthisid = null;
            do {
                vel_funthisid = Math.floor(Math.random() * 89999999 + 10000000);
            } while (vel_dynamic_menus[vel_funthisid]);
            vel_funthis.attr("data-contextmenuid", vel_funthisid);

            vel_dynamic_menus[vel_funthisid] = funarr;
            menuids.push(vel_funthisid);


            _(_this).bind("contextmenu", function (e) {
                e.preventDefault();
            })


            _("[data-contextmenuid='" + vel_funthisid + "']").bind("mousedown", function (e, self) {
                if (e.button == 2) {

                    _(`body ._Velfun_Contextmenu_[dynamic]`).remove();

                    const thisid = _(self).attr("data-contextmenuid");
                    let trueTarget = "";
                    if (this[0] == self) {
                        trueTarget = "self";
                    } else {
                        for (const s in vel_dynamic_menus[thisid]) {
                            if (e.target.matches(s)) {
                                trueTarget = s;
                                break;
                            }
                        }
                    }
                    if (trueTarget == "") return;
                    let X = e.pageX;
                    let Y = e.pageY;

                    const funarr = vel_dynamic_menus[thisid][trueTarget];
                    let backgroundStyle = "background-color: var(--bg-color);";
                    if (CSS.supports("backdrop-filter", "blur(30px)") || CSS.supports("-webkit-backdrop-filter", "blur(30px)")) {
                        backgroundStyle = "background-color: var(--bg-color-blur);";
                    }

                    _("body").append("<ul class='_Velfun_Contextmenu_' style='" + backgroundStyle + "' for='" + thisid + "' dynamic></ul>");

                    const _ul = _(`body ._Velfun_Contextmenu_[dynamic]`);
                    for (let i in funarr) {
                        if (i.match(/^\-{3}/)) {
                            _ul.append(`<li style="width:calc(100% - 10px);height:1px;background-color:#DDD;margin:5px auto;padding: 0 10px;"></li>`);
                        } else {
                            const imgurl = i.match(/icon\((.+?)\)/);
                            const ifc = i.match(/\sif\((.+)\)/);
                            let lititle = i;
                            let append = "";

                            if (imgurl) {
                                lititle = lititle.replace(/icon\((.+?)\)/, '');
                                append += "<img style='width: 16px;height: 16px;margin-right: 5px;margin-top: -2px;vertical-align: middle;border:none;' src='" + imgurl[1] + "'>";
                            }

                            if (ifc) {
                                lititle = lititle.replace(/\sif\((.+)\)/, '');
                                if (!eval(ifc[1])) continue;
                            }
                            const _func = funarr[i];
                            _ul.append("<li class='_Velfun_Contextmenu_option' style='width: 100%;height: 30px;line-height: 30px;transition: background 200ms;padding: 0 10px;margin: 0 auto;list-style-type: none;text-align: left;float: none;user-select: none;-moz-user-select: none;-webkit-user-select: none;-ms-user-select: none;cursor: default;'>" + append + lititle + "</li>");

                            const _last_li = _("li", _ul)[_("li", _ul).length - 1];
                            _last_li.addEventListener("click", ((target, func) => {
                                return function (e) {

                                    func.call(_(target), e);
                                }
                            })(e.target, _func), { "once": true });
                        }
                    }



                    _("._Velfun_Contextmenu_[data-open]").css("opacity:0;");

                    _("._Velfun_Contextmenu_[data-open]").css("display:none;");

                    _("._Velfun_Contextmenu_[data-open]").attr("data-open", "");


                    _("._Velfun_Contextmenu_[for='" + thisid + "']").css("display:block;left:" + X + "px; top:" + Y + "px;");


                    if (Y + parseInt(_("._Velfun_Contextmenu_[for='" + thisid + "']").css("height")) > parseInt(_("body").css("height"))) {

                        Y -= parseInt(_("._Velfun_Contextmenu_[for='" + thisid + "']").css("height"));

                        _("._Velfun_Contextmenu_[for='" + thisid + "']").css("top:" + Y + "px;");
                    }


                    if (X + parseInt(_("._Velfun_Contextmenu_[for='" + thisid + "']").css("width")) > parseInt(_("body").css("width"))) {

                        X -= parseInt(_("._Velfun_Contextmenu_[for='" + thisid + "']").css("width"));

                        _("._Velfun_Contextmenu_[for='" + thisid + "']").css("left:" + X + "px;");
                    }

                    setTimeout(function (thisid) {

                        _("._Velfun_Contextmenu_[for='" + thisid + "']").css("opacity:1;");

                        _("._Velfun_Contextmenu_[for='" + thisid + "']").attr("data-open", "data-open");
                    }, 10, thisid);

                }
            })
        }
        let menu = new Object(menuids);

        menu.add = function (selector, key, func, before = "") {
            let nowMenu = vel_dynamic_menus[this[0]][selector];
            let newMenu = new Map();
            for (const k in nowMenu) {
                const v = nowMenu[k];
                if (before != "" && before == k) {
                    newMenu.set(key, func);
                }
                newMenu.set(k, v);
            }

            for (let i = 0; i < this.length; i++) {
                const menuid = this[i];
                vel_dynamic_menus[menuid][selector] = Object.fromEntries(newMenu);
            }
        }

        menu.remove = function (selector, key) {
            let nowMenu = vel_dynamic_menus[this[0]][selector];
            delete nowMenu[key];
            nowMenu = nowMenu.filter(Boolean);

            for (let i = 0; i < this.length; i++) {
                const menuid = this[i];
                vel_dynamic_menus[menuid][selector] = nowMenu;
            }
        }
        return menu;
    }
    /**
     * 设定可变色图标的颜色，需要搭配 变色图标 的html标签一同使用
     * @param {string} col 颜色，支持英文、16禁制、rgb()、rgba()的形式
     * @returns {velfunEle|null} 当发生错误时返回该元素用以排查，无错误时不返回任何内容
     */
    velfun.fn.setColor = function (col) {
        if (this.length == 0) return this;
        if (this[0].tagName.toLowerCase() != "v-coloricon") {
            try {
                console.warn("%cVelFun%cWarning%c\n    %csetColor%c This element not a coloricon","background-color: black; color:white;padding: 0 5px; border-radius: 1000px 0 0 1000px;","background-color: orange; color:white;padding: 0 5px; border-radius: 0 1000px 1000px 0;","","background-color: orange; color:white;padding: 0 5px; border-radius: 1000px;","");
            } catch (e) {
                document.writeln("VelFun Error:\n    setColor:This element not a coloricon");
            }
            return this;
        }

        const coloricon = _("img", this);
        coloricon.css('filter:drop-shadow(' + this.attr("width") + 'px 0 0 ' + col + ')');
    }
    velfun.fn.getMainColors = velfun.fn.getmaincolors = velfun.fn.gmc = function (format = "rgb"){
        const _this = this;
        return new Promise((resolve,reject)=>{
            let colorsCounter = [];
            let ti = document.createElement("canvas");
            let ctxt = ti.getContext("2d");
            let img = new Image;
            img.crossOrigin = 'anonymous';
            img.onload = ()=>{
                ctxt.canvas.width = img.width;
                ctxt.canvas.height = img.height;
                ctxt.drawImage(img, 0, 0);
                let data = ctxt.getImageData(img.width * 0.25,img.height * 0.25,img.width * 0.75, img.height * 0.75).data;
                data = Array.from(data);
                let imgPixels = [];
                for(let i = 0;i < data.length;i += 4){
                    imgPixels.push(data.slice(i,i+4));
                }
                let pointsNum = 0;
                for (let i = 0; i < imgPixels.length; i += parseInt(imgPixels.length / 5000)) {
                    let topColor = closeColor(imgPixels[i],rgbColors);
                    if(!colorsCounter[topColor]) colorsCounter[topColor] = 0;
                    colorsCounter[topColor] ++;
                    pointsNum ++;
                }

                const entries = Object.entries(colorsCounter);
                entries.sort((a, b) => b[1] - a[1]);
                let mainColors = Object.keys(Object.fromEntries(entries));
                mainColors = mainColors.slice(0,mainColors.length * 0.25);

                let mainColor = mainColors[0];
                let darkColor = getLofColor(10,mainColors);
                let midColor = getLofColor(60,mainColors);
                let lightColor = getLofColor(90,mainColors);
                
                if(format.toUpperCase() == "RGB") {
                    resolve({
                        "mainColor":mainColor,
                        "darkColor":darkColor,
                        "midColor":midColor,
                        "lightColor":lightColor,
                        "0%":getLofColor(0,mainColors),
                        "25%":getLofColor(25,mainColors),
                        "50%":getLofColor(50,mainColors),
                        "75%":getLofColor(75,mainColors),
                        "100%":getLofColor(100,mainColors)
                    });
                }else if(format.toUpperCase() == "HSL") {
                    let _hslColors = RgbToHsl([
                        mainColor,
                        darkColor,
                        midColor,
                        lightColor,
                        getLofColor(0,mainColors),
                        getLofColor(25,mainColors),
                        getLofColor(50,mainColors),
                        getLofColor(75,mainColors),
                        getLofColor(100,mainColors)
                    ]);
                    resolve({
                        "mainColor":_hslColors[0],
                        "darkColor":_hslColors[1],
                        "midColor":_hslColors[2],
                        "lightColor":_hslColors[3],
                        "0%":_hslColors[4],
                        "25%":_hslColors[5],
                        "50%":_hslColors[6],
                        "75%":_hslColors[7],
                        "100%":_hslColors[8]
                    });
                }else if(format.toUpperCase() == "HEX") {
                    let _hslColors = RgbToHex([
                        mainColor,
                        darkColor,
                        midColor,
                        lightColor,
                        getLofColor(0,mainColors),
                        getLofColor(25,mainColors),
                        getLofColor(50,mainColors),
                        getLofColor(75,mainColors),
                        getLofColor(100,mainColors)
                    ]);
                    resolve({
                        "mainColor":_hslColors[0],
                        "darkColor":_hslColors[1],
                        "midColor":_hslColors[2],
                        "lightColor":_hslColors[3],
                        "0%":_hslColors[4],
                        "25%":_hslColors[5],
                        "50%":_hslColors[6],
                        "75%":_hslColors[7],
                        "100%":_hslColors[8]
                    });
                }else {
                    reject("Wrong format");
                }
                
            }
            let _style = window.getComputedStyle(_this[0]);
            let url = _style.getPropertyValue("background-image") ||  _style.getPropertyValue("background") || _style.backgroundImage || _style.background;
            if(url.match(/^url\((.+?)\)$/)) {
                url = url.match(/^url\("(.+?)"\)$/)[1];
                img.src = url;
            }else {
                reject("The element background not a image");
            }
        })
    }
    /**
     * [已废弃] 自动平铺，现已废弃，请使用flex和grid布局代替
     * @deprecated since version 4.50
     * @returns {null}
     */
    velfun.fn.autoTile = function () {
        try {
            console.error("%cVelFun%cDeprecated Error%c\n    %cautoTile%c This function is deprecated, You can use it under 4.40 version only.","background-color: black; color:white;padding: 0 5px; border-radius: 1000px 0 0 1000px;","background-color: red; color:white;padding: 0 5px; border-radius: 0 1000px 1000px 0;","","background-color: red; color:white;padding: 0 5px; border-radius: 1000px;","");
        } catch (e) { }

        return false;
    }

    //Static Function
    let msgboxList = new Array();

    let msgfun = function (e) { return true; };
    /**
     * 内部实现，不要直接调用
     */

    async function Msgbox_do(Message, Title, Type, Position, callback) {
        let msg = Message || "";
        let title = Title || "";
        let ty = Type || "";
        let pos = Position || ['calc(50% - 225px)', '30%'];

        msgfun = callback || function (e) { return true; };
        if (typeof title === "function") {
            msgfun = title;
            title = "";
        }
        if (typeof ty === "function") {
            msgfun = ty;
            ty = "";
        }
        if (typeof pos === "function") {
            msgfun = pos;
            pos = ['calc(50% - 225px)', '30%'];
        }

        let posStr = `left: ${pos[0]} ;top: ${pos[1]}`;

        let backgroundStyle = "background-color: var(--bg-color);";
        if (CSS.supports("backdrop-filter", "blur(30px)") || CSS.supports("-webkit-backdrop-filter", "blur(30px)")) {
            backgroundStyle = "background-color: var(--bg-color-blur);";
        }

        let appstr = "<div id='_MessageBox_' style='opacity: 0; border-radius: 10px; box-shadow: 0px 0px 50px transparent; transform: translateZ(5px);" + backgroundStyle + posStr + ";'>";

        let pwidth = parseInt(_("html").css("width"));
        if (pwidth <= 450) {
            posStr = `left: 0;bottom: 0px`;
            appstr = "<div id='_MessageBox_' style='opacity: 1; border-radius: 10px 10px 0 0; box-shadow: 0px 0px 5px transparent; transform: translateY(100%);" + backgroundStyle + posStr + ";'>";
        }

        if (title != "") {
            appstr += "<div style='width: calc(100% - 10px);height: 30px;margin:5px 5px 0px 5px;font-weight: bold;line-height:30px;box-sizing:border-box;padding-left: 5px;border-bottom:1px #DDD solid;text-align: left;'>" + title + "</div>";
            appstr += "<div style='width: calc(100% - 30px);margin:0px 15px;height: calc(100% - 85px);position: absolute;top: 40px;left: 0px;display: block;'>" + msg + "</div>";
        } else {
            appstr += "<div style='width: calc(100% - 30px);margin:0px 15px;height: calc(100% - 45px);position: absolute;top: 40px;left: 0px;display: block;'>" + msg + "</div>";
        }

        if (ty == "" || ty == 0 || ty == "MSG_OK") {
            appstr += "<div style='width: 100%;height: 40px;text-align: center;position: absolute;bottom: 0px;right: 0px;box-sizing: border-box;border-top:1px rgba(0,0,0,0.2) solid;'><span id='_MsgOK_' class='_MsgButton_' data-val='true' style='display:block;width:100%;height:40px;line-height:40px;cursor: default;transition: 300ms ease-out;user-select: none;-moz-user-select: none;-webkit-user-select: none;-ms-user-select: none;'>确定</span></div>";
        } else if (ty == 1 || ty == "MSG_YES_NO") {
            appstr += "<div style='width: 100%;height: 40px;text-align: center;position: absolute;bottom: 0px;right: 0px;box-sizing: border-box;border-top:1px rgba(0,0,0,0.2) solid;'><span id='_MsgYes_' class='_MsgButton_' data-val='true' style='float:left;display:block;width:50%;height:40px;line-height:40px;cursor: default;transition: 300ms ease-out;user-select: none;-moz-user-select: none;-webkit-user-select: none;-ms-user-select: none;'>是</span><span id='_MsgNo_' class='_MsgButton_' data-val='false' style='float:right;display:block;width:50%;height:40px;line-height:40px;cursor: default;transition: 300ms ease-out;user-select: none;-moz-user-select: none;-webkit-user-select: none;-ms-user-select: none;'>否</span></div>";
        } else if (ty == 2 || ty == "MSG_OK_Cancel") {
            appstr += "<div style='width: 100%;height: 40px;text-align: center;position: absolute;bottom: 0px;right: 0px;box-sizing: border-box;border-top:1px rgba(0,0,0,0.2) solid;'><span id='_MsgOK_' class='_MsgButton_' data-val='true' style='float:left;display:block;width:50%;height:40px;line-height:40px;cursor: default;transition: 300ms ease-out;user-select: none;-moz-user-select: none;-webkit-user-select: none;-ms-user-select: none;'>确定</span><span id='_MsgCancel_' class='_MsgButton_' data-val='false' style='float:right;display:block;width:50%;height:40px;line-height:40px;cursor: default;transition: 300ms ease-out;user-select: none;-moz-user-select: none;-webkit-user-select: none;-ms-user-select: none;'>取消</span></div>";
        }
        appstr += "</div></div>";

        _("body").after(appstr);

        _("body").back();
        setTimeout(function () {
            if (pwidth - 20 < 450) {

                _("#_MessageBox_").css("transform: translateY(0);");
            } else {

                _("#_MessageBox_").back();

                _("#_MessageBox_").css("box-shadow:0px 0px 10px rgba(0,0,0,0.5);");
            }
        }, 10);


        _("._MsgButton_").hover(function () {
            this.css("background-color:rgba(255,255,255,0.1);");
        }, function () {
            this.css("background-color:transparent;");
        }).bind("mousedown", function () {
            this.css("background-color:rgba(0,0,0,0.05);");
        });

        return new Promise((resolve, reject) => {

            _("._MsgButton_").bind("click", e => {

                let buttonval = _(e.target).attr("data-val") == "true" ? true : false;
                if (buttonval) {

                    MsgRe(true, false);
                    resolve(true)
                } else {

                    MsgRe(false, false);
                    reject(false);
                }
            })
        })
    }
    /**
     * 内部实现，不要直接调用
     */

    async function Msgbox_lite_do (Message, Title, Type, Position, callback) {
        let msg = Message || "";
        let title = Title || "";
        let ty = Type || "";
        let pos = Position || ['calc(50% - 225px)', '30%'];

        msgfun = callback || function (e) { return true; };
        if (typeof title === "function") {
            msgfun = title;
            title = "";
        }
        if (typeof ty === "function") {
            msgfun = ty;
            ty = "";
        }
        if (typeof pos === "function") {
            msgfun = pos;
            pos = ['calc(50% - 225px)', '30%'];
        }


        let backgroundStyle = "background-color: rgba(253,253,253,0.9);";
        if (CSS.supports("backdrop-filter", "blur(30px)") || CSS.supports("-webkit-backdrop-filter", "blur(30px)")) {
            backgroundStyle = "background-color: rgba(253,253,253,0.5);backdrop-filter: blur(30px);-webkit-backdrop-filter: blur(30px);";
        }

        let appstr = "<div id='_MessageBox_' style='box-shadow:0px 0px 5px black;" + backgroundStyle + "border:1px #CCC solid;border-radius: 10px;box-shadow: 1px 1px 10px #CCC;box-sizing:border-box;display: block;position: fixed;overflow:hidden;transform:translateZ(0px);opacity:1;max-width:100%;width:450px;height:200px;left:" + pos[0] + ";top:" + pos[1] + ";'>";

        let pwidth = parseInt(_("html").css("width"));
        if (pwidth <= 450) {
            appstr = "<div id='_MessageBox_' style='box-shadow:0px 0px 5px black;" + backgroundStyle + "border:1px #CCC solid;border-radius: 10px;box-shadow: 1px 1px 10px #CCC;box-sizing:border-box;display: block;position: fixed;overflow:hidden;transform:translateZ(0px);opacity:1;max-width:100%;width:450px;height:200px;left:0; bottom:0;'>";
        }
        if (title != "") {
            appstr += "<div style='width: calc(100% - 10px);height: 30px;margin:5px 5px 0px 5px;font-weight: bold;line-height:30px;box-sizing:border-box;padding-left: 5px;border-bottom:1px #DDD solid;text-align: left;'>" + title + "</div>";
            appstr += "<div style='width: calc(100% - 30px);margin:0px 15px;height: calc(100% - 85px);position: absolute;top: 40px;left: 0px;display: block;'>" + msg + "</div>";
        } else {
            appstr += "<div style='width: calc(100% - 30px);margin:0px 15px;height: calc(100% - 45px);position: absolute;top: 40px;left: 0px;display: block;'>" + msg + "</div>";
        }

        if (ty == "" || ty == 0 || ty == "MSG_OK") {
            appstr += "<div style='width: 100%;height: 40px;text-align: center;position: absolute;bottom: 0px;right: 0px;box-sizing: border-box;border-top:1px rgba(0,0,0,0.2) solid;'><span id='_MsgOK_' class='_MsgButton_' data-val='true' style='display:block;width:100%;height:40px;line-height:40px;cursor: default;transition: 300ms ease-out;user-select: none;-moz-user-select: none;-webkit-user-select: none;-ms-user-select: none;'>确定</span></div>";
        } else if (ty == 1 || ty == "MSG_YES_NO") {
            appstr += "<div style='width: 100%;height: 40px;text-align: center;position: absolute;bottom: 0px;right: 0px;box-sizing: border-box;border-top:1px rgba(0,0,0,0.2) solid;'><span id='_MsgYes_' class='_MsgButton_' data-val='true' style='float:left;display:block;width:50%;height:40px;line-height:40px;cursor: default;transition: 300ms ease-out;user-select: none;-moz-user-select: none;-webkit-user-select: none;-ms-user-select: none;'>是</span><span id='_MsgNo_' class='_MsgButton_' data-val='false' style='float:right;display:block;width:50%;height:40px;line-height:40px;cursor: default;transition: 300ms ease-out;user-select: none;-moz-user-select: none;-webkit-user-select: none;-ms-user-select: none;'>否</span></div>";
        } else if (ty == 2 || ty == "MSG_OK_Cancel") {
            appstr += "<div style='width: 100%;height: 40px;text-align: center;position: absolute;bottom: 0px;right: 0px;box-sizing: border-box;border-top:1px rgba(0,0,0,0.2) solid;'><span id='_MsgOK_' class='_MsgButton_' data-val='true' style='float:left;display:block;width:50%;height:40px;line-height:40px;cursor: default;transition: 300ms ease-out;user-select: none;-moz-user-select: none;-webkit-user-select: none;-ms-user-select: none;'>确定</span><span id='_MsgCancel_' class='_MsgButton_' data-val='false' style='float:right;display:block;width:50%;height:40px;line-height:40px;cursor: default;transition: 300ms ease-out;user-select: none;-moz-user-select: none;-webkit-user-select: none;-ms-user-select: none;'>取消</span></div>";
        }
        appstr += "</div></div>";

        _("body").after(appstr);

        _("body").addClass("body_lite_disabled");


        _("._MsgButton_").hover(function () {
            this.css("background-color:rgb(255,255,255);");
        }, function () {
            this.css("background-color:transparent;");
        }).bind("mousedown", function () {
            this.css("background-color:rgba(0,0,0,0.05);");
        });

        return new Promise((resolve, reject) => {

            _("._MsgButton_").bind("click", e => {

                let buttonval = _(e.target).attr("data-val") == "true" ? true : false;
                if (buttonval) {

                    MsgRe(true, true);
                    resolve(true)
                } else {

                    MsgRe(false, true);
                    reject(false);
                }
            })
        })
    };
    /**
     * 内部实现，不要直接调用
     */

    function MsgRe (re, lite) {
        if (lite) {

            _("#_MessageBox_").remove();

            _("body").removeClass("body_lite_disabled");
            if (msgboxList.length > 0) {
                const fun = msgboxList.shift();
                fun();
            }
        } else {

            const pwidth = parseInt(_("html").css("width"));
            if (pwidth - 20 < 450) {

                _("#_MessageBox_").css("transform: translateY(100%);");
            } else {

                _("#_MessageBox_").css("box-shadow:0px 0px 50px transparent;");

                _("#_MessageBox_").unback();
            }


            _("body").unback();
            setTimeout(function () {

                _("#_MessageBox_").remove();
                if (msgboxList.length > 0) {
                    const fun = msgboxList.shift();
                    fun();
                }
            }, 200)
        }
        msgfun(re);
    }

    let optionsList = new Array();
    let optionsArr = new Array();
    /**
     * 内部实现，不要直接调用
     */

    function Options_do (opt_arr, title) {
        title = title || "";
        let ulhtml = "<ul id='_Velfun_OPTIONS_' style='position: fixed;display: block;width: 100%;height: auto;left: 0px;top: 50%;transform: translateY(-50%);margin:0px;padding: 0px;z-index: 1000;overflow: hidden;cursor:default;'>";
        let lihtml = "";
        optionsArr = opt_arr;
        let backgroundStyle = "background-color: var(--button-color);";
        if (CSS.supports("backdrop-filter", "blur(30px)") || CSS.supports("-webkit-backdrop-filter", "blur(30px)")) {
            backgroundStyle = "background-color: var(--button-color-blur);";
        }

        if (title != "") {
            lihtml = "<li class='_Velfun_Options_Title' style='max-width: 400px;min-height: 40px;position: relative;height: auto;display: table;clear: both;margin: 10px auto;overflow-x: hidden;width: 100%;background: transparent;font-size: 20px;font-weight:bold;text-align: center;color: white;text-shadow:0px 0px 5px black;transform:translateZ(0px);'>" + title + "</li>";
        }
        for (const index in opt_arr) {
            if (opt_arr.hasOwnProperty(index)) {
                lihtml += "<li class='_Velfun_Options_Item' style='" + backgroundStyle + "' onclick='velfun.private.OptionsRe(this,\"" + index + "\")'><span style='display:table-cell;vertical-align: middle;text-align: center;'>" + index + "</span></li>";
            }
        }
        const ophtml = ulhtml + lihtml + "</ul>";

        _("body").after(ophtml);

        _("body").back();

        _("#_Velfun_OPTIONS_ li._Velfun_Options_Item").each(function (index, item) {

            const _this = _(this);
            setTimeout(function () {
                _this.css("transform: scale(1); opacity: 1;margin: 10px auto 10px auto;");
            }, 30 * index);
        })
    }
    /**
     * 内部实现，不要直接调用
     */
    velfun.private.OptionsRe = function (th, index) {

        const _this = _(th);
        _this.back();
        setTimeout(function () {

            _("#_Velfun_OPTIONS_ li").css("opacity: 0;");

            _("body").unback();
        }, 200);
        setTimeout(function () {

            _("#_Velfun_OPTIONS_").remove();
            if (typeof optionsArr[index] === "function") {
                optionsArr[index].call(_this);
            }
            if (optionsList.length > 0) {
                const fun = optionsList.shift();
                fun();
            }
        }, 500);
    }

    /**
     * 内部实现，不要直接调用
     */
    velfun.private.setAttrsLang = function (th, langdata) {

        if (_(th).hasAttr("alt")) {

            if (!_(th).hasAttr("data-altTempStr")) {

                _(th).attr("data-altTempStr", _(th).attr("alt"));
            } else {

                _(th).attr("alt", _(th).attr("data-altTempStr"));
            }
        }


        if (_(th).hasAttr("title")) {

            if (!_(th).hasAttr("data-titleTempStr")) {

                _(th).attr("data-titleTempStr", _(th).attr("title"));
            } else {

                _(th).attr("title", _(th).attr("data-titleTempStr"));
            }
        }

        if (_(th).hasAttr("placeholder")) {

            if (!_(th).hasAttr("data-placeholderTempStr")) {

                _(th).attr("data-placeholderTempStr", _(th).attr("placeholder"));
            } else {

                _(th).attr("placeholder", _(th).attr("data-placeholderTempStr"));
            }
        }

        if (_(th).hasAttr("value")) {

            if (!_(th).hasAttr("data-valueTempStr")) {

                _(th).attr("data-valueTempStr", _(th).attr("value"));
            } else {

                _(th).attr("value", _(th).attr("data-valueTempStr"));
            }
        }
        for (const key in langdata) {
            const nt = langdata[key];

            if (_(th).hasAttr("title")) {

                _(th).attr("title", _(th).attr("title").replaceAll(`@t-${key};`, nt));
            }

            if (_(th).hasAttr("alt")) {

                _(th).attr("alt", _(th).attr("alt").replaceAll(`@t-${key};`, nt));
            }

            if (_(th).hasAttr("placeholder")) {

                _(th).attr("placeholder", _(th).attr("placeholder").replaceAll(`@t-${key};`, nt));
            }

            if (_(th).hasAttr("value")) {

                _(th).attr("value", _(th).attr("value").replaceAll(`@t-${key};`, nt));
            }
        }
    }

    //IO
    velfun.io = new Object();
    /**
     * 同步AJAX
     * @param {String} method 请求类型[post,get]
     * @param {String} url 请求的地址
     * @param {Object} data 包含的数据，以Object格式提供，post模式下会以post提交，get模式会自动合并到请求地址
     * @returns {String|null} 成功时返回取得的文本，失败时为null
     */
    velfun.io.fetchSync = function (method, url, data) {
        if (typeof data == "object") {
            if (method.toLowerCase() == "get") {
                let params = new Array();
                for (const key in data) {
                    const v = encodeURIComponent(data[key]);
                    params.push(key + "=" + v);
                }
                data = params.join("&");
            } else {
                let params = new FormData();
                for (const key in data) {
                    params.append(key, data[key]);
                }
                data = params;
            }
        }
        const XHR = new XMLHttpRequest();
        if (method.toLowerCase() == "get") {
            if (url.match(/\?/) != null) {
                url += "&" + data;
            } else {
                url += "?" + data;
            }
            XHR.open(method, url, false);
            XHR.send();
        } else if (method.toLowerCase() == "post") {
            XHR.open(method, url, false);
            XHR.send(data);
        } else {
            try {
                console.warn("%cVelFun%cWarning%c\n    %cAJAX%c The method invalid.Can only be get or post.","background-color: black; color:white;padding: 0 5px; border-radius: 1000px 0 0 1000px;","background-color: orange; color:white;padding: 0 5px; border-radius: 0 1000px 1000px 0;","","background-color: orange; color:white;padding: 0 5px; border-radius: 1000px;","");
            } catch (e) {
                document.writeln("VelFun Error:\n    AJAX:The method invalid.Can only be get or post.");
            }
        }
        return (XHR.status == 200) ? XHR.responseText : null;
    }
    /**
     * AJAX异步请求
     * @param {string} method 请求类型[post,get]
     * @param {string} url 请求的地址
     * @param {object} data 包含的数据，以Object格式提供，post模式下会以post提交，get模式会自动合并到请求地址
     * @param {function} callback 回调函数，第一个参数为返回的内容
     * @returns {Promise<function>} 返回Promise对象
     */
    velfun.io.ajax = async function (method, url, data, callback) {
        if (typeof data == "function") {
            callback = data;
            data = null;
        } else if (typeof data == "object") {
            if (method.toLowerCase() == "get") {
                let params = new Array();
                for (const key in data) {
                    const v = encodeURIComponent(data[key]);
                    params.push(key + "=" + v);
                }
                data = params.join("&");
                if (url.match(/\?/) != null) {
                    url += "&" + data;
                } else {
                    url += "?" + data;
                }
            } else if (method.toLowerCase() == "post") {
                let params = new FormData();
                for (const key in data) {
                    params.append(key, data[key]);
                }
                data = params;
            } else {
                try {
                    console.warn("%cVelFun%cError%c\n    %cAJAX%c The method invalid.Can only be get or post.","background-color: black; color:white;padding: 0 5px; border-radius: 1000px 0 0 1000px;","background-color: orange; color:white;padding: 0 5px; border-radius: 0 1000px 1000px 0;","","background-color: orange; color:white;padding: 0 5px; border-radius: 1000px;","");
                } catch (e) {
                    document.writeln("VelFun Error:\n    AJAX:The method invalid.Can only be get or post.");
                }
            }
        }

        return new Promise((resolve, reject) => {
            if (method.toLowerCase() == "get") {
                fetch(url)
                    .then(response => response.text())
                    .then(text => {
                        if (typeof callback == "function") callback(text);
                        else resolve(text);
                    })
                    .catch(reason => {
                        reject(reason)
                    })
            } else if (method.toLowerCase() == "post") {
                fetch(url, { method: 'POST', body: data })
                    .then(response => response.text())
                    .then(text => {
                        if (typeof callback == "function") callback(text);
                        else resolve(text);
                    })
                    .catch(reason => {
                        reject(reason)
                    })
            } else {
                try {
                    console.warn("%cVelFun%cError%c\n    %cAJAX%c The method invalid.Can only be get or post.","background-color: black; color:white;padding: 0 5px; border-radius: 1000px 0 0 1000px;","background-color: orange; color:white;padding: 0 5px; border-radius: 0 1000px 1000px 0;","","background-color: orange; color:white;padding: 0 5px; border-radius: 1000px;","");
                } catch (e) {
                    document.writeln("VelFun Error:\n    AJAX:The method invalid.Can only be get or post.");
                }
            }
        })
    }
    /**
     * AJAX GET异步请求，基于.ajax()的简易实现
     * @param {string} url 请求的地址
     * @param {object} data 包含的数据，以Object格式提供，get模式会自动合并到请求地址
     * @param {function} callback 回调函数，第一个参数为返回的内容
     * @returns {Promise<function>} 返回Promise对象
     */

    velfun.io.get = async function (url, data, callback) {

        return velfun.io.ajax("get", url, data, callback);
    }
    /**
     * AJAX POST异步请求，基于.ajax()的简易实现
     * @param {string} url 请求的地址
     * @param {object} data 包含的数据，以Object格式提供，post模式下会以post提交
     * @param {function} callback 回调函数，第一个参数为返回的内容
     * @returns {Promise<function>} 返回Promise对象
     */

    velfun.io.post = async function (url, data, callback) {

        return velfun.io.ajax("post", url, data, callback);
    }
    /**
     * 动态导入资源
     * @param {string} url 资源的路径，可以使用绝对路径、相对路径、远端网址等
     * @param {string} type 手动指定资源的类型，通常程序会以后缀名自动判断类型，但当后缀名与实际类型不匹配时，就需要手动指定
     * @returns {string} 返回资源路径
     */

    velfun.io.import = function (url, type) {
        if (type == undefined) {
            let filepath = url.split("?");

            filepath = filepath[0];

            let ext = filepath.match(/\.([^\.]+$)/);
            type = ext[1];
        }
        if (type.toLowerCase() == "javascript" || type.toLowerCase() == "js") {

            const nowscript = _("script[src]");

            _(nowscript[nowscript.length - 1]).after('<script src="' + url + '" type="text/javascript"></script>');
        } else if (type.toLowerCase() == "stylesheet" || type.toLowerCase() == "css") {

            const nowcss = _("link[rel='stylesheet']");

            _(nowcss[nowcss.length - 1]).after('<link rel="stylesheet" href="' + url + '">');
        }
        return url;
    }
    /**
     * 动态移除资源
     * @param {string} url 资源的路径（src或href上的路径）
     */

    velfun.io.unimport = function (url) {

        _("[src='" + url + "']").remove();

        _("[href='" + url + "']").remove();
    }
    /**
     * 补丁目录加载
     * @param {string} path 指定补丁目录的路径，不支持单个文件 
     * @returns 
     */

    velfun.io.loadPatchsFrom = function (path) { //實驗性
        if (isOffline) return "Offline";
        const request = new XMLHttpRequest();
        request.open("get", path, false);
        request.send();
        if (request.status != 200) {
            console.clear();
            if (request.status == 404) console.error("%cVelFun%cError%c\n    %cloadPatchFrom%c There is not have valid patches, or given path is wrong!","background-color: black; color:white;padding: 0 5px; border-radius: 1000px 0 0 1000px;","background-color: red; color:white;padding: 0 5px; border-radius: 0 1000px 1000px 0;","","background-color: red; color:white;padding: 0 5px; border-radius: 1000px;","");
            console.log("%cVelFun%cLog%c\n   %cloadPatchsFrom%c Patches is not loaded!","background-color: black; color:white;padding: 0 5px; border-radius: 1000px 0 0 1000px;","background-color: #f0f0f0; color:black;padding: 0 5px; border-radius: 0 1000px 1000px 0;","","background-color: #f0f0f0; color:black;padding: 0 5px; border-radius: 1000px;","");
            return "Error";
        }


        for (const a of _.htmltodom(request.responseText).querySelectorAll('a')) {
            const patchfile = a.innerText;
            const start = patchfile.lastIndexOf('.');
            if (start > 0) {
                const patchfile_ext = patchfile.substring(start + 1);
                if (["js", "css"].includes(patchfile_ext)) {

                    _.io.import(path + "/" + patchfile);
                } else if (["html", "xml", "php", "htm"].includes(patchfile_ext)) {
                    window.addEventListener("load", ((patchfile) => {
                        return function () {
                            const html = new XMLHttpRequest();
                            html.open("get", path + "/" + patchfile, false);
                            html.send();

                            for (const dom of _.htmltodom(html.responseText).querySelectorAll('*')) {
                                if (dom.parentElement === null) {

                                    if (_(dom).hasAttr("id")) {

                                        let did = _(dom).attr("id");

                                        let nowele = _("#" + did);
                                        for (let i = 0; i < nowele.length; i++) {
                                            nowele[i].outerHTML = dom.outerHTML;
                                        }

                                    } else if (_(dom).hasAttr("class")) {

                                        let dc = _(dom).getClass();
                                        let cl = dc[0];

                                        let nowele = _("." + cl);
                                        for (let i = 0; i < nowele.length; i++) {
                                            nowele[i].outerHTML = dom.outerHTML;
                                        }
                                    }
                                }
                            }
                        }
                    })(patchfile))
                }
            }
        }
        return true;
    }
    /**
     * 设置Cookie或Session
     * @param {object} opts JSON格式的参数对象，具体格式请参考官网手册
     * @param {boolean} usingSessionMode 是否使用Session模式
     */

    velfun.io.setCookie = function (opts, usingSessionMode = false) {
        if (usingSessionMode) {
            window.sessionStorage.setItem(opts.name, opts.value);
            if (opts.expires) {
                let exp = opts.expires;
                let offset = 0;
                if (offset = exp.match(/^\+(\d+?)y$/)) {
                    offset = parseInt(offset[1]);
                    exp = new Date(new Date().setFullYear(new Date().getFullYear() + offset));
                } else if (offset = exp.match(/^\+(\d+?)m$/)) {
                    offset = parseInt(offset[1]);
                    exp = new Date(new Date().setMonth(new Date().getMonth() + offset));
                } else if (offset = exp.match(/^\+(\d+?)d$/)) {
                    offset = parseInt(offset[1]);
                    exp = new Date(new Date().setDate(new Date().getDate() + offset));
                } else if (offset = exp.match(/^\+(\d+?)h$/)) {
                    offset = parseInt(offset[1]);
                    exp = new Date(new Date().setHours(new Date().getHours() + offset));
                } else if (offset = exp.match(/^\+(\d+?)i$/)) {
                    offset = parseInt(offset[1]);
                    exp = new Date(new Date().setMinutes(new Date().getMinutes() + offset));
                } else if (offset = exp.match(/^\+(\d+?)s$/)) {
                    offset = parseInt(offset[1]);
                    exp = new Date(new Date().setSeconds(new Date().getSeconds() + offset));
                } else {
                    exp = new Date(exp);
                }
                let peeper = setInterval((name, expires) => {
                    let now = new Date();

                    if (Date.parse(now) >= Date.parse(expires)) {
                        window.sessionStorage.removeItem(name);
                        clearInterval(peeper);
                    }
                }, 1000, opts.name, exp);
            }
        } else {
            let cookieStr = `${opts.name}=${opts.value}`;
            if (opts.expires) {
                let exp = opts.expires;
                let offset = 0;
                if (offset = exp.match(/^\+(\d+?)y$/)) {
                    offset = parseInt(offset[1]);
                    exp = new Date(new Date().setFullYear(new Date().getFullYear() + offset));
                } else if (offset = exp.match(/^\+(\d+?)m$/)) {
                    offset = parseInt(offset[1]);
                    exp = new Date(new Date().setMonth(new Date().getMonth() + offset));
                } else if (offset = exp.match(/^\+(\d+?)d$/)) {
                    offset = parseInt(offset[1]);
                    exp = new Date(new Date().setDate(new Date().getDate() + offset));
                } else if (offset = exp.match(/^\+(\d+?)h$/)) {
                    offset = parseInt(offset[1]);
                    exp = new Date(new Date().setHours(new Date().getHours() + offset));
                } else if (offset = exp.match(/^\+(\d+?)i$/)) {
                    offset = parseInt(offset[1]);
                    exp = new Date(new Date().setMinutes(new Date().getMinutes() + offset));
                } else if (offset = exp.match(/^\+(\d+?)s$/)) {
                    offset = parseInt(offset[1]);
                    exp = new Date(new Date().setSeconds(new Date().getSeconds() + offset));
                } else {
                    exp = new Date(exp);
                }
                let utcdate = exp.toUTCString();
                cookieStr += "; expires=" + utcdate;
            }
            if (opts.path) cookieStr += "; path=" + opts.path;
            if (opts.domain) cookieStr += "; domain=" + opts.domain;
            document.cookie = cookieStr;
        }
    }
    /**
     * 获取Cookie或Session
     * @param {string} name Cookie或Session的名字
     * @param {boolean} usingSessionMode 使否使用Session模式，默认使用，将优先搜索Session之后是Cookie，设为False将只搜索Cookie。
     * @returns {string} Cookie或Session的值
     */

    velfun.io.getCookie = function (name, usingSessionMode = true) {

        if (usingSessionMode) {
            let val = window.sessionStorage.getItem(name);
            if (val) return val;
        }

        let result = document.cookie.match("(^|[^;]+)\\s*" + name + "\\s*=\\s*([^;]+)");

        return result ? result.pop() : "";
    }
    /**
     * 删除Cookie和Session
     * @param {string} name 要删除的Cookie或Session的名字
     * @param {boolean} usingSessionMode 是否删除Session，默认为true。如果设为false则仅会删除Cookie
     */

    velfun.io.delCookie = function (name, usingSessionMode = true) {
        if (usingSessionMode) {
            window.sessionStorage.removeItem(name);
        }
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    }
    /**
     * 调用并打开「打开文件」对话框，仅支持Promise返回值，不支持回调函数。
     * @param {object} options 包含input:file的属性，目前只针对accept和multiple生效。
     * @returns 
     */

    velfun.io.openFileDialog = async function (options = { "accept": "*", "multiple": false }) {

        return new Promise((resolve, reject) => {
            const f = document.createElement("input");
            f.type = "file";
            f.style.display = "none";
            if (options.accept) f.setAttribute("accept", options.accept);
            if (options.multiple) f.setAttribute("multiple", "multiple");

            f.onchange = (e) => {
                resolve(e.target.files);
            }

            f.click();
        })
    }

    //Test
    velfun.test = new Object();
    /**
     * 测试密码强度
     * @param {string} password 要测试的密码
     * @returns {number} 密码的分数，范围0-100，可能存在小数点
     */

    velfun.test.password = function (password) {
        const vel_t0 = /[A-Z]+/.test(password);
        const vel_t1 = /[a-z]+/.test(password);
        const vel_t2 = /\d+/.test(password);
        const vel_t3 = /[^A-z\d]+/.test(password);
        const vel_t4 = password.length;
        const vel_t5 = /(12|23|34|45|56|67|78|89|90|01|11|22|33|44|55|66|77|88|99|00)+/.test(password);
        const vel_t6 = /(ab|ac|cd|de|ef|fg|gh|hi|ij|jk|kl|lm|mn|no|op|pq|qr|rs|st|tu|uv|vw|wx|xy|yz|aa|bb|cc|dd|ee|ff|gg|hh|ii|jj|kk|ll|mm|nn|oo|pp|qq|rr|ss|tt|uu|vv|ww|xx|yy|zz)+/i.test(password);

        let vel_safe = 0.00;
        vel_safe += (vel_t0) ? 12.5 : 0;
        vel_safe += (vel_t1) ? 12.5 : 0;
        vel_safe += (vel_t2) ? 12.5 : 0;
        vel_safe += (vel_t3) ? 12.5 : 0;
        vel_safe += (vel_t4 >= 8) ? 12.5 : 0;
        vel_safe += (vel_t4 >= 15) ? 12.5 : 0;
        vel_safe += (!vel_t5 && vel_t2 && vel_t4 > 1) ? 12.5 : 0;
        vel_safe += (!vel_t6 && vel_t4 > 1 && (vel_t0 || vel_t1)) ? 12.5 : 0;

        return vel_safe;
    }
    /**
     * 测试电话号格式
     * @param {string} cellphone 要测试的电话号 
     * @returns {boolean} 输入的内容是否是电话号码。注意：此功能只能判断是否为合法电话号，但不能判断是否是有效的，或是特定要求的电话号。
     */

    velfun.test.cellphone = function (cellphone) {
        cellphone = cellphone.replace(/[\s-\(\)]/g, "")
        const areacode = cellphone.match(/^(\+|0{1,3}|\+0{1,3})(86|852|853|886|1|81|44)/);
        let test;
        if (!areacode) {

            areacode = "+86";
        } else {
            cellphone = cellphone.replace(areacode[0], "");


            areacode = areacode[0].replace(/(\+|0{1,3}|\+0{1,3})/, "+");
        }

        switch (areacode) {

            case "+86":
                test = /^1[345678]\d{9}$/.test(cellphone);
                break;

            case "+852":
                test = /^[239678]\d{7}$/.test(cellphone);
                break;

            case "+853":
                test = /^[68]\d{7}$/.test(cellphone) || /^28\d{6}$/.test(cellphone);
                break;

            case "+886":
                test = /^0?(9|2|3|4|5|6|7|8|37|49|89|82|826|836)\d{8}$/.test(cellphone);
                break;

            case "+1":
                test = /^\d{10}$/.test(cellphone);
                break;

            case "+81":
                test = /^\d{10}$/.test(cellphone);
                break;

            case "+44":
                test = /^0?7\d{9}$/.test(cellphone) || /^0?[^7]\d{10}$/.test(cellphone);
                break;
            default:

        }


        return test;
    }
    /**
     * 测试邮箱格式
     * @param {string} email 要测试的邮箱
     * @returns {boolean} 是否是合法的邮箱格式。注意：此功能只能判断格式是否正确，但不能判断邮箱可用性等因素
     */

    velfun.test.email = function (email) {
        return /(^[A-z]+[\d_]*)\@(\w+\.?)(\.\w+)$/.test(email.trim());
    }
    /**
     * 等待完全读取后触发回调
     * @param {function} callback 完成后触发回调
     * @returns {Promise<function>} 返回Promise对象
     */

    velfun.test.fullyLoad = async function (area, callback = ()=>{}, logs = true) {
        if (typeof callback == "boolean") {
            logs = callback;
            callback = () => { };
        }

        return new Promise((resolve, reject) => {
            let num = 0;
            let skipnum = 0;
            let errnum = 0;
            let fontsReady = false;

            _("img", area).each(function () {
                if (this.src == "") {
                    skipnum++;
                    if (logs) {
                        if (skipnum > 1) {

                            console.log(`%cVelFun%cLog%c Images ${skipnum}/${_("img", area).length} skipped.`,"background-color: black; color:white;padding: 0 5px; border-radius: 1000px 0 0 1000px;","background-color: #f0f0f0; color:black;padding: 0 5px; border-radius: 0 1000px 1000px 0;","");
                        } else {

                            console.log(`%cVelFun%cLog%c Image  ${skipnum}/${_("img", area).length} skipped.`,"background-color: black; color:white;padding: 0 5px; border-radius: 1000px 0 0 1000px;","background-color: #f0f0f0; color:black;padding: 0 5px; border-radius: 0 1000px 1000px 0;","");
                        }
                    }

                    if (num + errnum + skipnum >= _("img", area).length && fontsReady) {
                        callback();

                        resolve(true);
                    }
                    return;
                }
                let oImg = new Image();
                oImg.onload = function () {
                    num++;
                    if (logs) {
                        if (num > 1) {

                            console.log(`%cVelFun%cLog%c Images ${num}/${_("img", area).length} loaded.`,"background-color: black; color:white;padding: 0 5px; border-radius: 1000px 0 0 1000px;","background-color: #f0f0f0; color:black;padding: 0 5px; border-radius: 0 1000px 1000px 0;","");
                        } else {

                            console.log(`%cVelFun%cLog%c Image  ${num}/${_("img", area).length} loaded.`,"background-color: black; color:white;padding: 0 5px; border-radius: 1000px 0 0 1000px;","background-color: #f0f0f0; color:black;padding: 0 5px; border-radius: 0 1000px 1000px 0;","");
                        }
                    }

                    if (num + errnum + skipnum >= _("img", area).length && fontsReady) {
                        callback();

                        resolve(true);
                    }
                }
                oImg.onerror = function () {
                    errnum++;
                    if (logs) {
                        if (errnum > 1) {

                            console.log(`%cVelFun%cLog%c Failed to load images ${errnum}/${_("img", area).length}.`,"background-color: black; color:white;padding: 0 5px; border-radius: 1000px 0 0 1000px;","background-color: #f0f0f0; color:black;padding: 0 5px; border-radius: 0 1000px 1000px 0;","");
                        } else {

                            console.log(`%cVelFun%cLog%c Failed to load image  ${errnum}/${_("img", area).length}.`,"background-color: black; color:white;padding: 0 5px; border-radius: 1000px 0 0 1000px;","background-color: #f0f0f0; color:black;padding: 0 5px; border-radius: 0 1000px 1000px 0;","");
                        }
                    }

                    if (num + errnum + skipnum >= _("img", area).length && fontsReady) {
                        callback();

                        resolve(true);
                    }
                }
                oImg.src = this.src;
            })
            document.fonts.ready.then(function () {
                if (logs) console.log("%cVelFun%cLog%c Fonts loaded","background-color: black; color:white;padding: 0 5px; border-radius: 1000px 0 0 1000px;","background-color: #f0f0f0; color:black;padding: 0 5px; border-radius: 0 1000px 1000px 0;","");
                fontsReady = true;

                if (num + errnum >= _("img", area).length) {
                    callback();

                    resolve(true);
                }
            })
        })
    }

    //Translate
    velfun.trans = new Object();
    /**
     * 内部实现，不要直接调用
     */

    function toChar (num, numlang, levellang) {
        num = num.split("");
        let showNum = "";
        let hasZero = false;
        for (let i = 0; i < num.length; i++) {
            const level = levellang[num.length - i - 1];
            if (num.length == 2 && num[0] == '1' && i == 0) {
                showNum = level;
            } else {
                if (num[i] != 0) {
                    if (hasZero) {
                        showNum = showNum + "零" + numlang[num[i]] + level;
                        hasZero = false;
                    } else {
                        showNum = showNum + numlang[num[i]] + level;
                    }
                } else {
                    hasZero = true;
                }
            }
        }
        return showNum;
    }
    /**
     * 数字到汉字转换
     * @param {number} number 要转换的数字
     * @param {boolean} upperCase 是否使用大写汉字
     * @returns {string} 转换后的汉字数字
     */

    velfun.trans.NumToChar = function (number, upperCase) {
        upperCase = upperCase || false;

        number = String(number);

        const numArr = number.split(".");
        const numInt = numArr[0];
        const numFloat = numArr[1] || "";
        //定义对应数组
        let numlang, levellang;
        if (upperCase) {
            numlang = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖", "拾");
            levellang = new Array("", "拾", "佰", "仟");
        } else {
            numlang = new Array("零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十");
            levellang = new Array("", "十", "百", "千");
        }
        const biglevellang = new Array("", "万", "亿");

        //整数计算
        let num = new Array();
        if (numInt.length > 8) {
            num[0] = numInt.substring(0, numInt.length - 8);
            num[1] = numInt.substring(numInt.length - 8, numInt.length - 4);
            num[2] = numInt.substring(numInt.length - 4, numInt.length);
        } else if (numInt.length > 4) {
            num[0] = numInt.substring(0, numInt.length - 4);
            num[1] = numInt.substring(numInt.length - 4, numInt.length);
        } else {
            num[0] = numInt;
        }
        let showNum = "";
        for (let i = 0; i < num.length; i++) {

            let in_k = toChar(num[i], numlang, levellang);
            if (in_k != "") {
                if (i > 0 && in_k.indexOf("零") != 0 && num[i - 1].substring(num[i - 1].length - 1, num[i - 1].length) == "0") showNum += "零"

                showNum += toChar(num[i], numlang, levellang) + biglevellang[num.length - i - 1];
            }
        }
        //小数计算

        let showNum_float = toChar(numFloat, numlang, ["", "", "", ""]);
        if (showNum_float) {
            return showNum + "点" + showNum_float;
        } else {
            return showNum;
        }
    }

    //info
    velfun.info = new Object();
    /**
     * 获取移动端类型
     * @returns {string} 移动端的英文类型，NOT表示不是移动端
     */

    velfun.info.mobileType = function () {
        const u = navigator.userAgent;
        if (u.match(/Android/i)) {

            Mobile = 'android';
        } else if (u.match(/BlackBerry/i)) {

            Mobile = 'blackberry';
        } else if (u.match(/iPhone|iPad|iPod/i)) {

            Mobile = 'ios';
        } else if (u.match(/IEMobile/i)) {

            Mobile = 'windows';
        } else {

            Mobile = 'NOT';
        }

        return Mobile;
    }
    /**
     * 获取是否是移动端
     * @returns {boolean} 是否是移动端
     */

    velfun.info.isMobile = function () {

        return (velfun.info.mobileType() != 'NOT') ? true : false;
    }
    /**
     * 获取主机地址
     * @returns {string} 主机地址
     */

    velfun.info.host = function () {
        return window.location.host;
    }
    /**
     * [不工作] 判断是否是IE浏览器访问，但因为IE会让VelFun整体不能工作，所以此处代码仅供参考，无法实际应用
     * @deprecated
     * @param {function} func 如果为IE则执行的操作 
     * @returns {boolean} 是否是IE
     */

    velfun.info.isIE = function (func) {
        if ((!!window.ActiveXObject || "ActiveXObject" in window) && typeof func == "function") {
            func();
        }
        return (!!window.ActiveXObject || "ActiveXObject" in window) ? true : false;
    }
    /**
     * 获取GET方式传递的网页参数
     * @param {string} needvar 需要获取的参数的参数名
     * @returns {string} 返回的参数值，此值永远是字符串类型
     */

    velfun.info.args = function (needvar) {
        let query = window.location.search.substring(1);
        let reg = new RegExp(`(^|&)${needvar}=(.*?)(&|$)`);
        let re = query.match(reg);

        return re ? re[2] : false;
    };

    const query = window.location.search.substring(1);
    const vars = query.split("&");
    for (let i = 0; i < vars.length; i++) {
        const pair = vars[i].split("=");

        velfun.info.args[pair[0]] = pair[1];
    }

    let tipList = new Array();
    let tipReady = true;
    /**
     * 内部实现，不要直接调用
     */

    function Tip_do (content, title, duration) {
        if (typeof title === "number") {
            duration = title;

            title = undefined;
        }
        if (duration === undefined) {
            duration = 3000;
        }
        let appendHtml = "";
        let backgroundStyle = "background-color: var(--bg-color);";
        if (CSS.supports("backdrop-filter", "blur(30px)") || CSS.supports("-webkit-backdrop-filter", "blur(30px)")) {
            backgroundStyle = "background-color: var(--bg-color-blur);";
        }
        if (title !== undefined) {
            appendHtml = "<div class='_Velfun_Tip' style='" + backgroundStyle + "'><span class='_Velfun_Tip_Title' style='display:block;width:calc(100% - 10px);height:30px;line-height:30px;top:0px;margin:0px 5px;box-sizing:border-box;border-bottom:1px lightgray solid;font-weight:bold;'>" + title + "</span><span class='_Velfun_Tip_Content' style='display:block;width:100%;top:40px;padding:5px 10px;box-sizing:border-box;'>" + content + "</span></div>";
        } else {
            appendHtml = "<div class='_Velfun_Tip' style='" + backgroundStyle + "'><span class='_Velfun_Tip_Content' style='display:block;width:100%;padding:5px;box-sizing:border-box;'>" + content + "</span></div>";
        }

        _("body").after(appendHtml);


        const tips = _("._Velfun_Tip");
        for (let i = 0; i < tips.length; i++) {

            const tip = _(tips[i]);
            if (i == 0) {
                setTimeout(function (t) {
                    t.css("right:5px;--st-color-mask: transparent");
                }, 10, tip)
            } else {
                const newtop = parseInt(tips[0].offsetHeight) + parseInt(tip[0].offsetTop) + 5;
                tip.css("top:" + newtop + "px;");
            }
        }
        setTimeout(function (t) {
            t.css("opacity:0;");
            setTimeout(function (t) {
                t.remove();
            }, 300, t)

        }, duration, _(tips[0]))

        setTimeout(function () {
            if (tipList.length >= 1) {
                const fun = tipList.shift();
                fun();
            } else {
                tipReady = true;
            }
        }, 500)
    }

    velfun.fn.init.prototype = velfun.fn;

    window.velfun = _ = velfun;
})(window);

//Base Ext
/**
 * 获取两位数的完整月份
 * @param {boolean} addone 是否+1偏移 
 * @returns {string} 月份字符串
 */

Date.prototype.getFullMonth = function (addone) {
    const addo = addone || false;
    const vel_date = this;
    let vel_month = vel_date.getMonth();
    if (addo) {

        vel_month = parseInt(vel_month) + 1;
    }
    if (vel_month.toString().length == 1) {
        return "0" + vel_month;
    } else {

        return vel_month;
    }
}
/**
 * 获取两位数的完整日期
 * @returns {string} 天数字符串
 */

Date.prototype.getFullDate = function () {
    const vel_date = this;
    const vel_fdate = vel_date.getDate();
    if (vel_fdate.toString().length == 1) {
        return "0" + vel_fdate;
    } else {

        return vel_fdate;
    }
}
/**
 * 获取两位数的完整小时
 * @returns {string} 小时字符串
 */

Date.prototype.getFullHours = function () {
    const vel_date = this;
    const vel_hours = vel_date.getHours();
    if (vel_hours.toString().length == 1) {
        return "0" + vel_hours;
    } else {

        return vel_hours;
    }
}
/**
 * 获取两位数的完整分钟
 * @returns {string} 分钟字符串
 */

Date.prototype.getFullMinutes = function () {
    const vel_date = this;
    const vel_minutes = vel_date.getMinutes();
    if (vel_minutes.toString().length == 1) {
        return "0" + vel_minutes;
    } else {

        return vel_minutes;
    }
}
/**
 * 获取两位数的完整秒数
 * @returns {string} 秒数字符串
 */

Date.prototype.getFullSeconds = function () {
    const vel_date = this;
    const vel_seconds = vel_date.getSeconds();
    if (vel_seconds.toString().length == 1) {
        return "0" + vel_seconds;
    } else {

        return vel_seconds;
    }
}

Object.defineProperty(Date.prototype, "FullMonth", {
    get: function () {
        return this.getFullMonth(true);
    }
});

Object.defineProperty(Date.prototype, "FullDate", {
    get: function () {
        return this.getFullDate();
    }
});

Object.defineProperty(Date.prototype, "FullHours", {
    get: function () {
        return this.getFullHours();
    }
});

Object.defineProperty(Date.prototype, "FullMinutes", {
    get: function () {
        return this.getFullMinutes();
    }
});

Object.defineProperty(Date.prototype, "FullSeconds", {
    get: function () {
        return this.getFullSeconds();
    }
});

//Auto Exec
_.selfpath = document.scripts;
_.selfpath = _.selfpath[_.selfpath.length - 1].src.substring(0, _.selfpath[_.selfpath.length - 1].src.lastIndexOf("/") + 1);

let _return = _.io.loadPatchsFrom(_.selfpath + "plugins/");
if (_return == "Error") {
    console.clear();
    console.info("%cVelFun%cInfo%c Not found any plugins, Let's go on!","background-color: black; color:white;padding: 0 5px; border-radius: 1000px 0 0 1000px;","background-color: #9999ff; color:black;padding: 0 5px; border-radius: 0 1000px 1000px 0;","");
}

function controllerInit() {

    _.initUpload();

    _.setColoricon();

    _.observer.observe(_.obbody, _.obconfig);
}

_(function () {

    if (_.info.isIE()) {
        document.writeln("VelFun4 is not support Internet Explorer.");
        return false;
    }



    /**监听变化内容以更新**/

    _.obbody = _("html")[0];

    _.obconfig = { attributes: true, childList: true, subtree: true };

    _.obcallback = function (ml, observer) {
        controllerInit();
        for (const mr of ml) {
            /*>>>>语言更新*/
            switch (mr.type) {
                case "attributes":
                    if (!["alt", "title", "placeholder", "value"].includes(mr.attributeName)) continue;

                    _.observer.disconnect();

                    if (_(mr.target).hasAttr(mr.attributeName)) {

                        _(mr.target).attr("data-" + mr.attributeName + "TempStr", _(mr.target).attr(mr.attributeName));
                    }

                    for (const key in _.langdata) {

                        const nt = _.langdata[key];
                        try {

                            _(mr.target).attr(mr.attributeName, _(mr.target).attr(mr.attributeName).replaceAll(`@t-${key};`, nt));
                        } catch (e) { }
                    }

                    _.observer.observe(_.obbody, _.obconfig);
                    break;
                case "childList":

                    _.observer.disconnect();
                    for (const adn of mr.addedNodes) {

                        const nl = _.getTextNodes(adn);
                        for (const tn of nl) {
                            if (tn.tempStr == undefined) {
                                tn.tempStr = tn.nodeValue.trim();
                            } else {
                                tn.nodeValue = tn.tempStr;
                            }

                            for (const key in _.langdata) {

                                const nt = _.langdata[key];
                                tn.nodeValue = tn.nodeValue.replaceAll(`@t-${key};`, nt);
                            }
                        }

                        velfun.private.setAttrsLang(adn, _.langdata);
                    }

                    _.observer.observe(_.obbody, _.obconfig);
                    break;
            }
            /*<<<<语言更新*/
        }
    }

    _.observer = new MutationObserver(_.obcallback);
    controllerInit(); //初始化控件

    //Init Auto

    _("html").css("perspective: 100px; min-height:100%; min-width: 100%;");

    _("head").prepend(`
      <style id="vel_needed_styles">
    .html_alt_back {
        background-color: #333 !important;
    }
    
    .body_alt_back {
        background-color: white !important;
    }
    
    .body_lite_disabled {
        opacity: 0.8 !important;
        pointer-events: none !important;
    }
    
    .body_inback {
        pointer-events: none !important;
        transition-duration: 300ms;
        border-radius: 10px;
        overflow: hidden;
    }
    
    body {
        opacity: 1;
        transform: translateZ(0px);
        min-width: 100vw;
        min-height: 100vh;
        margin: 0;
    }
    
    #_MessageBox_ {
        --bg-color: rgba(253, 253, 253, 0.9);
        --bg-color-blur: rgba(253, 253, 253, 0.5);
        backdrop-filter: blur(30px);
        -webkit-backdrop-filter: blur(30px);
        transition: 300ms;
        border: 1px #CCC solid;
        box-sizing: border-box;
        display: block;
        position: fixed;
        overflow: hidden;
        max-width: 100%;
        width: 450px;
        min-height: 200px;
    }
    
    ._Velfun_Contextmenu_ {
        --bg-color: rgba(253, 253, 253, 0.9);
        --bg-color-blur: rgba(253, 253, 253, 0.5);
        backdrop-filter: blur(30px);
        -webkit-backdrop-filter: blur(30px);
        transition: opacity 120ms;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
        overflow: hidden;
        position: absolute;
        border-radius: 10px;
        padding: 0;
        z-index: 9999;
        min-width: 160px;
        opacity: 0;
        display: none;
        margin: 0;
    }

    ._Velfun_Contextmenu_option:hover {
        background-color: rgba(0, 0, 0, 0.1);
    }
    
    ._Velfun_Options_Item {
        --button-color: rgba(253, 253, 253, 0.9);
        --button-color-blur: rgba(253, 253, 253, 0.5);
        backdrop-filter: blur(30px);
        -webkit-backdrop-filter: blur(30px);
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
        width: 80%;
        max-width: 400px;
        min-height: 40px;
        position: relative;
        height: auto;
        display: table;
        clear: both;
        margin: -40px auto 0 auto;
        border-radius: 20px;
        overflow-x: hidden;
        transform: scale(0.8);
        opacity: 0;
        transition: transform 200ms, opacity 200ms, margin 200ms ease-out;
    }
    
    ._Velfun_Tip {
        --bg-color: rgba(253, 253, 253, 0.9);
        --bg-color-blur: rgba(253, 253, 253, 0.5);
        --st-color-mask:  rgba(255, 200, 0,0.5);
        backdrop-filter: blur(30px);
        -webkit-backdrop-filter: blur(30px);
        display: block;
        position: fixed;
        top: 5px;
        right: -310px;
        width: 300px;
        height: auto;
        border-radius: 10px;
        box-shadow: 0px 0px 5px gray;
        pointer-events: none;
        transition: right 300ms ease-in, opacity 300ms;
        z-index: 9999;
    }
    ._Velfun_Tip::before {
        content: " ";
        display: block;
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        transition: background-color 500ms ease-out;
        transition-delay: 350ms;
        background-color: var(--st-color-mask);
    }
    </style>
    `);


    _(document).bind("click", function () {

        _("._Velfun_Contextmenu_[data-open]").css("opacity:0;");
        setTimeout(function () {

            _("._Velfun_Contextmenu_[data-open]").css("display:none;");

            _("._Velfun_Contextmenu_[data-open]").attr("data-open", "");

            _("._Velfun_Contextmenu_[dynamic]").remove();
        }, 120)


        if (_("v-select[data-opening]").length > 0) {

            _("v-select[data-opening]").closeSelect();
        }
    })


    //Keys

    velfun.nowinputbox = null;

    _("v-key").bind("mousedown", function (e) {
        e.preventDefault();
    })


    _("v-key").bind("click", function () {
        const _this = this;

        if (_(velfun.nowinputbox).hasAttr('readonly') || _(velfun.nowinputbox).hasAttr('disable') || !velfun.nowinputbox) {
            return false;
        }
        const keychar = _this.attr("value");

        const pos = velfun.nowinputbox.selectionStart;
        if (keychar == "clear") {

            velfun.nowinputbox.value = "";

            velfun.nowinputbox.selectionStart = 0;

            velfun.nowinputbox.selectionEnd = 0;
        } else if (keychar == "backspace") {

            if (velfun.nowinputbox.selectionStart != velfun.nowinputbox.selectionEnd) {

                velfun.nowinputbox.value = velfun.nowinputbox.value.substr(0, velfun.nowinputbox.selectionStart) + velfun.nowinputbox.value.substr(velfun.nowinputbox.selectionEnd, velfun.nowinputbox.value.length);

                velfun.nowinputbox.selectionStart = pos;

                velfun.nowinputbox.selectionEnd = pos;
                return false;
            }

            velfun.nowinputbox.value = velfun.nowinputbox.value.substr(0, pos - 1) + velfun.nowinputbox.value.substr(pos, velfun.nowinputbox.value.length);

            velfun.nowinputbox.selectionStart = pos - 1;

            velfun.nowinputbox.selectionEnd = pos - 1;
        } else if (keychar == "minus") {

            if (velfun.nowinputbox.value.indexOf("-") == -1) {

                velfun.nowinputbox.value = "-" + velfun.nowinputbox.value;
            } else {

                velfun.nowinputbox.value = velfun.nowinputbox.value.substr(1, velfun.nowinputbox.value.length);
            }

            velfun.nowinputbox.selectionStart = velfun.nowinputbox.value.length;

            velfun.nowinputbox.selectionEnd = velfun.nowinputbox.value.length;
        } else if (keychar == "shift") {
            if (_this.hasClass('shiftON')) {
                _this.removeClass('shiftON');

                const keys = _("v-key", _this.parent());
                for (let i = 0; i < keys.length; i++) {

                    const key = _(keys[i]);
                    const isEn = /^[a-zA-Z]$/i.test(key.attr("value"));
                    if (isEn) {
                        const normal = key.attr("value").toLowerCase();
                        key.attr("value", normal);
                        key.text(normal);
                    }
                }
            } else {
                _this.addClass('shiftON');

                const keys = _("v-key", _this.parent());
                for (let i = 0; i < keys.length; i++) {

                    const key = _(keys[i]);
                    const isEn = /^[a-zA-Z]$/i.test(key.attr("value"));
                    if (isEn) {
                        const upper = key.attr("value").toUpperCase();
                        key.attr("value", upper);
                        key.text(upper);
                    }
                }
            }
        } else if (keychar == "space") {

            velfun.nowinputbox.value = velfun.nowinputbox.value.substr(0, velfun.nowinputbox.selectionStart) + " " + velfun.nowinputbox.value.substr(velfun.nowinputbox.selectionEnd, velfun.nowinputbox.value.length);

            velfun.nowinputbox.selectionStart = pos + keychar.length;

            velfun.nowinputbox.selectionEnd = pos + keychar.length;
        } else {

            velfun.nowinputbox.value = velfun.nowinputbox.value.substr(0, velfun.nowinputbox.selectionStart) + keychar + velfun.nowinputbox.value.substr(velfun.nowinputbox.selectionEnd, velfun.nowinputbox.value.length);

            velfun.nowinputbox.selectionStart = pos + keychar.length;

            velfun.nowinputbox.selectionEnd = pos + keychar.length;
        }

        _(velfun.nowinputbox).trigger("change");
    })


    _("input[inputbox]").bind("focus", function () {

        velfun.nowinputbox = this[0];
    })

})
