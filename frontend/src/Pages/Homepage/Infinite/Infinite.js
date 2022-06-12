import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import LatestCard from "../Latest/LatestCard/LatestCard";
import loadingAnim from "../../../Images/loading.gif"
import { useSelector } from "react-redux";
import { clickAd, fetchPosts } from "../../../api";
import { useInView } from 'react-intersection-observer';
import { displayAd } from "../../../actions/adActions";
import { BACKEND_URL } from "../../../constants/url";
import adpic from '../../../Images/ad2.jpg';
import FooterComp from "../../../components/Footer/Footer";

export default function Infinite() {
  const [items, setItem] = useState([]);
  const [hasMore, setHasmore] = useState(true);
  const {posts} = useSelector((state)=>state)
  const { ref:adBanner, inView, entry } = useInView()
  const [ad,setAd] = useState(null)



  const style = {
    marginBottom: 30,
    padding: 8,
  };

  useEffect(()=>{
    if(posts!==null){
      setItem(posts.filter((val,i)=>{
        if(i>10) return val
      }))
    }
  },[posts])

  useEffect(()=>{
    if(inView && ad===null){
        loadAd()
    }
  },[inView])

  const loadAd = ()=>{
    (async()=>{
        let adParams={
            format:"FRM3"
        }
        setAd(await displayAd(adParams))
    })()
  }

  

  const fetchMoreData = async () => {

    let {data} = await fetchPosts(items.length+3,items.length,"all")


    if(data.status){
      setItem([...items,...data.posts])
    }else{
      setHasmore(false)
    }
  };

  useEffect(() => {
    if (items.length > 50) {
      setHasmore(false);
    } else {
      
    }
  }, [items]);


  const handleAdClick = async (url) => {

    let adParams={
        format:"FRM2",
        adId:ad._id,
        sponsorId:ad.sponsorId
    }

    clickAd(adParams)
    window.open(`https://${url}`, "_blank");

  }

  

  const loading = <>
    <div className="infiite-loading-anime">
    <img src={loadingAnim} alt=""></img>
      
    </div>
  </>

  return (
    <InfiniteScroll
      dataLength={items.length}
      next={fetchMoreData}
      hasMore={hasMore}
      loader={loading}
      endMessage={<FooterComp/>}
    >
      <Container>
      <Row className="p-0 m-0">
        {items.map((post, index) =>{

          if(index===13){
            return <>
            <Col sm={12} md={8} className="p-0">
            <div ref={adBanner} style={{height:"300px"}} className="p-0 content-center ad-slot-3-div" key={index}>
                {ad ?
                <span onClick={()=>{
                  handleAdClick(ad?.url)
                }}>
                 <img className="ad-slot-3 pointer" width={"100%"} height="100%"  src={`${BACKEND_URL}/uploads/${ad?.imageFrm}`} alt=''/> 
                 <img className="ad-slot-3-mob d-none" width={"100%"} height="100%" src={`${BACKEND_URL}/uploads/${ad?.imageSqr}`} alt=''/> 
                </span>
                : <img className="ad-slot-3 pointer"  src={adpic} alt=''/> }
            </div>
          </Col>
            </>
            
          } 

          return <>
          <Col sm={12} md={4} className="p-0">
            <div style={style} key={index}>
              <LatestCard post={post} width="100%" height="230px"/>
            </div>
         
          </Col>
          </>
        } )}
        
      </Row>
      </Container>
    </InfiniteScroll>
  );
}
