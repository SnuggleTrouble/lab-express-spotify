require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:
//The Home page
app.get("/", (req, res, next) => {
  res.render("home");
});

//Searching for Artists
app.get("/artist-search", (req, res, next) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
      console.log("The received data from the API: ", data.body);
      let searchedArtists = data.body.artists.items;
      res.render("artist-search-results", { searchedArtists });
    })
    .catch((err) =>
      console.log("The error while searching artists occured: ", err)
    );
});

//Searching for Albums
app.get("/albums/:artistId", (req, res, next) => {
  spotifyApi
    .getArtistAlbums(req.params.id)
    .then((albums) => {
      let artistAlbums = albums.body.items;
      console.log(artistAlbums);
      res.render("albums", { artistAlbums });
    })
    .catch((err) => {
      console.log("There was an issue while retrieving the albums ", err);
    });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
