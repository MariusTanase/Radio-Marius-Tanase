import React, { useState, useEffect, useRef } from 'react';
import './Player.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faShuffle, faForward, faBackward, faPlay, faPause } from '@fortawesome/free-solid-svg-icons'
import { startRadio, stopRadio, setRadio, setRadioGenre, setRadioImage,setRadioName, setRadioVolume } from '../../utils/radio'

const Player = ({list}) => {
    const [radioId, setRadioID] = useState(0)
    const [audioIsRunning, setAudioIsRunning] = useState(false)

    const audioRef = useRef(null)

    const playAudio = () => {
        startRadio()
        setAudioIsRunning(true)
    }

    const pauseAudio = () => {
        stopRadio()
        setAudioIsRunning(false)
    }

    const randomRadio = () => {
        const randomRadio = list[Math.floor(Math.random() * list.length)]
        setRadioID(randomRadio.id)
        console.log(`random radio id: ${randomRadio.id}`)
        console.log(`radio id: ${radioId}`)
        if(randomRadio.id == radioId){
            randomRadio()
        }
        setRadioName(randomRadio.title)
        setRadioGenre(randomRadio.artist)
        setRadioImage(randomRadio.image, randomRadio.title, randomRadio.genre)
        setRadio(randomRadio.url)

        setAudioIsRunning(true)
        playAudio()
      }

    //   unfortunately I couldn't find a better way to move the slider
    let [volume, setVolume] = useState(0.1)
    const volumeControl = (value) => {
        setVolume(value);
        // update the UI to reflect the new volume
        audioRef.current.volume = volume
    }
    // change the radio to the previous one

    let [backClicked, setBackClicked] = useState(false)
    const previousRadio = (id) => {
        // changing the radio based on the id and the list length
        // first check the ID after change the radio
        if(!backClicked){
            setBackClicked(true)

            // if the id is the same, then the radio is the first one in the list
            // so we set the id to the last radio in the list
            id = id - 2;
        } else {
            // if the id is not the same, then we set the id to the previous radio
            id = id - 1;
        }
        if(id < 0){
            id = list.length - 1
        }
        // set the new id
        setRadioID(id)
        // change the radio
        setRadio(list[id].url)
        // change the radio info
        setRadioName(list[id].title)
        setRadioGenre(list[id].artist)
        setRadioImage(list[id].image, list[id].title, list[id].genre)
        // play the radio
        playAudio()
    }
 

    // change the radio to the next one
    const nextRadio = (id) => {
        if(id === list.length){
            id = 0
        } else {
            id = id + 1
        }
        // set the new id
        setRadioID(id)
        // change the radio
        setRadio(list[id].url)
        // change the radio info
        setRadioName(list[id].title)
        setRadioGenre(list[id].artist)
        setRadioImage(list[id].image, list[id].title, list[id].genre)
        // play the radio
        playAudio()
    }

    useEffect(() => {
        setVolume(0.1)
        // set a random radio on load
        randomRadio()
    }, [])

  return (
    <div className="audio-player">
        <div className="track-info">
            <img
            className="artwork"
            />
            <h2 className="title"></h2>
            <h3 className="genre"></h3>
        </div>
        <div className="controls">
            <div className='controls-buttons'>


                <button className="control-button previous" onClick={() =>{
                    previousRadio(radioId)
                }}>
                    <FontAwesomeIcon icon={faBackward} />
                </button>

                {/* if audio is paused, show playbutton, else if audio is running show stop button */}
                {audioIsRunning ? (
                    <button className="control-button play" onClick={() => {
                        pauseAudio()
                    }}>
                    <FontAwesomeIcon icon={faPause} />
                    </button>
                ) : (
                    <button className="control-button play" onClick={() => {
                        playAudio()
                    }}>
                    <FontAwesomeIcon icon={faPlay} />
                    </button>
                )}

                <button className="control-button next" onClick={() => {
                    nextRadio(radioId)
                }}>
                    <FontAwesomeIcon icon={faForward} />
                </button>
            </div>
            
            <div className="volume-control">
            <button className="control-button shuffle" onClick={() => { 
                randomRadio()
                }}>
                <FontAwesomeIcon icon={faShuffle} />
                </button>
                {/* value has to change when slide */}
                <input type="range" min="0" max="1" step="0.01"
                className='volume-slider'
                value={audioRef.current ? audioRef.current.volume : 0}
                onLoad={() => volumeControl(0.1)}
                onChange={
                (e) => volumeControl(e.target.value)
                }/>
            </div>
        </div>

        <audio ref={audioRef} src={list[2].url} autoPlay={true}/>

    </div>
  )
}

export default Player