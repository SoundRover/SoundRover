# -*- coding: utf-8 -*-
"""
Created on Wed Jan 11 19:45:40 2023

@author: Noah McCreery
"""

import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from spotipy.oauth2 import SpotifyOAuth
from lyricsgenius import Genius
import cred
import operator

#Authentication - without user
#client_credentials_manager = SpotifyClientCredentials(client_id=cid, client_secret=secret)
#sp = spotipy.Spotify(client_credentials_manager = client_credentials_manager)

# Authentication - with user
scope = ['user-library-read', 'app-remote-control', 'user-modify-playback-state', 'user-read-playback-state']
sp = spotipy.Spotify(auth_manager=SpotifyOAuth(client_id=cred.client_id, 
                                               client_secret= cred.client_secret, 
                                               redirect_uri=cred.redirect_url, 
                                               scope=scope))

# results = sp.current_user_recently_played()
# for idx, item in enumerate(results['items']):
#      track = item['track']
#      print(idx, track['artists'][0]['name'], " – ", track['name'])

def pretty_print_tracks(tracks):
    for idx, item in enumerate(tracks):
          track = item['track']
          print(idx, track['artists'][0]['name'], " – ", track['name'])
     
# get all of a users saved tracks
def get_all_user_saved_tracks(limit_step=50):
    tracks = []
    for offset in range(0, 10000000, limit_step):
        response = sp.current_user_saved_tracks(
            limit=limit_step,
            offset=offset,
        )
        #print(response)
        if response['offset'] > response['total']:
            break
        for item in response['items']:
            tracks.append(item)
    return tracks

def list_all_user_saved_songs():
    tracks = get_all_user_saved_tracks()
    pretty_print_tracks(tracks)
          
def list_artists_by_num_songs():
    tracks = get_all_user_saved_tracks()
    artists = {}
    for track in tracks:
        current_track_artists = track['track']['artists']
        for artist in current_track_artists:
            if artist['name'] not in artists:
                artists[artist['name']] = 1
            else:
                artists[artist['name']] += 1
    sorted_artists = dict(sorted(artists.items(), key=operator.itemgetter(1),reverse=True))
    for idx, artist in enumerate(sorted_artists):
        if (artists.get(artist) > 1):
            print(idx, artist, " - ", artists.get(artist))

def song_search():
    response = input("Type the name of the song: ")
    results = sp.search(q=response, type='track')
    song = results['tracks']['items'][0]
    return song

def print_lyrics(song):
    song_name = song['name']
    artist = song['artists'][0]['name']

    genius = Genius(access_token='your_access_token')
    song_lyrics = genius.search_song(song_name, artist)
    print(song_lyrics.lyrics)

def sample_search(track):
    if 'external_ids' in track:
        if 'isrc' in track['external_ids']:
            print(sp.track(track['external_ids']['isrc'])['name'])

        if 'samples' in track:
            for sample in track['samples']:
                print(sample)

def artist_search():
    response = input("Type the name of the artist: ")
    results = sp.search(q=response, type='artist')
    artist = results['artists']['items'][0]
    return artist['id']

def related_artists():
    artist_id = artist_search()
    results = sp.artist_related_artists(artist_id)
    for artist in results['artists']:
        print(artist['name'])

def discover(song=""):
    if song == "":
        song = song_search()

    results = sp.recommendations(seed_tracks=[song['id']],market='US', limit=5)
    for idx, track in enumerate(results['tracks']):
        print(idx, track['name'], " - ", track['artists'][0]['name'])

    response = ""

    while response != "q":
        print("Type the number of the song you want more recommendations about:")
        response = input("> ")
        if int(response) >= 1 and int(response) <= 5:
            discover(results['tracks'][int(response)])

    
def display_menu_and_input(response=""):
    while response != "q":
        print("Menu")
        print("1. List all songs in library")
        print("2. See the artists you have added the most songs from")
        print("3. Get a song's lyrics")
        print("4. See samples in a song")
        print("5. Skip current song")
        print("6. Find related artists")
        print("7. Discover")
        
        response = input("> ")
        
        if response == "1":
            list_all_user_saved_songs()
        if response == "2":
            list_artists_by_num_songs()
        if response == "3":
            song = song_search()
            print_lyrics(song)
        if response == "4":
            song = song_search()
            sample_search(song)
        if response == "5":
            try:
                sp.next_track()
            except spotipy.exceptions.SpotifyException:
                print("No music playing")
        if response == "6":
            related_artists()
        if response == "7":
            discover()
    return
    
    
def main():
    display_menu_and_input()

main()

# getting data from a playlist
# playlist_link = "https://open.spotify.com/playlist/37i9dQZEVXbNG2KDcFcKOF?si=1333723a6eff4b7f"
# playlist_URI = playlist_link.split("/")[-1].split("?")[0]
# track_uris = [x["track"]["uri"] for x in sp.playlist_tracks(playlist_URI)["items"]]

# for track in sp.playlist_tracks(playlist_URI)["items"]:
#     #URI
#     track_uri = track["track"]["uri"]
    
#     #Track name
#     track_name = track["track"]["name"]
    
#     #Main Artist
#     artist_uri = track["track"]["artists"][0]["uri"]
#     artist_info = sp.artist(artist_uri)
    
#     #Name, popularity, genre
#     artist_name = track["track"]["artists"][0]["name"]
#     artist_pop = artist_info["popularity"]
#     artist_genres = artist_info["genres"]
    
#     #Album
#     album = track["track"]["album"]["name"]
    
#     #Popularity of the track
#     track_pop = track["track"]["popularity"]
    
#     sp.audio_features(track_uri)[0]