/********************
腳本名:VelFun
版本號:4-2.80
通  道:Release
作　者:龍翔翎(Velade)

更新日期:2022-02-23
********************/
;(function(window,undefined){
  var version = "4-2.80";
  var channel = "Release"
  var velfun = function(selector,context){
    if(_.info.isIE()){
      return false;
    }
    return new velfun.fn.init(selector,context);
  }

  //Init
  velfun.fn = velfun.prototype = {
    length:0,
    velfun:version,
    channel:channel,
    selector:"",
    init:function(selector,context){
      var _this = this;
      _this.velfun = version;
      _this.channel = channel;
      try {
        if(selector === undefined){
          console.error("VelFun Error:\n    Selector:The selector cannot be empty and an empty object was returned!");
          _this.length = 0;
          _this.selector = "";
          return _this;
        }
        if(selector.velfun !== undefined){
          return selector;
        }
        if(typeof selector === "function"){
          window.addEventListener("load",function(){
            //Callback
            selector.call(_(document));
          });
          return _this;
        }
        var doms;
        var parent = document;
        if(context !== undefined){
          parent = _(context)[0];
        }
        if(typeof selector === "string"){
          if(parent === undefined){
            return;
          }
          doms = parent.querySelectorAll(selector);
        }else if(typeof selector === "object"){
          _this.length = 1;
          _this.selector = "DOM";
          _this[0] = selector;
          return _this;
        }else{
          try {
            console.error("VelFun Error:\n    Selector:Not support selector");
          } catch (e) {
            document.writeln("VelFun Error:\n    Selector:Not support selector");
          }
          _this.length = 0;
          _this.selector = "";
          return _this;
        }
        _this.length = doms.length;
        _this.selector = selector;
        for(var i = 0;i < doms.length;i++){
          _this[i] = doms[i];
        }
        return _this;
      } catch (e) {
        try {
          console.error("VelFun Error:\n    Selector:An error occurred and an empty object was returned!");
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
  velfun.fn.attr = function(attrname,attrvalue){
    if(this.length == 0) return this;
    if(this[0].nodeType == 3) return null;
    var _this = this;
    if(attrvalue === undefined){
      return _this[0].getAttribute(attrname);
    }else{
      for (var i = 0; i < _this.length; i++) {
        if(attrvalue === ""){
          _this[i].removeAttribute(attrname);
        }else if(attrvalue === attrname){
          _this[i].setAttribute(attrname,"");
        }else{
          _this[i].setAttribute(attrname,attrvalue);
        }
      }
      return this;
    }
  }

  velfun.fn.hasAttr = function(attrname){
    if(this.length == 0) return this;
    return (this.attr(attrname) !== null)?true:false;
  }

  velfun.fn.val = function(value){
    if(this.length == 0) return this;
    var _this = this;
    if(_this[0].tagName.toLowerCase() == "v-select"){
      if(value === undefined){
        return _("input[type='hidden']",_this).attr("value");
      }else{
        if(_this.hasAttr("readonly") || _this.hasAttr("disable")){
          return _this;
        }
        _("v-option[value='" + value + "']").trigger("click");
        return _this;
      }
    }else if(_this[0].tagName.toLowerCase() == "input" || _this[0].tagName.toLowerCase() == "textarea"){
      if(value === undefined){
        return _this[0].value;
      }else{
        this[0].value = value;
        return _this;
      }
    }else{
      if(value === undefined){
        return _this.attr("value");
      }else{
        _this.attr("value",value);
        return _this;
      }
    }
  }

  velfun.fn.css = function(css,index){
    if(this.length == 0) return this;
    var _this = this;
    var isRead = false;
    css = css.replace(/\s*?:\s*?/,":");
    css = css.replace(/\s*?;\s*?/,";");
    var newstyles = css.split(";");
    newstyles = newstyles.filter(Boolean);
    if(newstyles.length <= 1){
      if(newstyles[0]){
        var tmp_NaA = newstyles[0].split(":");
        if(!tmp_NaA[1]){
          isRead = true;
        }
      }else if(css){
        var tmp_NaA = css[0].split(":");
        if(!css[1]){
          isRead = true;
        }
      }
    }
    if(isRead){
      //Read css
      if(index === undefined){
        index = 0;
      }
      var re = null;
      switch (css) {
        case "transform":
        re = _this[0].style.transform;
        break;
        default:
        re = window.getComputedStyle(_this[index]).getPropertyValue(css);
      }
      return re;
    }else{
      //Write css
      for (var i = 0; i < _this.length; i++) {
        if (_this.hasOwnProperty(i)) {
          var tostyle = _(_this[i]).attr("style");
          var oldstyles = {};
          if(tostyle != null){
            tostyle = tostyle.replace(/\s*?:\s*?/,":");
            tostyle = tostyle.replace(/\s*?;\s*?/,";");
            oldstyles = tostyle.split(";");
            oldstyles = oldstyles.filter(Boolean);
          }
          var newstyles_a = {},oldstyles_a = {};
          for (var i2 in newstyles) {
            if (newstyles.hasOwnProperty(i2)) {
              var NaA = newstyles[i2].split(":");
              NaA = NaA.filter(Boolean);
              var cssvals = [];
              for (var n = 1; n <= NaA.length; n++) {
                if(NaA[n]){
                  cssvals.push(NaA[n]);
                }
              }
              newstyles_a[NaA[0].trim()] = cssvals.join(":");
            }
          }
          for (var i2 in oldstyles) {
            if (oldstyles.hasOwnProperty(i2)) {
              var NaA = oldstyles[i2].split(":");
              NaA = NaA.filter(Boolean);
              var cssvals = [];
              for (var n = 1; n <= NaA.length; n++) {
                if(NaA[n]){
                  cssvals.push(NaA[n]);
                }
              }
              oldstyles_a[NaA[0].trim()] = cssvals.join(":");
            }
          }
          for (var key in newstyles_a) {
            if (newstyles_a.hasOwnProperty(key)) {
              oldstyles_a[key] = newstyles_a[key];
            }
          }
          var newstyles_s = "";
          for (var key in oldstyles_a) {
            if (oldstyles_a.hasOwnProperty(key)) {
              newstyles_s += key + ":" + oldstyles_a[key] + ";";
            }
          }
          _(_this[i]).attr("style",newstyles_s);
        }
      }
      return this;
    }
  }

  velfun.fn.html = function(html,index){
    if(this.length == 0) return this;
    var _this = this;
    if(html === undefined){
      //ReadHTML
      if(index === undefined){
        return this[0].innerHTML;
      }else{
        return this[index].innerHTML;
      }

    }else{
      //WriteHTML
      for (var i = 0; i < _this.length; i++) {
        if (_this.hasOwnProperty(i)) {
          var tdom = _this[i];
          tdom.innerHTML = html;
        }
      }
      return _this;
    }
  }

  velfun.fn.text = function(text,index){
    if(this.length == 0) return this;
    var _this = this;
    if(text === undefined){
      //ReadTEXT
      if(index === undefined){
        return this[0].innerText;
      }else{
        return this[index].innerText;
      }
    }else{
      //WriteTEXT
      for (var i = 0; i < _this.length; i++) {
        if (_this.hasOwnProperty(i)) {
          var tdom = _this[i];
          tdom.innerText = text;
        }
      }
      return _this;
    }
  }

  velfun.fn.getClass = velfun.fn.getclass = function(index){
    if(this.length == 0) return this;
    if(!index && index != 0){
      var classStr = this[0].className;
    }else{
      var classStr = this[index].className;
    }
    var classArr = classStr.split(/\s+/);
    classArr = classArr.filter(Boolean);
    return classArr;
  }

  velfun.fn.hasClass = velfun.fn.hasclass = function(classname){
    if(this.length == 0) return this;
    var classes = this.getClass();
    return (classes.indexOf(classname) == -1)?false:true;
  }

  velfun.fn.addClass = velfun.fn.addclass = function(classname){
    if(this.length == 0) return this;
    var _this = this;
    for (var i = 0; i < _this.length; i++) {
      if (_this.hasOwnProperty(i)) {
        var nowClass = this.getclass(i);
        if(nowClass.indexOf(classname) === -1){
          nowClass.push(classname);
          nowClass = nowClass.filter(Boolean);
          var newClassStr = nowClass.join(" ");
          this.attr("class",newClassStr,i);
        }
      }
    }
    return this
  }

  velfun.fn.removeClass = velfun.fn.removeclass = function(classname){
    if(this.length == 0) return this;
    var _this = this;
    for (var i = 0; i < _this.length; i++) {
      var nowClass = _this.getclass(i);
      for(var i2 = 0; i2 < nowClass.length; i2++){
        if(nowClass[i2] === classname) {
          nowClass.splice(i2, 1);
        }
      }
      nowClass = nowClass.filter(Boolean);
      var newClassStr = nowClass.join(" ");
      _this.attr("class",newClassStr,i);
    }

    return _this;
  }

  velfun.fn.replaceClass = velfun.fn.replaceclass = function(oldclass,newclass){
    if(this.length == 0) return this;
    this.addClass(newclass);
    this.removeClass(oldclass);
    return this;
  }

  velfun.fn.bind = function(ev,selector = "",func,pop = false){
    if(this.length == 0) return this;
    var _this = this;
    if(typeof func == "boolean" && pop == undefined) {
      pop = func;
      func = "";
    }
    if(typeof selector == "function" && func == undefined) {
      func = selector;
      selector = "";
    }
    if(typeof func === "function"){
      for (var i = 0; i < _this.length; i++) {
        var th = _this[i];
        if(selector != ""){
          th.self = th;
          th.addEventListener(ev,(s=>{
            return function(e){
              var sdom = _(s);
              for (var i = 0; i < sdom.length; i++) {
                if(e.target === sdom[i] || pop) func.call(_(e.target),e,this);;
              }
            }
          })(selector))
        }else{
          th.self = th;
          th.addEventListener(ev,function(e){
            func.call(_(e.target),e,this);

          })
        }
      }
    }else{
      try {
        console.error("VelFun Error:\n    bind:The second parameter not a function!");
      } catch (e) {
        document.writeln("VelFun Error:\n    bind:The second parameter not a function!");
      }
    }

    return _this;
  }

  velfun.fn.trigger = function(event){
    if(this.length == 0) return this;
    var _this = this;
    var e = new Event(event);
    for (var i = 0; i < _this.length; i++) {
      var th = _this[i];
      if(typeof th[event] == "function"){
        th[event]();
      }else{
        th.dispatchEvent(e);
      }
    }

    return _this;
  }

  velfun.fn.click = function(func){
    if(this.length == 0) return this;
    if(func === undefined){
      this.trigger("click");
    }else{
      this.bind("click",func);
    }

    return this;
  }

  velfun.fn.after = function(html){
    if(this.length == 0) return this;
    var dom = this[0];
    _.htmltodom(html,function(elem){
      if(dom.parentNode){
        dom.parentNode.insertBefore(elem,dom.nextSibling);
      }
    })
    return this;
  }

  velfun.fn.before = function(html){
    if(this.length == 0) return this;
    var dom = this[0];
    _.htmltodom(html,function(elem){
      if(dom.parentNode){
        dom.parentNode.insertBefore(elem,dom);
      }
    })
    return this;
  }

  velfun.fn.append = function(html){
    if(this.length == 0) return this;
    var dom = this[0];
    _.htmltodom(html,function(elem){
      if(dom.parentNode){
        dom.appendChild(elem);
      }
    })
    return this;
  }

  velfun.fn.prepend = function(html){
    if(this.length == 0) return this;
    var dom = this[0];
    _.htmltodom(html,function(elem){
      if(dom.parentNode){
        dom.insertBefore(elem,dom.firstChild);
      }
    })
    return this;
  }

  velfun.fn.remove = function(){
    if(this.length == 0) return this;
    var _this = this;
    for (var i = 0; i < _this.length; i++) {
      var dom = _this[i];
      dom.parentNode.removeChild(dom);
    }
    return true;
  }

  velfun.fn.empty = function(){
    if(this.length == 0) return this;
    var _this = this;
    for (var i = 0; i < _this.length; i++) {
      var dom = _this[i];
      while(dom.hasChildNodes()){
        dom.removeChild(dom.firstChild);
      }
    }
  }

  velfun.fn.parent = function(){
    if(this.length == 0) return this;
    return _(this[0].parentElement);
  }

  velfun.fn.next = function(){
    if(this.length == 0) return this;
    return _(this[0].nextElementSibling);
  }

  velfun.fn.prev = function(){
    if(this.length == 0) return this;
    return _(this[0].previousSibling);
  }

  velfun.fn.each = function(func){
    if(this.length == 0) return this;
    var _this = this;
    if(typeof func != "function"){
      return false;
    }
    for (var i = 0; i < _this.length; i++) {
      var item = _this[i];
      var index = i;
      var value = func.call(item,index,item);
      if(value === false) break;
    }
    return _this;
  }

  velfun.fn.back = function(size){
    if(this.length == 0) return this;
    var _this = this;
    if(_this[0].tagName.toLowerCase() == "body"){
      _("html").css("background-color:black;");
    }

    if(size === undefined){
      size = 5;
    }

    var nowLaySize = _this.attr("data-laysizes");
    if(!nowLaySize){
      nowLaySize = size;
      _this.attr("data-start-opacity",_this.css("opacity"));
      _this.attr("data-start-pointerevents",_this.css("pointer-events"));
      _this.attr("data-start-cursor",_this.css("cursor"));
    }else{
      nowLaySize += "," + size;
    }
    _this.attr("data-laysizes",nowLaySize);

    var oldTransform = _this.css("transform");
    var oldTZ = oldTransform.match(/.*?translateZ\((.+?)\).*?/);
    var nowTZ;
    if(oldTZ){
      nowTZ = parseInt(oldTZ[1]);
    }else{
      nowTZ = 0;
    }

    var newsize = nowTZ - size;

    var newOpa = 1 - Math.min((Math.abs(newsize) / 25),1);
    var newTransform;
    if(oldTZ){
      newTransform = oldTransform.replace(/.*?translateZ\((.+?)\).*?/,"translateZ(" + newsize + "px)");
    }else{
      if(oldTransform){
        newTransform = oldTransform.split(" ");
        newTransform.unshift("translateZ(" + newsize + "px)");
        newTransform = newTransform.join(" ");
      }else{
        newTransform = "translateZ(" + newsize + "px)";
      }
    }
    _this.css("transition-duration: 300ms;transform: " + newTransform + ";opacity: " + newOpa + ";");
    if(newsize !== 0){
      _this.css("pointer-events: none;cursor: default;");
    }

    return _this;
  }

  velfun.fn.unback = function(){
    if(this.length == 0) return this;
    var _this = this;

    var nowLaySize = _this.attr("data-laysizes");
    if(!nowLaySize){
      return _this;
    }
    var nowLaySizes = nowLaySize.split(",");
    var size = nowLaySizes.pop();

    if(nowLaySizes.length > 0){
      _this.attr("data-laysizes",nowLaySizes.join(","));
    }else{
      _this.attr("data-laysizes","");
    }

    var oldTransform = _this.css("transform");
    var oldTZ = oldTransform.match(/.*?translateZ\((.+?)\).*?/);
    oldTZ = parseInt(oldTZ[1]);
    var newsize = parseFloat(oldTZ) + parseFloat(size);

    var newOpa = 1 - Math.min((Math.abs(newsize) / 25),1);
    var newTransform = oldTransform.replace(/.*?translateZ\((.+?)\).*?/,"translateZ(" + newsize + "px)");
    _this.css("transform: " + newTransform + ";opacity: " + newOpa + ";");

    if(nowLaySizes.length === 0){
      var startOpacity = _this.attr("data-start-opacity");
      _this.attr("data-start-opacity","");
      var startPointerEvents = _this.attr("data-start-pointerevents");
      _this.attr("data-start-pointerevents","");
      var startCursor = _this.attr("data-start-cursor");
      _this.attr("data-start-cursor","");
      _this.css("opacity:" + startOpacity + ";pointer-events:" + startPointerEvents + ";cursor:" + startCursor + ";");
      if(_this[0].tagName.toLowerCase() == "body"){
        setTimeout(function(){
          _("html").css("background-color:white;");
        },300);
      }
    }

    return _this;
  }

  velfun.fn.resetback = function(){
    if(this.length == 0) return this;
    var _this = this;

    var nowLaySize = _this.attr("data-laysizes");
    if(!nowLaySize){
      return _this;
    }
    var nowLaySizes = nowLaySize.split(",");
    var size = 0;
    for(var i = 0;i < nowLaySizes.length ; i++){
      size += parseFloat(nowLaySizes[i]);
    }

    _this.attr("data-laysizes","");

    var oldTransform = _this.css("transform");
    var oldTZ = oldTransform.match(/.*?translateZ\((.+?)\).*?/);
    oldTZ = parseInt(oldTZ[1]);
    var newsize = parseFloat(oldTZ) + parseFloat(size);

    var newOpa = 1 - Math.min((Math.abs(newsize) / 25),1);
    var newTransform = oldTransform.replace(/.*?translateZ\((.+?)\).*?/,"translateZ(" + newsize + "px)");
    _this.css("transform: " + newTransform + ";opacity: " + newOpa + ";");

    var startOpacity = _this.attr("data-start-opacity");
    _this.attr("data-start-opacity","");
    var startPointerEvents = _this.attr("data-start-pointerevents");
    _this.attr("data-start-pointerevents","");
    var startCursor = _this.attr("data-start-cursor");
    _this.attr("data-start-cursor","");
    _this.css("opacity:" + startOpacity + ";pointer-events:" + startPointerEvents + ";cursor:" + startCursor + ";");

    return _this;
  }

  velfun.fn.exec = function(func,delay){
    if(this.length == 0) return this;
    if(typeof func !== "function"){
      try {
        console.error("VelFun Error:\n    exec:The first parameter not a function!");
      } catch (e) {
        document.writeln("VelFun Error:\n    exec:The first parameter not a function!");
      }
      return this;
    }
    if(delay !== undefined){
      var _this = this;
      setTimeout(function(func){
        func.call(_this);
      }.bind(_this,func),delay)
    }else{
      func.call(this);
    }

    return this;
  }

  velfun.fn.hover = function(func1,func2){
    if(this.length == 0) return this;
    if(func1 === undefined){
      try {
        console.error("VelFun Error:\n    hover:You need to set at least one function to be executed!");
      } catch (e) {
        document.writeln("VelFun Error:\n    hover:You need to set at least one function to be executed!");
      }
      return this;
    }
    if(func2 === undefined){
      func2 = function(){};
    }

    if(typeof func1 !== "function" || typeof func2 !== "function"){
      try {
        console.error("VelFun Error:\n    hover:The parameter not a function!");
      } catch (e) {
        document.writeln("VelFun Error:\n    hover:The parameter not a function!");
      }
      return this;
    }

    this.bind("mouseover",func1).bind("mouseout",func2);

    return this;
  }

  var vel_menufuns=new Object();
  velfun.fn.CustomContextmenu = velfun.fn.ccm = function(funarr) {
    if(this.length == 0) return this;
    var _this = this;
    for (var index = 0; index < _this.length; index++) {
      var vel_funthis = _(_this[index]);
      var vel_funthisid = Math.floor(Math.random()*89999999+10000000);
      vel_funthis.attr("data-contextmenuid",vel_funthisid);
      var backgroundStyle = "background-color: rgba(253,253,253,0.9);";
      if(CSS.supports("backdrop-filter","blur(30px)")){
        backgroundStyle = "background-color: rgba(253,253,253,0.5);backdrop-filter: blur(30px);";
      }
      var menucontant = "<ul class='_Velfun_Contextmenu_' style='transition: opacity 120ms;box-shadow:0px 0px 10px rgba(0,0,0,0.5);overflow: hidden;position: absolute;" + backgroundStyle + ";backdrop-filter:blur(15px);border-radius: 10px;padding: 0;z-index: 9999;min-width: 160px;opacity: 0;display:none;margin:0;' for='" + vel_funthisid + "'>";
      vel_menufuns[vel_funthisid]=new Object();
      for (var i in funarr) {
          if(i.match(/^\-{3}/)){
            menucontant += `<li style="width:calc(100% - 10px);height:1px;background-color:#DDD;margin:5px auto;padding: 0 10px;"></li>`;
          }else{
            var imgurl = i.match(/icon\((.+?)\)/);
            var ifc = i.match(/\sif\((.+)\)/);
            var lititle = i;
            var append = "";

            if (imgurl) {
              lititle = lititle.replace(/icon\((.+?)\)/,'');
              append += "<img style='width: 16px;height: 16px;margin-right: 5px;margin-top: -2px;vertical-align: middle;border:none;' src='" + imgurl[1] + "'>";
            }

            if(ifc){
              lititle = lititle.replace(/\sif\((.+)\)/,'');
              if(!eval(ifc[1])) continue;
            }
            vel_menufuns[vel_funthisid][lititle]=funarr[i];
            menucontant += "<li class='_Velfun_Contextmenu_option' style='width: 100%;height: 30px;line-height: 30px;transition: background 200ms;padding: 0 10px;margin: 0 auto;list-style-type: none;text-align: left;float: none;user-select: none;-moz-user-select: none;-webkit-user-select: none;-ms-user-select: none;cursor: default;'>" + append + lititle + "</li>";
          }
      }

      menucontant+='</ul>';
      _("body").append(menucontant);

      _(_this).bind("contextmenu",function (e) {
        e.preventDefault();
      })

      _("[data-contextmenuid='" + vel_funthisid + "']").bind("mousedown",function (e) {
        if (e.button == 2) {
          var X=e.pageX;
          var Y=e.pageY;
          var thisid = this.attr("data-contextmenuid");
          _("._Velfun_Contextmenu_[data-open]").css("opacity:0;");
          _("._Velfun_Contextmenu_[data-open]").css("display:none;");
          _("._Velfun_Contextmenu_[data-open]").attr("data-open","");

          _("._Velfun_Contextmenu_[for='" + thisid + "']").css("display:block;left:" + X + "px; top:" + Y + "px;");

          if(Y + parseInt(_("._Velfun_Contextmenu_[for='" + thisid + "']").css("height")) > parseInt(_("body").css("height"))){
            Y -= parseInt(_("._Velfun_Contextmenu_[for='" + thisid + "']").css("height"));
            _("._Velfun_Contextmenu_[for='" + thisid + "']").css("top:" + Y + "px;");
          }

          if(X + parseInt(_("._Velfun_Contextmenu_[for='" + thisid + "']").css("width")) > parseInt(_("body").css("width"))){
            X -= parseInt(_("._Velfun_Contextmenu_[for='" + thisid + "']").css("width"));
            _("._Velfun_Contextmenu_[for='" + thisid + "']").css("left:" + X + "px;");
          }

          setTimeout(function(thisid){
            _("._Velfun_Contextmenu_[for='" + thisid + "']").css("opacity:1;");
            _("._Velfun_Contextmenu_[for='" + thisid + "']").attr("data-open","data-open");
          },10,thisid);
        }
      })

      _("._Velfun_Contextmenu_[for='" + vel_funthisid + "'] ._Velfun_Contextmenu_option").click(function(){
        var th_p = _(this).parent();
        var ft_id = th_p.attr("for");
        if(typeof vel_menufuns[ft_id][_(this).text()] === "function"){
          vel_menufuns[ft_id][_(this).text()].call(_("[data-contextmenuid='" + ft_id + "']"));
        }
      })

      _("._Velfun_Contextmenu_[for='" + vel_funthisid + "'] ._Velfun_Contextmenu_option").hover(function(){
        this.css("background-color:rgba(0,0,0,0.1)");
      },function(){
        this.css("background-color:rgba(0,0,0,0)");
      })
    }
  }

  var vel_dynamic_menus=new Object();
  velfun.fn.CustomContextmenuDynamic = velfun.fn.ccmd = function(funarr) {
    if(this.length == 0) return this;
    var _this = this;
    for (var index = 0; index < _this.length; index++) {
      var vel_funthis = _(_this[index]);
      var vel_funthisid = Math.floor(Math.random()*89999999+10000000);
      vel_funthis.attr("data-contextmenuid",vel_funthisid);

      vel_dynamic_menus[vel_funthisid] = funarr;

      _(_this).bind("contextmenu",function (e) {
        e.preventDefault();
      })

      _("[data-contextmenuid='" + vel_funthisid + "']").bind("mousedown",function (e,self) {
        if (e.button == 2) {
          _("body ._Velfun_Contextmenu_[dynamic]").remove();
          var thisid = _(self).attr("data-contextmenuid");
          var trueTarget = "";
          if(this[0] == self){
            trueTarget = "self";
          }else{
            for (var s in vel_dynamic_menus[thisid]) {
              if(Object.values(_(s)).includes(e.target)){
                trueTarget = s;
                break;
              }
            }
          }
          if(trueTarget == "") return;
          var X=e.pageX;
          var Y=e.pageY;

          var funarr = vel_dynamic_menus[thisid][trueTarget];
          var backgroundStyle = "background-color: rgba(253,253,253,0.9);";
          if(CSS.supports("backdrop-filter","blur(30px)")){
            backgroundStyle = "background-color: rgba(253,253,253,0.5);backdrop-filter: blur(30px);";
          }
          _("body").append("<ul class='_Velfun_Contextmenu_' style='transition: opacity 120ms;box-shadow:0px 0px 10px rgba(0,0,0,0.5);overflow: hidden;position: absolute;" + backgroundStyle + ";backdrop-filter:blur(15px);border-radius: 10px;padding: 0;z-index: 9999;min-width: 160px;opacity: 0;display:none;margin:0;' for='" + thisid + "' dynamic></ul>");
          var _ul = _("body ._Velfun_Contextmenu_[dynamic]");
          for (var i in funarr) {
            if(i.match(/^\-{3}/)){
              _ul.append(`<li style="width:calc(100% - 10px);height:1px;background-color:#DDD;margin:5px auto;padding: 0 10px;"></li>`);
            }else{
              var imgurl = i.match(/icon\((.+?)\)/);
              var ifc = i.match(/\sif\((.+)\)/);
              var lititle = i;
              var append = "";

              if (imgurl) {
                lititle = lititle.replace(/icon\((.+?)\)/,'');
                append += "<img style='width: 16px;height: 16px;margin-right: 5px;margin-top: -2px;vertical-align: middle;border:none;' src='" + imgurl[1] + "'>";
              }

              if(ifc){
                lititle = lititle.replace(/\sif\((.+)\)/,'');
                if(!eval(ifc[1])) continue;
              }
              var _func = funarr[i];
              _ul.append("<li class='_Velfun_Contextmenu_option' style='width: 100%;height: 30px;line-height: 30px;transition: background 200ms;padding: 0 10px;margin: 0 auto;list-style-type: none;text-align: left;float: none;user-select: none;-moz-user-select: none;-webkit-user-select: none;-ms-user-select: none;cursor: default;'>" + append + lititle + "</li>");
              var _last_li = _("li",_ul)[_("li",_ul).length - 1];
              _last_li.addEventListener("click",((target,func) => {
                return function(e){
                  func.call(_(target),e);
                }
              })(e.target,_func),{"once":true});
            }
          }


          _("._Velfun_Contextmenu_[data-open]").css("opacity:0;");
          _("._Velfun_Contextmenu_[data-open]").css("display:none;");
          _("._Velfun_Contextmenu_[data-open]").attr("data-open","");

          _("._Velfun_Contextmenu_[for='" + thisid + "']").css("display:block;left:" + X + "px; top:" + Y + "px;");

          if(Y + parseInt(_("._Velfun_Contextmenu_[for='" + thisid + "']").css("height")) > parseInt(_("body").css("height"))){
            Y -= parseInt(_("._Velfun_Contextmenu_[for='" + thisid + "']").css("height"));
            _("._Velfun_Contextmenu_[for='" + thisid + "']").css("top:" + Y + "px;");
          }

          if(X + parseInt(_("._Velfun_Contextmenu_[for='" + thisid + "']").css("width")) > parseInt(_("body").css("width"))){
            X -= parseInt(_("._Velfun_Contextmenu_[for='" + thisid + "']").css("width"));
            _("._Velfun_Contextmenu_[for='" + thisid + "']").css("left:" + X + "px;");
          }

          setTimeout(function(thisid){
            _("._Velfun_Contextmenu_[for='" + thisid + "']").css("opacity:1;");
            _("._Velfun_Contextmenu_[for='" + thisid + "']").attr("data-open","data-open");
          },10,thisid);

          _("._Velfun_Contextmenu_[for='" + thisid + "'] ._Velfun_Contextmenu_option").hover(function(){
            this.css("background-color:rgba(0,0,0,0.1)");
          },function(){
            this.css("background-color:rgba(0,0,0,0)");
          })
        }
      })

    }
  }

  velfun.fn.setSelect = function(){
    if(this.length == 0) return this;

    var _this = this;
    for (var i = 0; i < _this.length; i++) {
      var th = _this[i];
      var _th = _(th);
      if(_th.css("cursor") == "auto"){
        _th.css("cursor:default;");
      }
      var defvalue = _(_("v-option",th)[0]).val();
      var deftext = _(_("v-option",th)[0]).text();
      var thname = _th.attr("name");

      var baseLeft,baseTop;
      if(_th.css("position") == "static"){
        _th.css("position:relative;")
      }

      var pwidth = _th.css("width");
      var pheight = _th.css("height");
      var palign = _th.css("text-align");
      var pcolor = _th.css("color");
      var pfontF = _th.css("font-family");
      _th.prepend("<input type='hidden' name='" + thname + "'><v-selectval style='display:block;position:absolute;z-index:1000;width:" + pwidth + ";height:" + pheight + ";top:0px;left:0px;text-align:" + palign + ";color:" + pcolor + ";font-family:" + pfontF + ";'></v-selectval>");

      var options = _("v-option",th);
      for (var i2 = 0; i2 < options.length; i2++) {
        var ops = _(options[i2]);
        var opswidth = ops.css("width");
        var opsheight = ops.css("height");
        var zIndex = 999 - i2;
        ops.css("display:block;position:absolute;z-index:" + zIndex + ";opacity:0;top:0px;left:0px;");
        var opentop = parseFloat(pheight);
        if(i2 > 0){
          var prevops = _(options[i2-1]);
          var prevops_top = parseFloat(prevops.attr("data-opentop"));
          var prevops_height = parseFloat(prevops.css("height"));

          opentop = prevops_top + prevops_height;
        }

        ops.attr("data-opentop",opentop);
        if(opswidth == "auto"){
          ops.css("width:" + pwidth);
        }
        if(opsheight == "auto"){
          ops.css("height:" + pheight);
        }
        if(ops.hasAttr("selected")){
          defvalue = ops.val();
          deftext = ops.text();
        }
      }
      options.bind("click",function(e){
        e.stopPropagation();
        this.clickSelect();
      })
      _("input[type='hidden']",th).val(defvalue);
      _("v-selectval",th).text(deftext).bind("click",function(e){
        e.stopPropagation();
        if(this.parent().hasAttr("data-opening")){
          this.parent().closeSelect();
        }else{
          this.openSelect();
        }
      });
    }
  }

  velfun.fn.openSelect = function(){
    var _this = this.parent();
    if(_this.hasAttr("readonly") || _this.hasAttr("disable")){
      return;
    }
    setTimeout(function(){
      _this.attr("data-opening","true");
    },300);

    var options = _("v-option",_this);
    for (var i = 0; i < options.length; i++) {
      var ops = _(options[i]);
      var toTop = ops.attr("data-opentop");
      ops.css("transition:300ms;opacity:1;top:" + toTop + "px;");
      if(ops.hasAttr("disable")){
        ops.attr("data-enablecolor",ops.css("color"));
        ops.css("color:gray;");
      }else{
        if(ops.hasAttr("data-enablecolor")){
          ops.css("color:" + ops.attr("data-enablecolor") + ";");
        }
      }
    }
  }

  velfun.fn.clickSelect = function(){
    var _th = this;
    var _this = this.parent();

    if(_th.hasAttr("disable")){
      return;
    }

    _this.closeSelect();

    _("v-option",_this).attr("selected","");
    _th.attr("selected","selected");

    if(_("input[type='hidden']",_this).val() !== _th.val()){
      _this.trigger("change");
    }

    _("input[type='hidden']",_this).val(_th.val());
    _("v-selectval",_this).text(_th.text());
  }

  velfun.fn.closeSelect = function(){
    var _this = this;

    _this.attr("data-opening","");
    var options = _("v-option",_this);
    options.css("opacity:0;top:0px;");
  }

  velfun.fn.setColor = function (col) {
    if(this.length == 0) return this;
    if(this[0].tagName.toLowerCase() != "v-coloricon"){
      try {
        console.error("VelFun Error:\n    setColor:This element not a coloricon");
      } catch (e) {
        document.writeln("VelFun Error:\n    setColor:This element not a coloricon");
      }
      return this;
    }
    var coloricon = _("img",this);
    coloricon.css('filter:drop-shadow(' + this.attr("width") + 'px 0 0 ' + col + ')');
  }

  velfun.fn.autoTile = function(){
    if(this.length == 0) return this;
    var _items = this;
    _items.css("float:left;");
    var parent = _items.parent();
    var parentW = parseInt(parent[0].offsetWidth);
    parentW -= parseInt(parent.css("border-left-width")) + parseInt(parent.css("border-right-width")) + parseInt(parent.css("padding-left")) + parseInt(parent.css("padding-right"));
    var itemsW = parseInt(_items[0].offsetWidth);
    var itemsInlineNum = parseInt(parentW / itemsW);
    if(itemsInlineNum > _items.length) itemsInlineNum = _items.length;
    var gapNum = itemsInlineNum * 2;
    var allGap = parentW - (itemsW * itemsInlineNum);
    var eachGapW =allGap / gapNum;
    _items.css("margin-left:" + eachGapW +"px;margin-right:" + eachGapW + "px;");
  }

  //Static Function
  velfun.inside = new Object();
  velfun.htmltodom = function(html,callback){
    var template = document.createElement( 'template' );
    let range = document.createRange();
    range.selectNodeContents(template);

    if(callback !== undefined){
      callback.call(range.createContextualFragment(html),range.createContextualFragment(html));
    }
    return range.createContextualFragment(html);
  }

  velfun.bind = function(ev,selector = "",func,pop = false){
    var _this = _(document);
    if(typeof func == "boolean") {
      pop = func;
      func = undefined;
    }
    if(typeof selector == "function" && func == undefined) {
      func = selector;
      selector = "";
    }
    if(typeof func === "function"){
      for (var i = 0; i < _this.length; i++) {
        var th = _this[i];
        if(selector != ""){
          th.self = th;
          th.addEventListener(ev,(s=>{
            return function(e){
              var sdom = _(s);
              for (var i = 0; i < sdom.length; i++) {
                if(pop && e.target !== sdom[i]){
                  let thChilds = _("*",sdom[i]);
                  for (var childIndex = 0; childIndex < thChilds.length; childIndex++) {
                    if(e.target === thChilds[childIndex]){
                      func.call(_(sdom[i]),e,this);

                      break;
                    }
                  }
                }else if(e.target === sdom[i]){
                  func.call(_(e.target),e,this);

                }
              }
            }
          })(selector))
        }else{
          th.self = th;
          th.addEventListener(ev,function(e){
            func.call(_(e.target),e,this);

          })
        }
      }
    }else{
      try {
        console.error("VelFun Error:\n    bind:The second parameter not a function!");
      } catch (e) {
        document.writeln("VelFun Error:\n    bind:The second parameter not a function!");
      }
    }

    return _this;
  }

  var msgboxList = new Array();
  var msgfun = function(e){return true;};

  velfun.Msgbox = async function(Message,Title,Type,Position,callback){
    msgboxList.push(function(){return _.inside.Msgbox_do(Message,Title,Type,Position,callback)});
    if(_("#_MessageBox_").length == 0){
      var fun = msgboxList.shift();
      fun();
    }
  }
  velfun.inside.Msgbox_do = async function (Message,Title,Type,Position,callback) {
    var msg=Message || "";
    var title=Title || "";
    var ty=Type || "";
    var pos=Position || ['calc(50% - 225px)','30%'];
    msgfun=callback || function(e){return true;};
    if (typeof title === "function") {
      msgfun=title;
      title="";
    }
    if (typeof ty === "function") {
      msgfun=ty;
      ty="";
    }
    if (typeof pos === "function") {
      msgfun=pos;
      pos=['calc(50% - 225px)','30%'];
    }

    var pwidth=_("html").css("width");
    if(pwidth*0.8<450){
      var offset=pwidth*0.8/2;
      pos=['calc(50% - '+offset+'px)','30%'];
    }

    var backgroundStyle = "background-color: rgba(253,253,253,0.9);";
    if(CSS.supports("backdrop-filter","blur(30px)")){
      backgroundStyle = "background-color: rgba(253,253,253,0.5);backdrop-filter: blur(30px);";
    }

    var appstr="<div id='_MessageBox_' style='transition:300ms;" + backgroundStyle + "border:1px #CCC solid;border-radius: 10px;box-shadow: 1px 1px 10px rgba(0,0,0,0.5);box-sizing:border-box;display: block;position: fixed;overflow:hidden;transform:translateZ(5px);opacity:0;max-width:80%;width:450px;box-shadow:0px 0px 50px gray;height:200px;left:" + pos[0] + ";top:" + pos[1] + ";'>";
    if (title!="") {
      appstr+="<div style='width: calc(100% - 10px);height: 30px;margin:5px 5px 0px 5px;font-weight: bold;line-height:30px;box-sizing:border-box;padding-left: 5px;border-bottom:1px #DDD solid;text-align: left;'>" + title + "</div>";
      appstr+="<div style='width: calc(100% - 30px);margin:0px 15px;height: calc(100% - 85px);position: absolute;top: 40px;left: 0px;display: block;'>" + msg + "</div>";
    }else {
      appstr+="<div style='width: calc(100% - 30px);margin:0px 15px;height: calc(100% - 45px);position: absolute;top: 40px;left: 0px;display: block;'>" + msg + "</div>";
    }

    if (ty=="" || ty==0 || ty=="MSG_OK") {
      appstr+="<div style='width: 100%;height: 40px;text-align: center;position: absolute;bottom: 0px;right: 0px;box-sizing: border-box;border-top:1px #DDD solid;'><span id='_MsgOK_' class='_MsgButton_' data-val='true' style='display:block;width:100%;height:40px;line-height:40px;cursor: default;transition: 300ms ease-out;user-select: none;-moz-user-select: none;-webkit-user-select: none;-ms-user-select: none;'>确定</span></div>";
    }else if (ty==1 || ty=="MSG_YES_NO") {
      appstr+="<div style='width: 100%;height: 40px;text-align: center;position: absolute;bottom: 0px;right: 0px;box-sizing: border-box;border-top:1px #DDD solid;'><span id='_MsgYes_' class='_MsgButton_' data-val='true' style='float:left;display:block;width:50%;height:40px;line-height:40px;cursor: default;transition: 300ms ease-out;user-select: none;-moz-user-select: none;-webkit-user-select: none;-ms-user-select: none;'>是</span><span id='_MsgNo_' class='_MsgButton_' data-val='false' style='float:right;display:block;width:50%;height:40px;line-height:40px;cursor: default;transition: 300ms ease-out;user-select: none;-moz-user-select: none;-webkit-user-select: none;-ms-user-select: none;'>否</span></div>";
    }else if (ty==2 || ty=="MSG_OK_Cancel") {
      appstr+="<div style='width: 100%;height: 40px;text-align: center;position: absolute;bottom: 0px;right: 0px;box-sizing: border-box;border-top:1px #DDD solid;'><span id='_MsgOK_' class='_MsgButton_' data-val='true' style='float:left;display:block;width:50%;height:40px;line-height:40px;cursor: default;transition: 300ms ease-out;user-select: none;-moz-user-select: none;-webkit-user-select: none;-ms-user-select: none;'>确定</span><span id='_MsgCancel_' class='_MsgButton_' data-val='false' style='float:right;display:block;width:50%;height:40px;line-height:40px;cursor: default;transition: 300ms ease-out;user-select: none;-moz-user-select: none;-webkit-user-select: none;-ms-user-select: none;'>取消</span></div>";
    }
    appstr+="</div></div>";
    _("body").after(appstr);
    _("body").back();
    setTimeout(function(){
      _("#_MessageBox_").back();
      _("#_MessageBox_").css("box-shadow:0px 0px 10px rgba(0,0,0,0.5);");
    },10);

    _("._MsgButton_").hover(function(){
      this.css("background-color:rgb(255,255,255);");
    },function(){
      this.css("background-color:transparent;");
    }).bind("mousedown",function(){
      this.css("background-color:rgba(0,0,0,0.05);");
    });

    return new Promise((resolve,reject)=>{
      _("._MsgButton_").bind("click",e=>{
        let buttonval = _(e.target).attr("data-val") == "true"?true:false;
        if(buttonval){
          _.inside.MsgRe(true,false);
          resolve(true)
        }else{
          _.inside.MsgRe(false,false);
          reject(false);
        }
      })
    })
  }

  velfun.Msgbox_lite = async function(Message,Title,Type,Position,callback){
    msgboxList.push(function(){return _.inside.Msgbox_lite_do(Message,Title,Type,Position,callback)});
    if(_("#_MessageBox_").length == 0){
      var fun = msgboxList.shift();
      fun();
    }
  }

  velfun.inside.Msgbox_lite_do = async function (Message,Title,Type,Position,callback) {
    var msg=Message || "";
    var title=Title || "";
    var ty=Type || "";
    var pos=Position || ['calc(50% - 225px)','30%'];
    msgfun=callback || function(e){return true;};
    if (typeof title === "function") {
      msgfun=title;
      title="";
    }
    if (typeof ty === "function") {
      msgfun=ty;
      ty="";
    }
    if (typeof pos === "function") {
      msgfun=pos;
      pos=['calc(50% - 225px)','30%'];
    }

    var pwidth=_("html").css("width");
    if(pwidth*0.8<450){
      var offset=pwidth*0.8/2;
      pos=['calc(50% - '+offset+'px)','30%'];
    }

    var backgroundStyle = "background-color: rgba(253,253,253,0.9);";
    if(CSS.supports("backdrop-filter","blur(30px)")){
      backgroundStyle = "background-color: rgba(253,253,253,0.5);backdrop-filter: blur(30px);";
    }

    var appstr="<div id='_MessageBox_' style='box-shadow:0px 0px 5px black;" + backgroundStyle + "border:1px #CCC solid;border-radius: 10px;box-shadow: 1px 1px 10px #CCC;box-sizing:border-box;display: block;position: fixed;overflow:hidden;transform:translateZ(0px);opacity:1;max-width:80%;width:450px;height:200px;left:" + pos[0] + ";top:" + pos[1] + ";'>";
    if (title!="") {
      appstr+="<div style='width: calc(100% - 10px);height: 30px;margin:5px 5px 0px 5px;font-weight: bold;line-height:30px;box-sizing:border-box;padding-left: 5px;border-bottom:1px #DDD solid;text-align: left;'>" + title + "</div>";
      appstr+="<div style='width: calc(100% - 30px);margin:0px 15px;height: calc(100% - 85px);position: absolute;top: 40px;left: 0px;display: block;'>" + msg + "</div>";
    }else {
      appstr+="<div style='width: calc(100% - 30px);margin:0px 15px;height: calc(100% - 45px);position: absolute;top: 40px;left: 0px;display: block;'>" + msg + "</div>";
    }

    if (ty=="" || ty==0 || ty=="MSG_OK") {
      appstr+="<div style='width: 100%;height: 40px;text-align: center;position: absolute;bottom: 0px;right: 0px;box-sizing: border-box;border-top:1px #DDD solid;'><span id='_MsgOK_' class='_MsgButton_' data-val='true' style='display:block;width:100%;height:40px;line-height:40px;cursor: default;transition: 300ms ease-out;user-select: none;-moz-user-select: none;-webkit-user-select: none;-ms-user-select: none;'>确定</span></div>";
    }else if (ty==1 || ty=="MSG_YES_NO") {
      appstr+="<div style='width: 100%;height: 40px;text-align: center;position: absolute;bottom: 0px;right: 0px;box-sizing: border-box;border-top:1px #DDD solid;'><span id='_MsgYes_' class='_MsgButton_' data-val='true' style='float:left;display:block;width:50%;height:40px;line-height:40px;cursor: default;transition: 300ms ease-out;user-select: none;-moz-user-select: none;-webkit-user-select: none;-ms-user-select: none;'>是</span><span id='_MsgNo_' class='_MsgButton_' data-val='false' style='float:right;display:block;width:50%;height:40px;line-height:40px;cursor: default;transition: 300ms ease-out;user-select: none;-moz-user-select: none;-webkit-user-select: none;-ms-user-select: none;'>否</span></div>";
    }else if (ty==2 || ty=="MSG_OK_Cancel") {
      appstr+="<div style='width: 100%;height: 40px;text-align: center;position: absolute;bottom: 0px;right: 0px;box-sizing: border-box;border-top:1px #DDD solid;'><span id='_MsgOK_' class='_MsgButton_' data-val='true' style='float:left;display:block;width:50%;height:40px;line-height:40px;cursor: default;transition: 300ms ease-out;user-select: none;-moz-user-select: none;-webkit-user-select: none;-ms-user-select: none;'>确定</span><span id='_MsgCancel_' class='_MsgButton_' data-val='false' style='float:right;display:block;width:50%;height:40px;line-height:40px;cursor: default;transition: 300ms ease-out;user-select: none;-moz-user-select: none;-webkit-user-select: none;-ms-user-select: none;'>取消</span></div>";
    }
    appstr+="</div></div>";
    _("body").after(appstr);
    _("body").css("opacity:0.8;pointer-events: none;cursor:default;");

    _("._MsgButton_").hover(function(){
      this.css("background-color:rgb(255,255,255);");
    },function(){
      this.css("background-color:transparent;");
    }).bind("mousedown",function(){
      this.css("background-color:rgba(0,0,0,0.05);");
    });

    return new Promise((resolve,reject)=>{
      _("._MsgButton_").bind("click",e=>{
        let buttonval = _(e.target).attr("data-val") == "true"?true:false;
        if(buttonval){
          _.inside.MsgRe(true,true);
          resolve(true)
        }else{
          _.inside.MsgRe(false,true);
          reject(false);
        }
      })
    })
  };

  velfun.inside.MsgRe = function (re,lite) {
    if(lite){
      _("#_MessageBox_").remove();
      _("body").css("opacity:1;pointer-events: all;cursor:auto;");
      if(msgboxList.length > 0){
        var fun = msgboxList.shift();
        fun();
      }
    }else{
      _("#_MessageBox_").css("box-shadow:0px 0px 50px gray;");
      _("#_MessageBox_").unback();
      _("body").unback();
      setTimeout(function () {
        _("#_MessageBox_").remove();
        if(msgboxList.length > 0){
          var fun = msgboxList.shift();
          fun();
        }
      },150)
    }
    msgfun(re);
  }

  var optionsList = new Array();
  var optionsArr = new Array();
  velfun.Options = function(opt_arr,title){
    optionsList.push(function(){_.inside.Options_do(opt_arr,title)});
    if(_("#_OPTIONS_").length == 0){
      var fun = optionsList.shift();
      fun();
    }
  }

  velfun.inside.Options_do = function(opt_arr,title) {
    var title = title || "";
    var ulhtml = "<ul id='_OPTIONS_' style='position: fixed;display: block;width: 100%;height: 100%;left: 0px;top: 0px;margin:0px;padding: 0px;z-index: 1000;overflow: hidden;cursor:default;'>";
    var lihtml = "";
    optionsArr = opt_arr;
    var backgroundStyle = "background-color: rgba(253,253,253,0.9);";
    if(CSS.supports("backdrop-filter","blur(30px)")){
      backgroundStyle = "background-color: rgba(253,253,253,0.5);backdrop-filter: blur(30px);";
    }

    if(title!=""){
      lihtml = "<li class='velfun_options_title' style='max-width: 400px;min-height: 40px;position: relative;height: auto;display: table;clear: both;margin: 10px auto;overflow-x: hidden;width: 100%;background: transparent;font-size: 20px;font-weight:bold;text-align: center;color: white;text-shadow:0px 0px 5px black;transform:translateZ(0px);'>"+title+"</li>";
    }
    for (var index in opt_arr) {
      if (opt_arr.hasOwnProperty(index)) {
        lihtml += "<li class='velfun_options_item' style='width: 80%;max-width: 400px;min-height: 40px;position: relative;height: auto;display: table;clear: both;margin: 10px auto;border: 1px black solid;border-radius: 10px;" + backgroundStyle + "overflow-x: hidden;transform:translateZ(10px);opacity:0;' onclick='_.inside.OptionsRe(this,\"" + index + "\")'><span style='display:table-cell;vertical-align: middle;text-align: center;'>" + index + "</span></li>";
      }
    }
    var ophtml = ulhtml + lihtml + "</ul>";
    _("body").after(ophtml);
    _("body").back();
    _(_("#_OPTIONS_ li")[0]).css("margin-top:20%;");
    _("#_OPTIONS_ li.velfun_options_item").each(function(index,item){
      var _this=_(this);
      setTimeout(function(){
        _this.back(10);
      },100*index);
    })
  }

  velfun.inside.OptionsRe = function(th,index){
    var _this=_(th);
    _this.back();
    setTimeout(function(){
      _("#_OPTIONS_ li").resetback();
      _("body").unback();
    },200);
    setTimeout(function(){
      _("#_OPTIONS_").remove();
      if(typeof optionsArr[index] === "function"){
        optionsArr[index].call(_this);
      }
      if(optionsList.length > 0){
        var fun = optionsList.shift();
        fun();
      }
    },500);
  }

  velfun.random = function(min,max){
		var vel_minval,vel_maxval,vel_randomval;
		if (typeof min == 'number' & typeof max == 'number') {
			vel_minval=min;
			vel_maxval=max-min;
			vel_randomval=Math.round(Math.random()*vel_maxval+vel_minval);
		}else if (typeof min == 'number' & max === undefined) {
			vel_minval=0;
			vel_maxval=min;
			vel_randomval=Math.round(Math.random()*vel_maxval);
		}else {
      try {
        console.error("VelFun Error:\n    random:The parameter is missing or is not a number.");
      } catch (e) {
        document.writeln("VelFun Error:\n    random:The parameter is missing or is not a number.");
      }
		}
		return vel_randomval;
	}

  velfun.initUpload = function(){
    var veluploads = _("v-upload");
    for (var i = 0; i < veluploads.length; i++) {
      var th = _(veluploads[i]);
      if(_("*",th).length > 0) continue;
      let name = th.attr("data-name") || "uploadFile";
      let title = th.attr("data-title") || "";
      let eximg = th.attr("data-eximg") || "";
      let showpreview = th.attr("showpreview") || "true";
      let titletype = th.attr("titletype") || "defdynamic";
      th.attr("data-id",i+1);
      if(th.css("position").toLowerCase() == "static"){
        th.css("position:relative");
      }
      if(showpreview == "true"){
        th.append(`<img class="velupload_img" src="${eximg}" alt="${title}" />`);
      }

      th.append(`<input class="velupload_file" type="file" name="${name}" />`);
      if(title && ["defdynamic","dynamic","static"].indexOf(titletype) != -1){
        if(titletype == "defdynamic"){
          titletype = (showpreview == "false")?"static":"dynamic";
        }
        th.append(`<div class="velupload_title ${titletype}">${title}</div>`);
      }
    }

    if(_.veluploadInitDone) return true;
    if(veluploads.length == 0) return false;

    _("head").append(`<style>
      v-upload .velupload_img {
        display: block;
        max-width: 100%;
        max-height: 100%;
        margin: auto;
        border: 1px solid gray;
        border-radius: 10px;
        box-shadow: 1px 1px 5px gray;
        box-sizing: border-box;
      }
      v-upload .velupload_title{
        display: block;
        width: 100%;
        height: 30px;
        line-height: 30px;
        position: absolute;
        bottom: 0;
        text-align: center;
        color: black;
        transition: opacity 300ms;
        padding: 0;
        margin: 0;
        text-indent: 0;
      }
      v-upload .velupload_title.dynamic {
        opacity: 0;
      }
      v-upload .velupload_title.static {
        opacity: 1;
      }
      v-upload:hover .velupload_title.dynamic {
        opacity: 1;
      }
      v-upload .velupload_file {
        display: block;
        width: 0px;
        height: 0px;
        margin: 0;
        padding: 0;
      }
      v-upload *:not(.velupload_file) {
        pointer-events: none;
      }
      v-upload-preview {
        display: block;
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        width: 100vw;
        background-color: rgba(0,0,0,0.5);
        opacity: 0;
        transition: opacity 300ms;
        justify-content: center;
        algin-items: center;
        z-index:9999999;
      }
      v-upload-preview .velupload_preview {
        display:block;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        max-width: 100vw;
        max-height: 100vh;
        pointer-events: none;
      }
      v-upload-preview .velupload_reupload {
        display: block;
        position: absolute;
        width: 100px;
        height: 40px;
        line-height: 40px;
        bottom: 50px;
        left: calc(50% - 50px);
        text-align: center;
        border: 1px solid white;
        color: white;
        background-color: rgba(0,0,0,0.2);
        cursor: pointer;
        backdrop-filter: blur(30px);
      }
    </style>`);

    _.bind("click","v-upload",function(){
      if(_(".velupload_file",this).val() == ""){
        _(".velupload_file",this).trigger("click");
      }else{
        let files = _(".velupload_file",this)[0].files;
        if(files.length == 0){
          _("body").append(`<v-upload-preview data-for="${this.attr("data-id")}"><div class="velupload_preview">无法预览图片</div><div class="velupload_reupload">重新上传</div></v-upload-preview>`);
          setTimeout(function(){
            _("v-upload-preview").css("opacity:1");
          },0)
        }else{
          let fr = new FileReader();
          fr.onload = () => {
            _("body").append(`<v-upload-preview data-for="${this.attr("data-id")}"><img class="velupload_preview" src="${fr.result}"><div class="velupload_reupload">重新上传</div></v-upload-preview>`);
            setTimeout(function(){
              _("v-upload-preview").css("opacity:1");
            },0)
          }
          fr.readAsDataURL(files[0]);
        }
      }
    })

    _.bind("change","v-upload .velupload_file",function(){
      let files = this[0].files;
      if(files.length == 0){
        _(".velupload_img",this.parent()).attr("src",this.parent().attr("data-eximg"));
      }else{
        let thp = this.parent();
        let fr = new FileReader();
        fr.onload = () => {
          _(".velupload_img",thp).attr("src",fr.result);
        }
        fr.readAsDataURL(files[0]);
      }
    })

    _.bind("click","v-upload-preview",function(){
      this.css("opacity:0;pointer-events:none;");
      setTimeout(function(th){
        th.remove();
      },300,this)
    })

    _.bind("click","v-upload-preview .velupload_reupload",function(){
      let thfor = this.parent().attr("data-for");
      this.parent().trigger("click");
      _(`.velupload_file`,`v-upload[data-id='${thfor}']`).trigger("click");
    })
    _.veluploadInitDone = true;
    return true;
  }

  //IO
  velfun.io = new Object();
  velfun.io.ajax = async function(method,url,data,callback){
    if(typeof data == "function"){
      callback = data;
      data = null;
    }else if(typeof data == "object"){
      if(method.toLowerCase() == "get"){
        var params = new Array();
        for (var key in data) {
          var v = encodeURIComponent(data[key]);
          params.push(key + "=" + v);
        }
        data = params.join("&");
      }else{
        var params = new FormData();
        for (var key in data) {
          params.append(key,data[key]);
        }
        data = params;
      }
    }
    return new Promise((resolve,reject)=>{
      var XHR = new XMLHttpRequest();
      XHR.onreadystatechange = function(){
        if (XHR.readyState == 4 && XHR.status == 200) {
          var msg = XHR.responseText;
          if(typeof callback == "function") callback(msg,XHR);
          resolve(msg,XHR);
        }
      }

      if(method.toLowerCase() == "get"){
        if (url.match(/\?/) != null) {
          url += "&" + data;
        }else{
          url += "?" + data;
        }
        XHR.open(method,url);
        XHR.send();
      }else if(method.toLowerCase() == "post"){
        XHR.open(method,url);
        XHR.send(data);
      }else{
        try {
          console.error("VelFun Error:\n    AJAX:The method invalid.Can only be get or post.");
        } catch (e) {
          document.writeln("VelFun Error:\n    AJAX:The method invalid.Can only be get or post.");
        }
      }
    })
  }

  velfun.io.get = async function(url,data,callback){
    return velfun.io.ajax("get",url,data,callback);
  }

  velfun.io.post = async function(url,data,callback){
    return velfun.io.ajax("post",url,data,callback);
  }

  velfun.io.import = function(url,type){
    if(type == undefined){
      var filepath = url.split("?");
      filepath = filepath[0];
      var ext = filepath.match(/\.([^\.]+$)/);
      type = ext[1];
    }
    if(type.toLowerCase() == "javascript" || type.toLowerCase() == "js"){
      var nowscript = _("script[src]");
      _(nowscript[nowscript.length - 1]).after('<script src="' + url + '" type="text/javascript"></script>');
    }else if(type.toLowerCase() == "stylesheet" || type.toLowerCase() == "css"){
      var nowcss = _("link[rel='stylesheet']");
      _(nowcss[nowcss.length - 1]).after('<link rel="stylesheet" href="' + url + '">');
    }
    return url;
  }

  velfun.io.unimport = function(url){
    _("[src='" + url + "']").remove();
    _("[href='" + url + "']").remove();
  }

  velfun.io.loadPatchsFrom = function(path){ //實驗性
    var request = new XMLHttpRequest();
    request.open("get",path,false);
    request.send();
    for (var a of _.htmltodom(request.responseText).querySelectorAll('a')) {
      var patchfile = a.innerText;
      var start = patchfile.lastIndexOf('.');
      if(start > 0){
        var patchfile_ext = patchfile.substring(start + 1);
        if(["js","css"].includes(patchfile_ext)){
          _.io.import(path + "/" + patchfile);
        }else if(["html","xml","php","htm"].includes(patchfile_ext)){
          window.addEventListener("load",((patchfile)=>{
            return function(){
              var html = new XMLHttpRequest();
              html.open("get",path + "/" + patchfile,false);
              html.send();
              for (var dom of _.htmltodom(html.responseText).querySelectorAll('*')) {
                if(dom.parentElement === null){
                  if(_(dom).hasAttr("id")){
                    let did = _(dom).attr("id");
                    let nowele = _("#" + did);
                    for (var i = 0; i < nowele.length; i++) {
                      nowele[i].outerHTML = dom.outerHTML;
                    }
                  }else if(_(dom).hasAttr("class")){
                    let dc = _(dom).getClass();
                    let cl = dc[0];
                    let nowele = _("." + cl);
                    for (var i = 0; i < nowele.length; i++) {
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

  velfun.io.setCookie = function(opts,usingSessionMode = false){
    if(usingSessionMode){
      window.sessionStorage.setItem(opts.name,opts.value);
      if(opts.expires){
        let exp = opts.expires;
        let offset = 0;
        if(offset = exp.match(/^\+(\d+?)y$/)){
          offset = parseInt(offset[1]);
          exp = new Date(new Date().setFullYear(new Date().getFullYear() + offset));
        }else if(offset = exp.match(/^\+(\d+?)m$/)){
          offset = parseInt(offset[1]);
          exp = new Date(new Date().setMonth(new Date().getMonth() + offset));
        }else if(offset = exp.match(/^\+(\d+?)d$/)){
          offset = parseInt(offset[1]);
          exp = new Date(new Date().setDate(new Date().getDate() + offset));
        }else if(offset = exp.match(/^\+(\d+?)h$/)){
          offset = parseInt(offset[1]);
          exp = new Date(new Date().setHours(new Date().getHours() + offset));
        }else if(offset = exp.match(/^\+(\d+?)i$/)){
          offset = parseInt(offset[1]);
          exp = new Date(new Date().setMinutes(new Date().getMinutes() + offset));
        }else if(offset = exp.match(/^\+(\d+?)s$/)){
          offset = parseInt(offset[1]);
          exp = new Date(new Date().setSeconds(new Date().getSeconds() + offset));
        }else{
          exp = new Date(exp);
        }
        let peeper = setInterval((name,expires)=>{
          let now = new Date();
          if(Date.parse(now) >= Date.parse(expires)){
            window.sessionStorage.removeItem(name);
            clearInterval(peeper);
          }
        },1000,opts.name,exp);
      }
    }else{
      let cookieStr = `${opts.name}=${opts.value}`;
      if(opts.expires){
        let exp = opts.expires;
        let offset = 0;
        if(offset = exp.match(/^\+(\d+?)y$/)){
          offset = parseInt(offset[1]);
          exp = new Date(new Date().setFullYear(new Date().getFullYear() + offset));
        }else if(offset = exp.match(/^\+(\d+?)m$/)){
          offset = parseInt(offset[1]);
          exp = new Date(new Date().setMonth(new Date().getMonth() + offset));
        }else if(offset = exp.match(/^\+(\d+?)d$/)){
          offset = parseInt(offset[1]);
          exp = new Date(new Date().setDate(new Date().getDate() + offset));
        }else if(offset = exp.match(/^\+(\d+?)h$/)){
          offset = parseInt(offset[1]);
          exp = new Date(new Date().setHours(new Date().getHours() + offset));
        }else if(offset = exp.match(/^\+(\d+?)i$/)){
          offset = parseInt(offset[1]);
          exp = new Date(new Date().setMinutes(new Date().getMinutes() + offset));
        }else if(offset = exp.match(/^\+(\d+?)s$/)){
          offset = parseInt(offset[1]);
          exp = new Date(new Date().setSeconds(new Date().getSeconds() + offset));
        }else{
          exp = new Date(exp);
        }
        let utcdate = exp.toUTCString();
        cookieStr += "; expires=" + utcdate;
      }
      if(opts.path) cookieStr += "; path=" + opts.path;
      if(opts.domain) cookieStr += "; domain=" + opts.domain;
      document.cookie = cookieStr;
    }
  }

  velfun.io.getCookie = function(name,usingSessionMode = true){
    
    if(usingSessionMode){
      let val = window.sessionStorage.getItem(name);
      if(val) return val;
    }

    let result = document.cookie.match("(^|[^;]+)\\s*" + name + "\\s*=\\s*([^;]+)");
    return result ? result.pop() : "";
  }

  velfun.io.delCookie = function(name,usingSessionMode = true){
      if(usingSessionMode){
        window.sessionStorage.removeItem(name);
      }
      document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
  }

  //Test
  velfun.test = new Object();

  velfun.test.password = function (password) {
		var vel_t0=/[A-Z]+/.test(password);
		var vel_t1=/[a-z]+/.test(password);
		var vel_t2=/\d+/.test(password);
		var vel_t3=/[^A-z\d]+/.test(password);
		var vel_t4=password.length;
		var vel_t5=/(12|23|34|45|56|67|78|89|90|01|11|22|33|44|55|66|77|88|99|00)+/.test(password);
		var vel_t6=/(ab|ac|cd|de|ef|fg|gh|hi|ij|jk|kl|lm|mn|no|op|pq|qr|rs|st|tu|uv|vw|wx|xy|yz|aa|bb|cc|dd|ee|ff|gg|hh|ii|jj|kk|ll|mm|nn|oo|pp|qq|rr|ss|tt|uu|vv|ww|xx|yy|zz)+/i.test(password);

		var vel_safe=0.00;
		vel_safe+=(vel_t0)?12.5:0;
		vel_safe+=(vel_t1)?12.5:0;
		vel_safe+=(vel_t2)?12.5:0;
		vel_safe+=(vel_t3)?12.5:0;
		vel_safe+=(vel_t4>=8)?12.5:0;
		vel_safe+=(vel_t4>=15)?12.5:0;
		vel_safe+=(!vel_t5&&vel_t2&&vel_t4>1)?12.5:0;
		vel_safe+=(!vel_t6&&vel_t4>1&&(vel_t0||vel_t1))?12.5:0;

		return vel_safe;
	}

  velfun.test.cellphone = function (cellphone) {
    cellphone = cellphone.replace(/[\s-\(\)]/g,"")
    var areacode = cellphone.match(/^(\+|0{1,3}|\+0{1,3})(86|852|853|886|1|81|44)/);
    var test;
    if(!areacode){
      areacode = "+86";
    }else{
      cellphone = cellphone.replace(areacode[0],"");

      areacode = areacode[0].replace(/(\+|0{1,3}|\+0{1,3})/,"+");
    }

    switch (areacode) {
      case "+86":
        test=/^1[345678]\d{9}$/.test(cellphone);
      break;
      case "+852":
        test=/^[239678]\d{7}$/.test(cellphone);
      break;
      case "+853":
        test=/^[68]\d{7}$/.test(cellphone) || /^28\d{6}$/.test(cellphone);
      break;
      case "+886":
        test=/^0?(9|2|3|4|5|6|7|8|37|49|89|82|826|836)\d{8}$/.test(cellphone);
      break;
      case "+1":
        test=/^\d{10}$/.test(cellphone);
      break;
      case "+81":
        test=/^\d{10}$/.test(cellphone);
      break;
      case "+44":
        test=/^0?7\d{9}$/.test(cellphone) || /^0?[^7]\d{10}$/.test(cellphone);
      break;
      default:

    }

		return test;
	}

  velfun.test.email = function (email) {
		var vel_t0=/(^[A-z]+[\d_]*)\@(\w+\.?)(\.\w+)$/.test(email.trim());
		return vel_t0;
	}

  //Translate
  velfun.trans=new Object();
  velfun.trans.inside=new Object();

  velfun.trans.inside.toChar = function(num,numlang,levellang){
		var num = num.split("");
		var showNum = "";
		var hasZero = false;
		for (var i = 0; i < num.length; i++) {
			var level = levellang[num.length - i - 1];
			if(num.length == 2 && num[0] == '1' && i == 0){
				showNum = level;
			}else{
				if(num[i] != 0){
					if (hasZero) {
						showNum = showNum + "零" + numlang[num[i]] + level;
						hasZero = false;
					}else{
						showNum = showNum + numlang[num[i]] + level;
					}
				}else{
					hasZero = true;
				}
			}
		}
		return showNum;
	}

  velfun.trans.NumToChar = function(number,upperCase){
		upperCase = upperCase || false;
    number = String(number);
		if(upperCase){
			var numlang = new Array("零","壹","贰","叁","肆","伍","陆","柒","捌","玖","拾");
			var levellang = new Array("","拾","佰","仟");
		}else{
			var numlang = new Array("零","一","二","三","四","五","六","七","八","九","十");
			var levellang = new Array("","十","百","千");
		}
		var biglevellang = new Array("","万","亿");
		num = new Array();
		if(number.length > 4 && number.length <= 8){
			num[0] = number.substring(0,number.length - 4);
			num[1] = number.substring(number.length - 4,number.length);
		}else if(number.length > 8){
			num[0] = number.substring(0,number.length - 8);
			num[1] = number.substring(number.length - 8,number.length-4);
			num[2] = number.substring(number.length - 4,number.length);
		}else{
			num[0] = number;
		}
		var showNum = "";
		for (var i = 0; i < num.length; i++) {
			showNum += velfun.trans.inside.toChar(num[i],numlang,levellang) + biglevellang[num.length - i - 1];
		}
		return showNum;
	}

  //info
  velfun.info=new Object();

  velfun.info.mobileType = function(){
		var u = navigator.userAgent;
		if(u.match(/Android/i)){
			Mobile = 'android';
		}else if(u.match(/BlackBerry/i)){
			Mobile = 'blackberry';
		}else if(u.match(/iPhone|iPad|iPod/i)){
			Mobile = 'ios';
		}else if(u.match(/IEMobile/i)){
			Mobile = 'windows';
		}else{
			Mobile = 'NOT';
		}
		return Mobile;
	}

  velfun.info.isMobile = function(){
		return (velfun.info.mobileType() != 'NOT')?true:false;
	}

  velfun.info.host = function(){
    return window.location.host;
  }

  velfun.info.isIE = function(func){
    if((!!window.ActiveXObject || "ActiveXObject" in window) && typeof func == "function"){
      func();
    }
    return (!!window.ActiveXObject || "ActiveXObject" in window)?true:false;
  }

  velfun.info.args = function(needvar){
    let query = window.location.search.substring(1);
    let reg = new RegExp(`(^|&)${needvar}=(.*?)(&|$)`);
    let re = query.match(reg);
    return re?re[2]:false;
  };

  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    velfun.info.args[pair[0]] = pair[1];
  }

  var tipList = new Array();
  var tipReady = true;
  velfun.Tip = function(content,title,duration){
    tipList.push(function(){_.inside.Tip_do(content,title,duration)});
    if(tipReady){
      tipReady = false;
      var fun = tipList.shift();
      fun();
    }
  }

  velfun.inside.Tip_do = function(content,title,duration){
    if(typeof title === "number"){
      duration = title;
      delete title;
    }
    if(duration === undefined){
      duration = 3000;
    }
    var appendHtml = "";
    var backgroundStyle = "background-color: rgba(253,253,253,0.9);";
    if(CSS.supports("backdrop-filter","blur(30px)")){
      backgroundStyle = "background-color: rgba(253,253,253,0.5);backdrop-filter: blur(30px);";
    }
    if(title !== undefined){
      appendHtml = "<div class='velfun_tip' style='display: block;position: fixed;top:5px;right:-310px;width:300px; min-height:50px;" + backgroundStyle + "border-radius:10px;box-shadow: 0px 0px 5px gray;pointer-events:none;transition:right 300ms ease-in,filter 500ms ease-out;transition-delay:0ms 350ms;filter: brightness(5) sepia(1);'><span class='velfun_tip_title' style='display:block;width:calc(100% - 10px);height:30px;line-height:30px;top:0px;margin:0px 5px;box-sizing:border-box;border-bottom:1px lightgray solid;font-weight:bold;'>" + title + "</span><span class='velfun_tip_content' style='display:block;width:100%;top:40px;padding:5px 10px;box-sizing:border-box;'>" + content + "</span></div>";
    }else{
      appendHtml = "<div class='velfun_tip' style='display: block;position: fixed;top:5px;right:-310px;width:300px; min-height:50px;" + backgroundStyle + ";border-radius:10px;box-shadow: 0px 0px 5px gray;pointer-events:none;transition:300ms ease-in;'><span class='velfun_tip_content' style='display:block;width:100%;padding:5px;box-sizing:border-box;'>" + content + "</span></div>";
    }
    _("body").after(appendHtml);

    var tips = _(".velfun_tip");
    for (var i = 0; i < tips.length; i++) {
      var tip = _(tips[i]);
      if(i == 0){
        setTimeout(function(t){
          t.css("right:5px;filter: brightness(1);");
        },10,tip)
      }else{
        var newtop = parseInt(tips[0].offsetHeight) + parseInt(tip[0].offsetTop) + 5;
        tip.css("top:" + newtop + "px;");
      }
    }
    setTimeout(function(t){
      t.css("opacity:0;");
      setTimeout(function(t){
        t.remove();
      },300,t)
    },duration,_(tips[0]))

    setTimeout(function(){
      if(tipList.length >= 1){
          var fun = tipList.shift();
          fun();
      }else{
        tipReady = true;
      }
    },500)
  }

  velfun.setColoricon = function(){
    var coloricons = _("v-coloricon");
    for (var i = 0; i < coloricons.length; i++) {
      var thisicon = _(coloricons[i]);
      var width = thisicon.attr("width") || thisicon.css("width");
      var height = thisicon.attr("height") || thisicon.css("height");
      var src = thisicon.attr("src");
      thisicon.css("width:" + width + "px;height:" + height + "px;overflow:hidden;display:inline-block;text-indent:0px;padding:0px;");
      thisicon.append("<img src='" + src + "' style='width:" + width + "px;height:" + height + "px;position:relative;left:-" + width + "px;border-right:1px solid transparent;filter:drop-shadow(" + width + "px 0 0 black)'>");
    }
  }

  velfun.setLang = function(langfile = ""){
    if(langfile == "") return;
    if(_.observer != undefined) _.observer.disconnect();

    _.io.get(langfile,function(langfiledata){
      _.langdata = JSON.parse(langfiledata);

      /**调用时强制更新**/
      var nl = _.getTextNodes(_("html")[0]);
      for (var tn of nl) {
        if(tn.nodeValue.trim() == "") continue;
        if(tn.tempStr == undefined){
          tn.tempStr = tn.nodeValue.trim();
        }else{
          tn.nodeValue = tn.tempStr;
        }
        for (var key in _.langdata) {
          var nt = _.langdata[key];
          tn.nodeValue = tn.nodeValue.replaceAll(`@t-${key};`,nt);
        }
      }

      var al = _("[title],[placeholder],[value]");
      al.each(function(){
        _.setAttrsLang(this,_.langdata);
      })
      _.observer.observe(_.obbody,_.obconfig);
    })
  }

  velfun.setAttrsLang = function(th,langdata){
    if(_(th).hasAttr("alt")){
      if(!_(th).hasAttr("data-altTempStr")){
        _(th).attr("data-altTempStr",_(th).attr("alt"));
      }else{
        _(th).attr("alt",_(th).attr("data-altTempStr"));
      }
    }

    if(_(th).hasAttr("title")){
      if(!_(th).hasAttr("data-titleTempStr")){
        _(th).attr("data-titleTempStr",_(th).attr("title"));
      }else{
        _(th).attr("title",_(th).attr("data-titleTempStr"));
      }
    }
    if(_(th).hasAttr("placeholder")){
      if(!_(th).hasAttr("data-placeholderTempStr")){
        _(th).attr("data-placeholderTempStr",_(th).attr("placeholder"));
      }else{
        _(th).attr("placeholder",_(th).attr("data-placeholderTempStr"));
      }
    }
    if(_(th).hasAttr("value")){
      if(!_(th).hasAttr("data-valueTempStr")){
        _(th).attr("data-valueTempStr",_(th).attr("value"));
      }else{
        _(th).attr("value",_(th).attr("data-valueTempStr"));
      }
    }
    for (var key in langdata) {
      var nt = langdata[key];
      if(_(th).hasAttr("title")){
        _(th).attr("title",_(th).attr("title").replaceAll(`@t-${key};`,nt));
      }
      if(_(th).hasAttr("alt")){
        _(th).attr("alt",_(th).attr("alt").replaceAll(`@t-${key};`,nt));
      }
      if(_(th).hasAttr("placeholder")){
        _(th).attr("placeholder",_(th).attr("placeholder").replaceAll(`@t-${key};`,nt));
      }
      if(_(th).hasAttr("value")){
        _(th).attr("value",_(th).attr("value").replaceAll(`@t-${key};`,nt));
      }
    }
  }

  velfun.getTextNodes = function(ele){
    if(ele.nodeType == 3) return [ele];
    var nodes = ele.childNodes;
    var textnodes = [];
    for (var i in nodes) {
      if(nodes[i].nodeType == 3){
        textnodes.push(nodes[i]);
      }else{
        var r = _.getTextNodes(nodes[i]);
        for (var tn of r) {
          textnodes.push(tn);
        }
      }
    }
    return textnodes;
  }

  velfun.fn.init.prototype = velfun.fn;
  window.velfun = _ = velfun;
})(window);

//Base Ext
Date.prototype.getFullMonth=function (addone) {
	var addo = addone || false;
	var vel_date=this;
	var vel_month=vel_date.getMonth();
	if (addo) {
		vel_month=parseInt(vel_month)+1;
	}
	if (vel_month.toString().length==1) {
		return "0"+vel_month;
	}else {
		return vel_month;
	}
}
Date.prototype.getFullDate=function () {
	var vel_date=this;
	var vel_fdate=vel_date.getDate();
	if (vel_fdate.toString().length==1) {
		return "0"+vel_fdate;
	}else {
		return vel_fdate;
	}
}
Date.prototype.getFullHours=function () {
	var vel_date=this;
	var vel_hours=vel_date.getHours();
	if (vel_hours.toString().length==1) {
		return "0"+vel_hours;
	}else {
		return vel_hours;
	}
}
Date.prototype.getFullMinutes=function () {
	var vel_date=this;
	var vel_minutes=vel_date.getMinutes();
	if (vel_minutes.toString().length==1) {
		return "0"+vel_minutes;
	}else {
		return vel_minutes;
	}
}
Date.prototype.getFullSeconds=function () {
	var vel_date=this;
	var vel_seconds=vel_date.getSeconds();
	if (vel_seconds.toString().length==1) {
		return "0"+vel_seconds;
	}else {
		return vel_seconds;
	}
}

Object.defineProperty(Date.prototype,"FullMonth",{
  get:function(){
    return this.getFullMonth(true);
  }
});

Object.defineProperty(Date.prototype,"FullDate",{
  get:function(){
    return this.getFullDate();
  }
});

Object.defineProperty(Date.prototype,"FullHours",{
  get:function(){
    return this.getFullHours();
  }
});

Object.defineProperty(Date.prototype,"FullMinutes",{
  get:function(){
    return this.getFullMinutes();
  }
});

Object.defineProperty(Date.prototype,"FullSeconds",{
  get:function(){
    return this.getFullSeconds();
  }
});

//Auto Exec
_.selfpath=document.scripts;
_.selfpath=_.selfpath[_.selfpath.length-1].src.substring(0,_.selfpath[_.selfpath.length-1].src.lastIndexOf("/")+1);
_.io.loadPatchsFrom(_.selfpath + "plugins/");

function controllerInit() {
  _("v-select").setSelect();
  _.initUpload();
  _.setColoricon();
  _.observer.observe(_.obbody,_.obconfig);
}
_(function(){
  if(_.info.isIE()){
    document.writeln("VelFun4 is not support Internet Explorer.");
    return false;
  }

  

  /**监听变化内容以更新**/
  _.obbody = _("html")[0];
  _.obconfig = {attributes: true, childList: true, subtree: true};
  _.obcallback = function(ml, observer){
    controllerInit();
    for (var mr of ml) {
      /*>>>>语言更新*/
      switch (mr.type) {
        case "attributes":
          if(!["alt","title","placeholder","value"].includes(mr.attributeName)) continue;
          let mutationRecords = observer.takeRecords();
          _.observer.disconnect();
          if(_(mr.target).hasAttr(mr.attributeName)){
              _(mr.target).attr("data-" + mr.attributeName + "TempStr",_(mr.target).attr(mr.attributeName));
          }
          for (var key in _.langdata) {
              var nt = _.langdata[key];
              try {
                _(mr.target).attr(mr.attributeName,_(mr.target).attr(mr.attributeName).replaceAll(`@t-${key};`,nt));
              } catch (e) {}
          }
          _.observer.observe(_.obbody,_.obconfig);
        break;
        case "childList":
          _.observer.disconnect();
          for (var adn of mr.addedNodes) {
            var nl = _.getTextNodes(adn);
            for (var tn of nl) {
              if(tn.tempStr == undefined){
                tn.tempStr = tn.nodeValue.trim();
              }else{
                tn.nodeValue = tn.tempStr;
              }
              for (var key in _.langdata) {
                var nt = _.langdata[key];
                tn.nodeValue = tn.nodeValue.replaceAll(`@t-${key};`,nt);
              }
            }
            _.setAttrsLang(adn,_.langdata);
          }
          _.observer.observe(_.obbody,_.obconfig);
        break;
      }
      /*<<<<语言更新*/
    }
  }
  _.observer = new MutationObserver(_.obcallback);
  controllerInit(); //初始化控件

  //Init Auto
  _("html").css("perspective: 100px; min-height:100%; min-width: 100%;");
  _("body").css("opacity: 1;transform: translateZ(0px);min-width:100vw; min-height:100vh;margin:0;");
  if(new Array("rgba(0, 0, 0, 0)","rgba(0,0,0,0)","transparent").indexOf(_("body").css("background-color")) > -1){
    _("body").css("background-color:rgba(255, 255, 255, 1)");
  }

  _(document).click(function(){
    _("._Velfun_Contextmenu_[data-open]").css("opacity:0;");
    setTimeout(function(){
      _("._Velfun_Contextmenu_[data-open]").css("display:none;");
      _("._Velfun_Contextmenu_[data-open]").attr("data-open","");
      _("._Velfun_Contextmenu_[dynamic]").remove();
    },120)

    if(_("v-select[data-opening]").length > 0){
      _("v-select[data-opening]").closeSelect();
    }
  })


  //Keys
  velfun.nowinputbox = null;
  _("v-key").bind("mousedown",function(e){
    e.preventDefault();
  })

  _("v-key").bind("click",function(){
    var _this = this;
    if(_(velfun.nowinputbox).hasAttr('readonly') || _(velfun.nowinputbox).hasAttr('disable') || !velfun.nowinputbox){
      return false;
    }
    var keychar=_this.val();
    var pos=velfun.nowinputbox.selectionStart;
    if (keychar=="clear") {
      velfun.nowinputbox.value="";
      velfun.nowinputbox.selectionStart=0;
      velfun.nowinputbox.selectionEnd=0;
    }else if (keychar=="backspace") {
      if(velfun.nowinputbox.selectionStart != velfun.nowinputbox.selectionEnd){
        velfun.nowinputbox.value=velfun.nowinputbox.value.substr(0,velfun.nowinputbox.selectionStart)+velfun.nowinputbox.value.substr(velfun.nowinputbox.selectionEnd,velfun.nowinputbox.value.length);
        velfun.nowinputbox.selectionStart=pos;
        velfun.nowinputbox.selectionEnd=pos;
        return false;
      }
      velfun.nowinputbox.value=velfun.nowinputbox.value.substr(0,pos-1)+velfun.nowinputbox.value.substr(pos,velfun.nowinputbox.value.length);
      velfun.nowinputbox.selectionStart=pos-1;
      velfun.nowinputbox.selectionEnd=pos-1;
    }else if (keychar=="minus") {
      if (velfun.nowinputbox.value.indexOf("-")==-1) {
        velfun.nowinputbox.value="-"+velfun.nowinputbox.value;
      }else {
        velfun.nowinputbox.value=velfun.nowinputbox.value.substr(1,velfun.nowinputbox.value.length);
      }
      velfun.nowinputbox.selectionStart=velfun.nowinputbox.value.length;
      velfun.nowinputbox.selectionEnd=velfun.nowinputbox.value.length;
    }else if (keychar=="shift"){
      if (_this.hasClass('shiftON')) {
        _this.removeClass('shiftON');
        var keys = _("v-key",_this.parent());
        for (var i = 0; i < keys.length; i++) {
          var key = _(keys[i]);
          var isEn = /^[a-zA-Z]$/i.test(key.val());
          if (isEn) {
            var normal=key.val().toLowerCase();
            key.val(normal);
            key.text(normal);
          }
        }
      }else {
        _this.addClass('shiftON');
        var keys = _("v-key",_this.parent());
        for (var i = 0; i < keys.length; i++) {
          var key = _(keys[i]);
          var isEn = /^[a-zA-Z]$/i.test(key.val());
          if (isEn) {
            var upper=key.val().toUpperCase();
            key.val(upper);
            key.text(upper);
          }
        }
      }
    }else if(keychar=="space"){
      velfun.nowinputbox.value=velfun.nowinputbox.value.substr(0,velfun.nowinputbox.selectionStart)+" "+velfun.nowinputbox.value.substr(velfun.nowinputbox.selectionEnd,velfun.nowinputbox.value.length);
      velfun.nowinputbox.selectionStart=pos+keychar.length;
      velfun.nowinputbox.selectionEnd=pos+keychar.length;
    }else {
      velfun.nowinputbox.value=velfun.nowinputbox.value.substr(0,velfun.nowinputbox.selectionStart)+keychar+velfun.nowinputbox.value.substr(velfun.nowinputbox.selectionEnd,velfun.nowinputbox.value.length);
      velfun.nowinputbox.selectionStart=pos+keychar.length;
      velfun.nowinputbox.selectionEnd=pos+keychar.length;
    }
    _(velfun.nowinputbox).trigger("change");
  })

  _("input[inputbox]").bind("focus",function(){
    velfun.nowinputbox=this[0];
  })

})
