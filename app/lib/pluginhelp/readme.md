# Plugin

## 使用说明

* SatelliteView-API-Resource中必须包含 ./plugin资源

    > eg: http://localhost:4001/plugin

* ./plugin 的返回值必须是
  * disabled: 插件是否禁用
  * url: 插件的API地址
  * host: API地址的host
  * description: 描述信息
  * name: 插件名

```plugin-module
{
        "data":[
            {
                "disabled": true,
                "url": "http://localhost:4100/plugin/sst-analyze",
                "host": "http://localhost:4100",
                "description": "广州示范站海温产品应用示范1",
                "name": "SST-Analyze"
            },
            {
                "disabled": false,
                "url": "http://10.24.4.118:4100/plugin/sst-analyze",
                "host": "http://10.24.4.118:4100",
                "description": "广州示范站海温产品应用示范2",
                "name": "SST-Analyze"
            }
        ]
  }
```

* 插件的API中必须包含 manifest资源

    >eg: http://10.24.4.118:4100/plugin/sst-analyze/manifest

* ./manifest的返回值必须包含以下内容:
  * version: 版本号
  * name: manifest的名称(唯一标识)
  * scripts: 需要加载的script脚本名

```manifest-module
    {
        "version": "0.0.1",
        "name": "SST-Analyze",
        "scripts": [
            "injectPlugin.js"
        ]
    }
```

## API

svPlugin.pluginHelp 中的所有API通过svPlugin.register()在controller中进行注册，目前提供以下API:

* getManifest: 获取指定插件的manifest信息
* getDatetime: 获取时间轴上选中的时间
* getLayer: 获取map中的toplayer
* getGeometry: 获取map中所有已框选区域的geometry

### getDatetime

> svPlugin.pluginHelp.getDatetime() => moment

### getLayer

> svPlugin.pluginHelp.getLayer() => layermodule

### getGeometry

>svPlugin.pluginHelp.getGeometry() => geometryModule

```geometry-module
[
    {
        "type": "Box",
        "point": [[100, 20], [110, 10]]
    },
    {
        "type": "Box",
        "point": [[105, 25], [110, 15]]
    }
]
```

## 注意事项

* 插件中的所有函数都要写在一个闭包中，防止污染主程序
* 插件中的所有元素样式建议使用以下方法，避免污染主程序:
  * 内联样式，如: style=""
  * ID/伪类选择器，如: #[pluginName] div {} / .[pluginName] div {}