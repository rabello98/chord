(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, (global.chord = global.chord || {}, global.chord.bundle = factory()));
}(this, (function () { 'use strict';

    var chord = {
        globalModules: {},
        _currentModuleProperties: [],
        _containerElement: '',

        initGlobalModules (modules) {
            modules && typeof modules === typeof Object()
            ? this.globalModules = modules 
            : this.error('To use the global modules it is necessary to pass an object');
        },

        init (router, containerElement) {
            containerElement && typeof containerElement === typeof "" && containerElement.includes('#')
            ? this._containerElement = containerElement
            : this.error(`you must pass a valid string to configure the application. The string must contain a valid id ('#element')`);
            
            router.loadApp();
        },

        _mapProperties (currentModule) {
            this._currentModuleProperties = Object.keys(currentModule.component);
        },

        _unMapProperties () {
            if (this._currentModuleProperties.length) {
                this._currentModuleProperties.forEach(propertie => {
                    delete window[propertie];
                });
                this._currentModuleProperties = {};
            }
        },

        _beforeCreate () {
            
        },

        _afterCreate () {
            
        },

        _renderModule (currentModule) {
            if (currentModule.hasOwnProperty('component') 
            && typeof currentModule.component === typeof Object()) {
                Object.assign(window, currentModule.component);
                this._mapProperties(currentModule);
            } else {
                this.error(`the component must contain its properties in a 'component' object`);
            }
        },

        _renderView (currentView) {
            $(this._containerElement).html(currentView);
        },

        _beforeRemove () {
            
        },

        _dismountModule () {
            this._unMapProperties();
        },

        _afterRemove () {
            
        },

        runLifeCicle (curentModule, currentView) {
            this._beforeRemove();
            this.runLifeCicleComponentMethod(curentModule.beforeRemove);
            this._dismountModule();
            this._afterRemove();
            this.runLifeCicleComponentMethod(curentModule.afterRemove);
            this._renderModule(curentModule);
            this._beforeCreate();
            this.runLifeCicleComponentMethod(curentModule.beforeCreate);
            this._renderView(currentView);
            this._afterCreate();
            this.runLifeCicleComponentMethod(curentModule.afterCreate);
        },

        runLifeCicleComponentMethod (method) {
            if (method) {
                method && typeof method == typeof Function 
                ? method() 
                : this.error('It is necessary that each Life Cycle method be a function');
            }
        },

        error (errorMessage) {
            throw new Error(errorMessage)
        }
    };

    return chord;

})));
