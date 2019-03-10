const gulp = require('gulp');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const babel = require('gulp-babel');
const browserSync  = require('browser-sync').create();

// var pipeline = require('readable-stream').pipeline; // getting error

// Copy all relavant files
gulp.task('copyfiles', function(done) {
  gulp.src('./src/*.html', './src/*.png', './src/*.ico', '/*.svg', './src/site.webmanifest', './src/*.xml')
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
  done();
});

// Optimize images
gulp.task('imagemin', function(done) {
  gulp.src('src/img/*.*')
    .pipe(imagemin())
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
    .pipe(concat('/css/styles.css'))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
  done();
});

// Transpile/Concat/uglify js files
gulp.task('minify-js', function(done) {
  gulp.src('src/js/*.js')
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(concat('main.js'))
    .pipe(uglify())
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

gulp.task('default', gulp.series('copyfiles', 'copysounds', 'imagemin', 'minify-css', 'minify-js'));