export default [
    {
        input: 'src/chord/chord.js',
        output: {
            name: 'chord.bundle',
            file: 'dist/chord.js',
            format: 'umd'
        }
    },
    {
        input: 'src/router/router.js',
        output: {
            name: 'router.bundle',
            file: 'dist/router.js',
            format: 'umd'
        }
    }
]