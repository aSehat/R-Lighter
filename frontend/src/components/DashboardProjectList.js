import React, { useState } from "react";
import { useTable } from 'react-table';
import { makeStyles } from '@material-ui/core/styles';
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import Button from '@material-ui/core/Button';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';



// NOTE: the list keys are made using the following 2 assumptions:
      //  1: the "date" field is date of creation, NOT date last modified
      //  2: it is not possible to create 2 identical projects within 1ms of each other
      // let key = current.date + current.link;
      // return (
      //   <li key={key}></li>
      // );



export default function DashboardProjectList(props) {
  return (
    <TableBody {...props.gettablebodyprops()}>
      {props.rows.map((row, i) => {
        // TODO: find out what this sorcery entails
        props.preparerow(row)
        return (
          <TableRow {...row.getRowProps()} onClick={() => {
            console.log(row.getRowProps());
            props.getproject(row)
            }}>
            {row.cells.map(cell => {
              return (
                <TableCell {...cell.getCellProps()}>
                  {cell.render('Cell')}
                </TableCell>
              )
            })}
              {/* <InfoOutlinedIcon
                  className="edit-project"
                  variant="contained"
                  color="primary"
                  onClick={(event) => {event.stopPropagation(); props.getProjectSettings(row)}}
              >
                  Edit
              </InfoOutlinedIcon> */}
          </TableRow>
        )
      })}
    </TableBody>
  );
}