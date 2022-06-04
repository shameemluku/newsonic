import {
  Avatar,
  Breadcrumbs,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../../components/Header/Header";
import "./Dashboard.css";
import ImageIcon from "@mui/icons-material/Image";
import PaidIcon from '@mui/icons-material/Paid';
import FeaturedVideoIcon from '@mui/icons-material/FeaturedVideo';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { useDispatch, useSelector } from "react-redux";
import { getSponsorAds } from "../../../actions/adActions";
import AdList from "./Children/AdList";
import AdDetails from "./Children/AdDetails";
import AddIcon from '@mui/icons-material/Add';
import { GrNext } from "react-icons/gr";
import MakePay from "./Children/MakePay";


const SponsorDashboard = () => {
  
  const { authUser: authData, sponsorDetails } = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [current,setCurrent] = useState("ADLIST")
  const [selectedAd,setSelectedAd] = useState({})

  useEffect(() => {
    if (authData.user !== null) {
      dispatch(getSponsorAds());
    }
  }, [authData]);

  const handleDetails=(data)=>{
    setSelectedAd({...data})
    setCurrent("DETAILS")
  }

  return (
    <>
      
      <Header hide={true} />
      <div className="spons-main-content">
        <Container>
          <Row>
            <Col lg={3}>
              <Card sx={{ minWidth: 275 }} className={"sponsor-dash-left"}>
                <CardContent>
                  <div className="w-100">
                    <Button variant="contained" className="w-100 create-ad-btn" onClick={()=>{
                      navigate('/sponsor/create')
                    }}>
                      <AddIcon />CREATE NEW AD
                    </Button>
                  </div>

                  <List
                    sx={{
                      width: "100%",
                      maxWidth: 360,
                      bgcolor: "background.paper",
                    }}
                  >
                    <ListItem className="amount-pay-btn pointer" onClick={()=>{
                      setCurrent("MAKEPAY")
                    }}>
                      <ListItemAvatar>
                        <Avatar>
                          <PaidIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <div className="pt-3">
                      {sponsorDetails.loading? <><CircularProgress size={25} style={{color:"black"}}/></>:<p className="mb-0 f-20 fw-500">₹ {sponsorDetails?.amount}</p>}
                      <p>Amount to pay</p>
                      </div>
                      <GrNext className="next-icon"/>
                    </ListItem>
                    
                    <Divider variant="inset" component="li" />
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>
                          <FeaturedVideoIcon />
                        </Avatar>
                      </ListItemAvatar>
                      Active Ads: <ListItemText primary="3" />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>
                          <ReceiptIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary="Transactions" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Col>

            <Col lg={9}>
              <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" color="inherit" to="/">
                  Account
                </Link>
                <Link underline="hover" color="inherit" to="/sponsor">
                  Sponsor
                </Link>
                <Typography className={current!=="ADLIST" && "pointer"} color={current==="ADLIST" && "text.primary"} onClick={()=>{
                  {current !=="ADLIST" && setCurrent("ADLIST")}
                }}>Dashboard</Typography>
                { current==='DETAILS' && <Typography color="text.primary"> Details</Typography>}
                { current==='MAKEPAY' && <Typography color="text.primary"> Payment</Typography>}
              </Breadcrumbs>

                   {current==='ADLIST' && <AdList adsList={sponsorDetails?.ads} handleDetails={handleDetails}/> }
                   {current==='DETAILS' && <AdDetails data={selectedAd} setCurrent={setCurrent}/> }
                   {current==='MAKEPAY' && <MakePay totalAmount={sponsorDetails.amount} setCurrent={setCurrent}/> }
              
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default SponsorDashboard;
