require("dotenv").config();
var keys = require("./keys.js");
var axios = require("axios");
var fs = require("fs");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

function concertSearch(band) {
    axios.get("https://rest.bandsintown.com/artists/" + band + "/events?app_id=codingbootcamp")
    .then(function(res) {
        for(var i = 0; i < res.data.length; i++) {
            venue = res.data[i].venue.name;
            location = res.data[i].venue.city;
            date = res.data[i].datetime;

            console.log("Venue: " + venue);
            console.log("location: " + location);
            console.log("Date: " + date);
        }
    });
}

function songSearch(song) {
    spotify.search({
        type: "track",
        query: song
    }).then(function (data) {
        firstSong = data.tracks.items[0];
        artists = firstSong.artists;
        title = firstSong.name;
        link = firstSong.preview_url;
        albumTitle = firstSong.album.name;

        if (artists.length === 1)
            console.log("Artist: " + artists[0].name);
        else {
            let out = "Artists: ";
            for (var i = 0; i < artists.length; i++) {
                out += artists[i].name + ", ";
            }
            out = out.substring(0, out.length - 2);
            console.log(out);
        }
        console.log("Album: " + albumTitle);
        console.log("Title: " + title);
        console.log("Preview Link: " + link);
    })
}

function movieSearch(movie) {
    axios.get("http://www.omdbapi.com/?apikey=" + keys.omdb.key + "&t=" + movie)
    .then(function(res) {
        title = res.data.Title;
        year = res.data.Year;
        imdb = res.data.imdbRating;
        rt = res.data.Ratings[1].Value;
        country = res.data.Country;
        language = res.data.Language;
        plot = res.data.Plot;
        actors = res.data.Actors;
        
        console.log("Title: " + title);
        console.log("Year: " + year);
        console.log("Ratings: IMDB: " + imdb + ", Rotten Tomatoes: " + rt);
        console.log("Filmed in: " + country);
        console.log("Available in: " + language);
        console.log("Plot: " + plot);
        console.log("Primary actors: " + actors);
    });
}

function somethingRandom(words) {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        }
        var dataArr = data.split(",");

        run(dataArr[0], dataArr[1]);
    });
}

let key = process.argv[2];
let theRest = process.argv.slice(3).join(" ")

function run(a, b) {
    switch (a) {
        case "concert-this":
            concertSearch(b);
            break;
        case "spotify-this-song":
            songSearch(b);
            break;
        case "movie-this":
            movieSearch(b);
            break;
        case "do-what-it-says":
            somethingRandom(b);
            break;
        default:
            console.log("I'm sorry, I don't understand " + a + "...");
            break;
    }
}

run(key, theRest);