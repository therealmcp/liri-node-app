require("dotenv").config();

var fs = require("fs");
var request = require('request');
var moment = require('moment');
var Spotify = require('node-spotify-api');

fs.appendFile("log.txt", process.argv.slice(2), function(err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Added to log");
    }
})

var spotify = new Spotify ({
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET
});

var command = process.argv[2];
var userQuery = process.argv.slice(3); // Fix this for concert-this

var mySwitch = function() {
    switch (command) {
        case "movie-this":
            request('http://www.omdbapi.com/?t=' + userQuery + '&apikey=trilogy', function (error, response, body) {
                if (error) {
                    console.log('error:', error); // Print the error if one occurred
                    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                } else {
                    // console.log('BODY:', body); // Print the HTML for the Google homepage.
                    var movieData = JSON.parse(body);
                    console.log("\n");
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
            request("https://rest.bandsintown.com/artists/" + userQuery + "/events?app_id=codingbootcamp", function (error, response, body) {
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
        case "spotify-this-song":
            spotify
            .search({ type: 'track', query: userQuery })
            .then(function(response) {
                console.log("\n");
                console.log("* Artist: ", response.tracks.items[0].artists[0].name);
                console.log("* Song Name: ", response.tracks.items[0].name);
                console.log("* Link: ", response.tracks.items[0].external_urls.spotify);
                console.log("* Album: ", response.tracks.items[0].album.name);
            })
            .catch(function(err) {
            console.log(err);
            });
            break;
        case "do-what-it-says":
            fs.readFile("random.txt", "utf8", function(error, data) {
                if (error) {
                    return console.log(error);
                }

                var dataArr = data.split(",");

                command = dataArr[0];
                userQuery = dataArr[1].slice(1, -1);

                console.log(userQuery);

                mySwitch();
            })
            break;
    }
}

mySwitch();