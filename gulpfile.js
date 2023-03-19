'use strict'
const { src, dest, watch, parallel, series } = require('gulp')
const browserSync = require('browser-sync').create()
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');


const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat')
const postcssImport = require('postcss-import');
const postcssNesed = require('postcss-nested');
const autoprefixer = require('autoprefixer');
const uglify = require('gulp-uglify-es').default;
const gulpClean = require('gulp-clean');

function styles() {
	return src('./app/pcss/**/*.pcss')
		.pipe(sourcemaps.init())
		.pipe(postcss([
			postcssImport,
			postcssNesed,
			autoprefixer,
		]))
		.pipe(rename({
			extname: '.css'
		}))
		.pipe(concat('style.min.css'))
		.pipe(cleanCSS())
		.pipe(sourcemaps.write())
		.pipe(dest('./app/css'))
		.pipe(browserSync.stream())
}

function scripts() {
	return src('./app/js/main.js')
		.pipe(concat('main.min.js'))
		.pipe(uglify())
		.pipe(dest('./app/js'))
		.pipe(browserSync.stream())
}

function watching() {
	watch(['./app/pcss/**/*.pcss'], styles)
	watch(['./app/js/main.js'], scripts)
	watch(['app/**/*.html']).on('change', browserSync.reload)
}

function liveServer() {
	browserSync.init({
		server: {
			baseDir: "app/"
		}
	});
}

function cleanDist() {
	return src('dist')
		.pipe(gulpClean())
}

function building() {
	return src([
		'app/css/style.min.css',
		'app/js/main.min.js',
		'app/**/*.html'
	], { base: 'app' })
		.pipe(dest('dist'))
}


exports.styles = styles;
exports.scripts = scripts;
exports.watching = watching;
exports.liveServer = liveServer;

exports.build = series(cleanDist, building)
exports.default = parallel(styles, scripts, liveServer, watching);