// Load Node Modules/Plugins
var gulp = require('gulp');
var concat = require('gulp-concat');
// var uglify = require('gulp-uglify');
var notify = require('gulp-notify');
var minifyCSS = require('gulp-minify-css');
var browsersync = require('browser-sync');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');


// Asset paths
var paths = {
  sass:                     ['scss/*.scss'],
  css:                      'css',
  js:                       'js/*.js',
  angularControllers:       'js/controllers/*.js',
  angularDirectives:        'js/directives/*.js',
  angularDirectivesTemp:    'js/directives/*.html',
  angularViews:             'views/*.html',
  js_dist:                  'js/dist/',
};


// Error Helper
function onError(err) {
    notify({ message: 'Oh Boy. Error.' });
    console.log(err);
}

// browsersync task
gulp.task('browsersync', function(cb) {
   return browsersync({
       server: {
           baseDir:'./'
    } }, cb);
   console.log("css injected");
});


// task css also starts task 'compass' as well (probably synchronous)
gulp.task('sass', function() {
    gulp.src(paths["sass"])
        .pipe(plumber({
                errorHandler: onError
            }))
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest(paths["css"]))
        .pipe(notify({ message: 'Sass complete' }))
        .pipe(browsersync.stream());
});



// concat gulp task
gulp.task('concatenate', function() {
    return gulp.src([
                'bower_components/jquery/dist/jquery.min.js',
                'bower_components/angular/angular.min.js',
                'bower_components/angular-touch/angular-touch.js',
                'bower_components/angular-route/angular-route.js',
                'bower_components/hammerjs/hammer.js',
                'bower_components/AngularHammer/angular.hammer.js',
                'bower_components/d3/d3.min.js',
                // 'node_modules/scrollmagic/scrollmagic/minified/ScrollMagic.min.js',
                paths['js'],
                paths['angularControllers'],
                paths['angularDirectives'],
            ])
        .pipe(plumber({
                errorHandler: onError
            }))
        .pipe(sourcemaps.init())
        .pipe(concat('all.js'))
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest(paths['js_dist']))
        .pipe(notify({ message: 'Concatenate task complete' }))
        .pipe(browsersync.stream());
});




// Watch Task
gulp.task('watch', function() {
    // watch scss files
    gulp.watch(paths['sass'], ['sass']);

    // Watch .js files
    // and also watch angular js files
    gulp.watch([
            paths['js'],
            paths['angularControllers'],
            paths['angularDirectives'],
            paths['angularDirectivesTemp'],
            paths['angularViews'],
        ], ['concatenate']);

    gulp.watch("*.html").on('change', browsersync.reload);
});


// Default Task
gulp.task('default', ['sass', 'watch', 'browsersync']);





// production tasks

// gulp.task('production-css', function(){
//     return gulp.src('campusinterview/sass/*.scss')
//         .pipe(plumber({
//             errorHandler: onError
//         }))
//         .pipe(compass({
//             style: 'compressed',
//             comments: false,    // no effect ?!
//             css: 'campusinterview/stylesheets',
//             sass: 'campusinterview/sass',
//         }))
//         .pipe(minifyCSS())      //minifying removes line comments as well
//         .pipe(gulp.dest('testcampusinterview/system/templates/frontend/default/css/production'))
//         .pipe(notify({ message: 'Compass production task complete' }));
// });

// gulp.task('production-js', function() {
//     return gulp.src('testcampusinterview/system/templates/frontend/default/js/all.js')
//         .pipe(uglify())
//         .pipe(gulp.dest('testcampusinterview/system/templates/frontend/default/js/production'))
//         .pipe(notify({ message: 'uglify js task complete' }));
// });

// gulp.task('production', ['production-js', 'production-css']);
