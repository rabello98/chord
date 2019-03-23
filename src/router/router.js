import history from './history/history'

export default {
    routes: [],

    init (routes) {
        this.routes = routes
    },

    go (route) {
        $chord.runLifeCicle(route.module, route.view)
        history.navigate(route)
    },
}