const exec = require('child_process').exec
// const spawn = require('child_process').spawn
const gulp = require('gulp')

const project = './parts/data-layer'
const execOptions = {cwd: project}
gulp.task('watch-ts', () => {
  gulp.watch(`${project}/src/**/*.ts`, gulp.series('tsc'))
})

gulp.task('tsc', (cb) => {
    exec('tsc', execOptions, (err, stdout, stderr) => {
      console.log(stdout);
      console.log(stderr);
      if (err) cb(err);
      else cb(stdout)
    })
})

gulp.task('karma', () => {
    // exec('karma start test/script/karma.dev.config.js', execOptions, (err, stdout, stderr) => {
    //     console.log(1111111111)
    //     console.log(stdout);
    //     console.log(stderr);
    //     if (err) cb(err);
    //     else cb(stdout)
    // })
    // const artisan = spawn('karma', ['start', 'test/script/karma.dev.config.js'], execOptions)
    // artisan.stdout.on('data', function (data) {
    //   console.log('stdout: ' + data.toString());
    // });

    // artisan.stderr.on('data', function (data) {
    //   console.log('stderr: ' + data.toString());
    // });

    // artisan.on('exit', function (code) {
    //   console.log('child process exited with code ' + code.toString());
    // });
})

gulp.task('output')
gulp.task('default', gulp.parallel('watch-ts', 'karma'))
