import React, { useState } from "react";
import { useTable } from 'react-table';
import { makeStyles } from '@material-ui/core/styles';
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import Button from '@material-ui/core/Button';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';


const useStyles = makeStyles((theme) => ({
  project: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#d3d3d3'
    },
    backgroundColor: 'white'
  },
}));

export default function DashboardProjectList(props) {
  const classes = useStyles();
  return (
    <TableBody {...props.gettablebodyprops()}>
      {props.rows.map((row, i) => {
        props.preparerow(row)
        return (
          <TableRow {...row.getRowProps()} onClick={() => {
            console.log(row.getRowProps());
            props.getproject(row)
            }} className={classes.project}>
            {row.cells.map(cell => {
              return (
                <TableCell {...cell.getCellProps()}>
                  {cell.render('Cell')}
                </TableCell>
              )
            })}
          </TableRow>
        )
      })}
    </TableBody>
  );
}