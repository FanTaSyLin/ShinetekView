(function () {

    'use strict';

    angular.module('SatelliteView')
        .config(SVConfig);

    SVConfig.$inject = ['$httpProvider'];

    function SVConfig($httpProvider) {
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }

})();