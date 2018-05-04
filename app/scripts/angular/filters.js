(function () {

    "use strict";

    angular.module('SatelliteView')
        .filter('subLayerItemList', subLayerItemList)
        .filter("subLayerNameLength", subLayerNameLength)
        .filter("chURItoEn", chURItoEn);


    function subLayerNameLength() {
        return function (layerName, length) {
            if (layerName.length > length && length > 1) {
                return String(layerName).substring(0, length - 1) + "...";
            } else {
                return layerName;
            }
        };
    }

    function subLayerItemList() {
        return function (layerList) {
            var array = [];
            for (var i = 0; i < layerList.length; i++) {
                if (layerList[i].index <= 5) {
                    array.push(layerList[i]);
                }
            }
            return array;
        };
    }

    function chURItoEn() {
        return function (param) {
            param = encodeURI(param);
            return param;
        };
    }


})();