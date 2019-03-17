(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, (global.chord = global.chord || {}, global.chord.bundle = factory()));
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

    return chord;

}));
