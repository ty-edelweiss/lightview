var gulp = require('gulp');
var rename = require('gulp-rename');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var less = require('gulp-less');
var clean = require('gulp-clean-css');
var livereload = require('gulp-livereload');
var spawn = require('child_process').spawn;
var server = null;

gulp.task('js-compile', function() {
    var bundler = browserify({
        entries: ['./src/js/app.js']
    }).transform(babelify, { presets: ['es2015'] });
    return bundler.bundle()
           .pipe(source('bundle.js'))
           .pipe(gulp.dest('./app/public/js/'))
           .pipe(buffer())
           .pipe(sourcemaps.init())
           .pipe(uglify())
           .pipe(sourcemaps.write('./maps/'))
           .pipe(rename({extname: '.min.js'}))
           .pipe(gulp.dest('./app/public/js/'));
});

gulp.task('less-compile', function() {
    return gulp.src('./src/less/style.less')
           .pipe(less())
           .pipe(gulp.dest('./app/public/css/'))
           .pipe(sourcemaps.init())
           .pipe(clean())
           .pipe(sourcemaps.write('./maps/'))
           .pipe(rename({extname: '.min.css'}))
           .pipe(gulp.dest('./app/public/css/'));
});

gulp.task('css-compile', function() {
    return gulp.src('./src/css/*.css')
           .pipe(gulp.dest('./app/public/css/'))
           .pipe(sourcemaps.init())
           .pipe(clean())
           .pipe(sourcemaps.write('./maps/'))
           .pipe(rename({extname: '.min.css'}))
        .pipe(gulp.dest('./app/public/css/'));
});

gulp.task('server', function() {
    if(server) {
        server.kill('SIGKILL');
        server = null;
    }
    server = spawn('node',['./app/server']);
    server.stdout.setEncoding('utf8');
    server.stdout.on('data',function(data){
        console.log(data);
    });
    server.stderr.setEncoding('utf8');
    server.stderr.on('data',function(data){
        console.log(data);
    });
});

gulp.task('reload', ['js-compile', 'less-compile', 'css-compile'], function() {
});

gulp.task('watch', function() {
    gulp.watch('./src/js/*.js', ['js-compile']);
    gulp.watch('./src/less/*.less', ['less-compile']);
    gulp.watch('./src/css/*.css', ['css-compile']);
    gulp.watch('./app/*.js', ['server']);
    gulp.watch('./app/*.html', ['server']);
    gulp.watch('./app/public/css/*.css', ['server']);
    gulp.watch('./app/public/js/*.js', ['server']);
});

gulp.task('default', ['server', 'watch']);
