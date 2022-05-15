import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import "./Technology.css"

export default function Technology() {
  return (
    
    <Container className='p-0 mt-3'>
        <span className='cat-head'>TECHNOLOGY</span>
        <Row>
            <Col md={6} className='mb-3'>
                <div className='w-100 tech-card bg-danger hoverZoom pointer' 
                style={{
                    background:"url(https://s.hdnux.com/photos/01/21/01/54/21240595/3/1200x0.jpg)",
                    backgroundSize:"cover",
                    position: "relative",
                    overflow:"hidden"
                }}>
                    <span className='tech-title-bg'>
                        <span className='tech-title'>Bitcoin risk-reward is being upended by rising</span>
                    </span>
                </div>
            </Col>
            
            <Col md={6} className='mb-3'>
                <div className='w-100 tech-card bg-danger hoverZoom pointer' 
                style={{
                    background:"url(https://s.hdnux.com/photos/01/25/33/13/22393554/5/ratio3x2_1200.jpg)",
                    backgroundSize:"cover",
                    position: "relative",
                    overflow:"hidden"
                }}>
                    <span className='tech-title-bg'>
                        <span className='tech-title'>Bitcoin risk-reward is being upended by rising</span>
                    </span>
                </div>
            </Col>

        </Row>

        <Row>
            <Col md={6} className='mb-3'>
                <div className='w-100 tech-card bg-danger hoverZoom pointer' 
                style={{
                    background:"url(https://s.hdnux.com/photos/01/21/01/54/21240595/3/1200x0.jpg)",
                    backgroundSize:"cover",
                    position: "relative",
                    overflow:"hidden"
                }}>
                    <span className='tech-title-bg'>
                        <span className='tech-title'>Tech-enabled classrooms: Transforming the face of education</span>
                    </span>
                </div>
            </Col>

            <Col md={6} className='mb-3'>
                <div className='w-100 tech-card bg-danger hoverZoom pointer' 
                style={{
                    background:"url(https://s.hdnux.com/photos/01/25/34/01/22397032/5/1200x0.jpg)",
                    backgroundSize:"cover",
                    position: "relative",
                    overflow:"hidden"
                }}>
                    <span className='tech-title-bg'>
                        <span className='tech-title'>Bitcoin risk-reward is being upended by rising</span>
                    </span>
                </div>
            </Col>
        </Row>
    </Container>
  )
}
