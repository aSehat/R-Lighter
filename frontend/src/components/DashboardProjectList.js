import React from "react";
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'




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
            props.getproject(row)
            }}>
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