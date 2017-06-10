const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const server = require('gulp-webserver');

gulp.task('server', _ => {
    gulp.src('./')
        .pipe(server({
            livereload: true,
            open: true,
            port: 8080,
        }));
});

gulp.task('sass', _ => {
  return gulp.src('sass/*.sass')
          .pipe(sass().on('error', sass.logError))
          .pipe(autoprefixer({
              browsers: ['last 2 versions']
          }))
          .pipe(gulp.dest('css'));
});

gulp.task('watch', _ => {
  gulp.watch('sass/*.sass', ['sass']);
});

gulp.task('default', ['sass', 'watch', 'server']);