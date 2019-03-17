import chord from '../chord/chord'

export default {
    routes: [],

    init (routes) {
        this.routes = routes
    },

    go (route) {
        chord.render(route.view, route.module)
    }
}