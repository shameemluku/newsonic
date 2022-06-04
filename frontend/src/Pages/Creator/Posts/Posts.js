import React, { useEffect } from 'react'
import { Container } from 'react-bootstrap'
import TableComp from './Table'
import "./Posts.css"
import { ToggleButtonGroup, ToggleButton } from '@mui/material';
import { useDispatch, useSelector } from "react-redux";
import { getCreatorPosts } from '../../../actions/channelActions';

export default function Posts() {

  const [filterStatus, setFilterStatus] = React.useState('ALL');
  const dispatch = useDispatch()
  const { channelDetails, addedPosts } = useSelector((state) => state);

  const handleChange = (event, newStatus) => {
    setFilterStatus(newStatus);
  };

  useEffect(()=>{
    dispatch(getCreatorPosts(channelDetails.channel._id,"ALL",10))
  },[])

  useEffect(()=>{
    if(filterStatus==='DRAFT'){
      alert("Draft")
    }else{
      console.log(filterStatus);
      dispatch(getCreatorPosts(channelDetails.channel._id,filterStatus,10))
    }
  },[filterStatus])


  return (
    <Container>
        <div className='content-end mt-4 status-sec'>
        <ToggleButtonGroup
          color="primary"
          style={{backgroundColor:"white"}}
          value={filterStatus}
          exclusive
          onChange={handleChange}
        >
          <ToggleButton value="ALL" className='show-post-toogle'>All Posts</ToggleButton>
          <ToggleButton value="DRAFT" className='show-post-toogle'>Draft</ToggleButton>
          <ToggleButton value="PUBLIC" className='show-post-toogle'>Published</ToggleButton>
          <ToggleButton value="REVIEW" className='show-post-toogle'>Review</ToggleButton>
        </ToggleButtonGroup>
        </div>
        <div className='mt-1'>
            <TableComp data={addedPosts.posts} loading={addedPosts.loading} isDeleting={addedPosts.isDeleting}/>
        </div>
    </Container>
  )
}
