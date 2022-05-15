import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import LatestCard from "../Latest/LatestCard/LatestCard";
import loadingAnim from "../../../Images/loading.gif"

export default function Infinite() {
  const [items, setItem] = useState([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
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

  

  const fetchMoreData = () => {
    // a fake async api call like which sends
    // 20 more records in 1.5 secs
    setTimeout(() => {
      setItem([...items, 1, 1, 1, 1, 1]);
    }, 1500);
  };

  useEffect(() => {
    if (items.length > 30) {
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
        {items.map((i, index) =>{

          console.log(index);
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
              <LatestCard post={null} width="100%"/>
            </div>
         
          </Col>
          </>
        } )}
      </Row>
    </InfiniteScroll>
  );
}
