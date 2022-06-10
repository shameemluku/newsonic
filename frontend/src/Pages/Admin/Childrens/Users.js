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
import * as api from '../../../api/admin'
import "./Children.css"
import { useDispatch } from "react-redux";
import { Box } from "@mui/system";

export default function Users() {

  const [status,setStatus] = useState("ALL")
  const [users,setUser] = useState([])
  const [deleteId,setDeleteId] = useState(null)
  const dispatch = useDispatch()

  const SHOW="SHOW_ADMIN_PROGRESS"
  const HIDE="HIDE_ADMIN_PROGRESS"
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () =>{
    setOpen(false);
    setDeleteId(null)
  } 

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
    border:"none",
    p: 4,
  };

  useEffect(() => {
    users.length=0;
    setUser([...users])
    loadUser(0,10,status)
  }, [status]);

  const loadUser = async (skip,limit,status) => {
      dispatch({type:SHOW})
      let {data} = await api.fetchUsers(skip,limit,status)
      dispatch({type:HIDE})
      if(data?.users) setUser([...users,...data?.users])
      if(data?.message) alert(data?.message)
  }

  const handleLoadmore = async () => {
      dispatch({type:SHOW})
      loadUser(parseInt(users.length),parseInt(users.length+10),status)
      dispatch({type:HIDE})
  }

  const handleBlock = async (id,status) => {
    dispatch({type:SHOW})
    await api.blockUser(id,status)
    users.forEach((post)=>{
      if(post._id===id) post.isBlocked = status
    })
    dispatch({type:HIDE})
  }

  const handleDelete = async () =>{
    
    dispatch({type:SHOW})
    await api.removeUser(deleteId)
    setUser([...users.filter((user)=>{
      if(user._id !== deleteId) return user
    })])
    dispatch({type:HIDE})
    handleClose()
  }


  return (

    <>
    <div className="content-end mt-3">
    <ToggleButtonGroup
          color="primary"
          style={{backgroundColor:"white"}}
          value={status}
          exclusive
          onChange={handleChange}
        >
          <ToggleButton value="ALL" className='show-post-toogle'>All</ToggleButton>
          <ToggleButton value="BLOCKED" className='show-post-toogle'>Blocked</ToggleButton>
    </ToggleButtonGroup>
    </div>

    <TableContainer component={Paper} className="mt-1 mb-5">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>User Id:</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Blocked</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((row) => (
            <TableRow
              key={row._id}
              sx={{  }}
            >
              <TableCell className="id-row" component="th" scope="row">
                {row._id}
              </TableCell>
              <TableCell>{row.name} {row.isCreator && <HiBadgeCheck/>}</TableCell>
              <TableCell>{row.type==='google' ? <FcGoogle/> : <AiOutlineMail/> } - {row.email}</TableCell>
              <TableCell>{row.phone}</TableCell>
              <TableCell><Switch checked={row.isBlocked} onChange={(e)=>handleBlock(row._id,e.target.checked)}/></TableCell>
              <TableCell className="remove-row"><div className="pointer" 
                onClick={()=>{
                  handleOpen()
                  setDeleteId(row._id)
                }
              }>
                <RemoveCircleIcon/> Remove</div>
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
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Confirm Action
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <>
              <div>Are you sure to remove this user {deleteId}</div>
              </>
            </Typography>
                <div className="content-end mt-3">
                <Button onClick={()=>{ handleClose()}}>Cancel</Button>
                <Button className="delete-confirm-btn" onClick={handleDelete}>Confirm</Button>
                </div>
          </Box>
        </Modal>
      </div>

  </>

  );
}
