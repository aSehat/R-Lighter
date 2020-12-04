import React from "react";
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

// let IS_FIRST_CLICK = true;
// function determineAscending(current_sortby, attribute_clicked) {
//   let retVal = true;
//   if (IS_FIRST_CLICK && attribute_clicked === "date") {
//     retVal = true;
//   } else if (attribute_clicked !== current_sortby.attribute) {
//     retVal = true;
//   } else {
//     retVal = !current_sortby.ascending;
//   }
//   IS_FIRST_CLICK = false;
//   return retVal;
// }

export default function DashboardListHeader(props) {
  // TODO: not sure how exactly the sorting is going to work, some ui testing is required
  //  eg: initially ill sort by most recent first, but what happens if I then click the date sort option?
  //    I think it shouldn't change the first time, then if you click it again it flips to descending
  // TODO: also look into making an arrow icon appear to indicate how the list is being sorted
  return (
    <TableHead>
      {props.headergroups.map(headerGroup => (
        <TableRow {...headerGroup.getHeaderGroupProps()}>
          {headerGroup.headers.map(column => (
            <TableCell {...column.getHeaderProps()}>
              {column.render('Header')}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableHead>
  );
}