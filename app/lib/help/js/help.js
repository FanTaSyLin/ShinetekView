/**
 * Created by johm-z on 2017/12/27.
 */
var helpBox = {};
helpBox.pageNum = 1;
helpBox.isHelp="true";
helpBox.isDisplay="none";
helpBox = {
  /**
   * 初始化帮助功能
   **/
  _helpInit: function() {
      //console.log(localStorage);
      //console.log(localStorage.getItem("isHelp"));
      helpBox.pageNum = 1;
     //localStorage
    var _getStorage = localStorage.getItem("isHelp");
    if (_getStorage == null) {
        //不存在，首次打开，将帮助设置为显示,设置localStorage
        document.getElementById("mapHelp").style.display = "block";
        helpBox.setlocalStorage("isHelp");
    }
    else  if(_getStorage == false){
        //存在，不是首次打开，将帮助设置为隐藏
        document.getElementById("mapHelp").style.display = "none";


    }
  },

    /**
     * 设置localStorage
     */
    setlocalStorage:function (key) {
        localStorage.setItem(key, "false");
    },

    /**
     * Storage
     */
    getStorage:function (status) {
        console.log(localStorage);
    },

  /**
   * 读取cookie
   */
  getCookie: function(name) {
    //console.log(document.cookie);
    if (document.cookie.length > 0) {
      var c_start = document.cookie.indexOf(name + "=");
      if (c_start != -1) {
        //存在带=的值
        var cookieAry = new Array();
        cookieAry = document.cookie.split(";");
        for (i = 0; i < cookieAry.length; i++) {
          if (cookieAry[i].indexOf("monitor_count") != -1) {
            //存在 monitor_count
            var selectArt = cookieAry[i];
            var monitorAry = new Array();
            monitorAry = selectArt.split("=");
            return monitorAry[1];
          }
        }
      } else {
        //不存在带=的值
      }
    }
    return "";
  },

    /**
     * 设置图片为第几张
     */
    setFirstPage: function () {
      var sv_page_img=document.getElementsByClassName("sv-page-img")[0];
      console.log(sv_page_img);
        sv_page_img.style.background=url("/publics/firstPage.png")
},

    /**
     * 上一页
     */
    previousFun:function () {
        if(helpBox.pageNum>1){
            helpBox.pageNum=helpBox.pageNum-1;
            helpBox.addPage(helpBox.pageNum);
        }
    },

    /**
     * 下一页
     */
    nextFun:function () {
        if(helpBox.pageNum<5){
            helpBox.pageNum=helpBox.pageNum+1;
            helpBox.addPage(helpBox.pageNum);
        }
    },

    /**
     * 切换帮助页
     * @param pageNum
     */
    addPage:function (pageNum) {
      var sv_page_img=document.getElementsByClassName("sv-page-img")[0];
        switch (pageNum){
            case 1:
                sv_page_img.style.backgroundImage="url(/publics/firstPage.png)"
                document.getElementsByClassName("sv-page-button")[0].getElementsByTagName("button")[0].style.display="none";
                document.getElementsByClassName("sv-page-button")[0].getElementsByTagName("button")[1].style.marginLeft="43%";
                return ;
            case 2:
                sv_page_img.style.backgroundImage="url(/publics/secondPage.png)";
                document.getElementsByClassName("sv-page-button")[0].getElementsByTagName("button")[0].style.display="block";
                document.getElementsByClassName("sv-page-button")[0].getElementsByTagName("button")[0].style.marginLeft="30%";
                document.getElementsByClassName("sv-page-button")[0].getElementsByTagName("button")[1].style.marginLeft="20%";
                return ;
            case 3:
                sv_page_img.style.backgroundImage="url(/publics/thirdPage.png)";
                return ;
            case 4:
                sv_page_img.style.backgroundImage="url(/publics/fourthPage.png)";
                document.getElementsByClassName("sv-page-button")[0].getElementsByTagName("button")[0].style.marginLeft="30%";
                document.getElementsByClassName("sv-page-button")[0].getElementsByTagName("button")[1].style.display="block";
                return ;
            case 5:
                sv_page_img.style.backgroundImage="url(/publics/fifthPage.png)";
                document.getElementsByClassName("sv-page-button")[0].getElementsByTagName("button")[0].style.marginLeft="43%";
                document.getElementsByClassName("sv-page-button")[0].getElementsByTagName("button")[1].style.display="none";
                return ;
        }
    },

    /**
     * 关闭帮助
     */
    closePage:function () {
        document.getElementById("mapHelp").style.display="none";
        helpBox.isDisplay=undefined;
    },

    /**
     * 点击帮助控制帮助的显示隐藏
     */
    displayHelp:function () {
        console.log(helpBox.isDisplay);
        if(helpBox.isDisplay==undefined){
            document.getElementById("mapHelp").style.display="block";
            helpBox.isDisplay="block";
        }else if(helpBox.isDisplay=="block"){
            document.getElementById("mapHelp").style.display="none";
            helpBox.isDisplay=undefined;
        }

    }
};
