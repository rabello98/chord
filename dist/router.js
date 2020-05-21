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
        baseUrl: process.env.BASE_URL,
        msgRequiredParams: 'This route has required parameters',
        msgParamNotFound: 'The route does not have the specified parameter: ',
        msgRequiredSlash: `It is necessary to add '/' to the end of baseUrl`,
        regexRouterParams: new RegExp('[(:)]', 'g'),
        _publicPath: process.env.PUBLIC_PATH,
        _endpointRouteFragment: '/',

        initConfig () {
            if (!this.baseUrl.endsWith(this._endpointRouteFragment)) 
                $chord.error(this.msgRequiredSlash);

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
            var url = this._publicPath != this._endpointRouteFragment ? window.location.href.replace(this._publicPath, '') : window.location.href;
            this._currUrl = new URL(url);
            this._executeNavigate(this.getRouteByPath({ path: this._currUrl.pathname }));
        },

        getRouteByPath (options) {
            if (this._publicPath != this._endpointRouteFragment) {
                options.path = options.path.replace(this._publicPath, '');
            }

            if (options.path) {
                var getRoute = (fragments) => {
                    var routes2find = this._routes;
                    
                    for (let fragment of fragments) {
                        var found = [];
                        routes2find.forEach(route => { 
                            if (route.path.includes(fragment)) found.push(route); 
                        });

                        if (found.length) {
                            routes2find = found;
                            if (found.length == 1)
                                break
                        } else {
                            routes2find = [];
                        }
                    }
                    
                    if (routes2find.length != 1) 
                        return this.getRouteByName({ name: 'pageNotFound'})

                    var route = Object.assign({}, ...routes2find);
                    if (Object.keys(route).length) {
                        var realPath = this._currUrl.hash ? this._currUrl.hash.replace('#', '') : this._currUrl.pathname;
                        var params2Return = [];
                        
                        let paramsRoute = this.getRouteParams(route.path);
                        if (paramsRoute.length) {
                            var fragments = realPath.split(this._endpointRouteFragment);
                            paramsRoute.forEach(paramRoute => {
                                let currentFragment = fragments[paramRoute.idx];
                                if(currentFragment) {
                                    let param = {};
                                    param[paramRoute.name] = currentFragment;
                                    params2Return.push(param);
                                } else {
                                    if(paramRoute.isRequired)
                                        $chord.error(this.msgParamNotFound + paramRoute.name);
                                }
                            });
                        }
                        route.params = Object.assign({}, ...params2Return);
                        route.path = realPath;

                        if (this.historyMode && this._publicPath != this._endpointRouteFragment)
                            route.path = this._publicPath + route.path;

                        return route
                    } else return this.getRouteByName({ name: 'pageNotFound'})
                    
                };

                var getDefaultRoute = () => {
                    return this._routes.filter(route => {
                        if (route.path == this._endpointRouteFragment) {
                            if (this.historyMode)
                                route.path = this._publicPath;

                            return route
                        }
                    })[0]
                };

                if (options.path == this._endpointRouteFragment) {
                    if (this._currUrl.hash) {
                        var fragments = this._currUrl.hash.replace('#', '').split(this._endpointRouteFragment).filter(el => el);
                        if (fragments.length) {
                            return getRoute(fragments)
                        } else  return getDefaultRoute()
                    } else return getDefaultRoute()
                }
                var fragments = this._currUrl.pathname.split(this._endpointRouteFragment).filter(el => el);
                return getRoute(fragments)
            }
        },

        getRouteParams (path) {
            let fgts = path.split(this._endpointRouteFragment);

            let paramsRoute = [];
            fgts.forEach((fgt, index) => {
                if (this.containsRequiredParams(fgt)) {
                    paramsRoute.push({ idx: index, name: fgt.replace(this.regexRouterParams, ''), isRequired: true });
                } else if (this.containsOptionalParams(fgt)){
                    paramsRoute.push({ idx: index, name: fgt.replace(this.regexRouterParams, ''), isRequired: false });
                }
            });

            return paramsRoute
        },

        containsOptionalParams (path) {
            return path.includes('(') && path.includes(':') && path.includes(')')
        },

        containsRequiredParams (path) {
            return path.includes(':') && !path.includes('(') && !path.includes(')')
        },

        getRouteByName (options) {
            if (options.name) {
                var route = {};
                route = Object.assign({}, this._routes.filter(route => {
                    return route.name == options.name
                })[0]);
                
                if (!Object.keys(route).length)
                    route = this.getRouteByName({ name: 'pageNotFound'});
                
                var paramsRoute = this.getRouteParams(route.path);
                
                if (paramsRoute.length) {
                    paramsRoute.forEach(param => {
                        if (options.params) {
                            if (options.params[param.name]) {
                                route.path = route.path.replace(param.name, options.params[param.name]);
                            } else {
                                if (param.isRequired) {
                                    $chord.error(this.msgParamNotFound + param.name);
                                } else {
                                    route.path = route.path.replace(param.name, '');
                                }
                            }
                        } else {
                            if (param.isRequired) {
                                $chord.error(this.msgParamNotFound + param.name);
                            } else {
                                route.path = route.path.replace(param.name, '');
                            }
                        }
                    });

                    route.path = route.path.replace(this.regexRouterParams, '');
                }

                if (this.historyMode && this._publicPath != this._endpointRouteFragment)
                    route.path = this._publicPath + route.path;

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
            route.params = options.params ? options.params : null;
            this._executeNavigate(route);
        },

        _executeNavigate (route) {
            $chord.runLifeCicle(route.module, route.view, route.params);
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
