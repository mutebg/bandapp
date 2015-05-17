var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

var scriptsList = [
	'bower_components/angular/angular.min.js',
	'bower_components/angular-messages/angular-messages.min.js',
	'bower_components/angular-touch/angular-touch.min.js',
	'bower_components/angular-scroll/angular-scroll.min.js',
	'js-dev/*.js'
];

gulp.task('sass', function() {
	gulp.src( 'sass/main.scss' )
		.pipe( sass({errLogToConsole: true}) )
		.pipe( autoprefixer( { browsers: ['last 5 versions'], cascade: false } ) )
		.pipe( gulp.dest( 'css/' ) );
});

gulp.task('build-js', function(){
	gulp.src( scriptsList )
		.pipe( uglify( {mangle: false} ) )
		.pipe( concat('app.js') )
		.pipe( gulp.dest('js/') );
});

gulp.task('watch', function() {
	gulp.watch( 'sass/**/*.scss', ['sass'] );
	gulp.watch( 'js-dev/**/*.js', ['build-js'] );
});