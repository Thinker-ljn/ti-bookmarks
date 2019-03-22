const exec = require('child_process').exec
const gulp = require('gulp')

gulp.task('watch-ts', () => {
  gulp.watch(`**/*.ts`, gulp.series('mocha'))
})

gulp.task('mocha', async () => {
    await exec('yarn test', {'stdio': 'pipe'}, (err, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
    })
})

gulp.task('default', gulp.series('mocha', 'watch-ts'))
