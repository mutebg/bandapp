'use strict';

/**
 * Album Carousel
 */
function albums() {
	return {
		restrict: 'E',
		scope: {
			albums: '='
		},
		templateUrl: 'views/albums.html',

		link: function(scope, element, attrs) {
			var elementWidth = 170;
			var containerWidth = element.children()[0].offsetWidth;

			scope.perPage =  Math.floor( containerWidth / elementWidth );
			scope.pages = 0;
			scope.currentPage = 1;


			scope.move = function(direction) {
				if ( direction === 'next') {
					scope.currentPage++;
				} else {
					scope.currentPage--;
				}
				scope.moveTo( scope.currentPage );
			}

			scope.moveTo = function( page ) {
				var start = page* scope.perPage - scope.perPage;
				scope.visible = scope.albums.slice(start, start + scope.perPage);
			}

			scope.showAlbum = function(event, album) {
				var el = event.target.getBoundingClientRect();
				scope.$emit('album:show', {
					top: el.top,
					left: el.left,
					album: album
				});
			}

			var watchAlbums = scope.$watch('albums', function(newValue, oldValue) {
                if ( newValue && newValue.length > 0 ) {
                	watchAlbums();
					scope.visible = scope.albums.slice(0, scope.perPage);
					scope.pages = Math.ceil( scope.albums.length / scope.perPage );
                }
            }, true);

		}
	}
}


/**
 * Detect retina display and change image src
 */
function retinaSrc($window) {

	var isRetina = function() {
		var mediaQuery = '(-webkit-min-device-pixel-ratio: 1.5), (min--moz-device-pixel-ratio: 1.5), ' 
			+ '(-o-min-device-pixel-ratio: 3/2), (min-resolution: 1.5dppx)';
		if ($window.devicePixelRatio > 1) {
			return true;
		}
		return $window.matchMedia && $window.matchMedia(mediaQuery).matches;
	}();

	function getHighResolutionURL(url) {
		var parts = url.split('.');
		if ( parts.length < 2 ) {
			return url;
		}
		parts[parts.length - 2] += '-2x';
		return parts.join('.');
	}

    return {
		restrict: 'A',
		scope: {
			retinaSrc: '='
		},
		link: function(scope, element, attrs) {
			var watchSrc = scope.$watch('retinaSrc', function(newValue, oldValue) {
				if ( newValue ) {
					var src;
					if ( typeof newValue === 'string' && !isRetina ) {
						src = newValue;
					} else if ( typeof newValue === 'string' && isRetina ) {
						src = getHighResolutionURL(newValue);
					} else if ( typeof newValue === 'object' && !isRetina ) {
						src = newValue[0];
					} else if ( typeof newValue === 'object' && isRetina ) {
						src = newValue[1];
					}
					element.attr('src', src );
					watchSrc();
				}
			});
		}
	}
}


/**
 * Popup with album information
 */
function popupAlbum($rootScope, $timeout, LastFMService) {
	return {
		restrict: 'E',
		scope: {},
		templateUrl: 'views/popupalbum.html',
		link: function(scope, element, attrs) {
			scope.visible = false;
			scope.action;
			scope.css = {
				top: 0,
				left: 0
			}

			scope.close = function(){
            	scope.action = 'close';
            	scope.album = false;
            	$timeout( function(){
					scope.visible = false;
            	}, 500)
			}

            $rootScope.$on('album:show', function(event, data){
            	scope.css.top = data.top + 'px';
            	scope.css.left = data.left + 'px';
            	scope.visible = true;
            	scope.action = 'open';

            	LastFMService.getAlbum( data.album.id ).success( function(data){
            		console.log('album', data);
            		scope.album = data.album;
            		scope.album.image = [ data.album.image[3]['#text'], data.album.image[4]['#text'] ];
            	}).error( function(){
            		console.log('can\'t load album');
            	})
            });
		}
	}
}

angular.module('bandApp')
    .directive('albums', albums)
    .directive('retinaSrc', retinaSrc)
    .directive('popupAlbum', popupAlbum)