import React, { useEffect, useState } from 'react'
import LatestCard from './LatestCard/LatestCard'
import {Container,Row,Col} from 'react-bootstrap'
import "./Latest.css"
import { useSelector } from 'react-redux'

export default function Latest() {

  const {posts} = useSelector((state)=>state)
  const [postArray,setPostArray] = useState([])
  

  return (
    <>
    <Container>
      <Row style={{columnGap: "30px"}}>
        <h3 className='p-0 mb-3'>Latest News</h3>

        {posts.length!==0 ?
        (
          posts.slice(0,8).map((val,i)=>{
            return <Col key={i} className={`p-0 latest-card w-46 line-${i}`} xs={12}><LatestCard post={val} width="100%" height="160px"/></Col>
          })
        )
        :
        (
          [1,1,1,1,1,1].map((val,i)=>{
            return <Col key={i} className='p-0 latest-card w-46' xs={12}><LatestCard post={null} width="100%" height="160px"/></Col>
          })
        )
        }

      </Row>
    </Container>
    </>
  )
}
