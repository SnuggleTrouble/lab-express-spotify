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
app.get("/", (req, res) => {
  res.render("home");
});

//Searching for Artists
app.get("/artist-search", (req, res) => {
  spotifyApi
    .searchArtists(req.query.artistSearch)
    .then((data) => {
      console.log("The received data from the API: ", data.body.artists.items);
      res.render("artist-search-results", { artists: data.body.artists.items });
    })
    .catch((error) =>
      console.log("An error whilst searching for artists occurred: ", error)
    );
});

//Searching for Albums
app.get("/albums/:artistId", (req, res) => {
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then(async (data) => {
      const artistData = await spotifyApi.getArtist(req.params.artistId);
      res.render("albums", {
        albums: data.body.items,
        artistName: artistData.body.name,
      });
    })
    .catch((error) => {
      console.log("An error whilst retrieving the albums occurred: ", error);
    });
});

//Searching for Tracks
app.get("/tracks/:albumId", (req, res) => {
  spotifyApi
    .getAlbumTracks(req.params.albumId, { limit: 5, offset: 1 })
    .then((data) => {
      res.render("tracks", { tracks: data.body.items });
    })
    .catch((error) => {
      console.log("An error whilst retrieving the tracks occurred: ", error);
    });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
