'use strict';

function MainCtrl( $window, $scope ) {
	var scope = this;
	scope.showNav = false;
	scope.activeHeader = false;
	scope.nav = [
		{name:'Home', 		link: 'home'},
		{name:'About us', 	link: 'about'},
		{name:'Albums', 	link: 'albums'},
		{name:'Blog', 		link: 'blog'},
		{name:'Events', 	link: 'events'},
		{name:'Contact us',	link: 'contact'}
	];

	var isMobile = window.innerWidth < 800; //stuped way to detech mobile
	var bodyEl = angular.element(document).find('body');
	var topLimit = 250; // show orange header on 250px from top

	//bind scroll to add class on header
	angular.element($window).bind("scroll", function() {
		var ev = this;
	 	$scope.$apply( function(){
	 		scope.activeHeader = ev.pageYOffset > topLimit;
	 		if ( !isMobile && ev.pageYOffset < topLimit ) {
	 			bodyEl.css('background-position', '50% -' + ev.pageYOffset / 2 + 'px' );
	 		}
	 	});
	});
}


function AboutCtrl() {
	this.members = [
		{name: 'Alex Kapranos', position: 'lead vocals', 	img: 'alex', 	link: 'http://en.wikipedia.org/wiki/Alex_Kapranos'},
		{name: 'Nick McCarthy', position: 'rhythm guitar', 	img: 'nick',	link: 'http://en.wikipedia.org/wiki/Nick_McCarthy'},
		{name: 'Bob Hardy', 	position: 'bass guita', 	img: 'bob',		link: 'http://en.wikipedia.org/wiki/Bob_Hardy_(bassist)'},
		{name: 'Paul Thomson', 	position: 'drums', 			img: 'paul',	link: 'http://en.wikipedia.org/wiki/Paul_Thomson'}
	];
}


function AlbumsCtrl(LastFMService) {
	LastFMService.getAlbums().success( function(response) {
		var albums = [];
		response.topalbums.album.forEach( function(item){
			if ( item.mbid ) {
				var album = {
					id: item.mbid,
					name: item.name,
					image:[ item.image[2]['#text'], item.image[3]['#text'] ]
				}
				albums.push(album);
			}
		});
		this.list = albums;

	}.bind( this ) )
	.error( function() {
		console.log('can\'t load albums');
	});
}


function EventsCtrl(LastFMService) {
	LastFMService.getEvents().success( function(response) {
		var events = response.events.event;
		events.forEach( function(item, i){
			events[i].date = new Date(item.startDate);
		})
		this.list = events;
	}.bind(this) )
	.error( function(){
		console.log('can\'t load events');
	});
}


function ContactCtrl($http, $timeout) {
	this.isLoading = false;
	this.showMessage = false;

	this.send = function(form) {
		this.isLoading = true;

		//imitate slow server response
		$timeout( function(){
			this.isLoading = false;
			this.showMessage = true;
		}.bind( this ), 5000);

	}.bind( this );
}


angular.module('bandApp')
	.controller('MainCtrl', MainCtrl)
	.controller('AboutCtrl', AboutCtrl)
	.controller('AlbumsCtrl', AlbumsCtrl)
	.controller('EventsCtrl', EventsCtrl)
	.controller('ContactCtrl', ContactCtrl)