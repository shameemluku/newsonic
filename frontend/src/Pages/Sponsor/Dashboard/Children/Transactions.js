import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { AiOutlineArrowRight, AiOutlineMail } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { HiBadgeCheck } from "react-icons/hi";
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { Button, Modal, Switch, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { Box } from "@mui/system";
import { getTransactions } from "../../../../api";
import { useSnackbar } from "notistack";

export default function Transactions() {

  const [trans,setTrans] = useState([])
  const [loading,setLoading] = useState(false)
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    trans.length=0;
    setTrans([...trans])
    loadTransactions(0,10)
  }, []);

  const loadTransactions = async (skip,limit) => {
      let {data} = await getTransactions(skip,limit)
      if(data?.transactions) setTrans([...trans,...data?.transactions])
      if(data?.isEnd) enqueueSnackbar(data?.message, { variant:'info' });
  }

  const handleLoadmore = async () => {
      loadTransactions(parseInt(trans.length),parseInt(trans.length+10))
  }



  return (

    <>
    <div className="content-end mt-3">
    </div>

    <TableContainer component={Paper} className="mt-1 mb-5">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Tran. ID:</TableCell>
            <TableCell>Payment ID</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {trans.map((row) => (
            <TableRow
              key={row._id}
              sx={{  }}
            >
              <TableCell className="id-row" component="th" scope="row">
                {row._id}
              </TableCell>
              <TableCell>{row.payId }</TableCell>
              <TableCell>{row.date}</TableCell>
              <TableCell><span className="tran-spent-amt">- ₹ {row.amount}</span></TableCell>
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

    
  </>

  );
}
