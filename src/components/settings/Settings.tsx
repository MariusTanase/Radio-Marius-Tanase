import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import './Settings.css'
import { faGear } from '@fortawesome/free-solid-svg-icons'
// @ts-ignore
import { ThemeMenu } from '@/components/ThemeMenu/ThemeMenu'
// @ts-ignore

import BackgroundMenu from '@/components/BackgroundMenu/BackgroundMenu'


type SettingsProps = {
  toggleUI: () => void
}


const Settings = ({ toggleUI }: SettingsProps) => {

  const handleMenu = () => {
    const button = document.querySelector('.settings-button')
// @ts-ignore
    button.classList.add('hidden')

    const settingsMenu = document.querySelector('.settings-menu')
// @ts-ignore
    settingsMenu.classList.add('open')


    const closeButton = document.querySelector('.settings-button__close')
    // @ts-ignore
    closeButton.classList.remove('hidden')
  }

  const closeMenu = () => {
    const closeButton = document.querySelector('.settings-button__close')
    // @ts-ignore
    closeButton.classList.toggle('hidden')

    const settingsMenu = document.querySelector('.settings-menu')
    // @ts-ignore
    settingsMenu.classList.remove('open')

    const button = document.querySelector('.settings-button')
    // @ts-ignore
    button.classList.remove('hidden')
  }

  let themeContent = {
    'Light': 'Light',
    'Dark': 'Dark',
    'Crimson': 'Crimson',
    'Blue': 'Blue'
  }


  return (
    <div className='settings-container'>
      <button className='settings-button' onClick={
        () => {
          handleMenu()
        }
      }>
        <FontAwesomeIcon icon={faGear} className='spin' />
      </button>
      <div className='settings-menu'>
        <div className='settings-menu-wrapper'>
          <ThemeMenu category={'Theme'} content={themeContent} />
          <BackgroundMenu />
        </div>

        <div>
          <button className='settings-button__close' onClick={toggleUI}>HidePlayer</button>
        </div>

        <button className='settings-button__close' onClick={
          () => {
            closeMenu()
          }}>Close</button>
      </div>
    </div>
  )
}

export default Settings