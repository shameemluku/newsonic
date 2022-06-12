import React from 'react'
import { Container,Row,Col } from 'react-bootstrap'
import logo from "../../../Images/default.svg"
import { IoNotificationsOutline } from 'react-icons/io5'
import { MdDashboard } from 'react-icons/md'
import { useSelector } from 'react-redux'
import { BACKEND_URL } from '../../../constants/url'

export default function () {

  const adminDetails = useSelector((state) => state.adminDetails);

  return (
    <div className='admin-header w-100'>
        <Container>
          <Row>
            <Col>
            <MdDashboard  style={{fontSize:"30px",marginTop:"-12px"}}/>
            <span className='page-title ms-2'>Admin Dashboard</span>
            </Col>
            <Col className='d-flex justify-content-end' 
            >
                <p className='admin-name'>{adminDetails.user?.name}</p>
                <img className='admin-dp' 
                  src={logo} 
                  alt=''
                ></img>
            </Col>
          </Row>
        </Container>
    </div>
  )
}
