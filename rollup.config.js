require('dotenv').config();

export default [
    {
        input: 'src/chord/chord.js',
        output: {
            name: 'chord.bundle',
            file: process.env.CHORD_DEV_PATH ? process.env.CHORD_DEV_PATH : 'dist/chord.js',
            format: 'umd'
        }
    },
    {
        input: 'src/router/router.js',
        output: {
            name: 'router.bundle',
            file: process.env.ROUTE_DEV_PATH ? process.env.ROUTE_DEV_PATH : 'dist/router.js',
            format: 'umd'
        }
    }
]