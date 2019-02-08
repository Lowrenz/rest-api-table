'use strict';

var config = require('./gulp.config'),
  gulp = require('gulp'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat'),
  sass = require('gulp-sass'),
  imagemin = require('gulp-imagemin'),
  del = require('del'),
  browserSync = require('browser-sync').create(),
  stripDebug = require('gulp-strip-debug'),
  babel = require('gulp-babel'),
  autoprefixer = require('gulp-autoprefixer'),
  sourcemaps = require('gulp-sourcemaps'),
  tabulator = require('tabulator-tables');;

//remove dist folder, let's start fresh
gulp.task('clean',
  (done) => {
    return del([config.dist.all]);
    done();
  }
);

//move fonts to dist folder
gulp.task('move-fonts',
  (done) => {
    gulp.src(config.src.fonts)
      .pipe(gulp.dest(config.dist.fonts));
    done();
  }
);

//optimize images in images folder
gulp.task('optimize-images', gulp.series(
  (done) => {
    gulp.src(config.src.img)
      .pipe(imagemin({
        progressive: true
      }))
      .pipe(gulp.dest(config.dist.img));
    done();
  }
));

//compile sass for production
gulp.task('compile-sass-prod', gulp.series(
  (done) => {
    gulp.src(config.src.sassFile)
      .pipe(sass.sync().on('error', sass.logError))
      .pipe(sass({
        outputStyle: 'compressed'
      }))
      .pipe(autoprefixer({
        browsers: ['last 2 versions', 'ie >= 9', 'android >= 4.4', 'ios >= 7'],
        cascade: false
      }))
      .pipe(gulp.dest(config.dist.css))
      .pipe(browserSync.reload({
        stream: true
      }));
    done();
  }
));

//compile sass
gulp.task('compile-sass', gulp.series(
  (done) => {
    gulp.src(config.src.sassFile)
      .pipe(sourcemaps.init())
      .pipe(sass.sync().on('error', sass.logError))
      .pipe(sass({
        outputStyle: 'compressed'
      }))
      .pipe(autoprefixer({
        browsers: ['last 2 versions', 'ie >= 9', 'android >= 4.4', 'ios >= 7'],
        cascade: false
      }))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(config.dist.css))
      .pipe(browserSync.reload({
        stream: true
      }));
    done();
  }
));

//concat and compile vendor specific javascript files
gulp.task('compile-vendor-js', gulp.series(
  (done) => {
    gulp.src(config.src.vendorJs)
      .pipe(concat('plugins.min.js'))
      .pipe(gulp.dest(config.dist.js))
      .pipe(uglify())
      .pipe(gulp.dest(config.dist.js));
    done();
  }
));

//compile app.js file
gulp.task('compile-app-js', gulp.series(
  (done) => {
    gulp.src(config.src.appJs)
      .pipe(sourcemaps.init())
      .pipe(babel({
        presets: ['@babel/env']
      }).on('error', err))
      .pipe(concat('app.min.js'))
      .pipe(gulp.dest(config.dist.js))
      .pipe(uglify().on('error', err))
      .pipe(gulp.dest(config.dist.js))
      .pipe(sourcemaps.write('.'))
      .pipe(browserSync.reload({
        stream: true
      }));
    done();
  }
));

//compile app.js file for production
gulp.task('compile-app-js-prod', gulp.series(
  (done) => {
    gulp.src(config.src.appJs)
      .pipe(babel({
        presets: ['@babel/env']
      }).on('error', err))
      .pipe(concat('app.min.js'))
      .pipe(gulp.dest(config.dist.js))
      .pipe(uglify().on('error', err))
      .pipe(gulp.dest(config.dist.js))
      .pipe(stripDebug())
      .pipe(browserSync.reload({
        stream: true
      }));
    done();
  }
));

// Removes all console.log, alert and debug statements from processed JS files
gulp.task('stripDebug', gulp.series(
  (done) => {
    gulp.src(config.dist.js)
      .pipe(stripDebug())
      .pipe(gulp.dest(config.dist.js));
    done();
  }
));

let err = (error) => {
  console.log(error.toString());
}

//build function, compiles all resources to dist folder
gulp.task('build', gulp.parallel(
  'move-fonts',
  'compile-vendor-js',
  'compile-app-js',
  'compile-sass',
  'optimize-images',
  (done) => {
    done();
  }
));

//build function, compiles all resources to dist folder
gulp.task('build-prod', gulp.parallel(
  'move-fonts',
  'compile-vendor-js',
  'compile-app-js-prod',
  'compile-sass-prod',
  'optimize-images',
  (done) => {
    done();
  }
));

//watch files for file changes
gulp.task('watch', (done) => {
  gulp.watch(config.src.appJs, gulp.series('compile-app-js'));
  gulp.watch(config.src.sassPath, gulp.series('compile-sass'));
  done();
});

//Start a local server and serve files
gulp.task('serve', gulp.series('build', (done) => {
  browserSync.init({
    proxy: "http://localhost:8080/"
  });

  gulp.watch(config.src.appJs, gulp.series('compile-app-js'));
  gulp.watch(config.src.sassPath, gulp.series('compile-sass'));
  done();
}));

//default function
gulp.task('default', gulp.series(
  'serve', 'watch',
  (done) => {
    done();
  }
));