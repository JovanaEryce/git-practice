var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var reload = browserSync.relaod;
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache =  require('gulp-cache');
var del = require('del');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var iconfont = require('gulp-iconfont');
var iconfontCssAndTemplate = require('gulp-iconfont-css-and-template');


// Starrt iconfonts
gulp.task('iconfont', function(){
    gulp.src(['app/icons/*.svg']) 
    .pipe(iconfontCssAndTemplate({
        fontName: 'myFont',
        cssClass: 'gmIcon',
        cssTargetPath: 'app/css/iconFont.css'
    }))
      .pipe(iconfont({
        prependUnicode: false,
        fontName: myFont,
        formats: ['ttf', 'eot', 'woff'],
        normalize: true
      }))
      .pipe(gulp.dest('dist/fonts/'));
  });

gulp.task('iconFontCssAndTemplate', function () {
    return gulp.src(['app/icons/*.svg'])
         .pipe(iconfontCssAndTemplate({
             fontName: 'fontName',
             cssClass: 'gmIcon',
             cssTargetPath: 'iconFont.css'
         }))
         .pipe(iconfont({
             fontName: 'fontName',
             formats: ['ttf', 'eot', 'woff', 'svg']
         }))
         .pipe(gulp.dest('dist/fonts/'));
 });

// Start sourcemaps
gulp.task('sourcemaps', function(){
    gulp.src('app/sass/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.stream());
});



// Start autoprefixer
gulp.task('autoprefixer', function() {
    return gulp.src('app/css/style.css')
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    .pipe(gulp.dest('dist'))
});

// Start cleaning up generated files automatically
gulp.task('clean:dist', function(){
    return del.sync('dist');
})

// Start copying fonts to dist
gulp.task('fonts', function() {
    return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
})


// Start imagemin and cache
gulp.task('images', function(){
    return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
    // Caching images that ran through imagemin
    .pipe(cache(imagemin({
        //Setting interlaced to true
        interlaced: true
    })))
    .pipe(gulp.dest('dist/images'))
});

// Start cssnano
gulp.task('useref', function() {
    return gulp.src('app/*.html')
    .pipe(userif())
    .pipe(gulpIf('*.js', uglify()))
    //Minifies only if it is a CSS file
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))

});

// Start uglifi ang if

gulp.task('useref', function() {
    return gulp.src('app/*.html')
    .pipe(useref())
    //Minifies only if it is JS file
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulp.dest('dist'))
});

// Start BrowserSync

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: 'app'
        }
    });
});

// Start useref

gulp.task('useref', function() {
    return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulp.dest('dist'))
});

//Start Sass

gulp.task('sass', function() {
gulp.src('app/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({stream:true}));
});



//Watch task
gulp.task('watch', ['browser-sync', 'sass', 'autoprefixer', 'useref', 'fonts', 'images', 'sourcemaps', 'iconfont', 'iconFontCssAndTemplate'], function() {
    gulp.watch('app/sass/**/*.scss',['sass'])
    gulp.watch('app/css/*.css')
    gulp.watch('app/*.html')
    gulp.watch('app/*.html').on('change', browserSync.reload);
    gulp.watch('app/fonts/**/*')
    gulp.watch('app/images/**/*.+(png|jpg|jpeg|gif|svg)');
});

gulp.task('default', ['browser-sync', 'sass', 'watch']); 