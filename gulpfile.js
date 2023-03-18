'use strict'
const { src, dest, watch, parallel } = require('gulp')
const browserSync = require('browser-sync').create()
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');

// Styles
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat')
const postcssImport = require('postcss-import');
const postcssNesed = require('postcss-nested');
const autoprefixer = require('autoprefixer');

// JS
const uglify = require('gulp-uglify-es').default;

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
		.pipe(sourcemaps.init())
		.pipe(concat('main.min.js'))
		.pipe(uglify())
		.pipe(dest('./app/js'))
		.pipe(sourcemaps.write())
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

exports.styles = styles;
exports.scripts = scripts;
exports.watching = watching;
exports.liveServer = liveServer;

exports.default = parallel(styles, scripts, liveServer, watching);