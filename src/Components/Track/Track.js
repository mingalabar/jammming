import React, { Component } from 'react';
import './Track.css';

class Track extends Component {
  constructor(props) {
    super(props);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
  }

  addTrack() {
    this.props.onAdd(this.props.track);
  }

  removeTrack() {
    this.props.onRemove(this.props.track);
  }

  /* renderAction method adds the HTML to the track information based
  on whether track can be added or removed. */
  renderAction() {
    if (this.props.isRemoval) {
      return <a className="Track-action" onClick={this.removeTrack}>-</a>;
    }
    return <a className="Track-action" onClick={this.addTrack}>+</a>;
  }



  render() {
    return (
      <div className="Track">
        <div className="Track-information">
          <h3>
            {this.props.track.name}
          </h3>
          <p>
          {this.props.track.artist} | {this.props.track.album}
          <br />
          Tempo : {Math.round(this.props.track.tempo)} bpm <br/>
          Danceability : {Math.round(this.props.track.danceability*100)}/100
           | Happiness : {Math.round(this.props.track.valence*100)}/100
           | Energy : {Math.round(this.props.track.energy*100)}/100
          </p><br />
          <iframe title={this.props.track.id} src={"https://open.spotify.com/embed?uri=spotify:track:"+ this.props.track.id}
          frameBorder="0" allowTransparency="true"></iframe>
        </div>
        {this.renderAction()}
      </div>
    );
  }
}

export default Track;
