import { Skeleton } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { BACKEND_URL } from '../../../../constants/url';
import thumb from "../../../../Images/gray-thumb.jpg"

export default function LatestCard({post,width}) {

  const [isLoaded, setLoaded] = useState(false)

  useEffect(()=>{
  },[])

  return (
    
    <>
    {
      post ? (
        <>
        <div className='pointer'>
          

            {!isLoaded && <img
              className='latest-Img'
              src={thumb}
              height="160px"
              alt=""
              width={width}
            ></img>}

          <img
            className={`${!isLoaded?"hide":""} latest-Img`}
            src={`${BACKEND_URL}/uploads/${post?.images[0]}`}
            height="100%"
            alt=""
            width={width}
            onLoad={()=>setLoaded(true)}
          ></img>


          <div className='latest-title' style={{width}}>{(post?.newsHead.length > 100) ? post?.newsHead.substring(0,100) : post?.newsHead}</div>
          <div className='latest-cat mt-2 mb-4'>Politics | Sports</div>
          <div className='latest-line'></div>
        </div>

        </>
      ):
      (
        <div className='pointer'>
          <Skeleton
            variant="rectangular"
            sx={{ bgcolor: "#72b054" }}
            width={width}
            height={"198px"}
          />
          <div className='latest-title' style={{width}}>
            <Skeleton height={"35px"}/>
            <Skeleton width={"80%"} height={"35px"}/>
          </div>
          <div className='latest-cat mt-2 mb-4'><Skeleton width={"50%"}/></div>
          
          <div className='latest-line'></div>
        </div>
      )
    }
    </>

  )
}
