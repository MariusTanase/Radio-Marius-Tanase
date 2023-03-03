import React, { useState, useEffect, useRef } from 'react';
import './Player.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faShuffle, faBackward, faForward, faPlay, faPause } from '@fortawesome/free-solid-svg-icons'

const Player = () => {


    const [title, setTitle] = useState('Title')
    const [artist, setArtist] = useState('Artist')
    const [image, setImage] = useState('https://via.placeholder.com/150')
    const [radioID, setRadioID] = useState(0)
    const [audioIsRunning, setAudioIsRunning] = useState(false)

    const radios = [
        {   
            id: 1,
            title: 'Virgin FM',
            artist: '-',
            genre: 'Pop',
            image: 'https://yt3.googleusercontent.com/u5l6CzL3sSRgQJPzNczUX9bvA81HFyIwfdRz-SJR0EQvezpPQAj4J1zmhUK5mH-hEY_Oayg3ecA=s900-c-k-c0x00ffffff-no-rj',
            url: 'https://radio.virginradio.co.uk/stream'
        },
        {
            id: 2,
            title: 'Classic',
            artist: 'FM',
            genre: 'Dance',
            image: 'https://uk.radio.net/images/broadcasts/79/5a/121368/1/c300.png',
            url: 'https://media-ssl.musicradio.com/ClassicFM'
        },
        {
            id: 3,
            title: 'Heart',
            artist: 'Dance',
            genre: 'Dance',
            image: 'https://static.mytuner.mobi/media/tvos_radios/mmvGSBqcQB.png',
            url: 'https://media-ssl.musicradio.com/HeartDance'
        },
        {
            id: 4,
            title: 'Monte Carlo 2',
            artist: 'Deep House Radio',
            genre: 'Deep House',
            image: 'https://cdn.onlineradiobox.com/img/l/8/12078.v9.png',
            url: 'https://edge.singsingmusic.net/MC2.mp3'
        }
    ]

    const audioRef = useRef(null)

    const playAudio = () => {
        audioRef.current.play()
        setAudioIsRunning(true)
    }

    const pauseAudio = () => {
        audioRef.current.pause()
        setAudioIsRunning(false)
    }

    const randomRadio = () => {

        const randomRadio = radios[Math.floor(Math.random() * radios.length)]
        setTitle(randomRadio.title)
        setArtist(randomRadio.artist)
        setImage(randomRadio.image)
        setRadioID(randomRadio.id)
        audioRef.current.src = randomRadio.url
        playAudio()
      }

    const volumeControl = (value) => {
        audioRef.current.volume = value
    }

    const previousRadio = () => {
        if(radioID === 1) {
            setRadioID(radios.length)
        } else {
            setRadioID(radioID - 1)
        }
        setTitle(radios[radioID - 1].title)
        setArtist(radios[radioID - 1].artist)
        setImage(radios[radioID - 1].image)
        audioRef.current.src = radios[radioID - 1].url
        playAudio()

    }

    const nextRadio = () => {
        if(radioID === radios.length) {
            setRadioID(1)
        } else {
            setRadioID(radioID + 1)
        }
        setTitle(radios[radioID - 1].title)
        setArtist(radios[radioID - 1].artist)
        setImage(radios[radioID - 1].image)
        audioRef.current.src = radios[radioID - 1].url
        playAudio()

    }


    useEffect(() => {
        volumeControl(0.1)
        setArtist(radios[2].artist)
        setTitle(radios[2].title)
        setImage(radios[2].image)

        // return () => {
        //     pauseAudio()
        //     setAudioIsRunning(false)
        // }
    }, [])

  return (
    <div className="audio-player">
        <div className="track-info">
            <img
            className="artwork"
            src={image}
            alt={`track artwork for ${title} by ${artist}`}
            />
            <h2 className="title">{title}</h2>
            <h3 className="artist">{artist}</h3>
        </div>
        <div className="controls">
            <div className='controls-buttons'>

                <button className="control-button previous" onClick={() =>{
                    previousRadio()
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
                    nextRadio()
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
                <input type="range" min="0" max="1" step="0.01" 
                onLoad={() => volumeControl(0.2)}
                onChange={
                (e) => volumeControl(e.target.value)
                }/>
            </div>
        </div>

        <audio ref={audioRef} src={radios[2].url} autoPlay={true}/>

    </div>
  )
}

export default Player