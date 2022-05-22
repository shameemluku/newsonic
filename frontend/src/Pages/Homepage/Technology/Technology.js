import { Skeleton } from '@mui/material'
import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { BACKEND_URL } from '../../../constants/url'
import thumb from "../../../Images/gray-thumb.jpg"
import BlackCard from './BlackCard'
import "./Technology.css"

export default function Technology({data}) {
  return (
    
    <Container className='p-0 mt-3'>
        <span className='cat-head'>TECHNOLOGY</span>
        <Row>
            

            <BlackCard data={data && data[0]} lg={6}/>
            <BlackCard data={data && data[1]} lg={6}/>

        </Row>

        <Row>
            
                
            <BlackCard data={data && data[2]} lg={6}/>
            <BlackCard data={data && data[3]} lg={6}/>

        </Row>
    </Container>
  )
}
