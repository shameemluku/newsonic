import React from 'react'
import "./Sidenav.css"
import logo from '../../../Images/mainlogo.svg'
import { MdOutlineAnalytics } from 'react-icons/md'
import { IoNewspaperOutline, IoSettingsOutline,IoAddCircleOutline } from 'react-icons/io5'
import { RiMoneyDollarCircleLine } from 'react-icons/ri'

export default function Sidenav() {
  return (
      <>
    <div className="side-nav d-flex flex-column vh-100 flex-shrink-0 p-3 text-white" style={{width: "250px",position:"fixed",backgroundColor:"white"}}> 
      <div className='w-100 d-flex justify-content-center mt-4'>

    <img src={logo} height="20px" alt='logo'></img> </div>
    
    <div className='w-100 d-flex justify-content-center'>
        <div className='add-btn text-center'><IoAddCircleOutline className='me-2' style={{fontSize:"20px"}}/>Add news</div>
    </div>
    
    <ul className="nav nav-pills flex-column mb-auto">
        <li> <a href="#" className="nav-link text-white"> <MdOutlineAnalytics style={{color:"black"}}/><span className="ms-2 admin-link">Analytics</span> </a> </li>
        <li> <a href="#" className="nav-link text-white"> <IoNewspaperOutline style={{color:"black"}}/><span className="ms-2 admin-link">News</span> </a> </li>
        <li> <a href="#" className="nav-link text-white"> <RiMoneyDollarCircleLine style={{color:"black"}}/><span className="ms-2 admin-link">Transactions</span> </a> </li>
        <li> <a href="#" className="nav-link text-white"> <IoSettingsOutline style={{color:"black"}}/><span className="ms-2 admin-link">Settings</span> </a> </li>      
    </ul>
    </div>
    </>
    
  )
}
