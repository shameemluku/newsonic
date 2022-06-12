import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getPosts } from "../../actions/postActions";
import { fetchPosts } from "../../api";
import Header from "../../components/Header/Header";
import LatestCard from "../Homepage/Latest/LatestCard/LatestCard";
import BlackCard from "../Homepage/Technology/BlackCard";
import Technology from "../Homepage/Technology/Technology";
import Infinite from "./Infinite";
import noResult from "../../Images/noresult.gif"
import "./CategoryPage.css";
import FooterComp from "../../components/Footer/Footer";

function CategoryPage() {
  
  const [catPosts, setCatPosts] = useState([]);
  const [category, setCategory] = useState(useParams().category);
  const [notFound, setNotFound] = useState(false);
  const { posts } = useSelector((state) => state);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation()

  useEffect(() => {
    (async () => {
      try {
        
        setNotFound(false)
        setCategory(location.pathname.slice(10))
        dispatch({type:"SHOW_PROGRESS"})
        let catposts = await (await fetchPosts(9, 0, category)).data?.posts;
        dispatch({type:"HIDE_PROGRESS"})
        if (catposts?.length === 0) {
          setNotFound(true);
        } else {
          setCatPosts([...catposts]);
        }
      } catch (error) {
        setNotFound(true);
      }
    })();
    document.title = `${category} - Newsonic`
    posts.length === 0 && dispatch(getPosts());
  }, [category,navigate]);

  const formatedCategory = ()=>{
    return (category[0].toUpperCase() + category.toLowerCase().slice(1))
  }



  return (
    <>
      <Header />

      <div className="category-content">
        {!notFound ? (
          <>
            <Container>
              <div className="cat-heading">#{formatedCategory()}</div>
              <Row>
                {!(catPosts.length < 1) && (
                  <BlackCard data={catPosts[0]} lg={3} />
                )}
                {!(catPosts.length < 2) && (
                  <BlackCard data={catPosts[1]} lg={3} />
                )}
                {!(catPosts.length < 3) && (
                  <BlackCard data={catPosts[2]} lg={3} />
                )}
                {!(catPosts.length < 4) && (
                  <BlackCard data={catPosts[3]} lg={3} />
                )}

                {catPosts.length === 0 && <BlackCard data={null} lg={3} />}
                {catPosts.length === 0 && <BlackCard data={null} lg={3} />}
                {catPosts.length === 0 && <BlackCard data={null} lg={3} />}
                {catPosts.length === 0 && <BlackCard data={null} lg={3} />}

                {catPosts.length!==0 && catPosts.length < 5 && (
                  <Container className="mt-3">

                    <span className="cat-continue-head">Continue Reading...</span>
                    <div className="d-flex card-scroll mt-3">
                      {posts.slice(0, 7).map((val) => {
                        return (
                          <span className="me-2">
                            <LatestCard
                              post={val}
                              width="300px"
                              loadFull={true}
                            />
                          </span>
                        );
                      })}
                    </div>
                  </Container>
                )}
              </Row>
            </Container>
            <Container className="p-0">
              <Infinite posts={catPosts} category={formatedCategory()} />
            </Container>
          </>
        ) : (
          <>
            <Container>
              <div className="content-center cat-error">
                <div>
                <p className="text-center cat-error-head">#{formatedCategory()}</p>
                <img className="cat-error-gif" src={noResult} alt="" draggable={false}/>
                <p className="text-center cat-error-desc">Nothing to show in this category</p>
                </div>
              </div>
              <span className="cat-continue-head">Continue Reading...</span>
              <div className="d-flex card-scroll mt-3 mb-3">
                {posts.slice(0, 7).map((val) => {
                  return (
                    <span className="me-2">
                      <LatestCard post={val} width="300px" loadFull={true} />
                    </span>
                  );
                })}
              </div>
            </Container>
          </>
        )}
      </div>
      <FooterComp/>
    </>
  );
}

export default CategoryPage;
