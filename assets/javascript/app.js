var BB = (function() {

	/* -------------------------------------------
	 * Initialize Firebase
	 * ---------------------------------------- */
	  var config = {
	    apiKey: "AIzaSyAauOC4PC5WrE3Br4Ff1-HkA-FxBmh1QfQ",
	    authDomain: "breakbeats-4758a.firebaseapp.com",
	    databaseURL: "https://breakbeats-4758a.firebaseio.com",
	    storageBucket: "breakbeats-4758a.appspot.com",
	    messagingSenderId: "1058322946724"
	  };
	  firebase.initializeApp(config);

	// create a db reference
	  var dbRef = firebase.database().ref();
	// create a reference to the 'links' child inside db
	  playlistsRef = dbRef.child('playlists');
	// create a reference to the 'tags' child
    var tagsRef = dbRef.child('tags');

	/*--------------------------------------------
	 * email init
	 * ---------------------------------------- */

	emailjs.init("user_xrCuLVJF1XPydVeSaCraO");

	/* -------------------------------------------
	 * Bild DOM
	 * ---------------------------------------- */

  // cache DOM
  var $createPlaylist = $('#js-create-playlist'),
			$ytSearch = $('#js-yt-search-button'),
			$playlistSearch = $('#js-playlist-search'),
			$playlistSearchButton = $('#js-playlist-search-button'),
      $videosContainer = $('.yt-results'),
      $listContainer = $('#js-selected-list'),
			$landingSearch = $('#js-landing-search'),
      $ytSearchInput = $('#js-yt-search'),
			$viewNewPlaylist = $('#js-view-new-playlist'),
      $saveButton = $('.save-playlist'),
			$sendButton = $('#js-send-email'),
      $playlistTitle = $('#js-playlist-name'),
			$playlistVideoContainer = $('#js-video-list'),
			$newTags = $('#js-user-tags'),
			$addTag = $('#js-add-tag-button'),
			$removeTag = $('.chip'),
			$close = $('#js-close-send-review'),
			$magenta = '#AB537F',
      query,
      searchTerm,
      videoId,
			returnedTags= [],
      titles = [],
			userTags = [],
      checkedBoxes,
      maxResults = 10,
			playlistCounter =0,
      paginationData;

	// render DOM
	  function renderVideos(video) {
	    $videosContainer.append(video);
	  }
	  function renderSelectedTitles(titles) {
	    $listContainer.html('');
	    for(var i = 0; i < titles.length; i++) {
	      $listContainer.append('<li class="remove-video">'+ titles[i].title +'&nbsp<i class="tiny close material-icons">close</i><li>');
	    }

	  }
		function renderNewTags(tag) {
			$newTags.append(tag);
		}
		function renderNewPlaylist() {
			for(var i = 0; i < titles.length; i++) {
				var title = titles[i].title;
				var image = titles[i].image;

				var $li = $('<li>');
				var $wrapperDiv = $('<div class="col s12"></div>');
				$wrapperDiv.append('<img class="col s6" src='+image+' />');
				$wrapperDiv.append('<p class="flow-text col s6">'+title+'</p>');
				$li.append($wrapperDiv);
				$playlistVideoContainer.append($li);

			}
		}

	// DOM show/hide
	function hideLanding(pageToShow) {
		$('.landing-page').addClass('disable');
		$(pageToShow).removeClass('disable');
		$ytSearchInput.select();
		$playlistSearch.select();
	}
		function reviewAndSend() {
			$('.search-yt').addClass('opacity');
			$('.playlist-review-send').removeClass('disable');
		}
		function closeReviewSend() {
			$('.playlist-review-send').addClass('disable');
			$('.search-yt').removeClass('opacity');
		}
		function playlistHover() {
			$(this).append('<div class="playlist-hover"></div>');
			var index = $(this).index();
			var height = $(this).height();
			var width = $(this).width();
			$('.playlist-hover').css({
				'height': height,
				'width': width
			})
			$('.playlist-hover').append('<h4>This playlist is...</h4>');
			renderPlaylistTags(index);
			$('.playlist-hover').append('<a class="waves-effect btn" id="js-view-playlist">view</a>');
		}
		function renderPlaylistTags(index) {
			console.log(returnedTags);
			var tagArray = returnedTags[index];
			for(var i = 0; i < tagArray.length; i++) {
				var tag = tagArray[i];
				var tagDiv = $('<div class="chip">'+tag+'</div>');
				$('.playlist-hover').append(tagDiv);
			}
		}

	// bind events
	  $ytSearch.on('click', doSearch);
		$sendButton.on('click', getPlaylistTitle);
	  $saveButton.on('click', getPlaylistTitle);
		$createPlaylist.on('click', function() {
			hideLanding('.search-yt');
		});
		$landingSearch.on('click', function() {
			hideLanding('.search-playlists');
		});
		$viewNewPlaylist.on('click', function() {
			reviewAndSend();
			renderNewPlaylist();
		});
		$addTag.on('click', addTag);
		$(document).on('click', '.remove-tag', removeTag);
		$close.on('click', closeReviewSend);
		$playlistSearchButton.on('click', searchTags);
		$listContainer.on('click', '.remove-video', removeVideo);
		$('.playlist-results').on('mouseenter', '.playlist-display', playlistHover);
		$('.playlist-results').on('mouseleave', '.playlist-display', function() {
			$('.playlist-hover').remove();
		})




	// search function
	  function doSearch() {
			$videosContainer.empty();
	    searchTerm = $ytSearchInput.val().replace(/ /g, '+');
	    query = 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=' + maxResults + '&order=viewCount&q="' + searchTerm + '"&type=video&key=AIzaSyDIE0dd7hZ5j4vQRtwrU0CwQLGq-lhXWCc';
	    getDatafromAPI(query);
	    return false;
	  }

	  function getDatafromAPI(query) {
	    $.ajax({
	      url: query,
	      method: 'GET'
	    }).done( data => {
	      // videoId = data[0].id.videoId;
	      for(var i = 0; i < data.items.length; i++) {
	        createImage(data.items[i]);
	      }
	    });
	  }


		/* -------------------------------------------
	   * create iframe function from data
	   * ---------------------------------------- */

		function createIframe(item) {
	    var videoContainer = $('<div>').addClass('video col s6');
	    var video = $('<iframe />', {
	      class: 'Video-iframe Video-iframe--loading',
	      width: '100%',
				height: '100%',
	      src: 'https://www.youtube.com/embed/'+item.id.videoId+'?rel=0',
	      frameborder: '0'
	    });
	    // var checkbox = '<label class="checkbox" for="' + videoId + '"><input type="checkbox" checked="checked" value="" id="' + videoId + '" data-toggle="checkbox" class="custom-checkbox"><span class="icons"><span class="icon-unchecked"></span><span class="icon-checked"></span></span></label>';
	    var checkbox = '<input type="radio" class="with-gap radio" id=' + item.id.videoId + ' data-title="' + item.snippet.title + '" data-image="' + item.snippet.thumbnails.default.url + '" />';
			var label = '<label for='+item.id.videoId+'></label>';
	    videoContainer.append(video).append(checkbox).append(label);
	    renderVideos(videoContainer);
	  }

		function createImage(item) {
			var imgContainer = $('<div>').addClass('video col s6');
			var title = '<h5>' + item.snippet.title + '</h5>'
			var image = $('<img>', {
				class: 'Image',
				width: '100%',
				height: '100%',
				src: item.snippet.thumbnails.default.url
			});
			var checkbox = '<input type="radio" class="with-gap radio" id=' + item.id.videoId + ' data-title="' + item.snippet.title + '" data-image="' + item.snippet.thumbnails.default.url + '" />';
			var label = '<label for='+item.id.videoId+'></label>';
			imgContainer.prepend(title).append(image).append(checkbox).append(label);
			renderVideos(imgContainer);
		}

		function removeVideo() {
			console.log(titles);
			var title = $(this).text()
			title = title.replace(/close/g, "");
			console.log(title);
			var index = $(this).index();
			console.log(index);
			if(index === 0) {
				$listContainer.children('li').eq(0).remove();
				titles.splice(0, 1);
			} else if(index === 2) {
				$listContainer.children('li').eq(2).remove();
				titles.splice(1, 1);
			} else {
				$listContainer.children('li').eq(4).remove();
				titles.splice(2, 1);
			}
			$('.radio').prop('checked', false);
			$('.radio').prop('disabled', false);
			console.log(titles);
		}


		// internal tag search
		function searchResultsTitle(title) {
			var newDiv = $('<div class="playlist-display col s4" id="playlist'+playlistCounter+'">');
			var h3 = $("<h3>"+title+"</h3>");
			$('.playlist-results').append(newDiv);
			$(newDiv).append(h3);
			$(newDiv).append('<ul>')
		}

		function searchResultsList(image, title) {
			var $li = $('<li>');
			var $wrapperDiv = $('<div class="col s12"></div>');
			$wrapperDiv.append('<img class="col s6" src='+image+' />');
			$wrapperDiv.append('<p class="flow-text col s6">'+title+'</p>');
			$li.append($wrapperDiv);
			$('#playlist'+playlistCounter).children("ul").append($li);
			$('.playlist-display').css('border', 'solid 1px '+$magenta);

		}




  /* -------------------------------------------
   * get URI parameters to display break videos
   * ---------------------------------------- */

  function getURIParameter(paramID, url) {
    if (!url) url = window.location.href;
    paramID = paramID.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + paramID + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';

    var playlistId = results[2].replace(/\+/g, " ");
    return decodeURIComponent(atob(playlistId));
  }

  // usage:
  $('.show-videos').html(getURIParameter('breakid'));




  $(document).on('change', '.radio', addVideoToPlaylist);

  function addVideoToPlaylist() {
    if ( $(this).is(":checked") ) {

        videoTitle  = $(this).data('title');
        videoId     = $(this).attr('id');
        videoImg    = $(this).data('image');
        titles.push({
          'title': videoTitle,
          'image': videoImg,
          'videoId': videoId
        });
        renderSelectedTitles(titles);
        disableSelectionIfPlaylistFull();
    } else {
      videoTitle = $(this).data('title');

      for(var i = 0; i < titles.length; i++) {
        if(titles[i].title === videoTitle) {
          titles.splice(i, 1);
        }
      }
      renderSelectedTitles(titles);
      enableSelection();
    }
  }

  function disableSelectionIfPlaylistFull() {
    checkedBoxes = $(document).find('.radio');
    if ( titles.length > 2 ) {
      for(var i = 0; i < checkedBoxes.length; i++) {
        if( checkedBoxes[i].checked == false) {
          checkedBoxes[i].disabled = true;
        }
      }
    }
  }

  function enableSelection() {
    checkedBoxes = $(document).find('.radio');
    for(var i = 0; i < checkedBoxes.length; i++) {
      if( checkedBoxes[i].disabled == true) {
        checkedBoxes[i].disabled = false;
      }
    }
  }



  /* -------------------------------------------
   * firebase integration
   * ---------------------------------------- */


  function getPlaylistTitle() {
    var playlistTitle = $playlistTitle.val().trim();
    var tags = userTags;

    var newPlaylist = playlistsRef.push().key;
    playlistsRef.child('/'+newPlaylist+'/').update(
      {
        'vtitle': playlistTitle,
        'vtags': tags
      });

    for(i = 0; i < titles.length; i++) {
      saveToFirebase(newPlaylist, titles[i]);
    }

    // var emailAddress = $emailAddress.val().trim();
    // sendEmail(emailAddress, newPlaylist);


    // global tag array
    // for(i = 0; i < tags.length; i++) {
    //   tagsRef.child('/'+tags[i]+'/').set({
    //     'tags': 'tag'
    //   });
    // }


    return false;
  }

	function addTag() {
		var newTag = $('#js-add-tags').val().trim();
		var newChip =$('<div class="chip">'+newTag+'</div>');
		var iTag = $('<i class="close material-icons remove-tag">close</i>');
		newChip.append(iTag);
		$('#js-user-tags').append(newChip);

		userTags.push(newTag);
		console.log(userTags);
	}

	function removeTag() {
		var tag = $(this).parent().text();
		tag = tag.replace(/close/i, "");
		var index = userTags.indexOf(tag);
		userTags.splice(index, 1);
		console.log(userTags);
	}

  function saveToFirebase(playlistName, video) {
    vid = video.videoId;
    vimg = video.image;
		vtitle = video.title;

    playlistsRef.child(playlistName).child('videos').push({
        videoId: vid,
        defaultImg: vimg,
				videoTitle: vtitle
    });
  }

  console.log(titles);

	function searchTags() {
		playlistsRef.once('value').then(function(snapshot) {
			var tagSearch = $playlistSearch.val().trim()
			console.log(tagSearch);

			snapshot.forEach(function(childSnapshot) {
				var playlist = childSnapshot.val();
				var videos = playlist.videos;
				var tags = playlist.vtags;

				if(tags.indexOf(tagSearch) != -1) {
					console.log(true);
					var title = playlist.vtitle;
					searchResultsTitle(title)
					returnedTags.push(tags);
					for(i in videos) {
						var defaultImg = videos[i].defaultImg;
						var videoId = videos[i].videoId;
						var videoTitle = videos[i].videoTitle;
						searchResultsList(defaultImg, videoTitle);
					}
				}

			})
		})
	}

})();
