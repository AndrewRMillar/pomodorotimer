const gulp = require('gulp');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const babel = require('gulp-babel');
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const lec = require('gulp-line-ending-corrector');

// var pipeline = require('readable-stream').pipeline; // getting error

// Copy all image files from base dir
gulp.task('copyFav', function(done) {
  gulp.src(['./src/*.ico', './src/*.png'])
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
  done();
});

// Copy all the text files from base dir
gulp.task('copyfiles', function(done) {
  gulp.src(['/src/*.svg', './src/*.html', './src/site.webmanifest', './src/*.xml'])
    .pipe(lec())
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
  done();
});


// Optimize images
gulp.task('imagemin', function(done) {
  gulp.src('src/img/*.*')
    .pipe(imagemin())
    .pipe(lec())
    .pipe(gulp.dest('dist/img'))
    .pipe(browserSync.stream());
  done();
});

// Copy audio files
gulp.task('copysounds', function(done) {
  gulp.src('./src/sounds/*.*')
    .pipe(gulp.dest('./dist/sounds'))
    .pipe(browserSync.stream());
  done();
}); 

// Concat/Minify css
gulp.task('minify-css', function(done) {
  gulp.src('src/css/*.css')
    .pipe(concat('/css/style.css'))
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(sourcemaps.write())
    .pipe(lec())
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
  done();
});

// Transpile/Concat/uglify js files
gulp.task('minify-js', function(done) {
  gulp.src('src/js/*.js')
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(lec())
    .pipe(gulp.dest('dist/js/'))
    .pipe(browserSync.stream());
  done();
});

// Watch for changes in the destination folders
gulp.task('watch', function() {
  browserSync.init({
    server: {
      baseDir: "./dist"
    }
  });
  // Only include the files which are likely to change 
  gulp.watch('src/*.html', gulp.parallel('copyfiles')).on('change', browserSync.reload);
  gulp.watch('src/js/*.js', gulp.parallel('minify-js')).on('change', browserSync.reload);
  gulp.watch('src/css/*.css', gulp.parallel('minify-css')).on('change', browserSync.reload);
});

gulp.task('default', gulp.series('copyfiles', 'copyFav', 'copysounds', 'imagemin', 'minify-css', 'minify-js'));