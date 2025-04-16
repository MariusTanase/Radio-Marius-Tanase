import { useState } from 'react'
import BackgroundParticles from '../components/Particles/Particles'
import Footer from '../components/footer/Footer'
import Player from '../components/player/Player'
import RadioList from '../components/radiosList/RadioList'
import Settings from '../components/settings/Settings'
import { radios } from '../components/radiosList/radios'

const Main = () => {
  let [showUI, setShowUI] = useState(false);

  let toggleUI = () => {
    setShowUI(!showUI)
  }

  return (
    <>
      <BackgroundParticles />
      <Player list={radios} toggleUI={showUI} />
      <RadioList toggleUI={showUI} />
      <Settings toggleUI={toggleUI} />
      <Footer />
    </>
  )
}

export default Main