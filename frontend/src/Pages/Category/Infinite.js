import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import LatestCard from "../../Pages/Homepage/Latest/LatestCard/LatestCard";
import loadingAnim from "../../Images/loading.gif"
import { useSelector } from "react-redux";
import { fetchPosts } from "../../api";
import FooterComp from "../../components/Footer/Footer";

export default function Infinite({posts, category}) {
  const [items, setItem] = useState([]);
  const [hasMore, setHasmore] = useState(true);
  // const style = {
  //   height: 300,
  //   border: "1px solid green",
  //   margin: 6,
  //   padding: 8,
  // };

  const style = {
    marginBottom: 30,
    padding: 8,
  };

  useEffect(()=>{
    if(posts!==null){
      setHasmore(true)
      setItem([...posts.filter((val,i)=>{
        if(i>3){ 
          return val}
      })])
    }
  },[posts])


  useEffect(()=>{

    if(items.length<5){
      setHasmore(false)
    }

    if (items.length > 50) {
      setHasmore(false);
    } 

  },[items])


  

  const fetchMoreData = async () => {

    let {data} = await fetchPosts(items.length+3,items.length,category)


    if(data.status){
      setItem([...items,...data.posts])
    }else{
      setHasmore(false)
    }
  };


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
      endMessage={<></>}
    >
      <Row className="p-0 m-0">
        {items.map((post, index) =>{

          if(index===13){
            
            return <>
            <Col sm={12} md={8} className="p-0">
            <div style={{height:"300px"}} className="p-2" key={index}>
                <div className="bg-dark h-100">dgdg</div>
            </div>
          </Col>
            </>
            
          } 

          return <>
          <Col sm={12} md={4} className="p-0">
            <div style={style} key={index}>
              <LatestCard post={post} width="100%" height="230px" category={"Business"}/>
            </div>
         
          </Col>
          </>
        } )}
      </Row>
    </InfiniteScroll>
  );
}
