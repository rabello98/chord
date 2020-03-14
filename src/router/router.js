import history from './history/history'

export default {
    routes: [],
    
    loadApp () {
        history.loadUrl()
    },

    init (options) {
        if (options.routes && typeof options.routes === typeof Array()) {
            this.routes = options.routes
            history._routes = Object.values(this.routes)
        } else $chord.error('the configured router is not valid: it must be a valid routes configured.')
        
        if(options.historyMode) 
            history.historyMode = true

        history.initConfig()
    },

    go (options) {
        history.navigate(options)
    },
}