$(document).ready(function() {


// Initialize Firebase
  var config = {
    apiKey: "AIzaSyAauOC4PC5WrE3Br4Ff1-HkA-FxBmh1QfQ",
    authDomain: "breakbeats-4758a.firebaseapp.com",
    databaseURL: "https://breakbeats-4758a.firebaseio.com",
    storageBucket: "breakbeats-4758a.appspot.com",
    messagingSenderId: "1058322946724"
  };
  firebase.initializeApp(config);


function build tagsArray() {
var tagsArray = firebase.database().ref(/tagsArray)



	
}


var tags = [
      "funny",
      "calm",
      "energy",
      "jazz",
      "happy",
      "Sad",
      "Slow",
      "fast",
      "cats",
    ];

var breaks = [

      "test cats",
      "jazz break",
      "Groovy",
      "rock",
      "crazy",
    ];



$(document)on('click', '#tagSearch', function(tags) {
    $( "#tags" ).autocomplete({
      source: tags
    });
  });

$(document)on('click', '#breakSearch', function(breaks) {
    $( "#breaks" ).autocomplete({
      source: tags
    });
  });

});