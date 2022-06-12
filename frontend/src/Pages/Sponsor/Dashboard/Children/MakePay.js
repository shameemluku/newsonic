import React, { useEffect, useState } from "react";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import {
  Button,
  CircularProgress,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Skeleton,
  ToggleButton,
} from "@mui/material";
import {
  createRazorOrder,
  getBillingData,
  verifyAndPay,
} from "../../../../api";
import { useDispatch, useSelector } from "react-redux";
import { Col, Container, Row } from "react-bootstrap";
import { BACKEND_URL } from "../../../../constants/url";
import { SiRazorpay } from "react-icons/si";
import { useSnackbar } from "notistack";
import { getSponsorAds } from "../../../../actions/adActions";
import successGig from "../../../../Images/successpay.gif";
import emptyImg from "../../../../Images/empty.png";

const MakePay = ({ totalAmount }) => {
  const { authUser, showTopProgress } = useSelector((state) => state);
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setLoading] = useState(false);
  const [billingData, setBillingData] = useState([]);
  const [enabled, seEnabled] = useState(false);
  const [selected, setSelected] = useState(false);
  const [payStatus, setPayStatus] = useState("INITIAL");
  const [transId, setTransId] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      dispatch({type:"SHOW_PROGRESS"})
      setLoading(true)
      const { data } = await getBillingData();
      setLoading(false)
      dispatch({type:"HIDE_PROGRESS"})
      setBillingData([...data.payable_ads]);
    })();
  }, []);



  function loadRazorpay() {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onerror = () => {
      alert("Razorpay SDK failed to load. Are you online?");
    };

    script.onload = async () => {
      try {
        dispatch({ type: "SHOW_PROGRESS" });

        const result = await createRazorOrder({
          amount: totalAmount * 100,
        });

        const { amount, id: order_id, currency, key } = result.data;

        const options = {
          key: key,
          amount: amount.toString(),
          currency: currency,
          name: "Newsonic Ads",
          description: "Payment for Campaign",
          order_id: order_id,
          handler: async function (response) {
            const { data } = await verifyAndPay({
              ...response,
              amount: amount,
            });

            if (data.status) {
              dispatch({ type: "HIDE_PROGRESS" });
              showToast(data.message, "success");
              setPayStatus("SUCCESS");
              dispatch(getSponsorAds());
              setTransId(data.transId);
            }
          },
          modal: {
            escape: false,
            ondismiss: function () {
              dispatch({ type: "HIDE_PROGRESS" });
              showToast("Payment Cancelled", "error");
            },
          },
          prefill: {
            name: authUser.user?.name,
            email: authUser.user?.email,
            contact: authUser.user?.phone,
          },
          notes: {
            address: authUser.user?.email,
          },
          theme: {
            color: "#30a621",
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } catch (err) {
        dispatch({ type: "HIDE_PROGRESS" });
        showToast("Payment Cancelled", "error");
      }
    };
    document.body.appendChild(script);
  }

  const showToast = (message, variant) => {
    enqueueSnackbar(message, { variant: variant });
  };

  return (
    <>
      <Container className="p-0 mt-5">
        {payStatus === "INITIAL" && (
          <Row>
            <Col lg={7}>
              <div className="billing-left-card mb-3">
                <p className="heading ms-3">
                  <CreditCardIcon className="me-2 mb-1" />
                  Summary
                </p>
                <List
                  sx={{
                    width: "100%",
                    bgcolor: "background.paper",
                  }}
                >
                  { !isLoading ?
                  billingData.length > 0 ? (
                    billingData.map((ad) => {
                      return (
                        <ListItem className="pointer">
                          <ListItemAvatar className="bill-ad-image">
                            <img
                              src={`${BACKEND_URL}/uploads/${ad?.image}`}
                              width="40px"
                              alt=""
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary={`${ad.title.slice(0, 25)}...`}
                            secondary={ad._id}
                          />
                          <p className="mb-0 fw-500">₹ {ad.amount.toFixed(2)}</p>
                        </ListItem>
                      );
                    })
                  ) : (
                    <>
                      <div>
                        <p className="content-center mt-2">
                          <img src={emptyImg} draggable={false}></img>
                        </p>
                        <p className="content-center mb-1 fw-500 f-17 f-dark-gray">
                          Nothing on List
                        </p>
                        <p className="content-center text-center f-gray f-15 mb-5">
                          You don't have any pending payments
                        </p>
                      </div>
                    </>
                  )
                  :
                  <>
                  {
                    [...Array(3)].map(() => {
                      return (
                        <ListItem>
                          <ListItemAvatar className="bill-ad-image">
                          <Skeleton variant="rectangular" width="80%" height="30px"/>
                          </ListItemAvatar>
                          <ListItemText
                            primary={<Skeleton width="80%"/>}
                            secondary={<Skeleton width="50%"/>}
                          />
                          <Skeleton width="10%"/>
                        </ListItem>
                      );
                    })
                  }
                  </>
                  }

                  <ListItem className="total-list">
                    <ListItemText primary="" secondary="" />
                    <p className="mb-0" style={{ color: "gray" }}>
                      To pay:{" "}
                      <span className="totalAmount ms-3">
                        ₹ {totalAmount.toFixed(2)}
                      </span>
                    </p>
                  </ListItem>
                </List>
              </div>
            </Col>

            <Col lg={5}>
              <div className="billing-right-card mb-3">
                <div>
                  <span className="f-gray">Pay using:</span>
                  <div className="payment-options">
                    <ToggleButton
                      className="razor"
                      value="check"
                      selected={selected}
                      onChange={() => {
                        setSelected(!selected);
                      }}
                      disabled={billingData.length<1}
                    >
                      {" "}
                      <SiRazorpay /> Razorpay
                    </ToggleButton>
                  </div>
                </div>
                {showTopProgress ? (
                  <>
                    <Button
                      className="pay-btn"
                      onClick={loadRazorpay}
                      disabled={showTopProgress}
                    >
                      <CircularProgress
                        size={16}
                        sx={{ color: "white", marginRight: "10px" }}
                      />
                      Processing...
                    </Button>
                  </>
                ) : (
                  <Button
                    className="pay-btn"
                    onClick={loadRazorpay}
                    disabled={!selected}
                  >
                    Pay now&nbsp;&nbsp; - &nbsp;&nbsp;₹ {totalAmount.toFixed(2)}{" "}
                  </Button>
                )}
              </div>
            </Col>
          </Row>
        )}

        {payStatus === "SUCCESS" && (
          <div>
            <div className="content-center">
              <img src={successGig} alt="" height={"220px"} />
            </div>
            <p className="content-center fw-500 f-20 mb-1">
              PAYMENT SUCCESSFULL
            </p>
            <p className="content-center f-gray">Transaction Id : {transId}</p>
          </div>
        )}
      </Container>
    </>
  );
};

export default MakePay;
