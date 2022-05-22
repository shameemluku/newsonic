import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import LatestCard from "../Latest/LatestCard/LatestCard";
import loadingAnim from "../../../Images/loading.gif"
import { useSelector } from "react-redux";
import { fetchPosts } from "../../../api";

export default function Infinite() {
  const [items, setItem] = useState([]);
  const [hasMore, setHasmore] = useState(true);
  const {posts} = useSelector((state)=>state)
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
      setItem(posts.filter((val,i)=>{
        if(i>10) return val
      }))
    }
  },[posts])

  

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
      endMessage={<p className="bg-dark">This is the end</p>}
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
              <LatestCard post={post} width="100%" height="230px"/>
            </div>
         
          </Col>
          </>
        } )}
      </Row>
    </InfiniteScroll>
  );
}
