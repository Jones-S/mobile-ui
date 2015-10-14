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
  sass:                     ['app/scss/*.scss'],
  css:                      'app/css',
  js:                       'app/js/*.js',
  angularControllers:       'app/js/controllers/*.js',
  angularDirectives:        'app/js/directives/*.js',
  angularServices:          'app/js/services/*.js',
  angularDirectivesTemp:    'app/js/directives/*.html',
  angularViews:             'app/views/*.html',
  angularIncludes:          'app/includes/*.html',
  js_dist:                  'app/js/dist/'
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
           baseDir:'./app/'
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
                // 'bower_components/jquery/dist/jquery.min.js',
                // 'bower_components/angular/angular.min.js',
                // 'bower_components/angular-touch/angular-touch.js',
                // 'bower_components/angular-route/angular-route.js',
                // 'bower_components/angular-animate/angular-animate.min.js',
                // 'bower_components/hammerjs/hammer.js',
                // 'bower_components/AngularHammer/angular.hammer.js',
                // 'bower_components/d3/d3.min.js',
                // 'node_modules/scrollmagic/scrollmagic/minified/ScrollMagic.min.js',
                paths['js'],
                paths['angularControllers'],
                paths['angularDirectives'],
                paths['angularServices']
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

// concat gulp task
gulp.task('concatthirdparty', function() {
    return gulp.src([
                'bower_components/jquery/dist/jquery.min.js',
                'bower_components/angular/angular.js',
                'bower_components/angular-touch/angular-touch.js',
                'bower_components/angular-route/angular-route.js',
                'bower_components/angular-animate/angular-animate.min.js',
                'bower_components/hammerjs/hammer.js',
                'bower_components/AngularHammer/angular.hammer.js',
                'bower_components/d3/d3.min.js',
                'bower_components/momentjs/min/moment.min.js',
                'bower_components/momentjs/min/locales.min.js',
                'bower_components/humanize-duration/humanize-duration.js',
                'bower_components/angular-timer/dist/angular-timer.min.js'
            ])
        .pipe(plumber({
                errorHandler: onError
            }))
        .pipe(sourcemaps.init())
        .pipe(concat('third_party.js'))
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest(paths['js_dist']))
        .pipe(notify({ message: 'Concat 3rdParty task complete' }))
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
            paths['angularIncludes']
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
