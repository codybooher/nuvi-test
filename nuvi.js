(function() {
	var httpRequest;
	var url = "https://nuvi-challenge.herokuapp.com/activities";
	function makeRequest() {
		httpRequest = new XMLHttpRequest();
		httpRequest.open('GET', url,false);
		httpRequest.send(null);
		return httpRequest.responseText;
  	}

  var response = makeRequest();
  var parsed = JSON.parse(response);
  var total = 0;
  var contentContainer = document.getElementById('contentContainer');
  var dashboard = document.getElementById('dashboard');
  parsed.forEach(function(element){
  	var div = document.createElement('div');
  	div.className += 'box';
  	var provider = element.provider;
  	var socialAction = '';
  	var likeBtn = '';
  	if (provider === 'facebook'){
  		div.className += ' fb';
  		likeBtn = '<div class="fb-like" data-href="'+ element.activity_url +'" \
  			data-width="200" data-layout="button_count" data-action="like" data-size="small" \
  			data-show-faces="true" data-share="true"></div>';
  	}
  	else if (provider === 'twitter'){
  		div.className += ' twitter';
  		var mediaID = element.activity_url.split('/');
    	mediaID = mediaID.pop();
  		likeBtn = '<button onclick="twitterLikeBtnClicked(this); return false;" class="btn" href="' + mediaID + '">Like</button>'
  	}
  	else if (provider === 'instagram'){
  		div.className += ' instagram';
  		var mediaID = element.activity_url.split('/');
    	mediaID = mediaID.pop();
  		likeBtn = '<button onclick="instaLikeBtnClicked(this); return false;" class="btn" href="' + mediaID + '">Like</button>'
  	}
  	else {
  		div.className += ' tumblr';
  		var mediaID = element.activity_url.split('/');
    	mediaID = mediaID.pop();
  		likeBtn = '<button onclick="tumblrLikeBtnClicked(this); return false;" class="btn" href="' + mediaID + '">Like</button>'
  	}

  	var username = '<h2>' + element.actor_username + ' posted on ' + provider + '</h2>';
  	

  	var contentType = urlChecker(element.activity_message); // check if it's an image url
  	if (contentType === null)
  	{
  		var content = element.activity_message;
  	}
  	else{
  		var contentURL = element.activity_message;
  		var content = '<a href="' + element.activity_url + '"><img class="contentImage" src="' + contentURL + '"></a>'
	}
	var date = element.activity_date;

  	var socialStatus = ' <p><strong>Likes: ' + element.activity_likes + '<br>Shares:' + element.activity_shares + '<br>Comments:' + element.activity_comments +'</strong><br>' + likeBtn+ '</p>';

  	div.innerHTML = username + '<br>' + content + '<br>' + date + socialStatus + socialAction;
  	contentContainer.appendChild(div);
  	total += 1;
  });
  var totalPosts = d3.select('#totalPosts');
  var totalLikes = d3.select('#totalLikes');
  D3Graph(socialCounter(parsed), totalPosts, '#56637F', 'Total # of Posts');
  D3Graph(likeCounter(parsed), totalLikes, '#2F4A7F', 'Total # of Likes');
})();

function urlChecker(string) {
	var re = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
	var result = re.exec(string);
	return result
}

function socialCounter(data){
	var facebookCount = 0;
	var twitterCount = 0;
	var tumblrCount = 0;
	var instagramCount = 0;

	data.forEach(function(element){
		if (element.provider === 'facebook'){
			facebookCount += 1;

	  	}
	  	else if (element.provider === 'twitter'){
	  		twitterCount += 1;
	  	}
	  	else if (element.provider === 'instagram'){
	  		instagramCount += 1;
	  	}
	  	else {
	  		tumblrCount += 1;
	  	}
	});

	var socialCountReturn = [{ 'x' : 'Facebook: ' + facebookCount, 'y': facebookCount},
	 { 'x' : 'Twitter: ' + twitterCount , 'y': twitterCount},
	 {'x' : 'Instagram: ' + instagramCount, 'y': instagramCount},
	 {'x' : 'Tumblr: ' + tumblrCount, 'y': tumblrCount}];
	return socialCountReturn;
}

