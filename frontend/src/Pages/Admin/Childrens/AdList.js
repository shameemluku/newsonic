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
import Link from "@mui/material/Link";
import { AiOutlineArrowRight } from "react-icons/ai";
import { 
  Button, 
  ToggleButton, 
  ToggleButtonGroup 
} from "@mui/material";
import moment from 'moment'
import AdDetails from "./AdDetails";


export default function AdList() {

  const [status,setStatus] = useState('ALL')
  const [ads,setAds] = useState([])
  const [selectedAd,setSelectedAd] = useState(null)
  

  useEffect(() => {
    ads.length=0;
    setAds([...ads])
    loadAds(0,10,status)
  }, [status]);


  const loadAds = async (skip,limit,status) => {
      let {data} = await api.fetchAds(skip,limit,status)
      if(data?.ads) setAds([...ads,...data?.ads])
      if(data?.message) alert(data?.message)
  }

  const handleLoadmore = async () => {
      loadAds(parseInt(ads.length),parseInt(ads.length+10),status)
  }

  const handleChange = (event, newStatus) => {
    setStatus(newStatus);
  };

  return (
    <>

    {
      !selectedAd ?
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
              <ToggleButton value="ACTIVE" className='show-post-toogle'>ACTIVE</ToggleButton>
              <ToggleButton value="INACTIVE" className='show-post-toogle'>INACTIVE</ToggleButton>
              <ToggleButton value="PENDING" className='show-post-toogle'>PENDING</ToggleButton>
              <ToggleButton value="ENDED" className='show-post-toogle'>ENDED</ToggleButton>
        </ToggleButtonGroup>
    </div>

    <TableContainer component={Paper} className="mt-1">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Ad Id:</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Duration</TableCell>
            <TableCell>SponsorId</TableCell>
            <TableCell>Views</TableCell>
            <TableCell>Clicks</TableCell>
            <TableCell>Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ads.map((row) => (
            <TableRow
              key={row._id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell className="id-row" scope="row">
                {row._id}
              </TableCell>
              <TableCell className="pointer" onClick={()=>{setSelectedAd(row)}}><Link>{row.title}</Link></TableCell>
              <TableCell>{moment(row.startDate).format('DD/MM/YYYY')} - {moment(row.endDate).format('DD/MM/YYYY')}</TableCell>
              <TableCell  className="id-row">{row.sponsorId}</TableCell>
              <TableCell><RemoveRedEyeIcon className="f-15 me-2 f-gray"/> {row.views}</TableCell>
              <TableCell><ThumbUpIcon className="f-15 me-2 f-gray"/>{row.clicks}</TableCell>
              <TableCell><span className={`sponsor-status-span 
                                  ${
                                    row.status === "Active" &&
                                    "ad-status-active"
                                  }
                                  ${
                                    (row.status === "Not Started" ||
                                      row.status === "Pending") &&
                                    "ad-status-pending"
                                  }
                                  ${
                                    (row.status === "Ended" ||
                                      row.status === "Cancelled") &&
                                    "ad-status-ended"
                                  }`}>{row.status}</span></TableCell>
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
      :
      <AdDetails adData={selectedAd} setSelectedAd={setSelectedAd}/>
    }
    
    </>
  );
}
