import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  Skeleton,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import TransactionTable from "./TranTable";
import "./Transactions.css";
import {
  cancelPayout,
  getTransactionDetails,
  requestPayout,
} from "../../../api";
import { useSnackbar } from "notistack";
import { Link, useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState();
  const [isRequested, setIsRequested] = useState(false);
  const [prevAmount, setPrevAmount] = useState(0);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { showTopProgress } = useSelector((state) => state);
  const { enqueueSnackbar } = useSnackbar();

  const [paypalAccount, setPaypalAccount] = useState('');
  
  const { channelDetails } = useSelector((state) => state);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };

  useEffect(() => {
    (async () => {
      dispatch({ type: "SHOW_PROGRESS" });
      let { data } = await getTransactionDetails(channelDetails?.channel._id);
      dispatch({ type: "HIDE_PROGRESS" });
      if (data.status) {
        setTransactions([...data?.transactions]);
        setAmount(data?.amount);
        setIsRequested(data?.isRequested);
        setPrevAmount(data?.prevAmount);
      }
    })();
  }, []);

  const handleRequest = async () => {
    try {
      dispatch({ type: "SHOW_PROGRESS" });
      if (isRequested) {
        let { data } = await cancelPayout(channelDetails?.channel._id);
        dispatch({ type: "HIDE_PROGRESS" });
        if (data.status) {
          setIsRequested(false);
          showToast(data.message, "success");
        }
      } else {
        
        let payout_data = {
          amount,
          paypalId: channelDetails.channel?.paymentAccount
        };

        let { data } = await requestPayout(
          payout_data,
          channelDetails?.channel._id
        );
        dispatch({ type: "HIDE_PROGRESS" });
        if (data.status) {
          setIsRequested(true);
          setPrevAmount(amount);
          showToast(data.message, "success");
        }
      }
    } catch (error) {
      dispatch({ type: "HIDE_PROGRESS" });
    }
  };

  const showToast = (message, variant) => {
    enqueueSnackbar(message, { variant: variant });
  };

  return (
    <>
      <Container>
        <Row className="mt-4">
          <Col lg={8}>
            <TransactionTable data={transactions} />
          </Col>
          <Col lg={4}>
            <Paper className="p-3">
              <p className="payout-title">Payouts</p>
              <div className="payout-details">
                <p className="content-end mb-0 amount">
                  ₹{" "}
                  {!showTopProgress ? (
                    <>{amount ? amount : "0.00"}</>
                  ) : (
                    <>
                      <CircularProgress className="mt-2 ms-2" size={30} />
                    </>
                  )}
                </p>
                <p className="content-end mb-0 f-gray">
                  Available amount to withdraw
                </p>
              </div>
              {amount > 0 ? (
                <Button
                  className={
                    !isRequested ? `request-payout-btn` : `disabled-payout-btn`
                  }
                  disabled={showTopProgress}
                  onClick={()=>{
                    if(!isRequested){
                      handleOpen()
                    }else{
                      handleRequest()
                    }
                  }}
                >
                  {!isRequested
                    ? "REQUEST PAYOUT"
                    : `CANCEL REQUEST FOR ${prevAmount}`}
                </Button>
              ) : (
                <Button className="no-payout-btn" disabled={true}>
                  YOU CAN'T REQUEST PAYOUT
                </Button>
              )}
            </Paper>
          </Col>
        </Row>
      </Container>

      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Confirm Payout
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {channelDetails.channel?.paymentAccount &&
              <>
              <div>You are about to make a payout request to</div>
              <span>{channelDetails.channel?.paymentAccount}</span>
              <EditIcon className="channel-edit-btn ms-3" onClick={()=>{
                navigate('/creator/settings')
              }}/>
              </>
            }
            </Typography>
            {channelDetails.channel?.paymentAccount 
                ? <Button className="request-payout-btn" onClick={()=>{
                  handleRequest()
                }}>Confirm</Button>
                : <Link to='/creator/settings'>Add a payment address first</Link>
            }
          </Box>
        </Modal>
      </div>
    </>
  );
}

export default Transactions;
