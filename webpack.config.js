module.exports = {
    entry: ['./src/app/main.js'],
    output: {
        filename: './js/bundle.js',
        libraryTarget: 'var',
        library: 'App'
    },
    module: {
        rules: [
            {
                // loader: 'babel-loader',
                test: /\.js$/,
                exclude: /node_modules/
            }
        ]
    },
    optimization:{
        minimize: false
    },
    devServer: {
        port: 3000
    }
};