function likeCounter(data){
	var facebookCount = 0;
	var twitterCount = 0;
	var tumblrCount = 0;
	var instagramCount = 0;

	data.forEach(function(element){
		if (element.provider === 'facebook'){
			facebookCount += element.activity_likes;

	  	}
	  	else if (element.provider === 'twitter'){
	  		twitterCount += element.activity_likes;
	  	}
	  	else if (element.provider === 'instagram'){
	  		instagramCount += element.activity_likes;
	  	}
	  	else {
	  		tumblrCount += element.activity_likes;
	  	}
	});

	var likeCountReturn = [{ 'x' : 'Facebook: ' + facebookCount, 'y': facebookCount},
	 { 'x' : 'Twitter: ' + twitterCount , 'y': twitterCount},
	 {'x' : 'Instagram: ' + instagramCount, 'y': instagramCount},
	 {'x' : 'Tumblr: ' + tumblrCount, 'y': tumblrCount}];
	return likeCountReturn;
}

function measure(text, classname) {
  if(!text || text.length === 0) return {height: 0, width: 0};

  var container = d3.select('#totalPosts').append('vis').attr('class', classname);
  container.append('text').attr({x: -1000, y: -1000}).text(text);

  var bbox = container.node().getBBox();
  container.remove();

  return {height: bbox.height, width: bbox.width};
}


function D3Graph(barData, vis, color, yLabel) {
	
    var WIDTH = 700,
    HEIGHT = 500,
    MARGINS = {
      top: 20,
      right: 20,
      bottom: 20,
      left: 50
    },
    xRange = d3.scaleBand().rangeRound([MARGINS.left, WIDTH], 1).domain(barData.map(function (d) {
      return d.x;
    })),


    yRange = d3.scaleLinear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([0,
      d3.max(barData, function (d) {
        return d.y;
      })
    ]),

    xAxis = d3.axisBottom()
      .scale(xRange)


    yAxis = d3.axisLeft()
      .scale(yRange)

	vis.append('svg:g')
	.attr('class', 'x axis')
	.attr('transform', 'translate(0,' + (HEIGHT - MARGINS.bottom) + ')')
	.call(xAxis);

	vis.append('svg:g')
	.attr('class', 'y axis')
	.attr('transform', 'translate(' + (MARGINS.left) + ',0)')
	.call(yAxis);
	
	vis.selectAll('rect')
	.data(barData)
	.enter()
	.append('rect')
	.attr('x', function (d) {
	  return xRange(d.x);
	})
	.attr('y', function (d) {
	  return yRange(d.y);
	})
	.attr('width', xRange.bandwidth() - 15)
	.attr('height', function (d) {
	  return ((HEIGHT - MARGINS.bottom) - yRange(d.y));
	})
	.attr('fill', color)
	.attr('border', '1px solid #000')
	.attr('border-radius', '5px');

	d3.select("#totalPosts").append("text")
            .attr("class","mainTitle")
            .attr("x",250)
            .attr("y",15)
            .text('Total # of Posts per Provider');

    d3.select("#totalLikes").append("text")
            .attr("class","mainTitle")
            .attr("x",250)
            .attr("y",15)
            .text('Total # of Likes per Provider');

}

function instaLikeBtnClicked (obj){
	var mediaID = obj.getAttribute("href"); // media id isn't valid though D:
	var url = 'https://api.instagram.com/v1/media/' + mediaID + '/likes?access_token=1384187989.683925d.8962437c674c474290f83b0dc895af40';
    httpRequest = new XMLHttpRequest();
	httpRequest.open('POST', url,false);
	httpRequest.send(null);

	return httpRequest.responseText;
}


function tumblrLikeBtnClicked (obj){
	var mediaID = obj.getAttribute("href");
	var url = 'https://api.tumblr.com/v2/user/like/' + mediaID; //  althought this won't work because I don't have oath authentication and the id is not real
    httpRequest = new XMLHttpRequest();
	httpRequest.open('POST', url,false);
	httpRequest.send(null);
	return httpRequest.responseText;
}


function twitterLikeBtnClicked (obj){
	var mediaID = obj.getAttribute("href");
	var url = 'https://api.twitter.com/1.1/favorites/create.json?id=' + mediaID; // media id isn't valid though D:
    httpRequest = new XMLHttpRequest();
	httpRequest.open('POST', url,false);
	httpRequest.send(null);
	return httpRequest.responseText;
}