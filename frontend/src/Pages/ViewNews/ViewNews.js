import React, { useEffect, useState } from 'react'
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
import { getRelated } from '../../api'

export default function ViewNews() {

    const {selectedPost,posts,authUser: authData} = useSelector((state)=>state)
    const [scroll, setScroll] = useState(0);
    const [related, setRelated] = useState(null);
    const {id:postId}=useParams()
    const dispatch = useDispatch()

    useEffect(()=>{

        dispatch(getPostDetails(postId))
  
        if(posts.length!==0){
            console.log("Already Loaded");
        }else{
            dispatch(getPosts());
        }
        
    },[authData])

    useEffect(()=>{
        window.scrollTo(0, 0)

    },[])



    useEffect(()=>{
        
        (async function (){
            let {data} = await getRelated(selectedPost.details.category)
            if(data.status){
                setRelated(data.posts)
            }
        })()


    },[selectedPost])



    useEffect(() => {

        let progressBarHandler = () => {
            
            const totalScroll = document.documentElement.scrollTop;
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scroll = `${totalScroll / windowHeight}`;
    
            setScroll(scroll);
        }
    
        window.addEventListener("scroll", progressBarHandler);
    
        return () => window.removeEventListener("scroll", progressBarHandler);
    });


  return (
    <>
    <Header next={scroll}></Header>
    <div id="progressBarContainer">
        <div id="progressBar" style={{transform: `scale(${scroll}, 1)`}} />
    </div>
    <Container className='main-section'>
        <Row>
            <Col sm={8}><NewsSection data={selectedPost?.details}/></Col>
            <Col sm={4} className="mt-5">
                <Business head={'MORE RELATED POSTS'} view={true} data={related} limit={6} loadFull={true}/>
                <img className='mt-5' src='https://i.pinimg.com/originals/04/98/cd/0498cdd66d92739bbe7b9fac5a5646b2.jpg' width={"100%"} alt=''></img>
            </Col>
        </Row>

        <Row>
            <div className='d-flex card-scroll mt-3'>
                {
                    posts.slice(0,7).map((val)=>{
                       return <span className='me-2'><LatestCard post={val} width="300px" loadFull={true}/></span>
                    })
                }

            </div>
        </Row>
    </Container>

    <section className='comment-section'>
    <Container style={{width:"90%"}} className="comment-container">
        <Comments comments={selectedPost.details?.comments} id={postId} />
    </Container>
    </section>
    </>
    
  )
}
