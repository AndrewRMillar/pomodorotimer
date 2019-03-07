const gulp = require('gulp');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const babel = require('gulp-babel');

// var pipeline = require('readable-stream').pipeline; // getting error

// Copy all relavant files
gulp.task('copyfiles', function(done) {
  gulp.src('./src/*.html', './src/*.png', './src/*.ico', '/*.svg', './src/site.webmanifest', './src/*.xml')
    .pipe(gulp.dest('dist'));
  done();
});

// Optimize images
gulp.task('imagemin', function(done) {
  gulp.src('src/img/*.*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/img'));
  done();
});

// Copy audio files
gulp.task('copysounds', function(done) {
  gulp.src('./src/sounds/*.*')
    .pipe(gulp.dest('./dist/sounds'));
  done();
}); 

// Concat/Minify css
gulp.task('minify-css', function(done) {
  gulp.src('src/css/*.css')
    .pipe(concat('/css/styles.css'))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist'));
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
    .pipe(gulp.dest('dist/js/'));
  done();
});

// Watch for changes in the destination folders
gulp.task('watch', function() {
  gulp.watch('src/*.html', gulp.parallel('copyfiles'));
  gulp.watch('src/sounds/*.*', gulp.parallel('copysounds'));
  gulp.watch('src/js/*.js', gulp.parallel('minify-js'));
  gulp.watch('src/img/*.*', gulp.parallel('imagemin'));
  gulp.watch('src/css/*.css', gulp.parallel('minify-css'));
});

gulp.task('default', gulp.series('copyfiles', 'copysounds', 'imagemin', 'minify-css', 'minify-js', 'watch'));