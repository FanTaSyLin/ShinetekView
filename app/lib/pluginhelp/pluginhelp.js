(function ($, factory) {
    if (!window.svPlugin) {
        window.svPlugin = {};
    }
    factory(window.svPlugin);
})(jQuery, function factory(svPlugin) {
    var manifestList = [];
    function getPluginManifest(pluginSchemas, callback) {
        if (pluginSchemas.length < 1) {
            return callback();
        }
        var plugin = pluginSchemas.shift();
        (function (plugin) {
            $.ajax({
                type: "GET",
                url: plugin.url + "/manifest",
                dataType: "json",
                success: function (data) {
                    var manifest = data;
                    manifest.host = plugin.host;
                    manifestList.push(manifest);
                    getPluginManifest(pluginSchemas, callback);
                },
                error: function () {
                    getPluginManifest(pluginSchemas, callback);
                }
            });
        })(plugin);
    }
    function injectPlugin(manifest) {
        if (!manifest || !manifest.scripts) {
            return;
        }
        manifest.scripts.forEach(script => {
            var url = manifest.host + "/" + script;
            $.getScript(url);
        });
    }
    function getManifest (name) {
        return svPlugin.pluginManifests[name] || undefined
    }
    function pluginInject_button(element) {
        // 关于css样式的检查早晚要加
        // codeSecurity(element);
        $("#plugin-button-area").append(element);
    }
    function codeSecurity(element) {
        var myStyleSheet = undefined;
        document.styleSheets.forEach(styleSheet => {
            if (styleSheet.type === "text/css" && styleSheet.href.indexOf("worldview.css") > -1) {
                myStyleSheet = styleSheet;
            }
        });
    }
    svPlugin.pluginInit = function (pluginSchemas) {
        if (!svPlugin.pluginManifests) {
            svPlugin.pluginManifests = {};
        }
        getPluginManifest(pluginSchemas, function () {
            // console.log(manifestList);
            manifestList.forEach(manifest => {
                injectPlugin(manifest);
                svPlugin.pluginManifests[manifest.name] = manifest;
            });
        });
    }
    svPlugin.register = function (funcName, func) {
        if (!svPlugin.pluginHelp) {
            svPlugin.pluginHelp = {};
            svPlugin.pluginHelp["getManifest"] = getManifest;
        }
        if (!svPlugin.pluginHelp[funcName]) {
            svPlugin.pluginHelp[funcName] = func;
        }
    }
    svPlugin.pluginInject = function (element, type) {
        switch (type) {
            case "button":
                return pluginInject_button(element);
            case "activity":
                return pluginInject_button(element);
        }
    }
});