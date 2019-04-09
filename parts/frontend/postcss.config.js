// const path = require('path')

// const alias = {
//     '@fe': process.cwd()
// }

//     require('postcss-import')({
//         resolve(id, basedir) {
//             const prefix = id.replace(/^(@[^\/]+?)(\/.*)/, '$1')
//             if (alias[prefix]) {
//                 const real = path.resolve(alias[prefix], id.slice(prefix.length + 1))
//                 return real
//             }
//             if (/^~/.test(id)) return path.resolve('./node_modules', id)
//             return path.resolve(basedir, id)
//         }
//     }),
module.exports = {
    plugins: [
        require('postcss-preset-env'),
        require('autoprefixer'),
        require('postcss-mixins'),
        require('postcss-simple-vars'),
        require('postcss-nested')
    ]
}
