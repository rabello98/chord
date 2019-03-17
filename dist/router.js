(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, (global.router = global.router || {}, global.router.bundle = factory()));
}(this, function () { 'use strict';

    var chord = {
        globalModules: {},

        initGlobalModules (modules) {
            this.globalModules = modules;
        },

        render (currentView, currentModule) {
            //
        },

        init () {
            //
        }
    };

    var router = {
        routes: [],

        init (routes) {
            this.routes = routes;
        },

        go (route) {
            chord.render(route.view, route.module);
        }
    };

    return router;

}));
