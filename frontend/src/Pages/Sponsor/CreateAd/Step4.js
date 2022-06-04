import { Button } from '@mui/material';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import loadingGif from "../../../Images/loading.gif";
import successGif from "../../../Images/success.gif";

function Step4({progress,response}) {

  const navigate = useNavigate();
  return ( 

    <>
    {
        response?.status ?
        <>
        <div className='content-center'>
          <img src={successGif} alt="" width="35%" draggable={false}/>
        </div>
        <p className='content-center ad-success-text mb-0'>Ad created successfully!!</p>
        <div className='content-center'>
          <Button
            className="spon-home-btn ad-success-btn"
            variant="contained"
            onClick={()=>{
              navigate('/sponsor/dashboard')
            }}
          >Go to dashboard</Button>
        </div>
        </>
        :
        <>
        <div className='final-step-main content-center'>
        <div className="loading-section mt-3">

            <div className="content-center">
              <img height={"200px"} src={loadingGif} alt=""></img>
            </div>


            <div className="content-center mb-5">
              <span>Please wait...  Creating your Ad &nbsp; <b>{progress}%</b></span>
            </div>
              
            
          </div>
        </div>
        </>
    }
    </>
    
  )
}

export default Step4