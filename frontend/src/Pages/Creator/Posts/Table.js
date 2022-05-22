import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import RefreshIcon from '@mui/icons-material/Refresh';
import { visuallyHidden } from '@mui/utils';
import { ToggleButtonGroup, ToggleButton, Button, Skeleton, TextField, OutlinedInput, CircularProgress } from '@mui/material';
import { AiOutlineArrowRight } from "react-icons/ai"
import { BACKEND_URL } from '../../../constants/url';
import {GrView} from 'react-icons/gr'
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { getCreatorPosts } from '../../../actions/channelActions';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { deletePost } from '../../../actions/postActions';



function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'image',
    numeric: false,
    disablePadding: false,
    label: 'Thumbnail',
  },
  {
    id: 'name',
    numeric: false,
    disablePadding: false,
    label: 'Title',
  },
  {
    id: 'date',
    numeric: true,
    disablePadding: false,
    label: 'Posted',
  },
  {
    id: 'view',
    numeric: true,
    disablePadding: false,
    label: 'Views',
  },
  {
    id: 'status',
    numeric: true,
    disablePadding: false,
    label: 'Status',
  },
  {
    id: 'actions',
    numeric: true,
    disablePadding: false,
    label: 'Actions',
  },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = (props) => {

  const { numSelected, selected } = props;
  const dispatch = useDispatch()
  const {channelDetails} = useSelector((state)=>state)
  const [deleteText, setDeleteText] = React.useState("")

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    if(deleteText==='delete'){
      dispatch(deletePost(selected,channelDetails.channel?._id))
    }
  };

  return (
    <>
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Added news posts
        </Typography>


      )}

      {numSelected===1 && (
      
        <Tooltip  title="Edit">
          <IconButton onClick={()=>{
            alert(selected);
          }}>
            <EditIcon/>
          </IconButton>
        </Tooltip>
      
      )}

      {numSelected > 0 ? (
        <Tooltip  title="Delete">
          <IconButton onClick={()=>{
            handleClickOpen()
          }}>
            <DeleteIcon/>
          </IconButton>
        </Tooltip>
      ) : ( 
        <>

        <Tooltip title="Refresh">
          <IconButton>
            <RefreshIcon onClick={()=>{
              console.log(channelDetails?.channel?._id);
              dispatch(getCreatorPosts(channelDetails?.channel?._id,"ALL"))
            }}/>
          </IconButton>
        </Tooltip>
        </>
        
      )}


    </Toolbar>

      <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      >
      <DialogTitle id="alert-dialog-title"><DeleteIcon/>
        {" Are you use to perform deletion?"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" className='mt-4'>
          You are about to delete {numSelected} document&#40;s&#41;. Enter "delete" to continue.
          
            <input type='text' className='w-100 delete-text' 
              placeholder='Type "delete" here' 
              onChange={(e)=>{setDeleteText(e.target.value)}}
              value={deleteText}
            ></input>


        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleDelete} autoFocus>
          Delete
        </Button>
      </DialogActions>
      </Dialog>

    </>

  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function TableComp({data,loading,isDeleting}) {

  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [showLoadMore, setLoadMore] = React.useState(false)
  const [rows,setRows] = React.useState([])

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };
  

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  React.useEffect(()=>{
    let countRow = Math.max(0, (1 + page) * rowsPerPage - rows.length);
    if(page === countRow && countRow!==0 || rowsPerPage>=rows.length ){
      setLoadMore(true)
    } else setLoadMore(false)
  },[page,rowsPerPage])


  React.useEffect(()=>{
    setRows(data)
  },[data])


  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} selected={selected} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
            {

              loading ? 
              <>
              {

                  [...Array(4)].map((i)=>{
                    return( 
                    <>
                    <TableRow>
                    <TableCell><Skeleton variant="text" height={40}/></TableCell>
                    <TableCell><Skeleton variant="text" height={40}/></TableCell>
                    <TableCell><Skeleton variant="text" height={40}/></TableCell>
                    <TableCell align="right"><Skeleton variant="text" height={40}/></TableCell>
                    <TableCell align="right"><Skeleton variant="text" height={40}/></TableCell>
                    <TableCell align="right"><Skeleton variant="text" height={40}/></TableCell>
                    <TableCell align="right"><Skeleton variant="text" height={40}/></TableCell>
                    </TableRow>
                    </>)
                  })

              }
                
              </>
              :
              <>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row._id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row?._id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row?._id}
                      selected={isItemSelected}
                    >
                      {
                        (isDeleting && isItemSelected) ?

                      <TableCell padding="checkbox">
                        <CircularProgress color="success" size={23}/>
                      </TableCell>
                        

                      :

                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>

             
                      }
                      

                      <TableCell>
                        <img 
                         className='table-thumb'
                         src={`${BACKEND_URL}/uploads/${row?.images[0]}`}
                         height="50px"
                         alt=''/>
                      </TableCell>

                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                        width={400}
                      >
                        {row?.newsHead}
                      </TableCell>
                      <TableCell align="right">{moment(row?.postDate).format('ddd MMM DD YYYY hh:mm:ss')}</TableCell>
                      <TableCell align="right"><GrView className='me-2'/>{row?.seenBy.length}</TableCell>
                      <TableCell align="right"><span className={`status-label ${row?.status}`}>{row.status}</span></TableCell>
                      <TableCell align="right">{row.protein}</TableCell>
                    </TableRow>
                  );
                })}
              </>
              
            }
              
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        {showLoadMore && <div className='content-center'>
          <Button variant="text w-100 py-3">Load more <AiOutlineArrowRight className='ms-2'/></Button>
        </div>}
      </Paper>
      {/* <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      /> */}
    </Box>
  );
}
