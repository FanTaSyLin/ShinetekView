(function () {

    "use strict";

    angular.module("SatelliteView")
        .factory("APIServices", APIServices);

    APIServices.$inject = ['$http'];

    function APIServices($http) {

        var BASEPATH = Config_Total.BASEPATH;

        var self = {
            getResources: getResources,
            insertResource: insertResource,
            delResource: delResource,
            getLayerModal: getLayerModal,
            getLayerGroupList: getLayerGroupList,
            getProjectInfoList: getProjectInfoList,
            getDataExistList: getDataExistList,
            getProjectPalette: getProjectPalette,
            getAnimaList: getAnimaList,
            getMultipleAnimaList: getMultipleAnimaList,
            getOperating: getOperating,
            getPlugin: getPlugin,
            getResourceSettings: getResourceSettings
        };

        return self;

        function getResourceSettings(baseUrl, sFn, eFn) {
            $http.get(baseUrl + "/settings").success(sFn).error(eFn);
        }

        function getPlugin(baseUrl, successFn, errorFn) {
            $http.get(baseUrl + "/plugin?disabled=false").success(successFn).error(errorFn);
        }

        function getOperating(successFn, errorFn) {
            $http.get("./satelliteview/api/operating").success(successFn).error(errorFn);
        }

        function delResource(name, successFn, errorFn) {
            $http.delete("./satelliteview/api/resource?name=" + name).success(successFn).error(errorFn);
        }

        function insertResource(item, successFn, errorFn) {
            $http.post("./satelliteview/api/resource", item).success(successFn).error(errorFn);
        }

        function getResources(successFn, errorFn) {
            $http.get("./satelliteview/api/resource").success(successFn).error(errorFn);
        }

        function getLayerModal(baseUrl, projectType, successFn, errorFn) {
            $http.get(baseUrl + "/resource?projectType=" + projectType).success(successFn).error(errorFn);
        }

        /**
         * 获取产品调色板信息
         * @param {String} url 
         * @param {Function} successFn 
         * @param {Function} errorFn 
         */
        function getProjectPalette(url, successFn, errorFn) {
            $http.get(url).success(successFn).error(errorFn);
        }

        /**
         * 获取产品信息列表
         * @param {Function} successFn
         * @param {Function} errorFn
         */
        function getProjectInfoList(successFn, errorFn) {
            $http.get(BASEPATH + "/projectinfo").success(successFn).error(errorFn);
        }

        /**
         * 获取图层分组列表
         * @param {Function} successFn 
         * @param {Function} errorFn 
         */
        function getLayerGroupList(successFn, errorFn) {
            $http.get(BASEPATH + '/layer-group').success(successFn).error(errorFn);
        }

        /**
         * 获取数据有无列表
         * @param {String} url 
         * @param {Function} successFn 
         * @param {Function} errorFn 
         */
        function getDataExistList(url, successFn, errorFn) {
            $http.get(url).success(successFn).error(errorFn);
        }

        /**
         * 获取动画列表
         * @param {String} url 
         * @param {Function} successFn 
         * @param {Function} errorFn 
         */
        function getAnimaList(url, successFn, errorFn) {
            //url = url.replace("4.130", "4.121");
            $http.get(url).success(successFn).error(errorFn);
        }

        /**
         * 获取多产品动画
         * 获取单产品动画
         * @param {any} baseUrl 
         * @param {any} animateType 
         * @param {any} successFn 
         * @param {any} errorFn 
         */
        function getMultipleAnimaList(baseUrl, animateType, successFn, errorFn) {
            // baseUrl = baseUrl.replace("4.130", "4.121");
            //console.log(baseUrl + "/satelliteview/multipleanimate/fy4?animationtype=" + animateType);
            animateType = encodeURI(animateType);
            //console.log(baseUrl + "/satelliteview/multipleanimate/fy4?animationtype=" + animateType);
            $http.get(baseUrl + "/satelliteview/multipleanimate/fy4?animationtype=" + animateType).success(successFn).error(errorFn);
        }

    }

})();