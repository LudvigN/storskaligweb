/**
 * 
 */
var cities =  [{city:"Stockholm", lat: 59.332269, long: 18.063015, wikiName:"Stockholm"},
               {city: "Washington DC", lat: 38.906751, long: -77.036492, wikiName:"Washington"},
               {city: "Moscow", lat: 55.755921, long: 37.617311, wikiName:"Moscow"}];
//Intervallen för timerprintOut
var cinterval = null;
var timeOut = null;

var points = 0;
var tries;
var index;

google.maps.event.addDomListener(window, 'load', newRound);

//kanske bättre
window.onload = function (){
	
};

$.ajax({
    type: 'GET',
    dataType: 'jsonp',
    data: {},
    url: "http://en.wikipedia.org/w/api.php?action=parse&page=Rome&format=json&prop=text&section=0",
    error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
    },
    //om den funkar stoppas resultatet av getWikisummary in i divven wikiInfo
    success: function (msg) {
        $("#wikiInfo").html(getWikiSummary(msg));
        
    }
});


function fillArray()
{
	if(cities.length == 0)
		{
		cities.push({city:"Stockholm", lat: 59.332269, long: 18.063015, wikiName:"Stockholm"});
		cities.push({city: "Washington DC", lat: 38.906751, long: -77.036492, wikiName:"Washington"});
		cities.push({city: "Moscow", lat: 55.755921, long: 37.617311, wikiName:"Moscow"});
		}
	else
		{
	
		}
}
	

function getPosition()
{
	index = Math.floor(Math.random()*cities.length);
	return index;
}

function newRound()
{
	
	//fillArray();
	var index = getPosition();
	getta(index);
	loadNewMap(index);
	
	  	clearTimeout(timeOut);
	  	clearInterval(cinterval);
	  	startTimer();

	
}


function loadNewMap(index) {
	console.log(index, cities);
	var city = new google.maps.LatLng(cities[index].lat, cities[index].long);
	  var panoramaOptions = {
			  addressControl:false,
	    position: city,
	    pov: {
	      heading: 165,
	      pitch: 0
	    },
	    zoom: 1
	  };
	  var myPano = new google.maps.StreetViewPanorama(
	      document.getElementById('map-canvas'),
	      panoramaOptions);
	  myPano.setVisible(true);  
	 
	}

function startTimer()
{

	var second = 40;
	cinterval = setInterval(function() { 
		second--;
		if(second <= 0)
			{
				clearInterval(cinterval);
				clearTimeout(timeOut);
			}
		document.getElementById('countdown').innerHTML = second;
		console.log(second);
		
	}, 1000);
	
	timeOut = setTimeout(function()
	{
		window.alert("Tiden tog slut :(");
		loadNewMap();
		
	}, 40000		
	);
}

function checkAnswer()
{
	var guess = document.getElementsByName("txtCityGuess")[0].value;
	if (guess == cities[index].city)
		{
			document.getElementsByName("txtCityGuess")[0].value = "";
			window.alert("Helt korrekt!" + guess + " var rätt svar! \n +100 pts!");
			points = points + 100;
			//clearInterval(cinterval);
			clearTimeout(timeOut);
			clearInterval(cinterval);
			newRound();
		}
	else
		{
				document.getElementsByName("txtCityGuess")[0].value = "";
				tries = tries -1;
				points = points - 50;
				window.alert("Fel svar! -50 pts!");
				clearTimeout(timeOut);
				clearInterval(cinterval);
				newRound();
		}
}





//Albins wikidelar

function getWikiSummary(data){
	checkAnswer();
	var result = "";
	
    for (var text in data.parse.text) {
    	
        text = data.parse.text[text].split("<p>");
        var pText = "";

        for (p in text) {
            //Remove html comment
            text[p] = text[p].split("<!--");
            
            if (text[p].length > 1) {
                text[p][0] = text[p][0].split(/\r\n|\r|\n/);
                text[p][0] = text[p][0][0];
                text[p][0] += "</p> ";
            }
            text[p] = text[p][0];

            //Construct a string from paragraphs
            if (text[p].indexOf("</p>") == text[p].length - 5) {
                var htmlStrip = text[p].replace(/<(?:.|\n)*?>/gm, ''); //Remove HTML
                var splitNewline = htmlStrip.split(/\r\n|\r|\n/); //Split on newlines
                
                for (newline in splitNewline) {
                    if (splitNewline[newline].substring(0, 11) != "Cite error:") {
                        pText += splitNewline[newline];
                        pText += "\n";
                    }
                }
            }
            
            
            	for(p in pText)
            	{
            		//removeCityname(p);
            		//removeFunkyName(p);
            		pText = pText.replace("Rome", "This Place");
            	}
            
        }
        pText = pText.substring(0, pText.length - 2); //Remove extra newline
        pText = pText.replace(/\[\d+\]/g, ""); //Remove reference tags (e.x. [1], [4], etc)
        result += pText;
    }
    
    return result;
}

function getta(index){
	
	var city = cities[index].wikiName;
	
	    $.ajax({
	        type: 'GET',
	        dataType: 'jsonp',
	        data: {},
	        url: "http://en.wikipedia.org/w/api.php?action=parse&page="+city+"&format=json&prop=text&section=0",
	        error: function (jqXHR, textStatus, errorThrown) {
	            console.log(jqXHR);
	        },
	        //om den funkar stoppas resultatet av getWikisummary in i divven wikiInfo
	        success: function (msg) {
	            $("#testDiv").html(getWikiSummary(msg));
	            
	        }
	    });
	
}