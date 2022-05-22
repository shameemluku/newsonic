import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { BACKEND_URL } from "../../../constants/url";
import "./Educational.css";
import thumb from "../../../Images/gray-thumb.jpg"
import { Skeleton } from "@mui/material";

export default function Educational({data}) {


  return (


    <Container className="p-0 mt-3">
      <span className="cat-head">EDUCATIONAL</span>

      { data ? (

        data.map((val)=>{
          return (

            <>
          <Container className="edu-card mb-2">
            <Row className="mb-3">
              <Col xs={3}>
                <img
                  className="edu-image"
                  src={`${BACKEND_URL}/uploads/${val?.images[0]}`}
                  alt=""
                ></img>
              </Col>
              <Col xs={9} className="edu-title">
                <h4>
                  {(val?.newsHead).substr(0,55)}...
                </h4>
              </Col>
            </Row>
          </Container>
        </>

          )
        })
        
        


      ) : (
        <>

        {
        [...Array(5)].map(()=>{

          return (<Container className="edu-card mb-2">
            <Row className="mb-3">
              <Col xs={3}>
                <Skeleton variant="rectangular" height={50} width={80}/>
              </Col>
              <Col xs={9} className="edu-title">
                <h4>
                <Skeleton height={25} />
                <Skeleton height={25} />
                </h4>
              </Col>
            </Row>
          </Container>)

        })
        
        }
        </>
      )} 

      
    </Container>
  );
}
