import { Skeleton } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getPostDetails } from '../../../../actions/postActions';
import { SET_POST_DETAILS } from '../../../../constants/actionTypes';
import { BACKEND_URL } from '../../../../constants/url';
import thumb from "../../../../Images/gray-thumb.jpg"

export default function LatestCard({post,width,height,loadFull,category}) {

  const [isLoaded, setLoaded] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()


  return (
    
    <>
    {
      post ? (
        <>
        <div className='pointer'
        onClick={()=>{
          navigate(`/post/${post._id}`)
          if(loadFull){
            window.scrollTo(0, 0)
            dispatch(getPostDetails(post._id))
          }
          dispatch({
            type:SET_POST_DETAILS,
            payload:post
          })
        }}
        >
          

            {!isLoaded && <img
              className='latest-Img'
              src={thumb}
              height={height}
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
          <div className='latest-cat mt-2 mb-4'>
              {post?.category.map((val, i) => {
                if (i !== post?.category.length - 1){

                  if(category===val) return (<><span className='bolded-cat'>{val}</span> | </>)
                  else return val + " | ";

                }else{
                  
                  if(category===val) return (<span className='bolded-cat'>{val}</span> )
                  else return val;
                }
              })}
          </div>
          
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
