import React from 'react'
import { Container,Row,Col } from 'react-bootstrap'
import logo from "../../../Images/default.svg"
import { IoNotificationsOutline } from 'react-icons/io5'
import { MdDashboard } from 'react-icons/md'
import { useSelector } from 'react-redux'

export default function () {

  const channelDetails = useSelector((state) => state.channelDetails);

  return (
    <div className='admin-header w-100'>
        <Container>
          <Row>
            <Col><MdDashboard  style={{fontSize:"30px",marginTop:"-12px"}}/><span className='page-title ms-2'>Dashboard</span></Col>
            <Col className='d-flex justify-content-end'>
                <IoNotificationsOutline style={{fontSize:"25px",marginTop:"8px",marginRight:"10px"}}/>
                <p className='admin-name'>Hi, {channelDetails.channel?.name}</p>
                <img className='admin-dp' src={logo} alt=''></img>
            </Col>
          </Row>
        </Container>
    </div>
  )
}
