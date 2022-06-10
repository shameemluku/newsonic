import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { verifyAdmin } from '../../actions/adminActions';
import Sidenav from './Components/Sidenav';
import Header from './Components/Header';
import TopProgress from './Components/TopProgress';
import { Container } from 'react-bootstrap';

function Layout({children,active}) {

  const dispatch = useDispatch()
  const {showAdminProgress} = useSelector((state)=>state)

  useEffect(()=>{
    dispatch(verifyAdmin())
  })

  return (
        <>
          <style>{"body {background-color:#edf0f5;}"}</style>
          <Sidenav active={active} />
          <div className="main-content">
            <Container className='ps-4'>
              <Header />

              {children}

            </Container>
          </div>

          {showAdminProgress && <TopProgress/>}
        </>
  )
}

export default Layout