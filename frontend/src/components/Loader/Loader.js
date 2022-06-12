import React from 'react'
import loadingAnim from "../../Images/loading.gif"
import logo from "../../Images/mainlogo.svg";
import "./Loader.css"

function Loader() {
  return (
    <div className='loader-wrapper'>
        <img className='load-anim' src={loadingAnim} alt='' draggable={false}/>
    </div>
  )
}

export default Loader