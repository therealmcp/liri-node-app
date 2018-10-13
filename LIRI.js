require("dotenv").config();

var request = require('request');
var moment = require('moment');

var command = process.argv[2];
var query = process.argv[3];

switch (command) {
    case "movie-this":
        request('http://www.omdbapi.com/?t=' + query + '&apikey=trilogy', function (error, response, body) {
            if (error) {
                console.log('error:', error); // Print the error if one occurred
                console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            } else {
                // console.log('body:', body); // Print the HTML for the Google homepage.
                var movieData = JSON.parse(body);
                console.log("* Title: ", movieData.Title);
                console.log("* Year of Release: ", movieData.Year);
                console.log("* IMDB Rating: ", movieData.imdbRating);
                console.log("* Rotten Tomatoes Rating: ", movieData.Ratings[1].Value);
                console.log("* Country: ", movieData.Country);
                console.log("* Language: ", movieData.Language);
                console.log("* Plot: ", movieData.Plot);
                console.log("* Actors: ", movieData.Actors);
            }
        });
        break;
    case "concert-this":
        request("https://rest.bandsintown.com/artists/" + query + "/events?app_id=codingbootcamp", function (error, response, body) {
            if (error) {
                console.log("error:", error);
                console.log("statsuCode: ", response && response.statusCode);
            } else {
                var bandData = JSON.parse(body);
                for (i = 0; i < bandData.length; i++) {
                    var date = moment(bandData[i].datetime).format("MM/DD/YYYY");
                    console.log("* Venue: ", bandData[i].venue.name);
                    console.log("* Location: ", bandData[i].venue.city, ", ", bandData[i].venue.country);
                    console.log("* Date: ", date);
                    console.log("\n");
                }
            }
        });
        break;
    // case "spotify-this-song":
        
}