(function () {
    "use strict";

    angular.module("SatelliteView").controller("SVController", SVController);

    SVController.$inject = ["APIServices", "CtrlServices", "$cookies"];
    /**
     *
     *
     * @param {any} APIServices
     * @param {any} CtrlServices
     * @param {any} $cookies
     */
    function SVController(APIServices, CtrlServices, $cookies) {

        const BASEINDEXFORBASE = 100; // 基础图层的基准z-index
        const BASEINDEXFOROVER = 30000; // 产品图层的基准z-index
        var self = this;
        var projectsForTimeline = []; // 为定时获取数据时间轴保存所有的layerModule
        var timelineUI = document.getElementById("timeline");
        var layerMenu = angular.element(document.getElementById("layerMenu"));
        var timeLineElm = angular.element(document.getElementById("timeLine"));
        var timeRangeBase = undefined;
        var resourceName = undefined;
        /** 动画用时钟 */
        var animeTimer = null;
        /** 获取数据时间轴用时钟 */
        var timelineTimer = null;
        /** 记录当前显示时次 为前一帧后一帧计算时使用 */
        var currentTime = moment(new Date());
        /** 记录当前map1中显示的所有geometry */
        var geometryList = [];
        self.currentTab = "Layer";
        self.overLayers = [];
        self.baseLayers = [];
        self.title = "ShinetekView";
        /**标记菜单是否折叠 0 显示 1 隐藏 2动画模式 20170517*/
        self.isMenuCollapse = 0;
        /*top tab group list*/
        self.tabGroups = [];
        /** 记录当前tabGroup标签对象 */
        self.currentTabGroup = {};
        /*模态框中的 常用图层列表*/
        self.frequentlyLayers = [];
        self.animation = {};
        /*模态框中的 数据排列形式  Collapse  Tile*/
        self.layerMenuType = "Tile";
        /*模态框 面包屑导航条 当前产品组*/
        self.currentGroup = {};
        self.currentLayer = {};
        self.currentInst = {};
        /** 是否显示动画播放按钮 */
        self.isShowVedioPlayBtn = true;
        /** 是否显示3D/2D切换按钮 */
        self.isShow3DSwitchBtn = true;
        /** 是否显示截屏按钮 */
        self.isShowScreenShotsBtn = true;
        /** 是否显示投影切换按钮 */
        self.isShowProjectionSwitchBtn = true;
        /** 是否显示资源切换按钮 */
        self.isShowResourceSwitchBtn = true;
        /** 是否显示帮助按钮 */
        self.isShowHelpBtn = true;
        /*是否显示video面板*/
        self.isShownVideoPanel = false;
        /*video帧频*/
        self.fpsNum = 4;
        /*video play 标识: -1 stop; 0 pause; 1 play*/
        self.isVideoPlayed = -1;
        /*video 循环 标识*/
        self.isLooped = true;
        /*video latest24 标识*/
        self.isLatest24 = false;
        /*首个标记为显示的图层*/
        self.topsideLayer = null;
        /** 所有标记为显示的图层 */
        self.sideLayers = [];
        /** 临时记录获取到的 m_timeLineList */
        self.tmpTimeLineList = [];
        self.listMenuModule = [];

        /** 资源地址 */
        self.resource = undefined;
        /** 定义好的资源列表 */
        self.resourceList = [];
        /*功能标签选择*/
        self.selectTab = _selectTab;
        self.selectTab_LayerMenuModal = _selectTab_LayerMenuModal;
        /*判断是否选中某个功能标签*/
        self.isSelectedTab = _isSelectedTab;
        self.isSelectedTab_LayerMenuModal = _isSelectedTab_LayerMenuModal;
        /*折叠菜单栏*/
        self.collapseMenu = _collapseMenu;
        self.extendMenu = _extendMenu;
        self.extendMenuByAnima = extendMenuByAnima;
        /*数据初始化*/
        self.init = init;
        /*点击图层的眼睛 控制是否显示该图层*/
        self.eyeClick = _eyeClick;
        /*点击打开Layer选择菜单*/
        self.showLayerMenu = _showLayerMenu;
        /*在模态框中选择了一个图层项*/
        self.selectLayerItem = _selectLayerItem;
        /*在layer之下选则仪器*/
        self.selectInstonAboveLayer = _selectInstonAboveLayer;
        self.isInstSelected = _isInstSelected;
        /*添加产品到图层 （或者移除产品到图层）*/
        self.addThisProject = addThisProject;
        /** 从 layerList 移除 layer 对象 */
        self.removeThisLayer = removeThisLayer;
        /*打开video面板*/
        self.showVideoPanel = _showVideoPanel;

        self.swicthMenuType = swicthMenuType;

        /*控制鼠标滑过显示*/
        self.isEnterSelectArea = isEnterSelectArea;
        /*控制鼠标移出隐藏*/
        self.isLeaveSelectArea = isLeaveSelectArea;
        /*控制选择区域当前状态*/
        self.isShowSelectArea = false ;
        /*点击图标选择框选模式*/
        self.selectAreaType = selectAreaType;

        /** 打开截图pannel */
        self.showScreenShots = _showScreenShots;
        /** 打开资源切换窗口 */
        self.showResourceSwitch = showResourceSwitch;
        self.switchResource = switchResource;
        self.delResource2Config = delResource2Config;
        self.addResource2Config = addResource2Config;
        self.resourceName = "";
        self.resourceUrl = "";
        /**打开提示窗口*/
        self.showPromptSwitch = showPromptSwitch;
        /**打开帮助窗口*/
        self.showHelpSwitch = showHelpSwitch;
        /**打开关于窗口*/
        self.showAboutSwitch = showAboutSwitch;
        /**关闭关于窗口*/
        self.closeAboutSwitch = closeAboutSwitch;
        /**newMenu的折叠隐藏*/
        self.showMenuSwitch = showMenuSwitch;
        /**newMenu一级菜单的折叠隐藏*/
        self.showMenuFirstSwitch = showMenuFirstSwitch;
        /*等待框显示*/
        self.isWaitingShow = false;
        /* 当前是否 3D模式*/
        self.isShown3D = false;
        /*用于显示当前动画状态*/
        self.showAnimeTitle = "";
        /** 控制资源切换窗口是否显示的标识 */
        self.isShowResourceModal = false;
        /**控制提示窗口是否显示*/
        self.isShowPromptModal = false;
        /**控制帮助是否显示*/
        self.isShowHelpModal = false;
        /**控制关于窗口是否显示*/
        self.isShowMapAbout = false;
        /* 动画类型 */
        self.animationTypes = [];

        /**控制菜单栏是否显示*/
        self.isShowMenuModal = false;

        self.is3Dinit = false;
        self.switch3D = _switch3D;

        self.projectName = "";
        self.projectTime = "";

        // 关闭事件 调用刷新cookies
        window.onbeforeunload = function (e) {
            e = e || window.event;
            // 刷新图层localStorage
            _saveDefaultLayers();
            _saveDefaultResource();
            return;
        };

        init();

        /** 时间轴控件发生日期改变时 重新加载所有图层 */
        $(timelineUI).on("DateTimeChange", function (event, selectDate) {
            /* 动画开始后 任何时间轴控件的事件均不响应 */
            if (self.isVideoPlayed !== -1) {
                return;
            }
            currentTime = selectDate;
            reloadLayersOnTimeLineChanged(selectDate);
        });
        /** 时间轴控件触发前后帧事件时 */
        $(timelineUI).on("FrameChange", function (event, flg) {
            reloadLayersOnTimeLineChanged(currentTime, flg);
        });

        /** openlayers 图层层级改变时触发 */
        var orgZoomNum = 4;
        $("#map").on("resolutionChange", function (event, nowZoomNum) {
            if (orgZoomNum === nowZoomNum) {
                return;
            }
            orgZoomNum = nowZoomNum;
            setLayersLevelWaring(nowZoomNum);
        });

        /**
         * 拖拽指令函数
         */
        self.sortableOptions = {
            // 完成拖拽动作
            stop: function (e, ui) {
                // 触发openlayer控件的刷新
                _refreshLayers();
                var animaParam = CtrlServices.getQueryString("animation");
                if (!animaParam) {
                    refreshTimeline();
                }
            }
        };

        function swicthMenuType() {
            self.isListMenu = !self.isListMenu;
        }

        /** 
         * 为 ListMenu 计算被选中产品的个数
         */
        function countSelectedLayerNum() {
            self.listMenuModule.forEach(listGroup => {
                listGroup.selectedNum = 0;
                listGroup.layers.forEach(layer => {
                    if (layer.isSelected) {
                        listGroup.selectedNum++;
                    }
                });
            });
        }

        function delResource2Config(name) {
            APIServices.delResource(name, function () {
                for (var i = 0; i < self.resourceList.length; i++) {
                    var o = self.resourceList[i];
                    if (o.name === name) {
                        self.resourceList.splice(i, 1);
                    }
                }
            }, function () {

            });
        }

        function addResource2Config(name, url) {
            for (var i = 0; i < self.resourceList.length; i++) {
                var resource = self.resourceList[i];
                if (resource.url === url) {
                    alert("与" + resource.name + "同地址!");
                    return;
                }
            }
            var o = {
                "name": name,
                "url": url
            }
            APIServices.insertResource(o, function () {
                self.resourceList.push(o);
                self.resourceName = "";
                self.resourceUrl = "";
            }, function () {
                alert("数据源添加失败!");
                self.resourceName = "";
                self.resourceUrl = "";
            });
        }

        function setLayersLevelWaring(levleNum) {
            self.overLayers.forEach(function (overLayer) {
                if (overLayer.layerRange) {
                    if (overLayer.layerRange.indexOf(String(levleNum)) < 0) {
                        // overLayer.levelWarning = true;
                        $("#levelWaring" + overLayer._id).show();
                    } else {
                        $("#levelWaring" + overLayer._id).hide();
                    }
                }
            });
            self.baseLayers.forEach(function (baseLayer) {
                if (baseLayer.layerRange) {
                    if (baseLayer.layerRange.indexOf(String(levleNum)) < 0) {
                        $("#levelWaring" + baseLayer._id).show();
                    } else {
                        $("#levelWaring" + baseLayer._id).hide();
                    }
                }
            });
        }

        function showResourceSwitch() {
            self.isShowResourceModal = !self.isShowResourceModal;
        }

        /**
         * 显示video面板
         */
        function _showVideoPanel() {
            self.isShownVideoPanel = !self.isShownVideoPanel;
        }

        function switchResource(resource) {
            if (resource.isSelected) {
                return;
            }
            self.resource = resource;
            for (var i = 0; i < self.resourceList.length; i++) {
                var o = self.resourceList[i];
                if (o.name === self.resource.name && o.url === self.resource.url) {
                    o.isSelected = true;
                } else {
                    o.isSelected = false;
                }
            }
            location.reload();
        }

        /**
         * 移除当前显示的所有图层
         * 
         */
        function removeLayersAll() {
            self.overLayers.forEach(function (item) {
                removeLayFromWMS(item, true);
            });
            self.baseLayers.forEach(function (item) {
                removeLayFromWMS(item, true);
            });
        }

        function showResourceSwitch() {
            self.isShowResourceModal = !self.isShowResourceModal;
        }

        function showPromptSwitch() {
            self.isShowPromptModal = !self.isShowPromptModal;
        }

        function showMenuSwitch() {
            if (self.isMenuCollapse !== 2) {
                newMenu.menuTitleScaling(self.isShowMenuModal);
                self.isShowMenuModal = !self.isShowMenuModal;
            } else {
                self.isShowMenuModal = true;
                newMenu.menuTitleScaling(self.isShowMenuModal);
                self.isShowMenuModal = !self.isShowMenuModal;
            }

        }

        function showMenuFirstSwitch() {
            newMenu.menuFirstScaling();
        }

        function showHelpSwitch() {
            //控制help.js中的显示隐藏         
            helpBox.displayHelp();
        }
        
        function showAboutSwitch() {
            self.isShowMapAbout = !self.isShowMapAbout;
        }

        function closeAboutSwitch(){
            self.isShowMapAbout = false;
        }

        /**
         * 显示截图面板 并向
         * 这个函数要大改， 传入一个函数 能够在被截图控件调用时提供截图参数
         * 目前这个函数是在首次打开截图控件时一次性提供截图参数
         * @private
         */
        function _showScreenShots() {
            self.topsideLayer = CtrlServices.getPlayLayers(self.baseLayers);
            if (self.topsideLayer != null) {
                // 获取当前最高图层信息
                var m_ShptAPI = "";
                if (self.topsideLayer.screenshotUrl) {
                    m_ShptAPI = self.topsideLayer.screenshotUrl;
                } else { }
                var m_ShotParam = self.topsideLayer.screenshotparam;
                // 获取当前选择时间
                var m_TimeNow = moment(timeLine.options.moment_select).utc();
                // 年月日替换
                if (m_ShptAPI.indexOf("yyyy") > 0) {
                    m_ShptAPI = m_ShptAPI.replace("yyyy", m_TimeNow.format("YYYY"));
                }
                if (m_ShptAPI.indexOf("MM") > 0) {
                    m_ShptAPI = m_ShptAPI.replace("MM", m_TimeNow.format("MM"));
                }
                if (m_ShptAPI.indexOf("dd") > 0) {
                    m_ShptAPI = m_ShptAPI.replace("dd", m_TimeNow.format("DD"));
                }
                if (m_ShptAPI.indexOf("HH") > 0) {
                    m_ShptAPI = m_ShptAPI.replace("HH", m_TimeNow.format("HH"));
                }
                if (m_ShptAPI.indexOf("mm") > 0) {
                    m_ShptAPI = m_ShptAPI.replace("mm", m_TimeNow.format("mm"));
                }
                // 向init传递参数
                screenshots.init(m_ShptAPI, m_ShotParam);
            } else {
                screenshots.init("", "");
            }
        }

        /*3D 切换函数*/
        function _switch3D() {
            console.log("_switch3D");
            if (self.isShown3D === false) {
                // 当前为2D 显示 切换显示3D
                // _clearLayers()
                self.isShown3D = true;
                //   document.getElementsByClassName("glyphicon-mapType")[0].innerText = "2D";
                ShinetekView.SatelliteView.setMapFun("3D");
                // 若未进行初始化 则 初始化
                if (!self.is3Dinit) {
                    ShinetekView.SatelliteView.init("");
                    // 将初始化 标志位
                    self.is3Dinit = true;
                    //  _refreshLayers();
                    //ShinetekView.SatelliteView.addLayer("111", "测试3D", "http://10.24.10.95/IMAGEL2/test/tianditu/20180415/", "false", "TMS");
                    //ShinetekView.SatelliteView.addLayer("111", "测试3D", "./json/ne_10m_us_states.topojson", "false", "GEOJSON");
                } else {
                    // 若已经初始化 则移除当前所有显示图层 并重新刷新加载
                    ShinetekView.SatelliteView.removeAllLayer();
                    //  _refreshLayers();
                }
            }
            else {
                self.isShown3D = false;
                document.getElementsByClassName("glyphicon-mapType")[0].innerText = "3D";
                ShinetekView.SatelliteView.setMapFun("2D");
                _refreshLayers();
            }

            //  ShinetekView.Ol3Opt.init("http://10.24.10.108/IMAGEL2/GBAL/")
        }

        /* 切换时 删除所有当前图层*/
        function _clearLayers() {
            self.overLayers.forEach(function (layModule) {
                removeLayFromWMS(layModule, true);
            });
            self.overLayers = [];
            self.baseLayers.forEach(function (layModule) {
                removeLayFromWMS(layModule, true);
            });
            self.baseLayers = [];
        }

        /**
         * 重排序所有已添加的图层
         * @private
         */
        function _refreshLayers() {
            var tmpList = [];
            // 记住一条 图层列表 先进后出 才能保证 后加的在先加的之上；
            self.overLayers.forEach(function (layModule) {
                tmpList.unshift(layModule);
            });
            self.baseLayers.forEach(function (layModule) {
                tmpList.unshift(layModule);
            });
            var animaParam = CtrlServices.getQueryString("animation");
            if (!animaParam) {
                for (var i = 0; i < tmpList.length; i++) {
                    var layadd = 30 + i;
                    try {
                        ShinetekView.SatelliteView.setZIndex(tmpList[i]._id, layadd);
                    } catch (err) { }
                }
            }
        }

        function reloadLayersOnTimeLineChanged(selectDate, flg) {
            var tmpList = [];
            // 记住一条 图层列表 先进后出 才能保证 后加的在先加的之上；
            self.baseLayers.forEach(function (layModule) {
                tmpList.push(layModule);
            });
            //20180124 针对火点 的基础图层 也进行添加 liuyp
            self.overLayers.forEach(function (layModule) {
                //针对数据存在列表进行判断 ,若数据存在API未配置，则不进行删除添加
                if (layModule.dataListUrl != "") {
                    tmpList.push(layModule);
                }
            });
            for (var i = 0; i < tmpList.length; i++) {
                removeLayFromWMS(tmpList[i], false);
            }
            var layerModules = CtrlServices.getPlayLayers(tmpList, true);
            if (layerModules) {
                for (var i = 0; i < layerModules.length; i++) {
                    var time = CtrlServices.getExistTime(
                        layerModules[i]._id,
                        selectDate,
                        flg,
                        layerModules[i].rangeBase
                    );
                    if (time) {
                        currentTime = time;
                        addLayerToWMSByAsyncList(tmpList, time);
                        break;
                    }
                }
            }
        }

        /**
         * 根据当前baseLays 重新设置顺序
         * @private
         */
        function refreshTimeline() {
            var newListOrder = [];
            self.baseLayers.forEach(function (layerModule) {
                newListOrder.push(layerModule._id);
            });
            timeLine.setDataInfoListOrder(newListOrder);
        }

        function _saveDefaultResource() {
            localStorage.removeItem("defaultResource");
            localStorage.setItem("defaultResource", JSON.stringify(self.resource));
        }

        /**
         * 保存默认图层信息至localstorage 关闭网页时调用
         */
        function _saveDefaultLayers() {
            localStorage.removeItem("defaultLayers");
            var tmpLayers = [];
            for (var i = 0; i < self.overLayers.length; i++) {
                tmpLayers.push(self.overLayers[i]);
            }
            for (var i = 0; i < self.baseLayers.length; i++) {
                tmpLayers.push(self.baseLayers[i]);
            }
            localStorage.setItem("defaultLayers", JSON.stringify(tmpLayers));
        }

        function addThisProject(project) {
            /** 
             * 2017/12/29 范霖
             * 根据上级精神 
             * 如果添加的project为BASELAYERS 则将已添加的baseLayer替换为此project对应的layerModule
             * 如果添加的project为OVERLAYERS 则逻辑不变
             */
            project.isSelected = !project.isSelected;
            if (project.isSelected === true) {
                if (project.layType === "BASELAYERS") {
                    self.baseLayers.forEach(function (baseLayer) {
                        removeThisLayer(baseLayer);
                    });
                }
                project.isShow = true;
                CtrlServices.setAddRemoveProjectFromBaseOverLayer(
                    self.overLayers,
                    self.baseLayers,
                    project,
                    "add"
                );
                addLayerToWMS(project, currentTime);
            } else {
                CtrlServices.setAddRemoveProjectFromBaseOverLayer(
                    self.overLayers,
                    self.baseLayers,
                    project,
                    "remove"
                );
                removeLayFromWMS(project, true);
            }
            self.listMenuModule.forEach(listGroup => {

            });
        }

        function _selectInstonAboveLayer(inst) {
            self.currentInst = inst;
            self.currentProjectList = inst.projects;
        }

        function _isInstSelected(instName) {
            return self.currentInst === undefined ?
                false :
                self.currentInst.instName === instName;
        }

        function _selectLayerItem(layer, group) {
            self.layerMenuType = "Collapse";
            self.currentGroup = group;
            self.currentLayer = layer;
            // 默认第一个仪器被选中
            self.currentInst =
                layer.group === undefined || layer.group.instGroups.length < 1 ?
                    undefined :
                    layer.group.instGroups[0];
            // 每次点击 都要在$cookies.frequentlyUsed 中增加依次计数
            _frequentlyCount(layer);
        }

        function _frequentlyCount(layer) {
            var frequentlyUsedAll = JSON.parse(
                localStorage.getItem("frequently-used-all")
            );
            var frequentlyUsedByResource = frequentlyUsedAll[self.resource.url];
            frequentlyUsedByResource.forEach(fubrItem => {
                if (
                    fubrItem.layerName === layer.layerName &&
                    fubrItem.tabGroup === self.currentTabGroup.type
                ) {
                    fubrItem.frequently++;
                }
            });
            localStorage.removeItem("frequently-used-all");
            localStorage.setItem(
                "frequently-used-all",
                JSON.stringify(frequentlyUsedAll)
            );
        }

        /**
         * 初始化图层列表
         * @param cb
         * @private
         */
        function layerMenuInit(url, projectType, cb) {
            APIServices.getLayerModal(url, projectType, function (data) {
                self.tabGroups.splice(0, self.tabGroups.length);
                var projectList = [];
                data.forEach(tabItem => {
                    /** 增加 frequentlyLayers 属性*/
                    tabItem.frequentlyLayers = [];
                    self.tabGroups.push(tabItem);
                    tabItem.allLayerGroups.forEach(layerGroupItem => {
                        /** 替换缺省图片路径 */
                        /** TODO: 这个环节应该在html端增加 */
                        if (layerGroupItem.pictureUrl === "") {
                            item.pictureUrl = "publics/Black.png";
                        }
                        layerGroupItem.layers.forEach(layer => {
                            if (layer.group) {
                                layer.group.instGroups.forEach(instG => {
                                    instG.projects.forEach(project => {
                                        /** 为每个产品对象增加一个 [z-index] 属性 */
                                        /** 为每一个产品对象增加 [isSelected]属性 */
                                        /** 为每一个产品对象增加 [isShow]属性 */
                                        project.isShow = true;
                                        project.isSelected = false;
                                        project.zIndex = 0;
                                        projectList.push(project);
                                    });
                                });
                            }
                        });
                    });
                });
                /** 设置 currentTab */
                if (self.tabGroups && self.tabGroups.length > 0) {
                    self.currentTabGroup = self.tabGroups[0];
                }
                /** 初始化FrequentlyLayers */
                freqLayersInit();
                cb(null, projectList, self.tabGroups);
            },
                function (err) {
                    cb(new Error("图层数据获取失败"), null);
                }
            );
        }

        /**
         * 为listMenu风格的图层列表初始化module
         * @param {[layerModule]} projectList 
         */
        function listMenuInit(tabGroups) {
            var tmpList = CtrlServices.getListMenuModule(tabGroups);
            if (!self.listMenuModule) {
                self.listMenuModule = [];
            }
            self.listMenuModule.splice(0, self.listMenuModule.length);
            tmpList.forEach(item => {
                self.listMenuModule.push(item);
            });
        }

        /**
         * 根据传入的图层列表 初始化map控件
         * @param lays (self.baseLayers + self.overLayers)
         * @private
         */
        function baseMapInit() {
            // 根据配置初始化底图
            ShinetekView.SatelliteView.init();
        }

        /**
         * 初始化常用图层列表
         */
        function freqLayersInit() {
            var frequentlyUsedAll = JSON.parse(
                localStorage.getItem("frequently-used-all")
            );
            if (!frequentlyUsedAll) {
                // 如果不存在 创建一个
                frequentlyUsedAll = {};
                var frequentlyUsedByResource = CtrlServices.createFrequentlyUsedByResource(self.tabGroups);
                frequentlyUsedAll[self.resource.url] = frequentlyUsedByResource;
                localStorage.setItem(
                    "frequently-used-all",
                    JSON.stringify(frequentlyUsedAll)
                );
            } else {
                if (!frequentlyUsedAll[self.resource.url]) {
                    // 如果不存在 创建一个
                    frequentlyUsedAll[self.resource.url] = CtrlServices.createFrequentlyUsedByResource(self.tabGroups);
                    localStorage.removeItem("frequently-used-all");
                    localStorage.setItem("frequently-used-all", JSON.stringify(frequentlyUsedAll));
                } else {
                    self.tabGroups.forEach(tabGroupItem => {
                        var tmp = [];
                        frequentlyUsedAll[self.resource.url].forEach(layerItem => {
                            if (layerItem.tabGroup === tabGroupItem.type) {
                                tmp.push(layerItem);
                            }
                        });
                        tmp.sort(function (a, b) {
                            return -(a.frequently - b.frequently);
                        });
                        tabGroupItem.frequentlyLayers.splice(0, tabGroupItem.frequentlyLayers.length);
                        var maxLength = tmp.length > 5 ? 5 : tmp.length;
                        for (var k = 0; k < maxLength; k++) {
                            if (tmp[k].frequently != 0) {
                                tabGroupItem.frequentlyLayers.push(tmp[k]);
                            }
                        }
                    });
                }
            }
        }

        function removeThisLayer(project) {
            CtrlServices.setAddRemoveProjectFromBaseOverLayer(
                self.overLayers,
                self.baseLayers,
                project,
                "remove"
            );
            removeLayFromWMS(project, true);
            timeLine.removeDataInfo(project._id);
            project.isSelected = false;
        }

        /**
         * 控制滑动显示隐藏选择区域
         */
        function isEnterSelectArea(){
            self.isShowSelectArea = true;
        }
        function isLeaveSelectArea(){
            self.isShowSelectArea = false;
        }

        /**
         *选择区域类型 点击
         */
        function selectAreaType($event){
            var selectAreaType = $event.target.id.split("selectArea_")[1];
            if(selectAreaType !== "None" && selectAreaType !== "DeletePolygon"){
                ShinetekView.OpenlayerOpt.removeInteractions("map");
                ShinetekView.OpenlayerOpt.addInteractions(selectAreaType,"map");
            }
            else if (selectAreaType == "DeletePolygon"){
                ShinetekView.OpenlayerOpt.removeAllVectorLayer();
                ShinetekView.OpenlayerOpt.removeInteractions("map");
            }
            else {
                //console.log(typeSelect.value);
                ShinetekView.OpenlayerOpt.removeInteractions("map");
            }
            geometryList = ShinetekView.AnalysisAry;
            console.log(geometryList);
        }

        /**
         * 点击显示图层选择模态框
         */
        function _showLayerMenu() {
            layerMenu.modal({
                backdrop: "static",
                keyboard: false
            });
        }

        /**
         * 点击加载或隐藏图层
         * @param layModule
         * @private
         */
        function _eyeClick(layModule) {
            layModule.isShow = !layModule.isShow;
            try {
                setVisibilityFromWMS(layModule._id, layModule.mapType, layModule.isShow);
                timeLine.setDataInfoVislbility(layModule._id, layModule.isShow);
            } catch (err) { }
        }

        /**
         * @description 往控件中添加图层
         * GEOLAYERS - 地理图层
         * OVERLAYERS - 可覆盖图层
         * BASELAYERS - 基础图层（一般产品图层）
         * @param layerModule
         * @param {moment} time 所选的时间（timeline控件在onChanged事件中传出的moment对象)
         * @private
         */
        function addLayerToWMS(layerModule, time, callback) {
            var projectUrl = "";
            var setTime = undefined;
            if (!callback || typeof callback !== "function") {
                callback = function () { };
            }
            if (layerModule.dataListUrl.indexOf("http://") < 0) {
                projectUrl = CtrlServices.getProjectUrl(layerModule);
                ShinetekView.SatelliteView.addLayer(
                    layerModule._id,
                    layerModule.layerName,
                    projectUrl,
                    "false",
                    layerModule.mapType
                );
                setTimeout(function () {
                    if (layerModule.layerRange.indexOf(String(orgZoomNum)) < 0) {
                        $("#levelWaring" + layerModule._id).show();
                    } else {
                        $("#levelWaring" + layerModule._id).hide();
                    }
                }, 100);
                var layadd = 30000;
                if (ShinetekView.SatelliteView.getZIndex(layerModule._id)) {
                    layadd = ShinetekView.SatelliteView.getZIndex(layerModule._id) + 30000;
                }
                ShinetekView.SatelliteView.setZIndex(layerModule._id, layadd);
                // getProjectPalette(layerModule)
                countSelectedLayerNum();
                callback();
            } else {
                /**
                 * 获取数据存在列表
                 * 如果数据存在列表中已有此layModule的对象 则不在重新获取数据
                 * 理论上 time !== undefined  CtrlServices.getLayerTimeList(layModule) 一定为真
                 */
                var latestTime = undefined;
                if (CtrlServices.getLayerTimeList(layerModule._id)) {
                    var timeList = CtrlServices.getLayerTimeList(layerModule._id).timeline;
                    if (timeList && timeList.length > 0) {
                        latestTime = CtrlServices.getTimeFromRange(timeList[0], layerModule.rangeBase);
                    }
                    if (time) {
                        projectUrl = CtrlServices.getProjectUrl(layerModule, time.format("YYYYMMDDHHmmss"));
                        currentTime = time;
                    } else {
                        projectUrl = CtrlServices.getProjectUrl(layerModule, latestTime);
                        currentTime = CtrlServices.formatStr2Moment(latestTime);
                    }
                    if (projectUrl) {
                        /** 不使用angular的绑定 是因为绑定了不刷新 挺奇怪的 临时用 JQuery凑合下 */
                        $("#projectTime_ListMenu").html(currentTime.format("YYYY-MM-DD HH:mm"));
                        if (layerModule.layType === "BASELAYERS") {
                            self.projectName = layerModule.projectName;
                        }
                        ShinetekView.SatelliteView.addLayer(
                            layerModule._id,
                            layerModule.layerName,
                            projectUrl,
                            "false",
                            layerModule.mapType
                        );
                        setTimeout(function () {
                            if (layerModule.layerRange.indexOf(String(orgZoomNum)) < 0) {
                                $("#levelWaring" + layerModule._id).show();
                            } else {
                                $("#levelWaring" + layerModule._id).hide();
                            }
                        }, 100);
                        setVisibilityFromWMS(
                            layerModule._id,
                            layerModule.mapType,
                            layerModule.isShow
                        );
                        _refreshLayers();
                        getProjectPalette(layerModule);
                        timeLine.addDataInfo([{
                            name: layerModule._id,
                            datainfolist: timeList
                        }]);
                        timeLine.setSelectMoment(currentTime);
                        countSelectedLayerNum();
                    }
                    callback();
                } else {
                    // TODO: 获取数据存在信息
                    APIServices.getDataExistList(
                        layerModule.dataListUrl,
                        function (data) {
                            CtrlServices.setLayerTimeList(layerModule._id, layerModule.dataListUrl, data);
                            if (data && data.length > 0) {
                                latestTime = CtrlServices.getTimeFromRange(data[0], layerModule.rangeBase);
                            } else {
                                return;
                            }
                            if (time) {
                                projectUrl = CtrlServices.getProjectUrl(layerModule, time.format("YYYYMMDDHHmmss"));
                                currentTime = time;
                            } else {
                                projectUrl = CtrlServices.getProjectUrl(layerModule, latestTime);
                                currentTime = CtrlServices.formatStr2Moment(latestTime);
                            }
                            /** 不使用angular的绑定 是因为绑定了不刷新 挺奇怪的 临时用 JQuery凑合下 */
                            $("#projectTime_ListMenu").html(currentTime.format("YYYY-MM-DD HH:mm"));
                            if (layerModule.layType === "BASELAYERS") {
                                self.projectName = layerModule.projectName;
                            }
                            ShinetekView.SatelliteView.addLayer(
                                layerModule._id,
                                layerModule.layerName,
                                projectUrl,
                                "false",
                                layerModule.mapType
                            );
                            setTimeout(function () {
                                if (layerModule.layerRange.indexOf(String(orgZoomNum)) < 0) {
                                    $("#levelWaring" + layerModule._id).show();
                                } else {
                                    $("#levelWaring" + layerModule._id).hide();
                                }
                            }, 100);
                            setVisibilityFromWMS(
                                layerModule._id,
                                layerModule.mapType,
                                layerModule.isShow
                            );
                            _refreshLayers();
                            getProjectPalette(layerModule);
                            timeLine.addDataInfo([{
                                name: layerModule._id,
                                index: 0,
                                datainfolist: CtrlServices.getLayerTimeList(layerModule._id).timeline
                            }]);
                            timeLine.setSelectMoment(currentTime);
                            countSelectedLayerNum();
                            callback();
                        },
                        function (err) {
                            callback();
                        }
                    );
                }
            }
        }

        function addLayerToWMSByAsyncList(layerModuleList, time, callback) {
            if (!callback || typeof callback !== "function") {
                callback = function () { };
            }
            if (layerModuleList.length === 0) {
                callback();
            }
            var layerModule = layerModuleList.shift();
            if (layerModule) {
                addLayerToWMS(layerModule, time, function () {
                    addLayerToWMSByAsyncList(layerModuleList, time, callback);
                });
            }
        }

        /**
         * 获取产品调色板
         * @param {Object} layModule
         * @param {Function} next
         */
        function getProjectPalette(layModule) {
            var paletteDivID = "palette" + layModule._id;
            var palette = new Palette();
            var paletteImage = new Palette();
            var paletteVector = new Palette();
            //paletteVector.init_palette("paletteVectorLayer", paletteModule);
            paletteImage.destroy_palette("paletteImageLayer");
            if (layModule.paletteUrl === undefined || layModule.paletteUrl === "") {
                return;
            } else {
                CtrlServices.getProjectPalette(layModule._id, function (paletteModule) {
                    if (paletteModule) {
                        /**  */
                        palette.init_palette(paletteDivID, paletteModule);
                        if (layModule.layType === "BASELAYERS") {
                            paletteImage.init_palette("paletteImageLayer", paletteModule);
                        } else {
                            paletteVector.init_palette("paletteVectorLayer", paletteModule);
                        }
                    } else {
                        APIServices.getProjectPalette(layModule.paletteUrl, function (paletteModule) {
                            if (paletteModule !== undefined) {
                                var paletteDivID = "palette" + layModule._id;
                                var palette = new Palette();
                                var paletteImage = new Palette();
                                var paletteVector = new Palette();
                                palette.init_palette(paletteDivID, paletteModule);
                                if (layModule.layType === "BASELAYERS") {
                                    paletteImage.init_palette("paletteImageLayer", paletteModule);
                                } else {
                                    paletteVector.init_palette("paletteVectorLayer", paletteModule);
                                }
                                CtrlServices.setProjectPalette(layModule._id, paletteModule);
                            }
                        },
                            function (res) {
                                console.log(new Error("获取调色板失败，请检查产品配置: " + layModule.projectName));
                            }
                        );
                    }
                });
            }
        }

        /**
         * 从WMS控件中移除图层
         * @param layModule
         * @private
         */
        function removeLayFromWMS(layModule, onlyShowflg) {
            ShinetekView.SatelliteView.removeLayer(layModule._id, layModule.mapType);
            layModule.isSelected = false;
            if (onlyShowflg) {
                timeLine.removeDataInfo(layModule._id);

                var paletteImage = new Palette();
                paletteImage.destroy_palette("paletteImageLayer");
            }
            countSelectedLayerNum();
        }

        /**
         * 根据传入的图层 控制其显示与隐藏
         *
         * @param {String} _id layModule的_id
         * @param {String} mapType layModule的mapType
         * @param {Boolean} isShow layModule的isShow
         */
        function setVisibilityFromWMS(_id, mapType, isShow) {
            ShinetekView.SatelliteView.setVisibility(_id, mapType, isShow);
        }

        /**
         * 移除当前显示的列表
         * @param layModule
         * @private
         */
        function removeDataExistList(layModule) {
            // 移除函数
            timelineUI.RemoveLayerDataByName(layModule.projectName + layModule._id);
        }

        /**
         * 初始化截图控件
         */
        function snapshotInit() {
            // 初始化截图框
            $("#snapshot").load("lib/screenshot/photo.html", function () { });
        }

        /**
         * 初始化帮助功能
         */
        function helpInit() {
            $("#mapHelp").load("/lib/help/help.html", helpBox._helpInit());
        }

        /**
         * 从本地存储中中获取上次保存的列表
         * @private
         */
        function defaultLayersInit(projectList) {
            projectList = CtrlServices.getDefaultLayers(projectList);
            projectList.forEach(function (layer) {
                if (layer.isDefault === true) {
                    CtrlServices.setAddRemoveProjectFromBaseOverLayer(
                        self.overLayers,
                        self.baseLayers,
                        layer,
                        "add"
                    );
                    layer.isSelected = true;
                }
            });
            self.overLayers.forEach(function (overlayer) {
                addLayerToWMS(overlayer);
            });
            // var baseLayer = CtrlServices.getPlayLayers(self.baseLayers, false)
            // if (baseLayer) {
            //     _addLayToWMS(baseLayer)
            // }
            /**
             * 如果baseLays 只加载首层数据，由于数据存在信息的获取代码在_addLayToWMS()中，
             * 导致时间轴也只能加载首层数据的时间列表，这样就会与图层列表不一致，
             * 并且还会导致变更图层顺序时的bug， 因为下面基层图层都未加载
             * 因此在默认图层初始化环节，必须加载所有图层至openlayers
             *
             * 由于_addLayToWMS() 在首次获取数据存在列表时是异步处理的，
             * 为了保证加载图层时的顺序与图层列表一致，
             * 这里必须采用异步回调的方式依次加载图层
             */
            var tmpBaseLayers = [];
            self.baseLayers.forEach(function (item) {
                tmpBaseLayers.unshift(item);
            });
            addLayerToWMSByAsyncList(tmpBaseLayers);
        }

        /**
         * 时间轴初始化
         * @private
         */
        function timelineUIInit() {
            timeLine.initialize(timelineUI, {});
        }

        /**
         * 初始化函数
         * @private
         */
        function init() {
            var animaParam = CtrlServices.getQueryString("animation");
            //动画中心点
            var animaCenter = CtrlServices.getQueryString("center");
            if (!animaParam) {
                initStandardPage();
            } else {
                initAnimationPage(animaParam, animaCenter);
            }
        }

        function initStandardPage() {
            // 初始化video动画播放时间范围
            var tmp = moment(new Date());
            self.videoEndTime = moment.utc(
                tmp.add(1, "h").format("YYYY-MM-DD HH:00:00")
            );
            self.videoStartTime = moment.utc(
                tmp.add(-1, "d").format("YYYY-MM-DD HH:00:00")
            );

            timelineTimer = $.timer(function () {
                CtrlServices.getAllLayerModulesTimeline();
            });
            timelineTimer.set({
                time: 10 * 60 * 1000,
                autostart: true
            });

            /** 初始化配置参数 */
            operatingInit();
            /** 初始化数据源 */
            resourceInit(function (err, url) {
                if (err) {
                    return alert(err.message);
                }
                /* 初始化源Setting */
                initResourceSettings(url);
                /* 初始化插件 */
                initPlugins(url);
                // 初始化图层列表
                layerMenuInit(url, "Product", function (err, projectList, tabGroups) {
                    if (err) {
                        return alert(err.message);
                    }
                    /* 根据配置初始化openlayer */
                    baseMapInit();
                    /* 初始化 listmenu module */
                    listMenuInit(tabGroups);
                    /* 初始化默认图层 */
                    defaultLayersInit(projectList);
                    /* 初始化时间轴控件 */
                    timelineUIInit();
                    /* 初始化自定义动画列表 */
                    customAnimaInit(url);
                    /* 初始化截图控件 */
                    snapshotInit();
                    /* 初始化帮助控件 */
                    helpInit();
                    /* 保存layerModule列表 */
                    CtrlServices.saveLayerModuleList(tabGroups);
                    timelineTimer.play();
                    //todo liuyp 需要添加到正确位置
                });
            });
        }

        function initResourceSettings(url) {
            APIServices.getResourceSettings(url, function (data) {
                resourceName = data["resource.name"] || "SatelliteView";
                //self.title = "ShinetekView";
            }, function (error) {
                //self.title = "ShinetekView";
            });
        }

        function initPlugins(url) {
            svPlugin.register("getDatetime", function () {
                return moment(currentTime);
            });
            svPlugin.register("getGeometry", function () {
                return geometryList;
            });
            svPlugin.register("getLayer", function () {
                var layermodel = CtrlServices.getPlayLayers(self.baseLayers, false);
                if (layermodel) {
                    return layermodel;
                } else {
                    return undefined;
                }
            });
            APIServices.getPlugin(url, function (res) {
                svPlugin.pluginInit(res.data);
            }, function (res) {

            });
        }

        function customAnimaInit(url) {
            APIServices.getLayerModal(url, "Animate", function (data) {
                var projectList = [];
                data.forEach(tabItem => {
                    /** 增加 frequentlyLayers 属性*/
                    tabItem.allLayerGroups.forEach(layerGroupItem => {
                        layerGroupItem.layers.forEach(layer => {
                            if (layer.group) {
                                layer.group.instGroups.forEach(instG => {
                                    instG.projects.forEach(project => {
                                        projectList.push(project);
                                    });
                                });
                            }
                        });
                    });
                });


                var animationTypeList = [];
                //遍历 projectList 获取所有的动画类型
                projectList.forEach(project => {
                    var animeTypeList = project.animeType;
                    animeTypeList.forEach(animeType => {
                        var isExist = false;
                        //校验是否已经存在类型
                        animationTypeList.forEach(type => {
                            if (type === animeType || animeType === "") {
                                isExist = true;
                            }
                        });
                        if (!isExist) {
                            animationTypeList.push(animeType);
                        }
                    });
                });

                //清除原有数组
                self.animationTypes.splice(0, self.animationTypes.length);
                //遍历 并添加界面右侧显示的 列表
                animationTypeList.forEach(item => {
                    self.animationTypes.push({
                        type: item
                    });
                });

            },
                function (err) {
                    self.animationTypes.splice(0, self.animationTypes.length);
                }
            );


        }

        function isPc(){
            if( navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i) ){
                //console.log('移动端');
                $(".ol-mouse-position").hide();
                $(".selectAreaBut").hide();
                $(".ol-scale-line-inner").hide();
                $(".myResolution").hide();
                $(".title-ico-css").hide();
                document.getElementsByClassName("collapse-area")[0].style.backgroundImage="";
                document.getElementsByClassName("aminite-label")[0].getElementsByTagName("p")[0].style.display="none";
                //document.getElementsByClassName("mapTrademark")[0].style
                $(".mapTrademark").hide();
            }else{
                //console.log('pc端');
            }
        }

        function initAnimationPage(animaParam, animaCenter) {
            /* 隐藏掉所有的功能按钮 */
            operatingInit({
                "3DSwitch": false,
                "screenShots": false,
                "projectionSwitch": false,
                "resourceSwitch": false,
                "help": false,
                "layerMenu.isList": false,
                "customAnimation": false,
                "standarAnimation": false,
                "menuTypeSwicth": false
            });
            /* 隐藏掉menuGroup */
            $("#menuGroup").hide();
            /* 隐藏掉添加图层按钮 */
            $("#addlayers-btn").hide();
            /* 隐藏掉事件页签 */
            $("#events-tab").css("visibility", "hidden");

            //self.title = "";
            self.title = animaParam;
            /* 初始化map */
            baseMapInit();

            /*判断设备为移动端时候，将经纬度坐标等信息隐藏*/
            isPc();

            //todo 当数据源中心点不一致的时候！如何判定
            if (animaCenter) {
                var animaCenterSP = animaCenter.split(",");
                if (animaCenterSP.length == 2) {
                    if (Number(animaCenterSP[0]) && Number(animaCenterSP[1])) {
                        var view = ShinetekView.map.getView();
                        console.log(view.getCenter());
                        view.setCenter([Number(animaCenterSP[0]), Number(animaCenterSP[1])]);
                        ShinetekView.map.render();
                    }
                }
            }

            /* 获取数据源 */
            resourceInit(function (err, url) {
                if (err) {
                    return alert(err.message);
                }
                /* 初始化源设置 */
                initResourceSettings(url);
                /* 初始化图层列表 */
                layerMenuInit(url, "Animate", function (err, projectList, tabGroups) {
                    /* 初始化左侧的动画图层列表 */
                    var tmpList = CtrlServices.addLayersForAnima(animaParam, projectList, self.baseLayers, self.overLayers);
                    tmpList.forEach(layerModule => {
                        getProjectPalette(layerModule);
                        setTimeout(function () {
                            $("#levelWaring" + layerModule._id).hide();
                            $("#item-control" + layerModule._id).hide();
                        }, 100);
                        /* 添加地理信息图层 */
                        if (layerModule.layType === "OVERLAYERS") {
                            addLayerToWMS(layerModule);
                        }
                    });
                });
                animaMultip(url, animaParam);
                // 开始动画 隐藏菜单栏  
                self.isMenuCollapse = 2;
                // showMenuSwitch();
            });
        }

        function animaMultip(url, animaParam) {
            var timespan = Math.floor(1000 / 10);
            APIServices.getMultipleAnimaList(url, animaParam, function (data) {
                animeInitMultiple(data, true, animaParam);
                //开始动画
                _startAnime(timespan, function (err, layerName) {
                    setTimeout(function () {
                        if (layerName !== null) {
                            ShinetekView.SatelliteView.removeLayer(layerName);
                        }
                        animaMultip(url, animaParam);
                    }, 5000);
                });
            }, function (err) { });
        }

        function operatingInit(flg) {
            APIServices.getOperating(
                function (config) {
                    if (flg) {
                        self.isShow3DSwitchBtn = flg["3DSwitch"];
                        self.isShowScreenShotsBtn = flg["screenShots"];
                        self.isShowProjectionSwitchBtn = flg["projectionSwitch"];
                        self.isShowResourceSwitchBtn = flg["resourceSwitch"];
                        self.isShowHelpBtn = flg["help"];
                        self.isListMenu = flg["layerMenu.isList"];
                        self.isShowCustomAnimaBtn = flg["customAnimation"];
                        self.isShowStandarAnimaBtn = flg["standarAnimation"];
                        self.isShowMenuTypeSwitchBtn = flg["menuTypeSwicth"];
                    } else {
                        self.isShow3DSwitchBtn = config.feature["3DSwitch"];
                        self.isShowScreenShotsBtn = config.feature["screenShots"];
                        self.isShowProjectionSwitchBtn = config.feature["projectionSwitch"];
                        self.isShowResourceSwitchBtn = config.feature["resourceSwitch"];
                        self.isShowHelpBtn = config.feature["help"];
                        self.isListMenu = config["layerMenu.isList"];
                        self.isShowCustomAnimaBtn = config.feature["customAnimation"];
                        self.isShowStandarAnimaBtn = config.feature["standarAnimation"];
                        self.isShowMenuTypeSwitchBtn = config.feature["menuTypeSwicth"];
                    }
                },
                function (err) { }
            );
        }

        function resourceInit(cb) {
            // 获取localStorage中的resource地址
            try {
                self.resource = JSON.parse(localStorage.getItem("defaultResource"));
            } catch (err) {
                localStorage.removeItem("defaultResource");
                self.resource = null;
            }
            APIServices.getResources(
                function (data) {
                    if (data.length === 0) {
                        alert("请添加一个数据源!");
                    }
                    if (!self.resource) {
                        self.resource = data[0];
                    }
                    data.forEach(o => {
                        if (o.name === self.resource.name && o.url === self.resource.url) {
                            o.isSelected = true;
                        } else {
                            o.isSelected = false;
                        }
                        self.resourceList.push(o);
                    });
                    cb(null, self.resource.url);
                },
                function (res) {
                    cb(new Error("无法获取数据源"), null);
                }
            );
        }

        function _isSelectedTab(tabName) {
            return self.currentTab === tabName;
        }

        function _selectTab(tabName) {
            self.currentTab = tabName;
        }

        function _isSelectedTab_LayerMenuModal(tabGroupModule) {
            return self.currentTabGroup === tabGroupModule;
        }

        function _selectTab_LayerMenuModal(tabGroupModule) {
            self.currentTabGroup = tabGroupModule;
        }

        /**
         * 折叠菜单栏 1隐藏
         */
        function _collapseMenu() {
            /** 自定义动画页面状态下 返回到 2 否则返回到 1 */
            var animaParam = CtrlServices.getQueryString("animation");
            if (animaParam) {
                self.isMenuCollapse = 2;
            } else {
                self.isMenuCollapse = 1;
            }
        }

        /**
         * 展开菜单栏 0显示
         */
        function _extendMenu() {
            self.isMenuCollapse = 0;
        }

        function extendMenuByAnima() {
            /** 自定义动画页面状态下 可以点开菜单 */
            var animaParam = CtrlServices.getQueryString("animation");
            if (animaParam) {
                self.isMenuCollapse = 0;
            }
        }

        // 需要进行动画的数据信息
        var animatedata = [];
        /*video 动画起始时间*/
        self.videoStartTime = moment.utc(new Date()).add(-1.0, "day");
        /*video 动画结束时间 默认使用当前时间*/
        self.videoEndTime = moment.utc(new Date());
        // 移除图层的num 初始化 -- 0 （初始化 未进行移除，将要移除第0层数据）
        var remove_layer_num = 0;
        // 当前现实图层num 初始化 -- 1 （初始化 显示图层0）
        var show_layer_num = 1;
        // 添加图层num 初始化 -- 4 （初始化 添加 0 1 2 3 层，将要添加层数：4）
        var add_layer_num = 4;
        var animelayer = null;
        /*播放video*/
        self.playVideo = _playVideo;
        /*停止video*/
        self.stopVideo = _stopVideo;
        /* 设置video动画的时间范围 */
        self.setVideoTimeRange = _setVideoTimeRange;
        /** 点击 速度 帧数减一 */
        self.minusVideo = _minusVideo;
        /** 点击 速度 帧数加一 */
        self.plusVideo = _plusVideo;
        /*动画前一帧*/
        self.backwardVideo = _backwardVideo;
        /*动画后一帧*/
        self.forwardVideo = _forwardVideo;
        /*设置video动画播放最近24小时的数据*/
        self.setVideoLatest24 = _setVideoLatest24;

        /**
         * 设置video动画播放最近24小时的数据
         * @private
         */
        function _setVideoLatest24() {
            // 1 设置标志, 时间范围区域 disable
            // 2 获取播放图层的数据列表
            // 3 根据最新数据计算动画的时间范围
            // 4 在timeline中设置播放范围
            self.isLatest24 = !self.isLatest24;
            if (self.isLatest24) {
                _getLatest24();
            }
        }

        /**
         * 获取最近的24小时 根据当前最新的图层 获取当前图层的最新24h
         *  self.videoStartTime   self.videoEndTime 重新设置
         * @returns 
         */
        function _getLatest24() {
            try {
                if (self.baseLayers.length < 1) return alert("请先添加一个产品");
                var layerModule = CtrlServices.getPlayLayers(self.baseLayers);
                var layerModuleInfo = CtrlServices.getLayerTimeList(layerModule._id);
                var latestOne = layerModuleInfo.timeline[0];
                if (latestOne) {
                    var _latestBegin = CtrlServices.getTimeFromRange(latestOne, layerModule.rangeBase);
                    var _videoStartTime = CtrlServices.formatStr2Moment(_latestBegin);
                    self.videoStartTime = _videoStartTime.add(-1.0, "day");
                    self.videoEndTime = CtrlServices.formatStr2Moment(_latestBegin);

                }
            } catch (err) {

            }

        }

        /**
         * 设置video动画的时间范围
         * @param {String} unit 单位（Y=年; M=月; D=日)
         * @param {String} opt 操作方式 (plus=加; minus=减)
         * @param {Object} targetTime 目标时间
         * @private
         */
        function _setVideoTimeRange(unit, opt, targetTime) {
            if (self.isLatest24) return;
            var x;
            if (opt === "plus") {
                x = 1;
            } else {
                x = -1;
            }
            if (unit === "m") {
                x = 30 * x;
            }
            targetTime.add(x, unit);
        }

        /**
         * 每秒帧数减一
         *速度控制  最小帧数为1
         */
        function _minusVideo() {
            if (self.fpsNum >= 1) {
                self.fpsNum--;
            }
        }

        /**
         * 每秒帧数加一
         * 速度控制  最大帧数为24
         */
        function _plusVideo() {
            if (self.fpsNum <= 24) {
                self.fpsNum++;
            }
        }

        /**
         * 前进动画
         * 点击暂停显示， 并向前推进一个显示
         */
        function _forwardVideo() {
            self.isVideoPlayed = 0;
            //第一步都是暂停动画
            _pauseAnime();
            _playNextLayer();
        }

        /**
         * 后退动画
         */
        function _backwardVideo() {
            self.isVideoPlayed = 0;
            //第一步都是暂停动画
            _pauseAnime();
            _playPreLayer();
        }

        /**
         * 单步向后进行显示
         */
        function _playNextLayer() {
            playNextStep();
        }

        /**
         * 单步向前进行显示
         */
        function _playPreLayer() {
            //对图层的添加进行判定 若未添加完成 则不能下一步
            if (!ShinetekView.SatelliteView.oGetStatus()) {
                return;
            }
            if (show_layer_num === 1) {
                return;
            }

            // 判断移除值域
            if (remove_layer_num > 1) {
                // 移除上一层的显示
                remove_layer_num--;
                ShinetekView.SatelliteView.addLayer(animatedata[remove_layer_num].LayerTimeName, "TMS3", animatedata[remove_layer_num].LayerTimeUrl, "false", "TMS"); // 0
                ShinetekView.SatelliteView.setZIndex(animatedata[remove_layer_num].LayerTimeName, animatedata[remove_layer_num].LayerTimeIndexZ);
            }

            // 判断当前显示值域
            if (show_layer_num > 2) {
                show_layer_num--;
                _reSetTitleShow(animatedata[show_layer_num - 2].prodName, animatedata[show_layer_num - 2].prodTime,
                    show_layer_num - 2, animatedata.length);
            }
            // 判断添加值域
            if (add_layer_num > 3) {
                // 设置当前图层状态为显示模式
                add_layer_num--;
                ShinetekView.SatelliteView.removeLayer(animatedata[add_layer_num].LayerTimeName, "TMS");
            }
        }

        /**
         * 播放动画 轮播模式
         * 点击开始动画模式，可分为暂停或开始
         * 一共可分为以下几种模式
         * 1. 从停止 -> 开始
         * 2. 从暂停 -> 开始
         * 3. 从开始 -> 暂停
         * @private
         */
        function _playVideo() {
            // 移除当前显示所有产品
            self.baseLayers.forEach(function (layModule) {
                removeLayFromWMS(layModule, false);
            });
            //隐藏当前显示 的时间轴

            // 对当前选择的 顶层进行置顶显示
            self.overLayers.forEach(function (layModule) {
                ShinetekView.SatelliteView.setZIndex(layModule._id, 30000);
            });
            // 开始动画 隐藏菜单栏  
            self.isMenuCollapse = 2;
            //隐藏左侧图层菜单列表
            showMenuSwitch();
            //隐藏下方时间轴列表
            _hideShowTimeLine(false);
            var orgFlg = self.isVideoPlayed;


            // 根据当前模式 对数据状态进行切换
            if (orgFlg === -1 || orgFlg === 0) {
                self.isVideoPlayed = 1;
            } else if (orgFlg === 1) {
                self.isVideoPlayed = 0;
            }
            // case1

            if (self.isVideoPlayed === 1) {
                /**
                 * orgFlg === -1
                 * 停止状态 ==> 播放状态
                 * 1 获取数据列表, 计算topLayer
                 * 2 启动动画 每一次都进行数据获取
                 * orgFlg=-1
                 */
                if (orgFlg === -1) {
                    self.isShownVideoPanel = false;
                }
                /**
                 * orgFlg === 0
                 * 暂停状态 ==> 播放状态
                 * 1 继续动画 =》不再进行数据获取 ，直接再次Play动画
                 * orgFlg==0
                 */

                // 从新开始动画
                _replayVideo(orgFlg);
            } else if (orgFlg === 1 && self.isVideoPlayed === 0) {
                /**
                 * orgFlg === 1
                 * 播放状态 ==> 暂停状态
                 * 1 暂停动画
                 */
                _pauseAnime();
            }
        }

        /**
         * 
         * 用于控制时间轴显示隐藏
         * @param {bool} isHide  true 使其显示 false 使其隐藏
         */
        function _hideShowTimeLine(isHide) {
            timeLine.options.isHide = isHide;
            timeLine._setHideAndShow();
        }
        /**
         * 停止动画并清除当前显示图层
         *
         */
        function _stopAnime() {
            var m_showList = [];
            try {
                animeTimer.stop();
                // 移除当前显示的信息 暂停的时候个人认为不需要删除显示
                // ShinetekView.Ol3Opt.setScreenTitle(" ")
                // 根据当前的 remove_layer_num add_layer_num
                // 遍历获取 当前所有 已经添加 但是未被移除的图层名称
                // 移除当前显示信息
                for (var w = remove_layer_num; w <= add_layer_num; w++) {
                    if (w < animatedata.length) {
                        var itemName = animatedata[w].LayerTimeName;

                        ShinetekView.SatelliteView.removeLayer(itemName);
                    }
                }

                // 对opanlayer 中待加载的所有数值清零20170518
                ShinetekView.SatelliteView.clearAnimate();
            } catch (err) { }
        }

        /**
         * 播放
         * @param {Number} orgFlg 0 暂停=》播放 1 停止=》播放
         * @private
         */
        function _replayVideo(orgFlg) {
            // 若为最近 24h模式 重新获取 动画列表
            if (self.isLatest24) {
                _getLatest24();
            }
            // 只有在停止的时候 -->暂停的时候 不进行最上层 查找转化
            if (orgFlg !== 0) {
                // 重新获取

                // 重头开始模式
                // getLatestTime todo
                // 获取顶层
                animelayer = CtrlServices.getPlayLayers(self.baseLayers, false);
                // 图层判断
                if (!animelayer) {
                    return alert("请先选择至少一个产品");
                }

                //根据当前 input 框 重新设置 并获取 动画时间范围
                _getAnimeTimeRange();

                //根据当前开始结束时间获取
                var _animeUrl = animelayer.animeUrl +
                    "&beginTime=" + self.videoStartTime.format("YYYYMMDDHHmmss") +
                    "&endTime=" + self.videoEndTime.format("YYYYMMDDHHmmss") + "";

                // 调用 api 获取 动画列表
                APIServices.getAnimaList(
                    _animeUrl,
                    function (data) {
                        //重新开始动画 进行 初始化设置
                        if (orgFlg === -1) {
                            //todo test  单产品动画 显示
                            animeInitMultiple(data, false);
                        }
                        //开始动画
                        var timespan = Math.floor(1000 / self.fpsNum);
                        _startAnime(timespan, function (err, layerName) {
                            if (self.isLooped) {
                                setTimeout(function () {
                                    if (layerName !== null) {
                                        ShinetekView.SatelliteView.removeLayer(layerName);
                                    }
                                    _replayVideo(-1);
                                }, 5000);
                            }
                        });
                    },
                    function (err) { }
                );
            } else {
                // 从暂停到播放
                var timeSpan = Math.floor(1000 / self.fpsNum);
                _startAnime(timeSpan, function (err, layerName) {
                    if (self.isLooped) {
                        setTimeout(function () {
                            if (layerName !== null) {
                                ShinetekView.SatelliteView.removeLayer(layerName);
                            }
                            _replayVideo(-1);
                        }, 5000);
                    }
                });
            }
        }
        /**
         * 
         * 
         * @param {any} AnimeteType 
         * @param {any} cb 
         */
        function _getAnimateList(AnimeteType, cb) {

            //TODO 按照动画类型 获取 动画 列表
            APIServices.getMultipleAnimaList(self.resource.url, AnimeteType,
                function success(data) {
                    //获取 数据成功函数
                    animeInitMultiple(data, true);

                    var timespan = Math.floor(1000 / self.fpsNum);
                    _startAnime(timespan, function (err, layerName) {
                        if (self.isLooped) {
                            setTimeout(function () {
                                if (layerName !== null) {
                                    ShinetekView.SatelliteView.removeLayer(layerName);
                                }
                                _replayVideo(-1);
                            }, 5000);
                        }
                    });
                },
                function (err) { });
        }
        /**
         * 初始化动画 - 预加载图层 多个动画版本
         * @param animateListData json数据内容（TimeLine 返回的,需要处理）
         * @param isMultiple 是否为 单产品模式
         * @param {String} animaParam 动画参数 GLL FDI
         * @private
         */
        function animeInitMultiple(animateListData, isMultiple, animaParam) {
            //获取当前 需要显示的动画列表
            var animateList_Show = [];
            // 存储 JsonData
            var totalList = [];
            animatedata = [];
            var animateNum = 0;
            //todo 调用函数 获取当前需要显示的数据列表 
            //TODO 需要列表支持列表 self.baseLayers
            if (isMultiple) {
                animateList_Show = CtrlServices.getMulitPlayLayers(self.baseLayers, animaParam);
            } else {
                //若为 单动画模式 则需要对显示图层进行数据化处理
                animateList_Show = CtrlServices.getPlayLayers(self.baseLayers, isMultiple);
                animateList_Show = [animateList_Show];
            }

            //遍历当前显示 获取 需要动画的总数 并按照 图层顺序进行显示
            for (var i = 0; i < animateList_Show.length; i++) {
                var showItem = animateList_Show[i];
                animateListData.forEach(function (animateItem) {
                    if (showItem.projectUrl === animateItem.projectUrl) {
                        showItem.animateList = animateItem.animateList;
                    }
                });
                if (showItem.animateList) {
                    animateNum = animateNum + showItem.animateList.length;
                }
            }
            var countNum = 0;
            for (var k = 0; k < animateList_Show.length; k++) {
                var animateItem = animateList_Show[k];
                var animateUrlList = animateItem.animateList;
                // 去重复'
                for (var w = 0; w < animateUrlList.length; w++) {
                    /* if (w === animateUrlList.length - 1) {
                        for (var x = 0; x < 10; x++) {
                            var prodId = animateItem._id;
                            var prodName = animateItem.projectName;
                            var prodUrl = animateUrlList[w].prodUrl;
                            var prodTime = animateUrlList[w].prodTime
                            var index_z_max = 550;
                            var animateDetail = {};
                            //图层url 
                            animateDetail.LayerTimeUrl = prodUrl;
                            animateDetail.prodName = prodName;
                            animateDetail.prodTime = prodTime;
                            //图层 id
                            animateDetail.LayerIndex = countNum;
                            //用于加减的唯一标识
                            animateDetail.LayerTimeName = prodId + "_" + w;
                            //当前显示的 layer index 计数 需要使用 总数
                            animateDetail.LayerTimeIndexZ = index_z_max + animateNum - countNum;
                            totalList.push(animateDetail);
                            countNum++;
                        }
                    } */
                    var prodId = animateItem._id;
                    var prodName = animateItem.projectName;
                    var prodUrl = animateUrlList[w].prodUrl;
                    var prodTime = animateUrlList[w].prodTime
                    var index_z_max = 550;
                    var animateDetail = {};
                    //图层url 
                    animateDetail.LayerTimeUrl = prodUrl;
                    animateDetail.prodName = prodName;
                    animateDetail.prodTime = prodTime;
                    //图层 id
                    animateDetail.LayerIndex = countNum;
                    //用于加减的唯一标识
                    animateDetail.LayerTimeName = prodId + "_" + w;
                    //当前显示的 layer index 计数 需要使用 总数
                    animateDetail.LayerTimeIndexZ = index_z_max + animateNum - countNum;
                    totalList.push(animateDetail);
                    countNum++;
                }
            }

            //对当前显示的动画 进行赋值
            animatedata = totalList;
            // var m_HidenList = []
            // 初始化值
            remove_layer_num = 0;
            show_layer_num = 1;
            add_layer_num = 3;

            // 20170517 修改最小动画范围小于 4的情况
            if (animatedata.length < add_layer_num) {
                console.warn(
                    "当前所选时间范围内，可播动画有效帧数为：" +
                    animatedata.length +
                    "。帧数不足以进行动画，请重新选择时间范围！"
                );
                add_layer_num = animatedata.length;
            }
            for (var i = remove_layer_num; i < add_layer_num; i++) {
                ShinetekView.SatelliteView.addLayer(
                    animatedata[i].LayerTimeName,
                    "TMS3",
                    animatedata[i].LayerTimeUrl,
                    "false",
                    "TMS"
                );
                ShinetekView.SatelliteView.setZIndex(
                    animatedata[i].LayerTimeName,
                    animatedata[i].LayerTimeIndexZ
                );
                _reSetTitleShow(animatedata[show_layer_num - 1].prodName, animatedata[show_layer_num - 1].prodTime,
                    show_layer_num - 1, animatedata.length);
            }
        }


        /**
         * 初始化动画 - 预加载图层 todo 并未使用 待删除
         * @param JsonData json数据内容（TimeLine 返回的,需要处理）
         * @param _id
         * @private
         */
        function animeInit(JsonData, _id) {
            var m_proid = _id;
            // 存储 JsonData
            var totalList = [];
            animatedata = [];
            // 去重复'
            for (var i = 0; i < JsonData.length; i++) {
                var ItemJson = JsonData[i];
                var index_z_max = 550;
                var m_itemInfo = [];
                m_itemInfo.LayerTimeUrl = ItemJson;
                m_itemInfo.LayerIndex = i;
                m_itemInfo.LayerTimeName = m_proid + "_" + i;
                m_itemInfo.LayerTimeIndexZ = index_z_max + JsonData.length - i;
                totalList.push(m_itemInfo);
            }

            animatedata = totalList;
            // var m_HidenList = []
            // 初始化值
            remove_layer_num = 0;
            show_layer_num = 1;
            add_layer_num = 2;
            // var m_NumNow = animatedata.length
            // 20170517 修改最小动画范围小于 4的情况
            if (animatedata.length < add_layer_num) {
                console.warn(
                    "当前所选时间范围内，可播动画有效帧数为：" +
                    animatedata.length +
                    "。帧数不足以进行动画，请重新选择时间范围！"
                );
                add_layer_num = animatedata.length;
            }
            for (var i = remove_layer_num; i < add_layer_num; i++) {
                ShinetekView.SatelliteView.addLayer(
                    animatedata[i].LayerTimeName,
                    "TMS3",
                    animatedata[i].LayerTimeUrl,
                    "false",
                    "TMS"
                );
                ShinetekView.SatelliteView.setZIndex(
                    animatedata[i].LayerTimeName,
                    animatedata[i].LayerTimeIndexZ
                );
            }
        }

        /**
         * 点击暂停开始等调用事件
         * 
         * @param {any} timespan 
         * @param {any} callback 
         */
        function _startAnime(timespan, callback) {

            // 获取动画长度  
            // 清楚当前图层列表中的缓存部分
            ShinetekView.SatelliteView.clearAnimate();
            // 对定时器赋值
            if (animeTimer === null) {
                animeTimer = $.timer(function () {
                    if (ShinetekView.SatelliteView.oGetStatus()) {
                        self.isWaitingShow = false;
                        // 判断移除值域
                        if (remove_layer_num < animatedata.length) {
                            // 移除上一层的显示
                            ShinetekView.SatelliteView.removeLayer(
                                animatedata[remove_layer_num].LayerTimeName,
                                "TMS"
                            );
                            remove_layer_num++;
                        }

                        // 判断当前显示值域
                        if (show_layer_num < animatedata.length) {
                            var m_TimeStr = "";
                            _reSetTitleShow(animatedata[show_layer_num].prodName, animatedata[show_layer_num].prodTime,
                                show_layer_num, animatedata.length);

                            show_layer_num++;
                            // ShinetekView.Ol3Opt.setScreenTitle(show_layer_num)
                            if (show_layer_num === animatedata.length) {
                                // 结束当前定时器
                                _pauseAnime();
                                callback(null, animatedata[show_layer_num - 1].LayerTimeName);
                                return;
                            }
                        }
                        // 判断添加值域
                        if (add_layer_num < animatedata.length) {
                            // 设置当前图层状态为显示模式
                            ShinetekView.SatelliteView.addLayer(
                                animatedata[add_layer_num].LayerTimeName,
                                "TMS3",
                                animatedata[add_layer_num].LayerTimeUrl,
                                "false",
                                "TMS"
                            ); // 0
                            ShinetekView.SatelliteView.setZIndex(animatedata[add_layer_num].LayerTimeName, animatedata[add_layer_num].LayerTimeIndexZ);

                            add_layer_num++;
                        }
                    } else {
                        self.isWaitingShow = true;
                    }

                });
                animeTimer.set({
                    time: timespan,
                    autostart: true
                });
            } else {
                animeTimer.play();
            }
        }
        /**
         *  向后进行一帧动画
         * 
         * @returns 
         */
        function playNextStep() {
            if (show_layer_num === animatedata.length + 1) {
                return;
            }
            if (ShinetekView.SatelliteView.oGetStatus()) {
                self.isWaitingShow = false;
                // 判断移除值域
                if (remove_layer_num < animatedata.length) {
                    // 移除上一层的显示
                    ShinetekView.SatelliteView.removeLayer(
                        animatedata[remove_layer_num].LayerTimeName,
                        "TMS"
                    );
                    remove_layer_num++;
                }

                // 判断当前显示值域
                if (show_layer_num <= animatedata.length) {

                    _reSetTitleShow(animatedata[show_layer_num - 1].prodName, animatedata[show_layer_num - 1].prodTime,
                        show_layer_num - 1, animatedata.length);

                    show_layer_num++;
                    // ShinetekView.Ol3Opt.setScreenTitle(show_layer_num)
                    if (show_layer_num === animatedata.length) {
                        // 结束当前定时器
                        _pauseAnime();
                        return;
                    }
                }
                // 判断添加值域
                if (add_layer_num < animatedata.length) {
                    // 设置当前图层状态为显示模式
                    ShinetekView.SatelliteView.addLayer(
                        animatedata[add_layer_num].LayerTimeName,
                        "TMS3",
                        animatedata[add_layer_num].LayerTimeUrl,
                        "false",
                        "TMS"
                    ); // 0
                    ShinetekView.SatelliteView.setZIndex(animatedata[add_layer_num].LayerTimeName, animatedata[add_layer_num].LayerTimeIndexZ);

                    add_layer_num++;
                }
            } else {
                self.isWaitingShow = true;
            }


        }




        /**
         * 根据当前显示的产品 对显示名称进行绑定/赋值显示
         * @param {any} prodName  产品名称
         * @param {any} prodTime  产品时次
         * @param {any} indexNum  产品当前序号
         * @param {any} allNum  动画总个数
         */
        function _reSetTitleShow(prodName, prodTime, indexNum, allNum) {
            var _prodName = prodName;
            var _prodTime = prodTime;
            indexNum++;
            //时次显示
            var _prodTimeStr = prodTime.substr(0, 4) + "-" + prodTime.substr(4, 2) + "-" + prodTime.substr(6, 2) +
                " " + prodTime.substr(8, 2) + ":" + prodTime.substr(10, 2);

            // 名称 及进度
            var showAnimeTitle = _prodName + "(" + indexNum + "/" + allNum + ")";
            //全屏显示模式
            var fullSceenShowTitle = "产品:" + prodName +
                "<br>" + "时次:" + _prodTimeStr +
                "<br>" + "进度:" + "(" + indexNum + "/" + allNum + ")";
            self.projectName = showAnimeTitle;
            $("#projectTime_ListMenu").html(_prodTimeStr);
            $("#projectName_ListMenu").html(showAnimeTitle);
            document.getElementById("AnprojectName").innerHTML = _prodTimeStr;
            document.getElementById("AntimeStr").innerHTML = showAnimeTitle;

            //对控件赋值 设置显示
            ShinetekView.SatelliteView.setScreenTitle(fullSceenShowTitle);
        }

        /**
         * 点击暂停时钟
         * @private
         */
        function _pauseAnime() {
            var m_showList = [];
            try {
                animeTimer.stop();
                // 移除当前显示的信息 暂停的时候个人认为不需要删除显示
                // ShinetekView.Ol3Opt.setScreenTitle(" ")
                // 根据当前的 remove_layer_num add_layer_num
                // 遍历获取 当前所有 已经添加 但是未被移除的图层名称
                for (var w = remove_layer_num; w <= add_layer_num; w++) {
                    if (w < animatedata.length) {
                        m_showList.push(animatedata[w].LayerTimeName);
                    }
                }
            } catch (err) { }
            return m_showList;
        }

        /**
         * 停止播放动画
         * 清除所有动画预加载图层
         * @private
         */
        function _stopVideo() {
            // 若还未停止
            if (self.isVideoPlayed !== -1) {
                self.isVideoPlayed = -1;
                _stopAnime();
            }
            // 打开菜单界面
            if (self.isMenuCollapse != 0) {
                self.isMenuCollapse = 0;
            }
            // 当前是否有等待框
            if (self.isWaitingShow) {
                self.isWaitingShow = false;
            }
            animatedata = [];
            document.getElementById("AnprojectName").innerHTML = "";
        }

        /*video 动画起始时间*/
        self.videoStartTime = moment.utc(new Date()).add(-1, "day");
        /*video 动画结束时间*/
        self.videoEndTime = moment.utc(new Date());

        /**
         * 设置当前动画范围
         *
         */
        function _getAnimeTimeRange() {
            try {
                //开始时间
                var start_year = $("#videoStartTime_year")[0].value;
                var start_month = $("#videoStartTime_month")[0].value;
                var start_day = $("#videoStartTime_day")[0].value;
                var start_minute = $("#videoStartTime_minute")[0].value;
                if (start_year.length < 4) {
                    for (var i = 0; i < 4 - start_year.length; i++) {
                        start_year = "0" + start_year;
                    }
                }
                var startTimeStr = start_year + "-" + start_month + "-" + start_day + " " + start_minute;

                self.videoStartTime = moment.utc(startTimeStr, "YYYY-MM-DD HH:mm");
                //结束时间
                var end_year = $("#videoEndTime_year")[0].value;
                var end_month = $("#videoEndTime_month")[0].value;
                var end_day = $("#videoEndTime_day")[0].value;
                var end_minute = $("#videoEndTime_minute")[0].value;
                if (end_year.length < 4) {
                    for (var t = 0; t < 4 - end_year.length; t++) {
                        end_year = "0" + end_year;
                    }
                }
                var endTimeStr = end_year + "-" + end_month + "-" + end_day + " " + end_minute;
                self.videoEndTime = moment.utc(endTimeStr, "YYYY-MM-DD HH:mm");
            } catch (err) {

            }
        }

        /**==================================动画部分 结束============================================= */
    }
})();