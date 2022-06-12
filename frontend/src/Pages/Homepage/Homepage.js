import React, { useEffect } from "react";
import { VariantType, useSnackbar } from "notistack";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import "./Home.css";

//actions

import { getPosts } from "../../actions/postActions";
import { verifyUser } from "../../actions/userActions";

import Slider from "./Slider/Slider";
import Tile from "./Tile/Tile";
import Latest from "./Latest/Latest";
import Topten from "./Topten/Topten";
import Educational from "./Educational/Educational";
import Technology from "./Technology/Technology";
import Business from "./Business/Business";
import Infinite from "./Infinite/Infinite";
import Header from "../../components/Header/Header";
import ErrorBoundary from "../../components/ErrorBoundary/ErrorBoundary";

export default function Homepage({ response }) {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { loginModal, catPosts } = useSelector((state) => state);

  useEffect(() => {
    dispatch(getPosts());
    dispatch(verifyUser());
    if (response) {
      dispatch({ type: "SHOW_MODAL", payload: true });
      enqueueSnackbar("Please Login first", { variant: "error" });
    }
    document.title = `Newsonic`
  }, []);

  return (
    <>
        <Header />
        <Tile />
        <Container>
          <Row>
            <Col xs={12} lg={6} className="p-0">
              <Latest />
            </Col>
            <Col xs={12} lg={6} className="ps-md-0">
              <Topten />
            </Col>
          </Row>
        </Container>

        <section className="three-section-wrapper py-3">
          <Container>
            <Row>
              <Col xl={3}>
                <Educational data={catPosts?.education} />
              </Col>

              <Col xl={6}>
                <Technology data={catPosts?.technology} />
              </Col>

              <Col xl={3}>
                <Business
                  data={catPosts?.business}
                  head={"BUSINESS NEWS"}
                  limit={5}
                />
              </Col>
            </Row>
          </Container>
        </section>

        <section className="pt-3">
          <Infinite></Infinite>
        </section>
    </>
  );
}
