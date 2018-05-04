/**
 * Created by johm-z on 2018/1/4.
 */
var newMenu={
    /**
     * 标题伸缩
     * @param status
     */
    menuTitleScaling:function (status) {
        /*plus-square-o
        minus-square-o*/
        var _menuTitleScaling=document.getElementsByClassName("menuTitleScaling")[0];
        if(status==false){
            _menuTitleScaling.className="fa fa-minus-square-o menuTitleScaling";
        }else if(status==true){
            _menuTitleScaling.className="fa fa-plus-square-o menuTitleScaling";
        }else {
            console.log("点击的图标状态错误："+status);
        }
    },

    /**
     * 一级菜单箭头伸缩
     */
    menuFirstScaling:function () {
        var e = window.event;
        e.target = e.target || e.srcElement;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;
        if(e.target.className=="ng-binding"){
            /*a标签*/
            var menuClickI=e.target.parentNode.getElementsByClassName("fa")[1];
            newMenu.menuSecondScaling(menuClickI);
        }
        else if(e.target.className=="fa fa-angle-down fr mt10"){
            /*i标签*/
            var menuClickI=e.target;
            newMenu.resetArrow();
            newMenu.menuSecondScaling(menuClickI);
        }
        else if(e.target.className=="fa fa-angle-right fr mt10"){
            /*i标签*/
            var menuClickI=e.target;
            newMenu.menuSecondScaling(menuClickI);
        }
        else if(e.target.className=="panel-title"){
            /*h4标签*/
            var menuClickI=e.target.getElementsByTagName("i")[1];
            newMenu.menuSecondScaling(menuClickI);
        }
        else if(e.target.className=="panel-heading  menuGroup-First"){
            /*div标签*/
            var menuClickI=e.target.getElementsByTagName("i")[1];
            newMenu.menuSecondScaling(menuClickI);
        }
        else if(e.target.className=="fa fa-map fr mt10"){
            /*第一个i标签*/
            var menuClickI=e.target.parentNode.parentNode.getElementsByTagName("i")[1];
            newMenu.menuSecondScaling(menuClickI);
        }
        else if(e.target.className=="label label-danger ng-binding"){
            /*span个数标签*/
            /*第一个i标签*/
            var menuClickI=e.target.parentNode.parentNode.getElementsByTagName("i")[1];
            newMenu.menuSecondScaling(menuClickI);
        }
        else {
            console.log("点击的图标未识别："+e.target);
        }
    },

    menuSecondScaling:function(label){
        var menuSeconde_none="fa fa-angle-down fr mt10";
        var menuSeconde_block="fa fa-angle-right fr mt10";
        if(label.className==menuSeconde_block){
            label.className=menuSeconde_none;
        }else if(label.className==menuSeconde_none){
            newMenu.resetArrow();
            label.className=menuSeconde_block;
        }
    },

    /**
     * 重置所有下箭头
     */
    resetArrow: function(){
        var _menuGroup=document.getElementsByClassName("menuGroup")[0];
        var menuFirstAry = _menuGroup.getElementsByClassName("panel");
        for(var i=0;i<menuFirstAry.length;i++){
            menuFirstAry[i].getElementsByClassName("fa")[1].className="fa fa-angle-down fr mt10";
        }
    }
}