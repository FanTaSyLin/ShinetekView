/**
 * Created by fanlin on 2017/7/3.
 */

var ShinetekView = {};

//cesium申明
ShinetekView.cesiumObj = {};
ShinetekView.viewer = {};
ShinetekView.CesiumTMSLayers = {};
ShinetekView.CesiumWMSLayers = {};
ShinetekView.Cesiumrwms = {};
ShinetekView.tileAllNum = {};
ShinetekView.tileLoadEnd = {};
ShinetekView.tileLoadError = {};

//ol申明
ShinetekView.showMode = '2D';
ShinetekView.openlayerObj = {};
/*记录图形绘制的Obj*/
ShinetekView.openlayerVectorObj = {};
ShinetekView.openlayerVectorRasterObj = {};
ShinetekView.VectorNum = 0;
ShinetekView.AnalysisAry = [];
ShinetekView.draw = "";
ShinetekView.snap = "";
/*记录图形绘制的Obj ---End*/
ShinetekView.styleCache = {};
ShinetekView.map = {};
ShinetekView.resolutions = [0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125,
    0.01953125, 0.009765625, 0.0048828125, 0.00244140625 /*, 0.00244140625*/
]; //设置分辨率
ShinetekView.wrapX = false;
ShinetekView.GEOJSONStyle = {
    shpStyle: {
        color: 'grey',
        lineDash: [1],
        width: 1.3
    },
    orbitStyle: {
        lineColor: "#06cae5",
        lineWidth: 4,
        circleColor: '#06cae5',
        circleWidth: 10
    }
};
ShinetekView.center = [105, 34];
ShinetekView.zoom = "4";
ShinetekView.map = "map"; //新加的nowZoom函数未设置map为变量


