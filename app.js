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
    .searchArtists(req.query.search)
    .then((data) => {
      console.log("The received data from the API: ", data.body.artists.items[0]);
      let searchedArtists = data.body.artists.items[0].images[0].url;
      res.render("artist-search-results", { searchedArtists });
    })
    .catch((error) =>
      console.log("An error whilst searching for artists occurred: ", error)
    );
});

//Searching for Albums
app.get("/albums/:artistId", (req, res, next) => {
  spotifyApi
    .getArtistAlbums(req.params.id, { limit: 10, offset: 20 })
    .then((albums) => {
      let artistAlbums = albums.body.items;
      res.render("albums", { artistAlbums });
    })
    .catch((error) => {
      console.log("An error whilst retrieving the albums occurred: ", error);
    });
});

//Searching for Tracks
app.get("/albums/tracks/:albumId", (req, res, next) => {
  spotifyApi
    .getAlbumTracks(req.params.id, { limit: 5, offset: 1 })
    .then((tracks) => {
      let albumTracks = tracks.body.items;
      res.render("tracks", { albumTracks });
    })
    .catch((error) => {
      console.log("An error whilst retrieving the tracks occurred: ", error);
    });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
