import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      searchTerm: '',
      playlistName: 'New Playlist Name',
      playlistTracks: [],
      tracks: []
      };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    }

  // Add a track to the playlist if not already there
  addTrack(track) {
    let isInPlaylist = this.state.playlistTracks.find(is => is.id === track.id); // is the track in the playlist already ?
    if (!isInPlaylist) {
      this.setState({playListTracks: this.state.playlistTracks.push(track)});
    }
  }

  // Removes a track from the playlist
  removeTrack(track) {
    let indexInPlaylist = this.state.playlistTracks.findIndex(is => is.id === track.id); // is the track in the playlist already ?
    this.setState({playListTracks: this.state.playlistTracks.splice(indexInPlaylist, 1)});
  }

  // Updates playlist name
  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }

  // Saves playlist using Spotify.playlist function
  savePlaylist() {
    let playlistName = this.state.playlistName;
    let trackURIs = [];
    this.state.playlistTracks.forEach(track => {
        trackURIs.push('spotify:track:'+track.id);
      });
    Spotify.savePlaylist(playlistName, trackURIs);
    this.setState({
        searchResults: [],
        searchTerm: '',
        playlistTracks: [],
        playlistName: 'New Playlist Name',
      });
//    document.getElementById('searchBar').value='';
//    document.getElementById('playlistName').value='New PlaylistName';
  }

  // Searches through Spotify API using Spotify.search function
  search(term) {
    Spotify.search(term).then(tracks => {
      this.setState({ searchResults: tracks });
    });
  }

  render() {
    return (
      <div>
        <h1>Ja
        <span className="highlight">mmm</span>
        ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks}
              onNameChange={this.updatePlaylistName} onSave={this.savePlaylist} onRemove={this.removeTrack}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
