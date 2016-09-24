$(document).ready(function() {
	
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