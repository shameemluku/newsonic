import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Skeleton, Toolbar, Typography } from '@mui/material';
import moment from 'moment'
import nothing from '../../../Images/notransaction.png'
import { useSelector } from 'react-redux';

const EnhancedTableToolbar = (props) => {

  return (
    <>
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        bgcolor:"white"
      }}
    >
      
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Transactions
        </Typography>

    </Toolbar>


    </>

  );
};



export default function TransactionTable({data}) {

  const {showTopProgress} = useSelector((state)=>state)

  return (
    <>
    
    <TableContainer component={Paper}>
      <EnhancedTableToolbar/>
      {
        showTopProgress && 
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Trans. Id</TableCell>
            <TableCell align="right">Payment Id.</TableCell>
            <TableCell align="right">Date</TableCell>
            <TableCell align="right">Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {[...Array(5)].map((_,i) => (
            <TableRow
              key={i}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
              <Skeleton height={25} />
              </TableCell>
              <TableCell align="right"><Skeleton height={25} /></TableCell>
              <TableCell align="right"><Skeleton height={25} /></TableCell>
              <TableCell align="right"><Skeleton height={25}/></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      }
      { (data.length>0) ? 

      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Trans. Id</TableCell>
            <TableCell align="right">Payment Id.</TableCell>
            <TableCell align="right">Date</TableCell>
            <TableCell align="right">Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow
              key={row._id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row._id}
              </TableCell>
              <TableCell align="right">{row.payId}</TableCell>
              <TableCell align="right">{moment(row.date).format('MMMM d, YYYY')}</TableCell>
              <TableCell align="right">₹ {row.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      :
      <>
        {
          !showTopProgress &&
          <>
          <div className='content-center'>
            <img src={nothing} width="200px" alt="" />
        </div>
        <p className='content-center mb-5'>You don't have any transactions yet</p>
          </>
        }
      </>
      }
    </TableContainer>
    </>
  );
}
