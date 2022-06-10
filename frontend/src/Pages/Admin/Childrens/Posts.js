import React, { useEffect, useState } from "react";
import * as api from '../../../api/admin'
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { AiOutlineArrowRight } from "react-icons/ai";
import { Button, ToggleButton, ToggleButtonGroup } from "@mui/material";
import moment from 'moment'
import { Link } from 'react-router-dom'


export default function Posts() {

  const [status,setStatus] = useState('ALL')
  const [posts,setPosts] = useState([])
  

  useEffect(() => {
    posts.length=0;
    setPosts([...posts])
    loadPost(0,10,status)
  }, [status]);


  const loadPost = async (skip,limit,status) => {
      let {data} = await api.fetchPosts(skip,limit,status)
      if(data?.posts) setPosts([...posts,...data?.posts])
      if(data?.message) alert(data?.message)
  }

  const handleLoadmore = async () => {
      loadPost(parseInt(posts.length),parseInt(posts.length+10),status)
  }

  const handleChange = (event, newStatus) => {
    setStatus(newStatus);
  };

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
              <ToggleButton value="PUBLIC" className='show-post-toogle'>PUBLIC</ToggleButton>
              <ToggleButton value="REVIEW" className='show-post-toogle'>REVIEW</ToggleButton>
        </ToggleButtonGroup>
    </div>

    <TableContainer component={Paper} className="mt-1">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Post Id:</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Likes</TableCell>
            <TableCell>Views</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {posts.map((row) => (
            <TableRow
              key={row._id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell className="id-row" scope="row">
                {row._id}
              </TableCell>
              <TableCell><Link to={`/admin/post/${row._id}`}>{row.newsHead}</Link></TableCell>
              <TableCell>{moment(row.postDate).format('DD/MM/YYYY')}</TableCell>
              <TableCell><RemoveRedEyeIcon className="f-15 me-2 f-gray"/> {row.likes}</TableCell>
              <TableCell><ThumbUpIcon className="f-15 me-2 f-gray"/>{row.seen}</TableCell>
              <TableCell><span className={`admin-post-status ${row.status==='REVIEW' && 'status-review'}`}>
                  {row.status}
                </span></TableCell>
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
