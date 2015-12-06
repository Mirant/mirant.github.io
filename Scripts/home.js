com = {}

if (!com.searchdemo) {
    com.searchdemo = {}
} else {
    if (typeof com.searchdemo != "object") {
        throw new Error("com.searchdemo already exists and is not an object")
    }
}

com.searchdemo.manager = function(){
	
	/** PRIVATE METHODS -----------------------------------------------------------------------------------------------------**/
	
	// This is called with the results from from FB.getLoginStatus().
	var statusChangeCallback = function(response) {
		// The response object is returned with a status field that lets the
		// app know the current login status of the person.
		if (response.status === 'connected') {
		  // Logged into your app and Facebook.
		  showUserDetails();
		} 
		else{
			$("#user-name").text("Guest");
		}
	}
	
	// This function is called when someone finishes with the Login
	// Button.
	var checkLoginState = function() {
		FB.getLoginStatus(function(response) {
			statusChangeCallback(response);
		});
	}
	
	// Here we run a very simple test of the Graph API after login is
	// successful.  See statusChangeCallback() for when this call is made.
	var showUserDetails = function() {
		FB.api('/me?fields=email,id,name,first_name,last_name,picture', function(response) {
			$("#user-name").text(response.first_name);

			//Download user details json file
			var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(response));
			var dlAnchorElem = document.getElementById('downloadAnchorElem');
			dlAnchorElem.setAttribute("href",     dataStr     );
			dlAnchorElem.setAttribute("download", "facebook.json");
			dlAnchorElem.click();
		});
	}
	
	var login_event = function(response) {
	  checkLoginState();
	}

	var logout_event = function(response) {
	  checkLoginState();
	}
	
	/** INITIALIZE PLUGIN ---------------------------------------------------------------------------------------------------**/
	
	window.fbAsyncInit = function() {
		FB.init({
		appId      : '1642302136024677',
		cookie     : true,
		xfbml      : true,  // parse social plugins on this page
		version    : 'v2.5' // use version 2.5
		});

		FB.getLoginStatus(function(response) {
			statusChangeCallback(response);
		});
		
		FB.Event.subscribe('auth.login', login_event);
		FB.Event.subscribe('auth.logout', logout_event);
	};
	
	var initFacebookSdk = function(){
		// Load the SDK asynchronously
		(function(d, s, id) {
			var js, fjs = d.getElementsByTagName(s)[0];
			if (d.getElementById(id)) return;
			js = d.createElement(s); js.id = id;
			js.src = "//connect.facebook.net/en_US/sdk.js";
			fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk'));
	}
	
	window.initLocationApi = function(){
		var input = (document.getElementById('pac-input'));

		var autocomplete = new google.maps.places.Autocomplete(input);
		var infowindow = new google.maps.InfoWindow();

		autocomplete.addListener('place_changed', function() {
			infowindow.close();

			var place = autocomplete.getPlace();
			if (!place.geometry) {
			  return;
		}

		var address = '';
		if (place.address_components) {
			address = [
				(place.address_components[0] && place.address_components[0].short_name || ''),
				(place.address_components[1] && place.address_components[1].short_name || ''),
				(place.address_components[2] && place.address_components[2].short_name || '')
			  ].join(' ');
			}

			infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
			
			$("#location-detail").text("Latitude: " + place.geometry.location.lat() + ", " + "Longitude: " + place.geometry.location.lng());
		});
	}
	
	/** INIT ----------------------------------------------------------------------------------------------------------------**/
	this.init = function(){
		initFacebookSdk();
	}
}
com.searchdemo.managerObj = new com.searchdemo.manager();

$(document).ready(function () {
	com.searchdemo.managerObj.init();
});