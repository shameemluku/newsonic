import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import * as api from "../../../api/admin";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { AiOutlineArrowRight, AiOutlineMail } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { HiBadgeCheck } from "react-icons/hi";
import { ImPaypal } from "react-icons/im";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import {
  Button,
  Modal,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import "./Children.css";
import { useDispatch } from "react-redux";
import { Box } from "@mui/system";
import moment from "moment";
import { INR2USD } from "../../../utility/fingerprint";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function Payouts() {
  const [status, setStatus] = useState("ALL");
  const [payouts, setPayouts] = useState([]);
  const [selectedPayout, setSelectedPayout] = useState(null);
  const dispatch = useDispatch();

  const SHOW = "SHOW_ADMIN_PROGRESS";
  const HIDE = "HIDE_ADMIN_PROGRESS";
  const [open, setOpen] = useState(false);
  const [paypalId, setPaypal] = useState(null);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSelectedPayout(null);
  };

  const handleChange = (event, newStatus) => {
    setStatus(newStatus);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "#fff",
    boxShadow: 24,
    border: "none",
    p: 4,
  };

  useEffect(()=>{
    (async()=>{
      let {data} = await api.getPaypalId()
      if(data?.status) setPaypal(data.paypalId)
      
    })()
  },[])

  useEffect(() => {
    payouts.length = 0;
    setPayouts([...payouts]);
    loadPayouts(0, 10, status);
  }, [status]);

  const loadPayouts = async (skip, limit, status) => {
    dispatch({ type: SHOW });
    let { data } = await api.fetchPayouts(skip, limit, status);
    dispatch({ type: HIDE });
    if (data?.payouts) setPayouts([...payouts, ...data?.payouts]);
    if (data?.message) alert(data?.message);
  };

  const handleLoadmore = async () => {
    dispatch({ type: SHOW });
    loadPayouts(
      parseInt(payouts.length),
      parseInt(payouts.length + 10),
      status
    );
    dispatch({ type: HIDE });
  };


  useEffect(()=>{
    if(selectedPayout){
      (async()=>{
        let amount = await INR2USD(selectedPayout.amount)
        selectedPayout.finalAmount = amount 
          ? amount 
          : (selectedPayout.amount/75).toFixed().toString()
      })()
    }
  },[selectedPayout])



  return (
    <>
      <div className="content-end mt-3">
        <ToggleButtonGroup
          color="primary"
          style={{ backgroundColor: "white" }}
          value={status}
          exclusive
          onChange={handleChange}
        >
          <ToggleButton value="ALL" className="show-post-toogle">
            All
          </ToggleButton>
          <ToggleButton value="PAID" className="show-post-toogle">
            PAID
          </ToggleButton>
          <ToggleButton value="PENDING" className="show-post-toogle">
            PENDING
          </ToggleButton>
        </ToggleButtonGroup>
      </div>

      <TableContainer component={Paper} className="mt-1 mb-5">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Channel Id:</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Paypal</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payouts.map((row) => (
              <TableRow key={row._id} sx={{}}>
                <TableCell className="id-row" component="th" scope="row">
                  {row.channelId}
                </TableCell>
                <TableCell>{moment(row.date).format("DD/MM/YYYY")}</TableCell>
                <TableCell>
                  <ImPaypal className="f-15 me-2" />
                  {row.paypalId}
                </TableCell>
                <TableCell>₹ {row.amount}</TableCell>
                <TableCell>
                  <span
                    className={`sponsor-status-span ${
                      row.isPaid ? "ad-status-active" : "ad-status-pending"
                    }`}
                  >
                    {row.isPaid ? "Paid" : "Pending"}
                  </span>
                </TableCell>
                <TableCell className="id-row" component="th" scope="row">
                  { !row.isPaid &&
                  <Button
                    onClick={() => {
                      setSelectedPayout(row);
                      handleOpen();
                    }}
                  >
                    Approve
                  </Button>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="content-center">
          <Button variant="text w-100 py-3" onClick={handleLoadmore}>
            Load more <AiOutlineArrowRight className="ms-2" />
          </Button>
        </div>
      </TableContainer>

      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>

            <p className="mb-1"> 
              Paypal Id:
              <span className="fw-500 ms-2">{selectedPayout?.paypalId}</span>
             </p>
             <p> 
              Amount:
              <span className="fw-500 f-20 ms-2">{selectedPayout?.amount}</span>
             </p>
          {paypalId &&<PayPalScriptProvider
              options={{
                "client-id":paypalId,
              }}
            >

              <PayPalButtons
                style={{
                  layout: "horizontal",
                  color: "silver",
                  tagline: false,
                }}
                createOrder={(data, actions) => {
                  const {finalAmount,paypalId:payee} = selectedPayout
                  return actions.order.create({
                    intent: "CAPTURE",
                    purchase_units: [
                      {
                        amount: {
                          currency_code: "USD",
                          value: finalAmount,
                        },
                        payee: {
                          email_address: payee,
                        },
                      },
                    ],
                  });
                }}
                onApprove={async (data, actions) => {
                  try {
                    const details = await actions.order.capture();
                    let paymentDetails = {
                      payment_id:details.id,
                      amount:selectedPayout?.amount,
                      channelId:selectedPayout?.channelId
                    }
                    let {data} = await api.approvePayout(paymentDetails,selectedPayout._id)
                    alert(data.message);
                    setSelectedPayout((prev)=>({
                      ...prev,
                      isPaid:true
                    }))
                    handleClose()
                  } catch (error) {
                    alert("Error");
                  }
                }}
              />
            </PayPalScriptProvider>}
          </Box>
        </Modal>
      </div>
    </>
  );
}
