(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, (global.router = global.router || {}, global.router.bundle = factory()));
}(this, (function () { 'use strict';

    var history = {
        _history: window.history,
        historyMode: false,
        _routes: [],
        _currUrl: new Object(),
        baseUrl: 'http://localhost:8000/',

        initConfig () {
            if (!this.historyMode) {
                window.addEventListener('hashchange', () =>  {
                    this.loadUrl();
                }, false);
                
                this.baseUrl = this.baseUrl + '#';
                this._currUrl = new URL(window.location.href);
                if (!this._currUrl.hash) {
                    this._currUrl = new URL(this.baseUrl);
                    this._history.replaceState({}, 'home', this.baseUrl);
                }
            }
        },

        loadUrl () {
            this._currUrl = new URL(window.location.href);
            this._executeNavigate(this.getRouteByPath({ path: this._currUrl.pathname }));
        },

        getRouteByPath (options) {
            if (options.path) {
                var getRoute = (fragments) => {
                    var routes2find = this._routes;
                    fragments.forEach(fragment => {
                        var found = [];
                        routes2find.forEach(route => { 
                            if (route.path.includes(fragment)) found.push(route); 
                        });

                        if (found.length)
                            routes2find = found;
                    });

                    var route = Object.assign({}, ...routes2find);
                    if (Object.keys(route).length) {
                        route.path = this._currUrl.hash ? this._currUrl.hash.replace('#', '') : this._currUrl.pathname;
                        return route
                    } else return null
                    
                };

                var getDefaultRoute = () => {
                    return this._routes.filter(route => {
                        return route.path == '/'
                    })[0]
                };

                if (options.path == '/') {
                    if (this._currUrl.hash) {
                        var fragments = this._currUrl.hash.replace('#', '').split('/').filter(el => el);
                        return getRoute(fragments)
                    } else return getDefaultRoute()
                }

                var fragments = this._currUrl.pathname.split('/').filter(el => el);
                return getRoute(fragments)
            }
        },

        getRouteByName (options) {
            if (options.name) {
                var route = Object.assign({}, this._routes.filter(route => {
                    return route.name == options.name
                })[0]);

                // optional params
                if (route.path.includes('(')
                    && route.path.includes(':')
                    && route.path.includes(')')) {

                    if (options.params) {
                        var paramsKey = Object.keys(options.params);
                        
                        paramsKey.forEach(key => {
                            if (route.path.includes(key)) {
                                route.path = route.path.replace(key, options.params[key]);
                                route.path = route.path.replace(/[(:)]/g, '');
                            } else {
                                route.path = route.path.replace(/\(.*\)/, '');
                            }
                        });
                    } else route.path = route.path.replace(/\(.*\)/, '');
                }

                // required params
                if (route.path.includes(':')
                    && !route.path.includes('(')
                    && !route.path.includes(')')) {

                    if (options.params) {
                        var paramsKey = Object.keys(options.params);
                        
                        paramsKey.forEach(key => {
                            if (route.path.includes(key)) {
                                var paramName = 
                                route.path = route.path.replace(key, options.params[key]);
                                route.path = route.path.replace(':', '');
                            } else throw new Erro('Deu ruim no parametro da rota viado')
                        });
                    } else throw new Error('Deu ruim na rota viado')
                }

                return route
            } 
        },

        navigateNext () {
            this._history.forward();
        },

        navigateBack () {
            this._history.back();
        },

        getLength () {
            return this._history.length
        },

        navigate (options) {
            var route = this.getRouteByName(options);
            this._currUrl = new URL(this.baseUrl + route.path);
            this._executeNavigate(route);
        },

        _executeNavigate (route) {
            $chord.runLifeCicle(route.module, route.view);
            this._history.pushState({}, route.name, this.historyMode ? route.path : this.baseUrl + route.path);   
        }
    };

    var router = {
        routes: [],
        
        loadApp () {
            history.loadUrl();
        },

        init (options) {
            if (options.routes && typeof options.routes === typeof Array()) {
                this.routes = options.routes;
                history._routes = Object.values(this.routes);
            } else $chord.error('the configured router is not valid: it must be a valid routes configured.');
            
            if(options.historyMode) 
                history.historyMode = true;

            history.initConfig();
        },

        go (options) {
            history.navigate(options);
        },
    };

    return router;

})));
