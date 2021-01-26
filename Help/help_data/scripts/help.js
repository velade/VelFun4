_(function(){
  _(".typeitem").bind("click",function(){
    _(".typeitem.selected").removeClass("selected");
    this.addClass("selected");
    _(".part").css("display:none;");
    _("#" + this.attr("data-page")).css("display:block;");
  })
  _(".typeitem[data-page='jj']").addClass("selected");
  _("#jj").css("display:block;");

  _.setLang("/online/Help/help_data/lang/cn.lang");

  /****演示按钮****/
  _("#test_back").bind("click",function(){
    _.Msgbox("点击「确定」返回");
  })

  _("#test_unback").bind("click",function(){
    _.Msgbox("现在我们给了页面一个back，点击「确定」执行unback操作!");
  })

  _("#test_resetback").bind("click",function(){
    setTimeout(function(){
      _("body").back();
      _.Tip("第一次执行back");
    },0);
    setTimeout(function(){
      _("body").back();
      _.Tip("第二次执行back");
    },1000);
    setTimeout(function(){
      _("body").back();
      _.Tip("第三次执行back");
    },2000);
    setTimeout(function(){
      _("body").back();
      _.Tip("第四次执行back");
      _.Tip("即将执行resetback");
    },3000);
    setTimeout(function(){
      _("body").resetback();
      _.Tip("现在执行了resetback");
    },5000);
  })

  _("#test_rightclick").bind("click",function(){
    _.Msgbox("都说了让你「右键」点击！");
  })

  _("#test_rightclick").CustomContextmenu({
    "复制":function(){
      _.Msgbox("按钮:你复制我要做什么呢？");
    },
    "粘贴":function(){
      _.Msgbox("按钮:你要干什么？不要把奇奇怪怪的东西贴上来啊！");
    },
    "删除":function(){
      _.Msgbox("按钮:你居然要删除我？你是认真的吗？","","MSG_YES_NO",function(re){
        if(re){
          _.Msgbox("按钮:好吧，再见！");
          _("#test_rightclick").remove();
        }else{
          _.Msgbox("按钮:我就知道你舍不得^_^");
        }
      });
    },
  })

  _("#test_autoTile").bind("click",function(){
    _("div","#test_autoTile_div").autoTile();
  })

  _("#test_coloricon").setColor("red");

  _("#test_Msgbox").bind("click",function(){
    _.Msgbox("Hello,又见面了","一个你可能眼熟的消息框");
  })

  _("#test_options").bind("click",function(){
    _.Options({
      "蓝色":function(){
        _.Msgbox("安静的颜色，很美，我也喜欢蓝色");
      },
      "红色":function(){
        _.Msgbox("热情的颜色呢，像火一样的红色真的很棒呢");
      },
      "绿色":function(){
        _.Msgbox("大自然的颜色，放在哪里都很美呢......除了头上");
      }
    },"你喜欢什么颜色？")
  })

  var tipTimes = 0;
  _("#test_tip").bind("click",function(){
    switch (tipTimes) {
      case 0:
        _.Tip("你可以多点几次试试","提示",5000);
      break;
      case 1:
        _.Tip("连续的提示会排列在右上角，而不会等前一个消失后才显示","提示",5000);
      break;
      case 2:
        _.Tip("最新的消息会显示在最上方","提示",5000);
      break;
      case 3:
        _.Tip("消息的显示速度有限制，如果一次来太多会滚动很久","提示",5000);
      break;
      case 4:
        _.Tip("以上就是所有的提示了","提示",5000);
      break;
      case 5:
        _.Tip("你怎么还点？","？？？",5000);
      break;
      default:
        _.Tip("这只是一条测试提示","-_-",5000);
    }
    this.text("多点几次试试");
    tipTimes ++;
  })

  _("#test_setlang").bind("click",function(){
    if(this.attr("data-lang") == "cn"){
      _.setLang("/online/Help/help_data/lang/en.lang");
      this.attr("data-lang","en");
    }else{
      _.setLang("/online/Help/help_data/lang/cn.lang");
      this.attr("data-lang","cn");
    }
  })

  _("#test_password").bind("keyup",function(){
    var strong = _.test.password(_("#test_password").val());
    var color;
    if(strong <= 37.5){
      color = "red";
    }else if(strong <= 62.5){
      color = "yellow";
    }else{
      color = "green";
    }
    _("#test_password_pro").css("background-color:" + color + ";width:" + strong + "%;");
    color = (strong)?color:"black";
    strong = strong || "输入密码测试强度";
    _("#test_password_strong").css("color:" + color + ";").text(strong);
  })

  _("#test_cellphone").bind("keyup",function(){
    var color = "red";
    if(_("#test_cellphone").val() !== ""){
      var check = _.test.cellphone(_("#test_cellphone").val());
      if (check) {
        color = "green";
      }
      _("#test_cellphone_check").css("color:" + color + ";").text(check.toString());
    }else{
      color = "black";
      _("#test_cellphone_check").css("color:" + color + ";").text("输入手机号码验证格式");
    }
  })

  _("#test_email").bind("keyup",function(){
    var color = "red";
    if(_("#test_email").val() !== ""){
      var check = _.test.email(_("#test_email").val());
      if (check) {
        color = "green";
      }
      _("#test_email_check").css("color:" + color + ";").text(check.toString());
    }else{
      color = "black";
      _("#test_email_check").css("color:" + color + ";").text("输入邮箱地址验证格式");
    }
  })

  _("#test_ntc").bind("keyup",function(){
    if(_("#test_ntc").val() !== ""){
      var str = _.trans.NumToChar(_("#test_ntc").val());
      _("#test_ntc_check").text(str);
    }else{
      _("#test_ntc_check").text("输入邮箱地址验证格式");
    }
  })

  setInterval(function(){
    _("#test_Month").text(new Date().getFullMonth(true));
    _("#test_Date").text(new Date().getFullDate());
    _("#test_Hour").text(new Date().getFullHours());
    _("#test_Min").text(new Date().getFullMinutes());
    _("#test_Sec").text(new Date().getFullSeconds());
  },500);

})
