var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var sourcemaps = require('gulp-sourcemaps');

var paths = {
    sass: ['./scss/**/*']
};

gulp.task('default', ['sass']);

// gulp.task('sass', function(done) {
//   gulp.src('./scss/ionic.app.scss')
//     .pipe(sass())
//     .on('error', sass.logError)
//     .pipe(gulp.dest('./www/css/'))
//     .pipe(minifyCss({
//       keepSpecialComments: 0
//     }))
//     .pipe(rename({ extname: '.min.css' }))
//     .pipe(gulp.dest('./www/css/'))
//     .on('end', done);
// });

gulp.task('sass', function(done) {
    gulp.src('./scss/ionic.app.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./www/css/'))
        // .pipe(minifyCss({ keepSpecialComments: 0 }))
        // .pipe(rename({ extname: '.min.css' }))
        // .pipe(gulp.dest('./www/css/'))
        .on('end', done);
});



gulp.task('watch', function() {
    gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
    return bower.commands.install()
        .on('log', function(data) {
            gutil.log('bower', gutil.colors.cyan(data.id), data.message);
        });
});


// gulp.task('ionic-date-picker', function() {
//     return gulp.src(['./node_modules/ionic-datetime-picker/dist/ionic-datetimepicker.js',
//             './node_modules/ionic-datetime-picker/dist/style.css',
//             './node_modules/ionic-datetime-picker/dist/templates.js'
//         ])
//         .pipe(gulp.dest('./www/lib/ionic-datetime-picker'))
// })

gulp.task('git-check', function(done) {
    if (!sh.which('git')) {
        console.log(
            '  ' + gutil.colors.red('Git is not installed.'),
            '\n  Git, the version control system, is required to download Ionic.',
            '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
            '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
        );
        process.exit(1);
    }
    done();
});