'use strict';

function duration() {
	return function(input) {
		var minutes = Math.floor( input / 60);
		var seconds = input - minutes * 60;

		var str = '' + seconds;
		var pad = '00';
		seconds = pad.substring(0, pad.length - str.length) + str

		return minutes + ':' + seconds;
	}
}

angular.module('bandApp')
    .filter('duration', duration)