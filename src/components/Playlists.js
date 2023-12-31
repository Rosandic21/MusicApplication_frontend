// Playlists.js 
import axios from 'axios';
import {React, useState} from 'react';
import RatingComponent from './RatingComponent'; // shows 1-5 stars for users to rate tracks

/**
 * UI to display users playlists
 * @param {object} playlistData - state containing user's Spotify playlists
 * @param {string} accessToken - accessToken used to make requests to Spotify API
 * @param {string} userID - unique user ID 
 * @returns - Playlists React component
 */
const Playlists = ({playlistData, accessToken, userID}) => {

    const [tracks, setTracks] = useState(null); 
    const [showTracks, setShowTracks] = useState(false);

    // fetch tracks contained in user's playlist
    const showPlaylistTracks = async(playlistItemsArray) => {
        try{
            const response = await axios.get(playlistItemsArray.tracks.href, {
                headers: {
                    Authorization: `Bearer  ${accessToken}`
                }
            });
            const tracks = response.data;
            console.log("Playlist Tracks: ", tracks);
            setTracks(tracks);
            } catch(error){
                console.log("Error retrieving tracks for playlist: ", error);
                setTracks(null);
            }
        };

    return (
        <div>
        {/* shows playlists as clickable <p>playlist names</p>. Update showTracks state */}
            <div className="flex">
                <div className="showPlaylists w-50 flex-col align-items-start">
                    <h1 className="text-xl text-white w-60 border-solid border-6 border rounded-full border-sky-600 ml-1 pl-2 bg-gradient-to-r from-pink-500 to-violet-500"> Rate your playlist tracks</h1> 
                    {playlistData && playlistData.items.length > 0 ? ( 
                        playlistData.items.map((playlistItem, index) =>
                            <div key={index}>
                                <p className="ml-4 font-semibold cursor-pointer underline text-blue-600 hover:text-blue-900" onClick={ () => {showPlaylistTracks(playlistItem); setShowTracks(!showTracks)} }>{index+1}: {playlistItem.name}</p>
                            </div>
                        )   
                    ) : (<p>You need to add or create a playlist on spotify</p>)}
                </div>

                {/* after playlist gets clicked, state of tracks updates and tracks get displayed. 
                showTracks included in conditional render to allow for showing/hiding of content onClick (where showTracks state changes) */}
                {/* display playlist tracks for rating when user clicks on playlist: */}
                {showTracks && tracks && ( // only display div className="showTracks" when tracks are actually displayed.
                <div className="showTracks bg-blue-400 border-2 border-grey-500 w-50 max-h-96 overflow-y-auto flex-col items-center ml-20 mr-4 p-4">
                    {showTracks && tracks && tracks.items.map((trackItemArray,index) =>
                        <div className="ratingBox bg-sky-200 border-2 mt-2"key={index}>
                            <b>{trackItemArray.track.name}</b> {/* display track name */}
                            <p>by {trackItemArray.track.artists[0].name}</p> {/* display artist name */}
                            <RatingComponent userID={userID} musicID={trackItemArray.track.external_urls.spotify} title={trackItemArray.track.name} artist={trackItemArray.track.artists[0].name}/> {/* pass props needed for creating ratings to RatingComponent */}
                        </div>
                    )} 
                </div>
                )}
            </div>
        </div>
    );
};

export default Playlists;
