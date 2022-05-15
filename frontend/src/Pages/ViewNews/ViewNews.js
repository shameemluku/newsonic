import React, { useEffect } from 'react'
import Header from "../../components/Header/Header"
import { Container,Row,Col } from 'react-bootstrap'
import "./ViewNews.css"
import NewsSection from './NewsSection/NewsSection'
import Business from "../Homepage/Business/Business"
import LatestCard from "../Homepage/Latest/LatestCard/LatestCard"
import Comments from './Comments/Comments'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getPostDetails, getPosts } from '../../actions/postActions'

export default function ViewNews() {

    const {selectedPost,posts} = useSelector((state)=>state)
    const {id:postId}=useParams()
    const dispatch = useDispatch()

    useEffect(()=>{

        console.log(postId);
        dispatch(getPostDetails(postId))
        

        if(posts.length!==0){
            console.log("Already Loaded");
        }else{
            dispatch(getPosts());
        }
        
    },[])


  return (
    <>
    <Header></Header>
    <Container className='main-section'>
        <Row>
            <Col sm={8}><NewsSection data={selectedPost?.details}/></Col>
            <Col sm={4} className="mt-5">
                <Business/>
                <img className='mt-5' src='https://i.pinimg.com/originals/04/98/cd/0498cdd66d92739bbe7b9fac5a5646b2.jpg' width={"100%"} alt=''></img>
            </Col>
        </Row>

        <Row>
            <div className='d-flex card-scroll mt-3'>
                {
                    posts.slice(0,7).map((val)=>{
                       return <span className='me-2'><LatestCard post={val} width="300px"/></span>
                    })
                }

            </div>
        </Row>
    </Container>

    <section className='comment-section'>
    <Container style={{width:"90%"}}>
        <Comments comments={selectedPost.details?.comments} id={postId} />
    </Container>
    </section>
    </>
    
  )
}
