import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import { Col } from 'react-bootstrap';
import { BACKEND_URL } from '../../constants/url';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';
import { useNavigate } from 'react-router-dom';
import { getPostDetails, savePost } from '../../actions/postActions';
import { useDispatch, useSelector } from 'react-redux';

export default function MultiActionAreaCard({data,handleUnsave}) {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {authUser:authData} = useSelector((state)=>state)


  return (
    <Col lg={3}>
    <Card sx={{ maxWidth: "100%"}} className={"savedCard mb-3"}>
      <CardActionArea onClick={()=>{
            navigate(`/post/${data?._id}`)
            window.scrollTo(0, 0)
            dispatch(getPostDetails(data?._id))
        }}>
        <CardMedia
          component="img"
          height="140"
          image={`${BACKEND_URL}/uploads/${data?.images[0]}`}
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom className='cardHeading' component="div">
            {data?.newsHead}
          </Typography>

        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" style={{color:"red"}} onClick={
            ()=>{
                dispatch(savePost({
                    userId: authData?.user?._id,
                    postId: data?._id,
                }))
                handleUnsave(data._id)
            }
        }>
          <BookmarkRemoveIcon className='me-1'/>Unsave
        </Button>
      </CardActions>
    </Card>
    </Col>
  );
}