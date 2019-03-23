export default {
    navigateNext () {
        window.history.forward()
    },

    navigateBack () {
        window.history.back()
    },

    getLength () {
        return window.history.length
    },

    navigate (route) {
        window.history.pushState({}, route.name, route.path)
    }
}