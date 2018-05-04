/**
 * Created by johm-z on 2017/11/30.
 */
//发送AJAX请求获取JSON文件信息
window.onload=function(){
    var languageObj={
        /**
         * 发送AJAX获取中英文JSON文件
         * @param url
         */
        oAjaxLanguage : function (url) {
            $.ajax({
                url: url,
                type: "get",
                dataType: "json",
                async: false,
                success: function (data) {
                    //console.log(data);
                    var dataBand = eval(data);
                    languageObj.bandData(dataBand);
                }
            })
        },
        /**
         * 将文件信息绑定到页面上
         * @param data
         */
        bandData : function (data) {
            //console.log(data);
            //Band Layers
            /* 使用源settings中的设置，default=“SatelliteView” */
            // if(document.getElementById("title_ico")){
            //     document.getElementById("title_ico").innerHTML=data.layers.title_ico_css_h2;
            // }
            if(document.getElementById("func-css-li-Layer")){
                document.getElementById("func-css-li-Layer").innerHTML=data.layers.func_css_li_Layer;
            }
            if(document.getElementById("func-css-li-Events")){
                document.getElementById("func-css-li-Events").innerHTML=data.layers.func_css_li_Events;
            }
            /*if(document.getElementsByClassName("glyphicon-save")[0]){
                document.getElementsByClassName("glyphicon-save")[0].innerHTML=data.layers.glyphicon_save;
            }*/
            if(document.getElementById("layers_overlays")){
                document.getElementById("layers_overlays").innerHTML=data.layers.layers_h6_overlayers;
            }
            if(document.getElementById("layers_baselayers")){
                document.getElementById("layers_baselayers").innerHTML=data.layers.layers_h6_baselayers;
            }
            if(document.getElementById("addlayers-btn-p")){
                document.getElementById("addlayers-btn-p").innerHTML=data.layers.addlayers_btn_p;
            }


            //Band animate
            if(document.getElementById("sv-animation-widget-header-begin"))
            {
                document.getElementById("sv-animation-widget-header-begin").innerHTML=data.animate.sv_animation_widget_header_begin
            }
            /*if(document.getElementsByClassName("sv-animation-widget-fps-label")[0].getElementsByTagName("span")[0]){
                //document.getElementsByClassName("sv-animation-widget-fps-label")[0].getElementsByTagName("span")[0].innerHTML = data.animate.sv_animation_widget_fps_label;
            }*/
            if(document.getElementById("thru-label")){
                document.getElementById("thru-label").innerHTML=data.animate.thru_label;
            }

            //Band screenshot
            if(document.getElementById("cameraName")){
                document.getElementById("cameraName").innerHTML=data.screenshot.cameraTop;
            }
            if(document.getElementById("wv-image-resolution-Name")){
                document.getElementById("wv-image-resolution-Name").innerHTML=data.screenshot.wv_image_resolution;
            }
            if(document.getElementById("wv-image-format-Name")){
                document.getElementById("wv-image-format-Name").innerHTML=data.screenshot.wv_image_format;
            }
            if(document.getElementsByClassName("xydisplay")[0]){
                //document.getElementsByClassName("xydisplay")[0].parentNode.getElementsByTagName("label")[0].innerHTML=data.screenshot.startXY_label;
            }
            if(document.getElementsByClassName("xydisplay")[0]){
                //document.getElementsByClassName("xydisplay")[0].parentNode.getElementsByTagName("label")[0].innerHTML=data.screenshot.endXY_label;
            }

            //经纬度
            if(document.getElementById("topleft_lon")){
                document.getElementById("topleft_lon").innerHTML=data.screenshot.startXY_lon;
            }
            if(document.getElementById("topleft_lat")){
                document.getElementById("topleft_lat").innerHTML=data.screenshot.startXY_lat;
            }
            if(document.getElementById("rightbottom_lon")){
                document.getElementById("rightbottom_lon").innerHTML=data.screenshot.endXY_lon;
            }
            if(document.getElementById("rightbottom_lat")){
                document.getElementById("rightbottom_lat").innerHTML=data.screenshot.endXY_lat;
            }


            //Band map
            if(document.getElementsByClassName("myResolution")[0]){
                document.getElementsByClassName("myResolution")[0].getElementsByTagName("p").innerHTML=data.map.resolutions;
            }

        }
    }

    languageObj.oAjaxLanguage("lib/language/language_cn.json")

}