ShinetekView.CesiumOpt = {
    init: function (url) {

        var viewer = new Cesium.Viewer('cesiumContainer', {
            animation: false, //是否创建动画小器件，左下角仪表
            baseLayerPicker: false, //是否显示图层选择器      //需设置
            fullscreenButton: false, //是否显示全屏按钮
            geocoder: false, //是否显示geocoder小器件，右上角查询按钮
            homeButton: true, //是否显示Home按钮
            infoBox: false, //是否显示信息框
            sceneModePicker: true, //是否显示3D/2D选择器
            selectionIndicator: false, //是否显示选取指示器组件
            timeline: false, //是否显示时间轴
            navigationHelpButton: false, //是否显示右上角的帮助按钮
            //scene3DOnly : true,//如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
            clock: new Cesium.Clock(), //用于控制当前时间的时钟对象
            selectedImageryProviderViewModel: undefined, //当前图像图层的显示模型，仅baseLayerPicker设为true有意义
            imageryProviderViewModels: Cesium.createDefaultImageryProviderViewModels(), //可供BaseLayerPicker选择的图像图层ProviderViewModel数组
            selectedTerrainProviderViewModel: undefined, //当前地形图层的显示模型，仅baseLayerPicker设为true有意义
            terrainProviderViewModels: Cesium.createDefaultTerrainProviderViewModels(), //可供BaseLayerPicker选择的地形图层ProviderViewModel数组
            fullscreenElement: document.body, //全屏时渲染的HTML元素,
            useDefaultRenderLoop: true, //如果需要控制渲染循环，则设为true
            targetFrameRate: undefined, //使用默认render loop时的帧率
            showRenderLoopErrors: false, //如果设为true，将在一个HTML面板中显示错误信息
            automaticallyTrackDataSourceClocks: true, //自动追踪最近添加的数据源的时钟设置
            contextOptions: undefined, //传递给Scene对象的上下文参数（scene.options）
            sceneMode: Cesium.SceneMode.SCENE3D, //初始场景模式
            mapProjection: new Cesium.WebMercatorProjection(), //地图投影体系
            dataSources: new Cesium.DataSourceCollection(), //需要进行可视化的数据源的集合
            terrainExaggeration: 2.0, //地形图设置
            geocoder: false, // no default bing maps
            imageryProvider: new Cesium.createTileMapServiceImageryProvider({
                url: 'http://10.24.10.95/IMAGEL2/test/tianditu/20180415/',
                /*layer: "",
                style: "default",
                format: "image/png",
                show: false,*/
                flipXY: false,
                tileMatrixLabels: ["0", "1", "2", "3", "4", "5", "6", "7"],
                minimumLevel: 0,
                maximumLevel: 7,
                //以下代码可取消xml配置绑定
                // ellipsoid: "WGS84",
                tilingScheme: new Cesium.GeographicTilingScheme({})
            }) //加载自定义地图瓦片需要指定一个自定义图片服务器//URL 为瓦片数据服务器地址
            /*      imageryProvider: tms0*/
            /*skyBox : new Cesium.SkyBox({
             sources : {
             positiveX : 'Cesium-1.7.1/Skybox/px.jpg',
             negativeX : 'Cesium-1.7.1/Skybox/mx.jpg',
             positiveY : 'Cesium-1.7.1/Skybox/py.jpg',
             negativeY : 'Cesium-1.7.1/Skybox/my.jpg',
             positiveZ : 'Cesium-1.7.1/Skybox/pz.jpg',
             negativeZ : 'Cesium-1.7.1/Skybox/mz.jpg'
             }
             }),//用于渲染星空的SkyBox对象*/
        });
        ShinetekView.viewer = viewer;
        //添加月球数据
        var radius = Cesium.Math.LUNAR_RADIUS * 2;
        viewer.scene.moon = new Cesium.Moon({
            ellipsoid: new Cesium.Ellipsoid(radius, radius, radius) //3474800   100000000
        });

        //地形图
        /*var cesiumTerrainProviderMeshes = new Cesium.CesiumTerrainProvider({
         url : 'https://assets.agi.com/stk-terrain/world',
         requestWaterMask : true,
         requestVertexNormals : true
         });
         viewer.terrainProvider = cesiumTerrainProviderMeshes;
         viewer.camera.setView({
         destination : new Cesium.Cartesian3(277096.634865404, 5647834.481964232, 2985563.7039122293),
         xorientation : {
         heading : 4.731089976107251,
         pitch : -0.32003481981370063
         }
         });
         viewer.scene.globe.enableLighting = true;*/


        var terrainProvider = new Cesium.CesiumTerrainProvider({
            url: 'https://assets.agi.com/stk-terrain/world' ,
            // 默认立体地表
            // 请求照明
            requestVertexNormals: true,
            // 请求水波纹效果
            requestWaterMask: true
        });
        viewer.terrainProvider = terrainProvider;

        /*添加区域*/
        /*var scene = viewer.scene;
        scene.globe.depthTestAgainstTerrain = true;

        scene.primitives.add(new Cesium.Primitive({
            geometryInstances : new Cesium.GeometryInstance({
                geometry : new Cesium.RectangleGeometry({
                    rectangle : Cesium.Rectangle.fromDegrees(-100.0, 30.0, -93.0, 37.0),
                    height: 1000,
                    vertexFormat : Cesium.PerInstanceColorAppearance.VERTEX_FORMAT
                }),
                attributes : {
                    color : Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.BLUE)
                }
            }),
            appearance : new Cesium.PerInstanceColorAppearance()
        }));*/

        var czml1 =
            [
            {
            "id" : "document",
            "name" : "CZML Geometries: Rectangle",
            "version" : "1.0"
        },
            {
                    "rectangle" : {
                        "coordinates" : {
                            "wsenDegrees" : [100, 46, 117, 47]
                        },
                        "fill" : true,
                        "material" : {
                            "solidColor" : {
                                "color": {
                                    "rgba" : [0, 255, 255, 60]
                                }
                            }
                        }
                    }
                },
            {
                    "rectangle" : {
                        "coordinates" : {
                            "wsenDegrees" : [100, 47, 106, 48]
                        },
                        "fill" : true,
                        "material" : {
                            "solidColor" : {
                                "color": {
                                    "rgba" : [255, 0, 255, 60]
                                }
                            }
                        }
                    }
                }
        ];
        var promise1 = Cesium.CzmlDataSource.load(czml1);
        promise1.alpha = 0.5;
        //promise1.brightness = 2.0;
        viewer.dataSources.add(promise1);

       /* var e =viewer.entities.add({
            polygon : {
                hierarchy : {
                    positions : [new Cesium.Cartesian3(-2358138.847340281, -3744072.459541374, 4581158.5714175375),
                        new Cesium.Cartesian3(-2357231.4925370603, -3745103.7886602185, 4580702.9757762635),
                        new Cesium.Cartesian3(-2355912.902205431, -3744249.029778454, 4582402.154378103),
                        new Cesium.Cartesian3(-2357208.0209552636, -3743553.4420488174, 4581961.863286629)]
                },
                material : Cesium.Color.BLUE.withAlpha(0.5)
            }
        });
        viewer.zoomTo(e);*/


        var CesiumTMSLayers = viewer.scene.imageryLayers;
        ShinetekView.CesiumTMSLayers = CesiumTMSLayers;
        var CesiumWMSLayers = viewer.imageryLayers;
        ShinetekView.CesiumWMSLayers = CesiumWMSLayers;
        var Cesiumrwms = viewer.scene.globe.imageryLayers;
        ShinetekView.Cesiumrwms = Cesiumrwms;

        //鼠标滑动显示经纬度
        //this.getPosition();
        this.getLonLat();

        //设置显示区域
        this.setView();

        // 设置你的bing地图key
        //Cesium.BingMapsApi.defaultKey = 'Ap2z3Su_tKy7X9Zdy5EuFqzLmEa6bPKtLCS8_Gnsq-btg91SoZDGTto22NoEO4FB';

        if (!url) {
            console.log("add");
            //ShinetekView.CesiumOpt.addLayer("_lkjw9sdj9jlaksjdlweiqw", "基础基础图层", "http://10.24.4.121/image/", "false", "WMS");
        }


        // Start off looking at Australia.
        /* viewer.camera.setView({
         destination: Cesium.Rectangle.fromDegrees(114.591, -45.837, 148.970, -5.730)
         });*/
    },

    /**
     * 添加图层
     * @param nameFun  操作图层显示隐藏的函数名
     * @param nameLayer
     * @param oURL  图层的url地址
     * @param isBase
     * @param WorT
     */
    addLayer: function (nameFun, nameLayer, oURL, isBase, WorT) {
        console.log("3D add!");
        console.log(nameFun);
        if (WorT === "WMS") {
            var layer = new Cesium.WebMapServiceImageryProvider({
                url: oURL,
                layers: 'Hydrography:bores',
                parameters: {
                    transparent: true,
                    format: 'image/png'
                },
                tileWidth: 256,
                tileHeight: 256,
                minimumLevel: 0,
                maximumLevel: 7,
                //  tilingScheme: new Cesium.GeographicTilingScheme()
            });
            ShinetekView.CesiumWMSLayers.addImageryProvider(layer);
            ShinetekView.cesiumObj[nameFun] = layer;

            /* var wms = new Cesium.UrlTemplateImageryProvider({
             url : 'https://programs.communications.gov.au/geoserver/ows?tiled=true&' +
             'transparent=true&format=image%2Fpng&exceptions=application%2Fvnd.ogc.se_xml&' +
             'styles=&service=WMS&version=1.1.1&request=GetMap&' +
             'layers=public%3AMyBroadband_Availability&srs=EPSG%3A3857&' +
             'bbox={westProjected}%2C{southProjected}%2C{eastProjected}%2C{northProjected}&' +
             'width=256&height=256',
             rectangle : Cesium.Rectangle.fromDegrees(96.799393, -43.598214999057824, 153.63925700000001, -9.2159219997013)
             });*/
        }
        else if (WorT === "WMTS") {
            var _layer = new Cesium.WebMapTileServiceImageryProvider({
                //全球矢量地图服务
                url: oURL,
                //路网
                /* "http://t0.tianditu.com/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",*/
                // 全球影像地图服务
                /*url: "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",*/
                //全球影像中文注记服务
                /*url: "http://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg",*/
                //全球矢量中文注记服务
                /*url: "http://t0.tianditu.com/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg",*/
                layer: "tdtVecBasicLayer",
                style: "default",
                format: "image/jpeg",
                tileMatrixSetID: "GoogleMapsCompatible",
                show: "false",
            });
            ShinetekView.CesiumWMSLayers.addImageryProvider(_layer);
            ShinetekView.cesiumObj[nameFun] = _layer;
        }
        else if (WorT === "TMS") {
            //若为天地图 则对后缀名称进行修改
            oPhoto = oURL.indexOf("tianditu") > -1 ? "png" : "jpg";
            var TMSLayer = new Cesium.ImageryLayer(
                new Cesium.createTileMapServiceImageryProvider({
                    url: oURL,
                    fileExtension: oPhoto,
                    flipXY: true,
                    tileMatrixLabels: ["0", "1", "2", "3", "4", "5", "6", "7"],
                    minimumLevel: 0,
                    maximumLevel: 7,
                    //以下代码可取消xml配置绑定                                 
                    // ellipsoid: "WGS84",
                    tilingScheme: new Cesium.GeographicTilingScheme({})

                })
            );
            ShinetekView.CesiumTMSLayers.add(TMSLayer);

            ShinetekView.cesiumObj[nameFun] = TMSLayer;
            //设置图层的透明度
            //nameFun.alpha = 0.5;
            //设置图层的亮度,两倍亮度
            //nameFun.brightness = 2.0;
        }
        else if (WorT === "KML") {

        }
        else if (WorT === "GEOJSON") {
            console.log("GEOJSON");
            Cesium.GeoJsonDataSource.load(oURL, {
                stroke: Cesium.Color.BLUE,
                fill: Cesium.Color.PINK.withAlpha(0.5),
                //Cesium.Color.TRANSPARENT
                strokeWidth: 3,
                markerSymbol: '?'
            }).then(function (myDataSource) {
                // Add it to the viewer
                ShinetekView.viewer.dataSources.add(myDataSource);
                // Remember the data source by ID so we can delete later
                // loadedGeometries[geometryID] = myDataSource;
                ShinetekView.cesiumObj[nameFun] = myDataSource;
                console.log("add layer " + nameFun);
            });
            //ShinetekView.viewer.dataSources.add(layer);
            // ShinetekView.CesiumTMSLayers.add(layer);
            /*console.log(ShinetekView.viewer.dataSources);*/
            //ShinetekView.cesiumObj[nameFun] = layer;
        }
        else if (WorT == "Tile_Coordinates") {
            var Tile_CoordinatesLayer = new Cesium.TileCoordinatesImageryProvider();
            ShinetekView.CesiumTMSLayers.add(Tile_CoordinatesLayer);
            ShinetekView.cesiumObj[nameFun] = Tile_CoordinatesLayer;
        }
    },

    /**
     * 移除图层
     * @param nameFun
     * @param WorT
     */
    removeLayer: function (nameFun, WorT) {

        if (WorT == "GEOJSON") {
            try {
                var layer = ShinetekView.cesiumObj[nameFun];
                ShinetekView.viewer.dataSources.remove(layer, true);
                delete ShinetekView.cesiumObj[nameFun];
            } catch (err) {
                console.log(err);
            }
        } else {
            try {
                var GEOJSONlayer = ShinetekView.cesiumObj[nameFun];
                //viewer.scene.imageryLayers
                ShinetekView.CesiumTMSLayers.remove(GEOJSONlayer, true);
                delete ShinetekView.cesiumObj[nameFun];
            } catch (err) {
                console.log(err);
            }
        }
    },

    /**
     * 匹配部分名字删除图层
     * @param nameFun
     */
    removeSomeLayer: function (nameFun) {

        var myName = nameFun;
        var layers = ShinetekView.cesiumObj;
        //遍历当前图层 并对其进行移除
        for (var m_layer in layers) {
            if (m_layer.indexOf(myName) > -1) {
                ShinetekView.CesiumOpt.removeLayer(m_layer, "WorT");
            }
        }
    },

    /**
     * 移除所有图层
     */
    removeAll: function () {
        //  ShinetekView.CesiumTMSLayers.removeAll(true);
        //  ShinetekView.cesiumObj = new Object();
        var layers = ShinetekView.cesiumObj;
        for (m_layer in layers) {
            ShinetekView.CesiumOpt.removeLayer(m_layer, "WorT");
        }
        ShinetekView.cesiumObJ = new Object();
    },

    /**
     * 显示隐藏图层 toso 修改显示隐藏 与 2D一致
     * @param nameFun
     * @param WorT
     */
    setVisibility: function (nameFun, WorT, isShow) {
        this.indexOf(nameFun);
        var nameFunStatus = ShinetekView.CesiumTMSLayers.get(this.indexOf(nameFun)).show;
        nameFunStatus == true ? ShinetekView.CesiumTMSLayers.get(this.indexOf(nameFun)).show = false : ShinetekView.CesiumTMSLayers.get(this.indexOf(nameFun)).show = true;
    },

    /**
     * 获取图层在集合中的索引值
     * @param obj 集合
     * @param para 图层名
     * @returns {number} 索引
     */
    getObjIndex: function (obj, para) {
        var i = 0;
        var index = -1;
        if (para in obj) {
            for (var o in obj) {
                if (o == para) {
                    index = i;
                } else {
                    i++;
                }
            }
        }
        return index;
    },

    /**
     * 获取图层在集合中的索引值
     * @param nameFun 图层名
     */
    indexOf: function (nameFun) {
        //var layer = ShinetekView.cesiumObj[nameFun];
        var layer = ShinetekView.cesiumObj[nameFun];
        return ShinetekView.CesiumTMSLayers.indexOf(layer);
    },

    /**
     * 设置图层的z-Index的值
     * @param nameFun
     * @param zIndex
     */
    setZIndex: function (nameFun, zIndex) {

        var layer = ShinetekView.cesiumObj[nameFun];
        ShinetekView.CesiumTMSLayers.add(layer, zIndex);
    },

    /**
     * 根据索引获取图层信息
     * @param nameFun
     */
    getZIndex: function (nameFun) {
        //    var layer = ShinetekView.cesiumObj[nameFun];
        // var index = this.indexOf(nameFun);

        var index = ShinetekView.cesiumObj.indexOf(nameFun);
        ShinetekView.CesiumTMSLayers.get(index);
        console.log(ShinetekView.CesiumTMSLayers.get(index));
        return ShinetekView.CesiumTMSLayers.get(index);
    },

    /**
     * 获取经纬度、高度信息
     */
    getPosition: function () {
        //得到当前三维场景
        var scene = ShinetekView.viewer.scene;
        //得到当前三维场景的椭球体
        var ellipsoid = scene.globe.ellipsoid;
        var entity = ShinetekView.viewer.entities.add({
            label: {
                show: false
            }
        });
        var longitudeString = null;
        var latitudeString = null;
        var height = null;
        var cartesian = null;
        // 定义当前场景的画布元素的事件处理
        var handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
        //设置鼠标移动事件的处理函数，这里负责监听x,y坐标值变化
        handler.setInputAction(function (movement) {
            //通过指定的椭球或者地图对应的坐标系，将鼠标的二维坐标转换为对应椭球体三维坐标
            cartesian = ShinetekView.viewer.camera.pickEllipsoid(movement.endPosition, ellipsoid);
            if (cartesian) {
                //将笛卡尔坐标转换为地理坐标
                var cartographic = ellipsoid.cartesianToCartographic(cartesian);
                //将弧度转为度的十进制度表示
                longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
                latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
                //获取相机高度
                height = Math.ceil(ShinetekView.viewer.camera.positionCartographic.height);
                entity.position = cartesian;
                entity.label.show = true;
                entity.label.text = '(' + longitudeString + ', ' + latitudeString + "," + height + ')';
            } else {
                entity.label.show = false;
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        //设置鼠标滚动事件的处理函数，这里负责监听高度值变化
        handler.setInputAction(function (wheelment) {
            height = Math.ceil(ShinetekView.viewer.camera.positionCartographic.height);
            entity.position = cartesian;
            entity.label.show = true;
            entity.label.text = '(' + longitudeString + ', ' + latitudeString + "," + height + ')';
        }, Cesium.ScreenSpaceEventType.WHEEL);
    },

    /**
     * 获取经纬度
     */
    getLonLat: function () {
        var scene = ShinetekView.viewer.scene;
        var handler;
        var entity = ShinetekView.viewer.entities.add({
            label: {
                show: false,
                showBackground: true,
                font: '14px monospace',
                horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                verticalOrigin: Cesium.VerticalOrigin.TOP,
                pixelOffset: new Cesium.Cartesian2(15, 0)
            }
        });

        // Mouse over the globe to see the cartographic position
        handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
        handler.setInputAction(function (movement) {
            var cartesian = ShinetekView.viewer.camera.pickEllipsoid(movement.endPosition, scene.globe.ellipsoid);
            if (cartesian) {
                var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                var longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(2);
                var latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(2);

                entity.position = cartesian;
                entity.label.show = true;
                entity.label.text =
                    'Lon: ' + ('   ' + longitudeString).slice(-7) + '\u00B0' +
                    '\nLat: ' + ('   ' + latitudeString).slice(-7) + '\u00B0';
            } else {
                entity.label.show = false;
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    },

    /**
     * 地图渲染结束事件
     * @returns {string}
     */
    oGetStatus: function () {
        var olMapLoadStatus = "true";
        return olMapLoadStatus;
    },

    /**
     * 设置显示区域
     */
    setView: function () {
        ShinetekView.viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(108.90, 34.49, 10103520)
        });
    },

    /**
     * 播放动画时设置产品标题
     * @param nameLayer
     */
    setScreenTitle: function (nameLayer) {


    }
};
ShinetekView.OpenlayerOpt = {
    /**
     * 地图初始化函数
     * @param url 地图初始化时基底图层的地址
     */
    init: function (url) {
        ShinetekView.map = new ol.Map({
            layers: [
                // 加载底图
                /*ShinetekView.OpenlayerOpt.addLayer("BaseLayer","baseLayer",url,"true","TMS"),*/
            ],
            target: ShinetekView.map,
            interactions: ol.interaction.defaults(
                { pinchRotate : false }
            ),
            controls: ol.control.defaults({
                attribution: false
            }).extend([
                new ol.control.FullScreen({}), //全屏
                new ol.control.MousePosition({
                    undefinedHTML: 'outside',
                    projection: 'EPSG:4326',
                    coordinateFormat: function (coordinate) {
                        //return (ShinetekView.OpenlayerOpt.formatDegree(coordinate) + "  " + ShinetekView.map.getView().getProjection().mb);
                        return (ShinetekView.OpenlayerOpt.formatDegree(coordinate));
                        //return ol.coordinate.format(coordinate, '{x}, {y}', 5);
                    }
                }), //经纬度坐标
                /*new ol.control.OverviewMap(),*/ //鸟瞰图
                new ol.control.ScaleLine(), // 比例尺
                //new ol.control.ZoomSlider(), //滚动轴
                //new ol.control.ZoomToExtent(), //回到最大
            ]),
            /* logo:{src: '../img/face_monkey.png', href: 'http://www.openstreetmap.org/'},*/
            view: new ol.View({
                projection: 'EPSG:4326',
                center: ShinetekView.center,
                zoom: ShinetekView.zoom,
                minZoom: 0,
                maxZoom: 10,
                // 设置地图中心范围
                /*extent: [102, 29, 104, 31],*/
                // 设置成都为地图中心
                /*center: [104.06, 30.67],*/
                resolutions: ShinetekView.resolutions,
                extent: [-180, -90, 180, 90]
            })
        });

        /*//地图渲染未开始事件
         map.on('precompose',function (e) {
         var olMapLoadStatus="false";
         ShinetekView.olMapLoadStatus=olMapLoadStatus;
         });
         //地图渲染中事件
         map.on('postcompose',function (e) {
         var olMapLoadStatus="false";
         ShinetekView.olMapLoadStatus=olMapLoadStatus;
         });
         //地图渲染结束
         map.on('postrender',function (e) {
         var olMapLoadStatus="true";
         ShinetekView.olMapLoadStatus=olMapLoadStatus;
         });*/

        /*var oAllScreen=document.getElementsByClassName("ol-overlaycontainer-stopevent")[0];
         oAllScreen.onclick=function (e) {
         e = e || window.event;
         e.target = e.target || e.srcElement;
         e.preventDefault ? e.preventDefault() : e.returnValue = false;
         var oScreenF=document.getElementsByClassName("ol-full-screen-false")[0];
         var oScreenT=document.getElementsByClassName("ol-full-screen-true")[0];
         if (e.target==oScreenF){
         var newProductTitleF=document.createElement("div");
         newProductTitleF.className="productTitle";
         var newProductP=document.createElement("p");
         newProductTitleF.appendChild(newProductP);
         oAllScreen.appendChild(newProductTitleF);
         }else if (e.target==oScreenT){
         var newProductTitleT=document.getElementsByClassName("productTitle")[0];
         oAllScreen.removeChild(newProductTitleT);
         }
         };*/

        //监听地图窗口的变化，判断是否为全屏模式，并设置全屏产品标题栏是否显示
        ShinetekView.map.on('change:size', function (e) {
            var oAllScreen = document.getElementsByClassName("ol-overlaycontainer-stopevent")[0];
            var oScreenBut = document.getElementsByClassName("ol-full-screen")[0].getElementsByTagName("button")[0];
            if (oScreenBut.className == "ol-full-screen-false") {
                if (document.getElementsByClassName("productTitle")[0]) {
                    var newProductTitleT = document.getElementsByClassName("productTitle")[0];
                    oAllScreen.removeChild(newProductTitleT);
                } else {

                }
            } else if (oScreenBut.className == "ol-full-screen-true") {
                if (document.getElementsByClassName("productTitle")[0]) {

                } else {
                    var newProductTitleF = document.createElement("div");
                    newProductTitleF.className = "productTitle";
                    var newProductP = document.createElement("p");
                    newProductTitleF.appendChild(newProductP);
                    oAllScreen.appendChild(newProductTitleF);
                }
            }
        });

        //鼠标移动
        ShinetekView.map.on('pointermove', function (e) {
            //var ool_zoomslider_thumb = document.getElementsByClassName("ol-zoomslider-thumb")[0];
            //ool_zoomslider_thumb.setAttribute("title", ShinetekView.OpenlayerOpt.getZoom());
        });

        //地图缩放
        ShinetekView.OpenlayerOpt.mapZoom(ShinetekView.map);

        //地图缩放和移动时候，重置播放动画的变量
        var view = ShinetekView.map.getView();
        view.on('change:center', function (e) {
            ShinetekView.OpenlayerOpt.clearAnimate();
        });
        view.on('change:resolution', function (e) {
            ShinetekView.OpenlayerOpt.clearAnimate();
            var _ol_zoom_num = document.getElementsByClassName("ol-zoom-num")[0];
            _ol_zoom_num.getElementsByTagName("p")[0].innerHTML = parseInt(ShinetekView.OpenlayerOpt.getZoom());
        });

        ShinetekView.OpenlayerOpt.updateCss();
        ShinetekView.OpenlayerOpt.nowZoom(ShinetekView.map);

    },

    /*重置按钮样式*/
    updateCss: function () {
        /*重置+-全屏按钮*/
        var zoomNum = document.getElementsByClassName("ol-zoom")[0];
        var reforeNode = document.getElementsByClassName("ol-zoom-out")[0];
        var zoomNumDiv = document.createElement("div");
        zoomNumDiv.className = "ol-zoom-num";
        var zoomNumP = document.createElement("p");
        zoomNumDiv.appendChild(zoomNumP);
        zoomNumP.innerHTML = ShinetekView.zoom;
        zoomNum.insertBefore(zoomNumDiv, reforeNode);

        /*重置全屏按钮*/
        var _ol_full_screen_false = document.getElementsByClassName("ol-full-screen-false")[0];
        _ol_full_screen_false.innerHTML = "";
    },

    /**
     * TMS瓦片拼接规则
     * @param nameFun 图层对象名
     * @param nameLayer 图层名
     * @param oURL 图层地址
     * @param isBase 是否为基底图层
     * @param WorT 图层格式WMS/TMS/KML
     * @returns {ol.layer.Tile}
     */
    addTile: function (nameFun, nameLayer, oURL, isBase, WorT, tileType, jsonType) {
        /*switch (tileType){
         case "png":
         tileType = "png";
         break;
         case  "jpg" :
         tileType = "jpg"
         break;
         case null :
         tileType = "jpg"
         break;
         }*/
        if (tileType == "png") {
            tileType = "png";
        } else if (tileType == "jpg" || tileType == null) {
            tileType = "jpg";
        }
        //console.log(ShinetekView.wrapX);
        //判断如果为TMS瓦片格式
        var urlTemplate = oURL + "{z}/{x}/{y}." + tileType;
        var layer = new ol.layer.Tile({
            source: new ol.source.TileImage({
                projection: 'EPSG:4326',
                tileGrid: new ol.tilegrid.TileGrid({
                    origin: ol.extent.getBottomLeft(new ol.proj.get("EPSG:4326").getExtent()), // 设置原点坐标
                    resolutions: ShinetekView.resolutions,
                    extent: [-180, -90, 180, 90],
                    tileSize: [256, 256]
                }),
                wrapX: ShinetekView.wrapX,
                tileUrlFunction: function (tileCoord, pixelRatio, projection) {
                    var z = tileCoord[0];
                    var x = tileCoord[1];
                    /*var y = Math.pow(2, z) + tileCoord[2];*/
                    var y = tileCoord[2];
                    // wrap the world on the X axis
                    var n = Math.pow(2, z + 1); // 2 tiles at z=0
                    x = x % n;
                    if (x * n < 0) {
                        // x and n differ in sign so add n to wrap the result
                        // to the correct sign
                        x = x + n;
                    }
                    ShinetekView.tileAllNum++;
                    return urlTemplate.replace('{z}', z.toString())
                        .replace('{y}', y.toString())
                        .replace('{x}', x.toString());
                }
            })
        });
        layer.getSource().on('tileloadstart', function () {
            // ShinetekView.tileLoadStart++;
        });
        layer.getSource().on('tileloadend', function () {
            ShinetekView.tileLoadEnd++;
        });
        layer.getSource().on('tileloaderror', function () {
            ShinetekView.tileLoadError++;
        });
        //判断如果是基底图层只需要返回一个url地址即可
        if (isBase == "true") {
            return layer;
        }
        //如果是叠加图层,则需要返回添加图层的函数
        else if (isBase == "false") {
            ShinetekView.openlayerObj[nameFun] = layer;
            var m_LayerADD = ShinetekView.map.addLayer(layer);
            return m_LayerADD;
        }
    },

    /**
     * KML火点图样式
     * @param feature
     * @returns {*}
     */
    styleFunction: function (feature) {
        // 2012_Earthquakes_Mag5.kml stores the magnitude of each earthquake in a
        // standards-violating <magnitude> tag in each Placemark.  We extract it from
        // the Placemark's name instead.
        var name = feature.get('name');
        var magnitude = parseFloat(name.substr(2));
        var radius = 5 + 20 * (magnitude - 5);
        var style = ShinetekView.styleCache[radius];
        if (!style) {
            style = new ol.style.Style({
                image: new ol.style.Circle({
                    radius: radius,
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 153, 0, 0.4)'
                    }),
                    stroke: new ol.style.Stroke({
                        color: 'rgba(255, 204, 0, 0.2)',
                        width: 1
                    })
                })
            });
            ShinetekView.styleCache[radius] = style;
        }
        return style;
    },

    /**
     * 添加图层（TMS/WMS/KML）
     * @param nameFun 图层对象名，添加、隐藏、删除图层时使用
     * @param nameLayer 图层名
     * @param oURL 图层地址
     * @param isBase 是否为基底图层
     * @param WorT 判断图层格式是WMS/TMS/KML
     * @returns {*}
     */
    addLayer: function (nameFun, nameLayer, oURL, isBase, WorT, params) {
        /*默认的参数
         * 轨道数据geojsonType值为orbit
         * */
        var paramsDefault = {
            tileType: "jpg",
            geojsonType: "shp",
            lonlat: undefined,
            WMSName: "ne:ne",
            shpStyle: {
                color: 'grey',
                lineDash: [1],
                width: 1.3
            },
            orbitStyle: {
                lineColor: "#06cae5",
                lineWidth: 4,
                circleColor: '#06cae5',
                circleWidth: 10
            },
            geojsonLine: {
                color: "#06cae5",
                LTLon: 104,
                LTLat: 34,
                RBLon: 140,
                RBLat: 4
            },
            imageExtent: [104, 4, 140, 34],
            maptarget: "map"
        };
        if (!params) {
            params = paramsDefault;
        }

        var _maptarget = (params.maptarget) ? params.maptarget : paramsDefault.maptarget;
        //判断不同的图层格式调用不同的加载方式
        if (WorT === "WMS") {
            var _oURL = oURL.split("?")[0];
            var _oURLname = oURL.split("?")[1];
            var layer = new ol.layer.Tile({
                title: nameLayer,
                source: new ol.source.TileWMS({
                    url: oURL,
                    wrapX: ShinetekView.wrapX,
                    /* params: {
                     'VERSION': '1.1.1',
                     LAYERS: 'lzugis:capital',
                     STYLES: '',
                     tiled:true,
                     },*/
                    params: {
                        //'LAYERS': params.WMSName ? params.WMSName : paramsDefault.WMSName,
                        'LAYERS': _oURLname,
                        'TILED': true
                    },
                    serverType: 'geoserver',
                    //crossOrigin: 'anonymous'
                    // 加这个参数在加载geoserver发布的图层会存在跨域问题
                    //但是使用的是WebGL渲染器、使用Canvas渲染器访问像素数据必须有此值
                })
            });
            ShinetekView.openlayerObj[nameFun] = layer;
            var m_LayerADD = ShinetekView.map.addLayer(layer);
            return m_LayerADD;
        }
        else if (WorT === "TMS") {
            var tileTypeNew = (params.tileType) ? params.tileType : paramsDefault.tileType;
            if (oURL.indexOf('tianditu') > -1) {
                tileTypeNew = "png";
            }
            return ShinetekView.OpenlayerOpt.addTile(nameFun, nameLayer, oURL, isBase, WorT, tileTypeNew);
        }
        else if (WorT === "KML") {
            //火点的俩种加载方式
            //方法一
            var layer = new ol.layer.Heatmap({
                source: new ol.source.Vector({
                    //1.生成的KML文件，保存到此网页文件所在的目录
                    //2.也可以直接使用生成这个文件的链接，动态生成数据文件
                    url: oURL,
                    projection: 'EPSG:4326',
                    format: new ol.format.KML({
                        extractStyles: false
                    }),
                    wrapX: ShinetekView.wrapX
                }),
                blur: 5,
                radius: 5,
            });
            ShinetekView.openlayerObj[nameFun] = layer;
            return ShinetekView.map.addLayer(layer);

            /*//方法二
             var layer = new ol.layer.Vector({
             source: new ol.source.Vector({
             url: oURL,      //https://openlayers.org/en/v3.20.1/examples/data/kml/2012_Earthquakes_Mag5.kml
             format: new ol.format.KML({
             extractStyles: false
             })
             }),
             style:WMS.styleFunction
             });
             ShinetekView.obj[nameFun]=layer;
             var m_LayerADD=map.addLayer(layer);
             return m_LayerADD;*/
        }
        else if (WorT === "XYZ") {
            var layer = new ol.layer.Tile({
                title: nameLayer,
                source: new ol.source.XYZ({
                    url: oURL,
                    /*WMS.addLayer("WMS1","天地图路网","http://t4.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}","false","XYZ");*/
                    /*WMS.addLayer("WMS2","天地图文字标注","http://t3.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}","false","XYZ");*/
                })
            });
            ShinetekView.openlayerObj[nameFun] = layer;
            var m_LayerADD = ShinetekView.map.addLayer(layer);
            return m_LayerADD;
        }
        else if (WorT === "GEOJSON") {
            var geojsonTypeNew = (params.geojsonType) ? params.geojsonType : paramsDefault.geojsonType;
            if (geojsonTypeNew == "orbit") {
                //console.log(oURL);
                //console.log("添加GEOJSON中的轨道数据");
                var layer = new ol.layer.Vector({
                    source: new ol.source.Vector({
                        url: oURL,
                        format: new ol.format.GeoJSON(),
                        wrapX: ShinetekView.wrapX
                    }),
                    style: pointStyleFunction(feature, resolution)
                });

                function createTextStyle(feature, resolution) {
                    var align = 'center';
                    var baseline = 'top';
                    var size = '12px';
                    var offsetX = parseInt(0, 10);
                    var offsetY = parseInt(15, 10);
                    var weight = '12px';
                    var placement = 'point';
                    var maxAngle = '0.7853981633974483';
                    var exceedLength = false;
                    var rotation = parseFloat(0);
                    var font = weight + ' ' + size + ' ' + "12px";
                    var fillColor = "#333";
                    var outlineColor = "#eee";
                    var outlineWidth = parseInt(3, 10);

                    return new ol.style.Text({
                        textAlign: align == '' ? undefined : align,
                        textBaseline: baseline,
                        font: font,
                        text: getText(feature, resolution),
                        fill: new ol.style.Fill({
                            color: fillColor
                        }),
                        stroke: new ol.style.Stroke({
                            color: outlineColor,
                            width: outlineWidth
                        }),
                        offsetX: offsetX,
                        offsetY: offsetY,
                        placement: placement,
                        maxAngle: maxAngle,
                        exceedLength: exceedLength,
                        rotation: rotation
                    });
                };

                function pointStyleFunction(feature, resolution) {
                    return new ol.style.Style({
                        image: new ol.style.Circle({
                            radius: 1,
                            fill: new ol.style.Fill({
                                color: 'rgba(255, 0, 0, 0.1)'
                            }),
                            stroke: new ol.style.Stroke({
                                color: params.orbitStyle.circleColor ? params.orbitStyle.circleColor : paramsDefault.orbitStyle.circleColor,
                                width: params.orbitStyle.circleWidth ? params.orbitStyle.circleWidth : paramsDefault.orbitStyle.circleWidth
                            })
                        }),
                        stroke: new ol.style.Stroke({
                            color: params.orbitStyle.lineColor ? params.orbitStyle.lineColor : paramsDefault.orbitStyle.lineColor,
                            width: params.orbitStyle.lineWidth ? params.orbitStyle.lineWidth : paramsDefault.orbitStyle.lineWidth,
                        }),
                        text: createTextStyle(feature, resolution)
                    });
                };

                function getText(feature, resolution) {
                    var type = 'normal';
                    var maxResolution = '1200';
                    var text = feature.get('title');

                    if (resolution > maxResolution) {
                        text = '';
                    } else if (type == 'hide') {
                        text = '';
                    } else if (type == 'shorten') {
                        text = text.trunc(12);
                    } else if (type == 'wrap' && 'point' != 'line') {
                        text = stringDivider(text, 16, '\n');
                    }
                    return text;
                };
            } else if (geojsonTypeNew == "shp" || geojsonTypeNew == null) {
                var layer = new ol.layer.Vector({
                    extent: params.lonlat ? params.lonlat : paramsDefault.lonlat,
                    source: new ol.source.Vector({
                        format: new ol.format.GeoJSON(),
                        url: oURL,
                        wrapX: ShinetekView.wrapX
                    }),
                    style: new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: params.shpStyle.color ? params.shpStyle.color : paramsDefault.shpStyle.color,
                            lineDash: params.shpStyle.lineDash ? params.shpStyle.lineDash : paramsDefault.shpStyle.lineDash,
                            width: params.shpStyle.width ? params.shpStyle.width : paramsDefault.shpStyle.width
                        }),
                        /*fill: new ol.style.Fill({
                         color: 'rgba(0, 0, 0, 0)'
                         })*/
                    })
                });
            }
            ShinetekView.openlayerObj[nameFun] = layer;
            var m_LayerADD = ShinetekView.map.addLayer(layer);
            return m_LayerADD;
        }
        else if (WorT === "GEOJSONLINE") {
            var styleFunction = new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: (params.geojsonLine.color) ? params.geojsonLine.color : paramsDefault.geojsonLine.color,
                    width: 2
                })
            });
            var geojsonObject = {
                'type': 'FeatureCollection',
                'crs': {
                    'type': 'name',
                    'properties': {
                        'name': 'EPSG:4326'
                    }
                },
                'features': [{
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Polygon',
                        'coordinates': [
                            [
                                [(params.geojsonLine.LTLon) ? params.geojsonLine.LTLon : paramsDefault.geojsonLine.LTLon,
                                (params.geojsonLine.LTLat) ? params.geojsonLine.LTLat : paramsDefault.geojsonLine.LTLat],
                                [(params.geojsonLine.LTLon) ? params.geojsonLine.LTLon : paramsDefault.geojsonLine.LTLon,
                                    (params.geojsonLine.RBLat) ? params.geojsonLine.RBLat : paramsDefault.geojsonLine.RBLat],
                                [(params.geojsonLine.RBLon) ? params.geojsonLine.RBLon : paramsDefault.geojsonLine.RBLon,
                                    (params.geojsonLine.RBLat) ? params.geojsonLine.RBLat : paramsDefault.geojsonLine.RBLat],
                                [(params.geojsonLine.RBLon) ? params.geojsonLine.RBLon : paramsDefault.geojsonLine.RBLon,
                                    (params.geojsonLine.LTLat) ? params.geojsonLine.LTLat : paramsDefault.geojsonLine.LTLat]
                            ]
                        ]
                    }
                }]
            };

            var vectorSource = new ol.source.Vector({
                features: (new ol.format.GeoJSON()).readFeatures(geojsonObject)
            });

            var layer = new ol.layer.Vector({
                source: vectorSource,
                style: styleFunction
            });
            /*ShinetekView.VectorNum = ShinetekView.VectorNum + 1;
            var VectorName = "VectorName" + ShinetekView.VectorNum;*/
            layer.setZIndex(5000);
            /*ShinetekView.AnalysisAry.push({
                type: "Box",
                point: [
                    [(params.geojsonLine.LTLon) ? params.geojsonLine.LTLon : paramsDefault.geojsonLine.LTLon,
                    (params.geojsonLine.LTLat) ? params.geojsonLine.LTLat : paramsDefault.geojsonLine.LTLat],
                    [(params.geojsonLine.RBLon) ? params.geojsonLine.RBLon : paramsDefault.geojsonLine.RBLon,
                    (params.geojsonLine.RBLat) ? params.geojsonLine.RBLat : paramsDefault.geojsonLine.RBLat]
                ]
            })*/
            if (_maptarget == "map") {
                ShinetekView.openlayerObj[nameFun] = layer;
                var m_LayerADD = ShinetekView.map.addLayer(layer);
            } else if (_maptarget == "rasterMap") {
                ShinetekView.openlayerObj[nameFun] = layer;
                var m_LayerADD = ShinetekView.rasterMap.addLayer(layer);
            }
            //console.log(ShinetekView.openlayerObj);
            return m_LayerADD;
        }
        else if (WorT === "IMAGE") {
            //console.log(params);
            var projection = new ol.proj.Projection({
                units: 'pixels',
                extent: (params.imageExtent) ? params.imageExtent : paramsDefault.imageExtent
            });
            //添加一个 layer
            var layer = new ol.layer.Image({
                source: new ol.source.ImageStatic({
                    url: oURL,
                    projection: projection,
                    imageExtent: (params.imageExtent) ? params.imageExtent : paramsDefault.imageExtent
                }),
            });
            if (_maptarget == "map") {
                ShinetekView.openlayerObj[nameFun] = layer;
                console.log(ShinetekView.map);
                var m_LayerADD = ShinetekView.map.addLayer(layer);
            } else if (_maptarget == "rasterMap") {
                ShinetekView.openlayerRasterObj[nameFun] = layer;
                console.log(ShinetekView.rasterMap);
                var m_LayerADD = ShinetekView.rasterMap.addLayer(layer);
            }
            return m_LayerADD;
        }
    },

    /**
     * 在地图上绘制图形
     */
    addInteractions: function (polygonType, maptarget) {
        ShinetekView.source = new ol.source.Vector();
        var vector = new ol.layer.Vector({
            source: ShinetekView.source,
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                }),
                stroke: new ol.style.Stroke({
                    color: 'red',
                    width: 2
                }),
                image: new ol.style.Circle({
                    radius: 7,
                    fill: new ol.style.Fill({
                        color: 'red'
                    })
                }),
            }),
            zIndex: 5000
        });
        ShinetekView.VectorNum = ShinetekView.VectorNum + 1;
        var VectorName = "VectorName" + ShinetekView.VectorNum;
        ShinetekView.openlayerVectorObj[VectorName] = vector;
        ShinetekView.map.addLayer(vector);
        //ShinetekView.openlayerVectorRasterObj[VectorName] = vector;
        //ShinetekView.rasterMap.addLayer(vector);
        if (polygonType == "Square") {
            polygonType = 'Square';
            geometryFunction = ol.interaction.Draw.createRegularPolygon(4);
            var draw = new ol.interaction.Draw({
                source: ShinetekView.source,
                type: polygonType,
                geometryFunction: geometryFunction
            });
            ShinetekView.draw = draw;
            //var snap = new ol.interaction.Snap({source: ShinetekView.source});
            //ShinetekView.snap = snap;
            if (maptarget == "map") {
                draw.on('drawend', function (vector) {
                    //记录分析的类型与点值
                    ShinetekView.AnalysisAry.push({
                        type: vector.target.R,
                        point: vector.target.a
                    })
                    //console.log(ShinetekView.AnalysisAry);
                });
                ShinetekView.map.addInteraction(draw);
                //ShinetekView.map.addInteraction(snap);
            }
            else if (maptarget == "rasterMap") {
                ShinetekView.rasterMap.addInteraction(draw);
                //ShinetekView.rasterMap.addInteraction(snap);
            }
        }
        else if (polygonType == "Box") {
            polygonType = 'Circle';
            geometryFunction = ol.interaction.Draw.createBox();
            var draw = new ol.interaction.Draw({
                source: ShinetekView.source,
                type: polygonType,
                geometryFunction: geometryFunction
            });
            ShinetekView.draw = draw;
            //var snap = new ol.interaction.Snap({source: ShinetekView.source});
            //ShinetekView.snap = snap;
            if (maptarget == "map") {
                draw.on('drawend', function (vector) {
                    //记录分析的值
                    ShinetekView.AnalysisAry.push({
                        type: "Box",
                        point: vector.target.a
                    })
                    //console.log(ShinetekView.AnalysisAry);
                });
                ShinetekView.map.addInteraction(draw);
                //ShinetekView.map.addInteraction(snap);

            }
            else if (maptarget == "rasterMap") {
                ShinetekView.rasterMap.addInteraction(draw);
                //ShinetekView.rasterMap.addInteraction(snap);
            }
        }
        else {
            var draw = new ol.interaction.Draw({
                source: ShinetekView.source,
                type: polygonType
            });
            ShinetekView.draw = draw;
            //var snap = new ol.interaction.Snap({source: ShinetekView.source});
            //ShinetekView.snap = snap;
            if (maptarget == "map") {
                draw.on('drawend', function (vector) {
                    //记录分析的值
                    ShinetekView.AnalysisAry.push({
                        type: vector.target.R,
                        point: vector.target.a
                    })
                    //console.log(ShinetekView.AnalysisAry);
                });
                ShinetekView.map.addInteraction(draw);
                //ShinetekView.map.addInteraction(snap);
            }
            else if (maptarget == "rasterMap") {
                ShinetekView.rasterMap.addInteraction(draw);
                //ShinetekView.rasterMap.addInteraction(snap);
            }
        }
    },

    /**
     * 取消绘制的图形
     */
    removeInteractions: function (maptarget) {
        if (maptarget == "map") {
            //console.log(ShinetekView.draw);
            ShinetekView.map.removeInteraction(ShinetekView.draw);
            //ShinetekView.map.removeInteraction(ShinetekView.snap);
        } else if (maptarget == "rasterMap") {
            ShinetekView.rasterMap.removeInteraction(ShinetekView.draw);
            //ShinetekView.rasterMap.removeInteraction(ShinetekView.snap);
        }
    },

    /**
     * 移除所有的Vector图层
     */
    removeAllVectorLayer: function () {
        ShinetekView.AnalysisAry = [];
        for (var key in ShinetekView.openlayerVectorObj) {
            var layer = ShinetekView.openlayerVectorObj[key];
            ShinetekView.map.removeLayer(layer);
            delete ShinetekView.openlayerVectorObj[key];
        }
        /*for(var rasterKey in ShinetekView.openlayerVectorRasterObj){
         var rasterLayer = ShinetekView.openlayerVectorRasterObj[rasterKey];
         ShinetekView.rasterMap.removeLayer(rasterLayer);
         delete ShinetekView.openlayerVectorRasterObj[rasterKey];
         }*/
    },

    /**
     * 移除图层
     * @param nameFun 图层对象名
     * @param WorT 图层格式WMS/TMS/KML
     */
    removeLayer: function (nameFun, WorT) {
        var WorT = WorT;
        var layer = ShinetekView.openlayerObj[nameFun];
        ShinetekView.map.removeLayer(layer);
        delete ShinetekView.openlayerObj[nameFun];
    },

    /**
     * 匹配部分名字进行删除图层
     * @param nameFun 图层名的部分
     */
    removeSomeLayer: function (nameFun) {
        //console.log(map.getLayers());
        var layer = ShinetekView.openlayerObj[nameFun];
        var myName = nameFun;
        var layers = ShinetekView.openlayerObj;
        /*console.log(layers)*/
        for (i in layers) {
            if (myName.indexOf(i) >= 0) {
                ShinetekView.map.removeLayer(i)
            }
        }
    },

    /**
     *  显示隐藏图层
     * @param nameFun 图层对象名
     * @param WorT 图层格式WMS/TMS/KML
     */
    setVisibility: function (nameFun, WorT, isShow) {
        var WorT = WorT;
        var layer = ShinetekView.openlayerObj[nameFun];
        //(layer.getVisible() == true) ? layer.setVisible(false) : layer.setVisible(true);
        if (layer) {
            if (isShow) {
                layer.setVisible(true);
            } else {
                layer.setVisible(false);
            }
        }
    },

    //监听图片开始加载
    oStart: function (nameFun) {
        var layer = ShinetekView.openlayerObj[nameFun];
        layer.getSource().on('tileloadstart', function (event) {
            //alert("111")
        });
    },

    //监听图片结束加载
    oEnd: function (nameFun) {
        var layer = ShinetekView.openlayerObj[nameFun];
        layer.getSource().on('tileloadend', function (event) {
            //alert("222")
        });
    },

    //地图渲染结束事件
    oGetStatus: function () {
        if (ShinetekView.tileAllNum <= ShinetekView.tileLoadEnd + ShinetekView.tileLoadError) {
            //console.log("true");

            ShinetekView.OpenlayerOpt.clearAnimate();
            return true;
        } else {

            return false;
        }
    },

    //刷新图层
    oRefresh: function () {
        ShinetekView.map.updateSize();
    },

    /**
     * 获取图层当前z-index值
     * @param nameFun 图层对象名
     */
    getZIndex: function (nameFun) {
        var layer = ShinetekView.openlayerObj[nameFun];
        /*      console.log("layer");
         console.log(layer);*/
        return layer.getZIndex();
    },

    /**
     * 设置图层z-index值
     * @param nameFun 图层对象名
     * @param zIndex 新的z-index值
     */
    setZIndex: function (nameFun, zIndex) {
        var layer = ShinetekView.openlayerObj[nameFun];
        layer.setZIndex(zIndex);
    },

    /*// Create the graticule component 经纬度网格
     graticule : new ol.Graticule({
     // the style to use for the lines, optional.
     strokeStyle: new ol.style.Stroke({
     color: 'rgba(255,120,0,0.9)',
     width: 2,
     lineDash: [0.5, 4]
     })
     }),
     graticule.setMap(map);*/

    /**
     * 移动到固定位置
     */
    moveToChengDu: function () {
        var view = ShinetekView.map.getView();
        // 设置地图中心为成都的坐标，即可让地图移动到成都
        view.setCenter(ol.proj.transform([104.06, 30.67], 'EPSG:4326', 'EPSG:3857'));
        ShinetekView.map.render();
    },

    /**
     * 显示固定范围
     */
    fitToChengdu: function () {
        // 让地图最大化完全地显示区域[104, 30.6, 104.12, 30.74]
        ShinetekView.map.getView().fit([104, 30.6, 104.12, 30.74], ShinetekView.map.getSize());
    },

    /**
     * 经纬度网格
     */
    graticule: function () {
        var graticule = new ol.Graticule({
            // the style to use for the lines, optional.
            strokeStyle: new ol.style.Stroke({
                color: 'rgba(255,120,0,0.9)',
                width: 2,
                lineDash: [0.5, 4],
            }),
        });
        graticule.setMap(ShinetekView.map);
    },

    /**
     *获取分辨率等信息
     */
    getRe: function () {
        return ShinetekView.map.getView().getResolution();
    },

    /**
     * 获取当前的zoom值
     */
    getZoom: function () {
        return ShinetekView.map.getView().getZoom();
    },

    /**
     * 地图缩放事件
     *
     */
    mapZoom: function (map) {
        var view = map.getView();
        ShinetekView.OpenlayerOpt.newResolution(ShinetekView.OpenlayerOpt.getRe());

        view.on("change:resolution", function (e) {
            var res = map.getView().getResolution();
            /* alert(res+'zoom了');*/
            var oResParent = document.getElementsByClassName(
                "ol-scale-line ol-unselectable"
            )[0];
            //清空上一个div
            var oResParent_child = oResParent.childNodes;
            if (oResParent_child.length == "1") {
            } else if (oResParent_child.length !== "1") {
                var oldmyResolution = document.getElementsByClassName("myResolution");
                for (var i = 0; i < oldmyResolution.length; i++) {
                    oResParent.removeChild(oldmyResolution[i]);
                }
            }
            /*console.log(oResParent_child.length);*/

            //创建div
            ShinetekView.OpenlayerOpt.newResolution(res);
        });
    },

    /**
     * 创建、显示分辨率信息
     */
    newResolution: function (res) {
        var oResParent = document.getElementsByClassName(
            "ol-scale-line ol-unselectable"
        )[0];
        var myResolution = document.createElement("div");
        myResolution.className = "myResolution";
        res = parseInt(res * 100000 * 4096 / 4000) + "M";
        myResolution.innerHTML = "分辨率：" + res;
        oResParent.appendChild(myResolution);
    },

    /**
     * 播放动画时设置产品标题
     * @param nameLayer
     */
    setScreenTitle: function (nameLayer) {
        var oScreenBut = document.getElementsByClassName("ol-full-screen")[0].getElementsByTagName("button")[0];
        if (oScreenBut.className == "ol-full-screen-false") {

        } else if (oScreenBut.className == "ol-full-screen-true") {
            var oTitleP = document.getElementsByClassName("productTitle")[0].getElementsByTagName("p")[0];
            oTitleP.innerHTML = nameLayer;
        }
    },

    /**
     * 重置动画播放的锁
     */
    clearAnimate: function () {
        ShinetekView.tileAllNum = 0;
        ShinetekView.tileLoadEnd = 0;
        /*    http://10.24.10.96/FY3B_MERSI_321/MERSI/yyyyMMdd/*/
        ShinetekView.tileLoadError = 0;
    },

    /*将度转换成为度分秒*/
    formatDegree: function (value) {

        var x = value[0];
        var y = value[1];

        while (x > 180) {
            x = x - 360;
        }
        while (x < -180) {
            x = x + 360;
        }
        //console.log("变化前的经纬度："+x,y);

        var lon_add, lat_add;
        if (x > 0) {
            lon_add = "E";
        } else if (x < 0) {
            lon_add = "W";
            x = -x;
        }
        if (y > 0) {
            lat_add = "N";
        } else if (y < 0) {
            lat_add = "S";
            y = -y;
        }

        //附：29.73784595,103.5863933 转化为度分秒就是：北纬N29°44′16.25″ 东经E103°35′11.02″

        valuelon = Math.abs(x);
        var v1lon = Math.floor(valuelon); //度
        var v2lon = Math.floor((valuelon - v1lon) * 60); //分
        var v3lon = Math.round((valuelon - v1lon) * 3600 % 60); //秒

        valuelat = Math.abs(y);
        var v1lat = Math.floor(valuelat); //度
        var v2lat = Math.floor((valuelat - v1lat) * 60); //分
        var v3lat = Math.round((valuelat - v1lat) * 3600 % 60); //秒
        var newValue = v1lon + '°' + v2lon + '\'' + v3lon + '" ' + lon_add + "," + v1lat + '°' + v2lat + '\'' + v3lat + '"' + lat_add;
        //console.log("变化后的经纬度："+newValue);
        return newValue;
    },

    /**
     * 帮助
     */
    helpFunction: function (status) {
        if (status == "true") {
            //打开帮助文档
        } else if (status == "false") {
            //关闭帮助文档
        }

    },

    /**
     * 地图缩放监听getzoom函数
     */
    nowZoom: function (map) {
        var view = map.getView();
        view.on("change:resolution", function (e) {
            // console.log("change:resolution");
            var nowZoomNum = parseInt(ShinetekView.OpenlayerOpt.getZoom());
            $("#map").trigger("resolutionChange", [nowZoomNum]);
        });
    }
};
ShinetekView.SatelliteView = {
    setMapFun: function (showType) {
        if (showType == '2D' || showType == '3D') {
            ShinetekView.showMode = showType;
        }
        /*  var o2_3tool_sel = document.getElementsByClassName("glyphicon-mapType")[0].innerHTML;
         var omap2D = document.getElementsByClassName("map2D")[0];
         var omap3D = document.getElementsByClassName("map3D")[0];
         /!*    require.config({
         baseUrl: 'lib/Cesium/Source',
         waitSeconds: 60
         });*!/
         // Shinetek3D.CesiumOpt.init("http://10.24.10.108/IMAGEL2/GBAL/");
         //console.log(o2_3tool_sel);
         if (o2_3tool_sel == "2D") {
         document.getElementsByClassName("glyphicon-mapType")[0].innerHTML = "3D";
         omap2D.style.display = "block";
         omap3D.style.display = "none";
         ShinetekView.showMode = "2D";

         }
         else if (o2_3tool_sel == "3D") {
         document.getElementsByClassName("glyphicon-mapType")[0].innerHTML = "2D";
         omap2D.style.display = "none";
         omap3D.style.display = "block";
         ShinetekView.showMode = "3D";
         }*/
    },
    getMapFun: function () {
        if (ShinetekView.showMode == '3D') {
            return '0';
        } else {
            return '1';
        }
    },
    init: function (url) {
        if (ShinetekView.showMode == '3D') {
            ShinetekView.CesiumOpt.init(url);
        } else {
            ShinetekView.OpenlayerOpt.init(url);
        }

    },
    addLayer: function (nameFun, nameLayer, oURL, isBase, WorT, tileType, geojsonType) {
        this.getMapFun() == '1' ?
            ShinetekView.OpenlayerOpt.addLayer(nameFun, nameLayer, oURL, isBase, WorT, tileType, geojsonType) :
            ShinetekView.CesiumOpt.addLayer(nameFun, nameLayer, oURL, isBase, WorT);
    },
    removeLayer: function (nameFun, WorT) {
        this.getMapFun() == '1' ?
            ShinetekView.OpenlayerOpt.removeLayer(nameFun, WorT) :
            ShinetekView.CesiumOpt.removeLayer(nameFun, WorT);
    },
    setVisibility: function (nameFun, WorT, isShow) {
        this.getMapFun() == '1' ?
            ShinetekView.OpenlayerOpt.setVisibility(nameFun, WorT, isShow) :
            ShinetekView.CesiumOpt.setVisibility(nameFun, WorT, isShow);
    },

    setZIndex: function (nameFun, zIndex) {
        this.getMapFun() == '1' ?
            ShinetekView.OpenlayerOpt.setZIndex(nameFun, zIndex) :
            ShinetekView.CesiumOpt.setZIndex(nameFun, zIndex);
    },

    getZIndex: function (nameFun) {
        this.getMapFun() == '1' ?
            ShinetekView.OpenlayerOpt.getZIndex(nameFun) :
            ShinetekView.CesiumOpt.getZIndex(nameFun);
    },

    getRe: function () {
        this.getMapFun() == '1' ?
            ShinetekView.OpenlayerOpt.getRe() :
            ShinetekView.CesiumOpt.getRe();
    },

    getZoom: function () {
        this.getMapFun() == '1' ?
            ShinetekView.OpenlayerOpt.getZoom() :
            ShinetekView.CesiumOpt.getZoom();
    },

    newResolution: function (res) {
        this.getMapFun() == '1' ?
            ShinetekView.OpenlayerOpt.newResolution(res) :
            ShinetekView.CesiumOpt.newResolution(res);
    },

    setScreenTitle: function (nameLayer) {
        this.getMapFun() == '1' ?
            ShinetekView.OpenlayerOpt.setScreenTitle(nameLayer) :
            ShinetekView.CesiumOpt.setScreenTitle(nameLayer);
    },

    oGetStatus: function () {
        if (this.getMapFun() == '1') {
            return ShinetekView.OpenlayerOpt.oGetStatus();
        } else {
            return ShinetekView.CesiumOpt.oGetStatus();
        }
    },

    removeAllLayer: function () {
        //todo 目前使用 3D模式清除
        if (this.getMapFun() == '0') {
            return ShinetekView.CesiumOpt.removeSomeLayer('');
            // return Shinetek3D.CesiumOpt.removeSomeLayer("");
        }
    },

    clearAnimate: function () {
        if (this.getMapFun() == '1') {
            return ShinetekView.OpenlayerOpt.clearAnimate();
            // return Shinetek3D.CesiumOpt.removeSomeLayer("");
        }
    }
};