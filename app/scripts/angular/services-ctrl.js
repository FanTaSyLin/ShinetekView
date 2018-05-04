(function () {

    "use strict";
    angular.module("SatelliteView")
        .factory("CtrlServices", CtrlServices);

    CtrlServices.$inject = ["APIServices"];

    function CtrlServices(APIServices) {
        /**
         * @description 图层数据时间轴数组存储图层的数据存在信息
         * @type {[TimelineModule]}
         */
        var layerTimeList = [];
        /**
         * @description 存储图层调色板对象
         * @type {[PaletteObj]}
         */
        var paletteList = [];

        var self = {
            layerModuleList: [],
            /** 根据Resource中的配置和localStorage中的记录，共同判断首次打开网页时默认加载的图层 */
            getDefaultLayers: getDefaultLayers,
            /** 获取图层的数据存在信息 */
            getLayerTimeList: getLayerTimeList,
            /** 存储图层的数据存在信息 */
            setLayerTimeList: setLayerTimeList,
            /** 根据传入的layerModule查找并拼接一个最近有数据的时次的Url */
            getProjectUrl: getProjectUrl,
            /** 根据传入的列表 判断最上层layer 并返回 */
            getShotLayers: getShotLayers,
            /** 根据传入的列表 找到所有标记为显示状态的图层 */
            getPlayLayers: getPlayLayers,
            /** 根据传入的layerModuley以及时次 查找并返回满足条件的begintime */
            getExistTime: getExistTime,
            /** 根据project的layType在overlay或者baselay中添加或移除对应的图层 */
            setAddRemoveProjectFromBaseOverLayer: setAddRemoveProjectFromBaseOverLayer,
            /** yyyyMMdd or yyyyMMddhhmmss 转 moment */
            formatStr2Moment: formatStr2Moment,
            /** 按资源创建常用图层列表 */
            createFrequentlyUsedByResource: createFrequentlyUsedByResource,
            /** 为 getAllLayerModulesTimeline() 保存layerModuleList*/
            saveLayerModuleList: saveLayerModuleList,
            /** 获取所有 LayerModule 的时间轴*/
            getAllLayerModulesTimeline: getAllLayerModulesTimeline,
            /** 根据传入的图层获取播放列表 */
            getPlayList: getPlayList,
            /** 根据传入的 layerModule._id 获取调色板信息 */
            getProjectPalette: getProjectPalette,
            /** 存储图层的调色板信息 */
            setProjectPalette: setProjectPalette,
            /** 为ListMenu显示样式输出一个专用的module */
            getListMenuModule: getListMenuModule,
            /** 判断Url合法性 */
            isURL: isURL,
            /** 获取当前的动画列表 */
            getMulitPlayLayers: getMulitPlayLayers,
            /** 采用正则表达式获取地址栏参数 */
            getQueryString: getQueryString,
            /** 为动画添加左侧图层列表 */
            addLayersForAnima: addLayersForAnima,
            /* 从timeRange中获取时间，begin/end */
            getTimeFromRange: getTimeFromRange
        };

        return self;

        function getTimeFromRange(range, rangeBase) {
            if (!rangeBase || rangeBase === "Begin") {
                return range.begintime;
            } else {
                return range.endtime;
            }
        }

        /**
         * 为动画添加左侧图层列表
         * @param {String} animaParam GLL/????
         * @param {[LayerModule]} projectList
         * @param {[LayerModule]} baseLayers 
         */
        function addLayersForAnima(animaParam, projectList, baseLayers, overLayers) {
            baseLayers.splice(0, baseLayers.length);
            overLayers.splice(0, overLayers.length);
            var tmpList = [];
            projectList.forEach(project => {
                if (project.animeType && project.animeType.length) {
                    project.animeType.forEach(o => {
                        if (o === animaParam) {
                            if (project.layType === "BASELAYERS") {
                                baseLayers.push(project);
                            } else if (project.layType === "OVERLAYERS") {
                                overLayers.push(project);
                            }
                            tmpList.push(project);
                        }
                    });
                }
            });
            return tmpList;
        }

        function getQueryString(queryName) {
            var reg = new RegExp("(^|&)" + queryName + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                var param = decodeURI(r[2]);
                return param;
            } else {
                return null;
            }
        }

        function getListMenuModule(tabGroups) {
            /**
             * @typedef ListGroup
             * @prop {String} name
             * @prop {String} _id
             * @prop {[LayerModule]} layers
             * @prop {Number} selectedNum
             */
            let listMenuModule = [];
            let isListGroupExist = false;
            tabGroups.forEach(tabGroup => {
                tabGroup.allLayerGroups.forEach(layerGroup => {
                    for (var i = 0; i < listMenuModule.length; i++) {
                        if (listMenuModule[i]._id === layerGroup._id) {
                            isListGroupExist = true;
                            break;
                        }
                    }
                    if (!isListGroupExist) {
                        /**
                         * @type ListGroup
                         */
                        let listGroup = {
                            name: layerGroup.name,
                            _id: layerGroup._id,
                            layers: getLayerList(layerGroup.layers),
                            selectedNum: 0
                        };
                        listMenuModule.push(listGroup);

                    }
                });
            });
            return listMenuModule;
        }

        function getLayerList(layers) {
            let layerList = [];
            let isProjectExist = false;
            layers.forEach(layerGroup => {
                if (layerGroup.group && layerGroup.group.instGroups) {
                    layerGroup.group.instGroups.forEach(instGroup => {
                        if (instGroup.projects) {
                            instGroup.projects.forEach(project => {
                                for (var i = 0; i < layerList.length; i++) {
                                    if (layerList[i]._id === project._id) {
                                        isProjectExist = true;
                                        break;
                                    }
                                }
                                if (!isProjectExist) {
                                    //todo 这种方式只是暂时解决FDI 问题
                                    if (project.layerName !== "L1全员盘1") {
                                        layerList.push(project);
                                    }
                                }
                            });
                        }
                    });
                }
            });
            return layerList;
        }

        function setProjectPalette(_id, paletteModule) {
            if (!paletteModule) {
                return;
            }
            for (var i = 0; i < paletteList.length; i++) {
                if (paletteList[i]._id === _id) {
                    paletteList[i].module = paletteModule;
                    return paletteList[i];
                }
            }
            var o = {
                _id: _id,
                module: paletteModule
            };
            paletteList.push(o);
            return o;
        }

        function getProjectPalette(_id, callback) {
            setTimeout(function () {
                for (var i = 0; i < paletteList.length; i++) {
                    if (paletteList[i]._id === _id) {
                        return callback(paletteList[i].module);
                    }
                }
                return callback(undefined);
            }, 100);
        }

        function getAllLayerModulesTimeline() {
            if (!self.layerModuleList || self.layerModuleList.length < 1) {
                return;
            }
            self.layerModuleList.forEach(function (layerModule) {
                if (layerModule.dataListUrl && isURL(layerModule.dataListUrl)) {
                    APIServices.getDataExistList(layerModule.dataListUrl, function (data) {
                        setLayerTimeList(layerModule._id, layerModule.dataListUrl, data);
                    }, function (err) {

                    });
                }
            });
        }

        function saveLayerModuleList(layerModuleList) {
            self.layerModuleList = layerModuleList;
        }

        /**
         * 根据传入的tabGroups (就是self.tabGroups)生成一个frequentlyUsedByResource集合
         * @param {Array} tabGroups
         */
        function createFrequentlyUsedByResource(tabGroups) {
            var frequentlyUsedByResource = [];
            tabGroups.forEach(tabGroupItem => {
                tabGroupItem.allLayerGroups.forEach(layerGroupItem => {
                    layerGroupItem.layers.forEach(layerItem => {
                        var isExistLayer = false;
                        frequentlyUsedByResource.forEach(fubrItem => {
                            if (fubrItem.layerName === layerItem.layerName) {
                                isExistLayer = true;
                            }
                        });
                        if (!isExistLayer) {
                            layerItem.frequently = 0;
                            layerItem.tabGroup = layerGroupItem.type;
                            frequentlyUsedByResource.push(layerItem);
                        }
                    });
                });
            });
            return frequentlyUsedByResource;
        }

        /**
         * 根据传入的图层获取播放列表
         * @param {[layerModule]} layerList
         * @param {moment} startTime
         * @param {moment} endTime
         */
        function getPlayList(layerList, startTime, endTime) {
            var timeline;
            for (var layer in layerList) {
                timeline = getLayerTimeList(layer).timeline;
            }
        }

        /**
         * @description
         * multiFlg === true 时 返回所有满足条件的图层
         * multiFlg === false 时 返回首个满足条件的图层
         */
        function getPlayLayers(layerList, multiFlg) {
            var layers = [];
            for (var i = 0; i < layerList.length; i++) {
                if (layerList[i].isShow) {
                    if (multiFlg) {
                        layers.push(layerList[i]);
                    } else {
                        //单个图层模式                     
                        return layerList[i];
                    }
                }
            }
            return layers;
        }

        /**
         * 返回多动画列表的产品列表
         * 
         * @param {any} layerList  基础图层列表
         * @param {any} animateType  用于查找 列表的动画类型 会返回所有符合要求 动画图层 不对可视化进行判断
         * @returns 
         */
        function getMulitPlayLayers(layerList, animateType) {
            var layers = [];
            for (var i = 0; i < layerList.length; i++) {
                var layerItem = layerList[i];
                if (layerItem.isShow) {
                    var animationTypeList = layerItem.animeType;
                    // console.log(animationTypeList);
                    if (animationTypeList && animationTypeList.length > 0 && animationTypeList.join(",").indexOf(animateType) >= 0) {
                        layers.push(layerItem);
                    }
                }
            }
            return layers;
        }

        /**
         * @description addRemoveFlg === add； addRemoveFlg === remove;
         */
        function setAddRemoveProjectFromBaseOverLayer(overLayers, baseLayers, project, addRemoveFlg) {
            if (project.layType === 'BASELAYERS') {
                if (addRemoveFlg === "add") {
                    baseLayers.unshift(project);
                } else {
                    for (var i = 0; i < baseLayers.length; i++) {
                        if (project._id === baseLayers[i]._id) {
                            baseLayers.splice(i, 1);
                        }
                    }
                }
            } else {
                if (addRemoveFlg === "add") {
                    overLayers.unshift(project);
                } else {
                    for (var t = 0; t < overLayers.length; t++) {
                        if (project._id === overLayers[t]._id) {
                            overLayers.splice(t, 1);
                        }
                    }
                }
            }
        }

        /**
         * 判断依据:
         * 1.排序在最上面
         * 2.状态为显示
         * 3.图层在传入的时次有数据
         */
        function getShotLayers(Layers, time) {
            if (!Layers) {
                return null;
            }
            for (var layer in Layers) {
                if (layer.isShow === true) {
                    if (time && getExistTime(layer, time)) {
                        return layer;
                    } else if (!time) {
                        return layer;
                    }
                }
            }
            return null;
        }

        /**
         *
         * @param {String} _id layerModule的_id
         * @param {Moment} time
         * @param {Number} indexFlg -1=找到的时次的前一个时次 1=找到的时次的后一个时次
         * @param {String} timeRangeBase 标识需要返回的是开始时间还是结束时间(begin / end)
         */
        function getExistTime(_id, time, indexFlg, timeRangeBase) {
            if (!indexFlg) {
                indexFlg = 0;
            } else {
                indexFlg = Number(indexFlg);
            }
            var timeList = getLayerTimeList(_id).timeline;
            for (var i = 0; i < timeList.length; i++) {
                let range = timeList[i];
                var beginTime = formatStr2Moment(range.begintime);
                var endTime = formatStr2Moment(range.endtime);
                if (time.isSameOrAfter(beginTime) && time.isBefore(endTime)) {
                    if ((i === 0 && indexFlg === 1) || (i === timeList.length - 1 && indexFlg === -1)) {
                        if (!timeRangeBase || timeRangeBase === "Begin") {
                            return beginTime;
                        } else {
                            return endTime;
                        }
                    } else {
                        range = timeList[i - indexFlg];
                        beginTime = formatStr2Moment(range.begintime);
                        endTime = formatStr2Moment(range.endtime);
                        if (!timeRangeBase || timeRangeBase === "Begin") {
                            return beginTime;
                        } else {
                            return endTime;
                        }
                    }
                }
            }
            return null;
        }

        /**
         * 根据传入的时间 替换 layerModule中ProjectUrl的通配符
         * @param {*} layerModule
         * @param {String} time yyyyMMddhhmmss/yyyyMMdd
         */
        function getProjectUrl(layerModule, time) {
            var projectUrl = layerModule.projectUrl;
            if (!time) {
                return projectUrl;
            }
            time = formatStr2Moment(time);
            var yyyy = time.year().toString();
            var MM = (time.month() + 1).toString();
            MM = (MM.length < 2) ? "0" + MM : MM;
            var dd = time.date().toString();
            dd = (dd.length < 2) ? "0" + dd : dd;
            var HH = time.hour().toString();
            HH = (HH.length < 2) ? "0" + HH : HH;
            var mm = time.minute().toString();
            mm = (mm.length < 2) ? "0" + mm : mm;
            var ss = time.second().toString();
            ss = (ss.length < 2) ? "0" + ss : ss;
            var tmp = "";
            if (projectUrl.indexOf("yyyyMMddHHmmss") > -1) {
                projectUrl = projectUrl.replace("yyyyMMddHHmmss", yyyy + MM + dd + HH + mm + ss);
            } else if (projectUrl.indexOf("yyyyMMddHHmm") > -1) {
                projectUrl = projectUrl.replace("yyyyMMddHHmm", yyyy + MM + dd + HH + mm);
            } else if (projectUrl.indexOf("yyyyMMddHH") > -1) {
                projectUrl = projectUrl.replace("yyyyMMddHH", yyyy + MM + dd + HH);
            } else if (projectUrl.indexOf("yyyyMMdd") > -1) {
                projectUrl = projectUrl.replace("yyyyMMdd", yyyy + MM + dd);
            } else if (projectUrl.indexOf("yyyy_MM_dd_HH_mm_ss") > -1) {
                projectUrl = projectUrl.replace("yyyy_MM_dd_HH_mm_ss", yyyy + "_" + MM + "_" + dd + "_" + HH + "_" + mm + "_" + ss);
            } else if (projectUrl.indexOf("yyyy_MM_dd_HH_mm") > -1) {
                projectUrl = projectUrl.replace("yyyy_MM_dd_HH_mm", yyyy + "_" + MM + "_" + dd + "_" + HH + "_" + mm);
            } else if (projectUrl.indexOf("yyyy_MM_dd_HH") > -1) {
                projectUrl = projectUrl.replace("yyyy_MM_dd_HH", yyyy + "_" + MM + "_" + dd + "_" + HH);
            } else if (projectUrl.indexOf("yyyy_MM_dd") > -1) {
                projectUrl = projectUrl.replace("yyyy_MM_dd", yyyy + "_" + MM + "_" + dd);
            }
            return projectUrl;
        }

        /**
         * 添加或设置一个图层的时间轴
         * @param {String} _id layerModule的_id
         * @param {String} url layerModule的url
         * @param {[TimeRange]} timeline
         * @return {TimelineModule}
         */
        function setLayerTimeList(_id, url, timeline) {
            for (var i = 0; i < layerTimeList.length; i++) {
                if (layerTimeList[i]._id === _id) {
                    layerTimeList[i].timeline = timeline;
                    return layerTimeList[i];
                }
            }
            var o = {
                _id: _id,
                url: url,
                timeline: timeline
            };
            layerTimeList.push(o);
            return o;
        }

        /**
         * 获取图层对应的时间轴
         * @param {String} _id layerModule的_id
         * @return {TimelineModule} 时间轴对象
         */
        function getLayerTimeList(_id) {
            for (var i = 0; i < layerTimeList.length; i++) {
                if (layerTimeList[i]._id === _id) {
                    return layerTimeList[i];
                }
            }
            return undefined;
        }

        /**
         * 初始化默认图层
         */
        function getDefaultLayers(layerList) {
            /**
             * 优先寻找本地存储中的图层加载
             * 本地没有则添加数据源配置中的图层
             * 根据本地存储的图层对象 在projectList中寻找对应的图层，将属性 isDefault 置为 true;其他的置为false;
             * 
             * 2017/12/29 范霖
             * 根据上级精神
             * BASELAYERS 只能有一个 因此需要在这里做点判断限制一下
             * 当然 首先是要保证首次使用时不会因为本地没有默认图层导致使用数据库默认时 出现多个BASELAYERS默认的情况
             * 其次 由于部分用户非首次使用 在本地已经记录了默认图层 因此要保证这些默认图层不会出现多个BASELAYERS
             */
            var baseLayerNum = 0;
            var defaultLayers = JSON.parse(localStorage.getItem("defaultLayers"));
            if (defaultLayers) {
                for (var i = 0; i < layerList.length; i++) {
                    layerList[i].isDefault = false;
                    for (var j = 0; j < defaultLayers.length; j++) {
                        if (layerList[i]._id === defaultLayers[j]._id) {
                            if (layerList[i].layType === "BASELAYERS" && baseLayerNum > 0) {
                                continue;
                            } else if (layerList[i].layType === "BASELAYERS" && baseLayerNum === 0) {
                                layerList[i].isDefault = true;
                                baseLayerNum++;
                            } else if (layerList[i].layType === "OVERLAYERS") {
                                layerList[i].isDefault = true;
                            }
                        }
                    }
                }
            } else {

            }
            return layerList;
        }

        function formatStr2Moment(timeStr) {
            if (timeStr.length === 8) {
                return moment.utc(timeStr.substr(0, 4) + "-" + timeStr.substr(4, 2) + "-" + timeStr.substr(6, 2));
            } else {
                return moment.utc(timeStr.substr(0, 4) + "-" + timeStr.substr(4, 2) + "-" + timeStr.substr(6, 2) + " " +
                    timeStr.substr(8, 2) + ":" + timeStr.substr(10, 2) + ":" + timeStr.substr(12, 2));
            }
        }

        function isURL(str_url) {
            // 验证url
            // "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" // ftp的user@         
            // "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184          
            // "|" // 允许IP和DOMAIN（域名）        
            // "([0-9a-z_!~*'()-]+\.)*" // 域名- www.      
            // "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名         
            // "[a-z]{2,6})" // first level domain- .com or .museum          
            // "(:[0-9]{1,4})?" // 端口- :80         
            // "((/?)|" // a slash isn't required if there is no file name           
            // "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
            var strRegex = "^((https|http|ftp|rtsp|mms)?://)" +
                "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" +
                "(([0-9]{1,3}\.){3}[0-9]{1,3}" +
                "|" +
                "([0-9a-z_!~*'()-]+\.)*" +
                "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." +
                "[a-z]{2,6})" +
                "(:[0-9]{1,4})?" +
                "((/?)|" +
                "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
            var re = new RegExp(strRegex);
            return re.test(str_url);
        }

    }



})();

/**
 * @typedef TimelineModule
 * @prop {String} _id timeline 所对应的layerModule的唯一标识
 * @prop {String} url layerModule的dataListUrl
 * @prop {[TimeRange]} timeline begintime,endtime组成的时间范围数组。
 */

/**
 * @typedef TimeRange
 * @prop {String} begintime
 * @prop {String} endtime
 */

/**
 * @typedef PaletteObj
 * @prop {String} _id
 * @prop {PaletteModule} module
 */