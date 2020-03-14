export default {
    _history: window.history,
    historyMode: false,
    _routes: [],
    _currUrl: new Object(),
    baseUrl: 'http://localhost:8000/',

    initConfig () {
        if (!this.historyMode) {
            window.addEventListener('hashchange', () =>  {
                this.loadUrl()
            }, false)

            this.baseUrl = this.baseUrl + '#'
            this._currUrl = new URL(this.baseUrl)
            this._history.replaceState({}, 'home', this.baseUrl)
        }
    },

    loadUrl () {
        this._currUrl = new URL(window.location.href)
        this._executeNavigate(this.getRoute({ path: this._currUrl.pathname }))
    },

    getRoute (options) {
        if (options.name) {
            return this._routes.filter(route => {
                return route.name == options.name
            })[0]
        } else if (options.path) {
            return this._routes.filter(route => {
                return route.path == options.path
            })[0]
        }
    },

    navigateNext () {
        this._history.forward()
    },

    navigateBack () {
        this._history.back()
    },

    getLength () {
        return this._history.length
    },

    navigate (options) {
        var route = this.getRoute({ name: options.name})
        this._currUrl = new URL(this.baseUrl + route.path)
        this._executeNavigate(route)
    },

    _executeNavigate (route) {
        $chord.runLifeCicle(route.module, route.view)
        this._history.pushState({}, route.name, this.historyMode ? route.path : this.baseUrl + route.path)   
    }
}