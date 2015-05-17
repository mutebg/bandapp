'use strict';

function LastFMService($http) {
	var apiKey = 'a6d554e3ad1bdea8b66cfd8e7aa4cebe';
	var apiURL = 'http://ws.audioscrobbler.com/2.0/?';
	var bandName = 'Franz Ferdinand';

	function createURL( params ) {
		var baseParams = {
			format: 'json',
			api_key: apiKey
		}

		angular.extend(params, baseParams);

		var urlParams = Object.keys(params).map(function(key) {
    		return key + '=' + params[key];
		}).join('&');

		var url = apiURL +  urlParams;
		return $http.get(url);
	}

	function getAlbums() {
		return createURL( {method: 'artist.gettopalbums', artist: bandName} );
	}

	function getAlbum(albumID) {
		return createURL( {method: 'album.getinfo', mbid: albumID} );
	}

	function getEvents() {
		return createURL( {method: 'artist.getevents', artist: bandName} );
	}

	return {
		getAlbums: getAlbums,
		getAlbum: getAlbum,
		getEvents: getEvents
	}
}

angular.module('bandApp')
	.factory('LastFMService', LastFMService);