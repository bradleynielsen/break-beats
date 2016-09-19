$('#searchButton').on('click', function() {
	$("#results").empty();
	event.preventDefault();

	var	genre = $('#searchInput').val();
	console.log("genre " +genre);
	var queryURL = "http://api.soundcloud.com/tracks?genres="+genre+"&client_id=72006e568cc8f77ed2a5b68c4a8c1ca5";
	console.log("queryURL " + queryURL);


    $.ajax({
    		url: queryURL, 
    		method: 'GET'
    	})
     	.done(function(response) {
		
	        for (var i = 0; i < response.length; i++) {
				console.log("artist" +i);
				console.log(response[i].artist);
				var responseid = response[i].id;
				var resultDiv = $('<div id="response'+responseid+'">');
				var pArtist = "Artist: "+response[i].artist;
				var pTitle = "Title: "+response[i].title;                
                var artworkImage = $('<img>');
                var link = response[i].permalink_url;
                var aLink = $('<a href="'+link+'"> target="_blank"');
                artworkImage.attr('src', response[i].artwork_url);
				aLink.append(artworkImage);
				resultDiv.append(pArtist).append('<br />');
				resultDiv.append(pTitle).append('<br />');
				resultDiv.append(aLink);
                $('#results').prepend(resultDiv);
	        }	  		
   		});
});

