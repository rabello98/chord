export default {
    globalModules: {},
    _containerElement: '',
    _currentModule: {},
    _transitionTime: 250,

    initGlobalModules (modules) {
        modules && typeof modules === typeof Object()
        ? this.globalModules = modules 
        : this.error('To use the global modules it is necessary to pass an object')
    },

    init (router, containerElement) {
        containerElement && typeof containerElement === typeof "" && containerElement.includes('#')
        ? this._containerElement = containerElement
        : this.error(`you must pass a valid string to configure the application. The string must contain a valid id ('#element')`)
        
        router.loadApp()
    },

    _unMapProperties () {
        let props2Remove = Object.keys(this._currentModule.component)
        if (props2Remove.length) {
            props2Remove.forEach(propertie => {
                delete window[propertie]
            })
        }
    },

    _beforeCreate () {

    },

    _afterCreate () {
        setTimeout(()=>{
            $(this._containerElement).addClass('show')
        }, this._transitionTime)
    },

    _renderModule (newModule) {
        if (newModule.hasOwnProperty('component') 
        && typeof newModule.component === typeof Object()) {
            Object.assign(window, newModule.component)
            this._currentModule = newModule
        } else {
            this.error(`the component must contain its properties in a 'component' object`)
        }
    },

    _renderView (newView) {
        setTimeout(()=>{
            $(this._containerElement).html(newView)
        }, this._transitionTime)
    },

    _beforeRemove () {
        $(this._containerElement).removeClass('show')
    },

    _dismountModule () {
        this._unMapProperties()
        setTimeout(()=>{
            $(this._containerElement).html('')
        }, this._transitionTime)
    },

    _afterRemove () {
        
    },

    runLifeCicle (newModule, newView, params) {
        if (Object.keys(this._currentModule).length) {
            this._beforeRemove()
            this.runLifeCicleComponentMethod(this._currentModule.beforeRemove)
            this._dismountModule()
            this._afterRemove()
            this.runLifeCicleComponentMethod(this._currentModule.afterRemove)
        }
        this._renderModule(newModule)
        this._beforeCreate(params)
        this.runLifeCicleComponentMethod(newModule.beforeCreate, params)
        this._renderView(newView)
        this._afterCreate()
        this.runLifeCicleComponentMethod(newModule.afterCreate)
    },

    runLifeCicleComponentMethod (method, params) {
        if (method) {
            method && typeof method == typeof Function 
            ? method(params) 
            : this.error('It is necessary that each Life Cycle method be a function')
        }
    },

    error (errorMessage) {
        throw new Error(errorMessage)
    }
}