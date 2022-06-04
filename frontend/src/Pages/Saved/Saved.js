import React, { useEffect, useState } from 'react'
import { Container, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { getPosts } from '../../actions/postActions'
import { getSavedPosts } from '../../api'
import Header from '../../components/Header/Header'
import SavedCard from '../../components/SavedCard/SavedCard'
import LatestCard from '../Homepage/Latest/LatestCard/LatestCard'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import "./Saved.css"

function Saved() {

    const [savedPosts, setSavedPosts] = useState([])
    const {authUser:authData ,posts} = useSelector((state)=>state)
    const dispatch = useDispatch()

  useEffect(()=>{
    (async()=>{
        const {data} = await getSavedPosts()
        console.log(data);
        {data.status && setSavedPosts([...data.posts])}
    })()
    posts.length === 0 && dispatch(getPosts());
  },[])


  const handleUnsave = (id)=>{
    setSavedPosts([...savedPosts.filter((post)=>{
        if(post?._id !== id ) return post;
    })])
  }


  return (
    <>
    <Header/>
    <Container className='saved-main-div'>

        <div className='saved-heading d-flex'><BookmarkBorderIcon className='mt-1' sx={{fontSize:"35px"}}/><p>Saved Posts</p></div>
        {
            authData.user !== null ?
            <>
            <Row className='mb-4'>
            {
                
                savedPosts!==null && savedPosts.map((post)=>{
                    return <SavedCard data={post} handleUnsave={handleUnsave}/>
                }) 
            }
            </Row>
            </> :
            <>
            </>
        }

        <span className="cat-continue-head">Continue Reading...</span>
        <div className="d-flex card-scroll mt-3">
          {posts.slice(0, 7).map((val) => {
            return (
              <span className="me-2">
                <LatestCard post={val} width="300px" loadFull={true} />
              </span>
            );
          })}
        </div>
        
        
        
    </Container>
    </>
  )
}

export default Saved