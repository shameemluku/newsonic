import React, { useEffect } from "react";
import Header from "../../components/Header/Header";
import Slider from "./Slider/Slider";
import Tile from "./Tile/Tile";
import Latest from "./Latest/Latest";
import Topten from "./Topten/Topten";
import Educational from "./Educational/Educational";
import Technology from "./Technology/Technology";
import Business from "./Business/Business";
import { VariantType, useSnackbar } from "notistack";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import "./Home.css";

//actions

import { getPosts } from "../../actions/postActions";
import { verifyUser } from "../../actions/userActions";
import Infinite from "./Infinite/Infinite";

export default function Homepage({response}) {

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const {loginModal,catPosts} = useSelector((state) => state);

  useEffect(() => {
    
    dispatch(getPosts());
    dispatch(verifyUser())
    if(response){
      dispatch({type:"SHOW_MODAL", payload:true})
      enqueueSnackbar("Please Login first", { variant: "error" })
    }
  }, []);


  

  return (
    <>
      <Header />
      <Tile />
      <Container>
        <Row>
          <Col xs={12} md={6} className="p-0">
            <Latest />
          </Col>
          <Col xs={12} md={6} className="ps-md-0">
            <Topten />
          </Col>
        </Row>
      </Container>

      <section className="three-section-wrapper">
        <Container>
          <Row>
            <Col xs={12} md={3}>
              <Educational data={catPosts?.education}/>
            </Col>

            <Col xs={12} md={6}>
              <Technology data={catPosts?.technology} />
            </Col>

            <Col xs={12} md={3}>
              <Business data={catPosts?.business} head={"BUSINESS NEWS"} limit={5}/>
            </Col>
          </Row>
        </Container>
      </section>

      <section>
      <Container>
        <Infinite></Infinite>
      </Container>
      </section>
    </>
  );
}
