const USER_ID = '6b82ab969eb74affbe6ca604b3dccfa8';
const REDIRECT_URI = 'http://jammmingCH.surge.sh';
const accessURIBase = 'https://accounts.spotify.com/authorize';
const spotifyURIBase = 'https://api.spotify.com/v1/';

let accessToken;

const Spotify = {
  // method used to get access token to utilize the SpotifyAPI.
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }

    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      // Clears the parameters, allowing a new access token to be pulled when it expires.
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    } else {
      const accessURI = `${accessURIBase}?client_id=${USER_ID}&response_type=token&scope=playlist-modify-public&redirect_uri=${REDIRECT_URI}`;
      //window.location = accessURI;
    }
  },
  /* method that takes the previously genereated Access token and performs search
  with the term passed from the App component. */
  search(term) {
    const accessToken = Spotify.getAccessToken();
    return fetch(`${spotifyURIBase}search?type=track&q=${term}`, { // retrival of the info for the term supplied.
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  ).then(response => { return response.json(); }
  ).then(jsonResponse => { // parsing of the retreived data into json objects.
      if (!jsonResponse.tracks) {
        return [];
      }
/* picking of the json data and assigning to track object. */
      return jsonResponse.tracks.items.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri
      }));
    });
  },
  /* method that takes the given playlist and saves to the users Spotify account. */
  savePlaylist(name, trackURIs) {
    if (!name || !trackURIs) return;
    const accessToken = Spotify.getAccessToken();
    const headers = {Authorization: `Bearer ${accessToken}`};
    const createPlaylistHeaders = {
      headers: headers,
      method: 'POST',
      body: JSON.stringify({name: name}) };
    const addTracksHeaders = {
      headers: headers,
      method: 'POST',
      body: JSON.stringify({'uris': trackURIs,}) };
    let userID, playlistID;
    // Get user id from Spotify
    console.log('rpout');
    return fetch('https://api.spotify.com/v1/me', {headers: headers})
    .then(response => response.json())
    .then(jsonResponse => {
      userID = jsonResponse.id;
      // Create playlist
      return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, createPlaylistHeaders)
        .then(response => response.json())
        .then(jsonResponse => {
          playlistID = jsonResponse.id;
          // Add tracks to playlist
          return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, addTracksHeaders)
        });
    });
  },
};

export default Spotify;
