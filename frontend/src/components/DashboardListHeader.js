import { is } from "immutable";
import React, { useState } from "react";
import { useTable } from 'react-table';

// <button onClick={() => props.setsortby({attribute: "newval"})}>change state</button>
{/* <tr>
  <th><button onClick={() => props.setsortby({attribute: "name", ascending: determineAscending(props.sortby, "name")})}>Name</button></th>
  <th><button onClick={() => props.setsortby({attribute: "date", ascending: determineAscending(props.sortby, "date")})}>Date</button></th>
  <th><button onClick={() => props.setsortby({attribute: "lang", ascending: determineAscending(props.sortby, "lang")})}>Language</button></th>
</tr> */}

let IS_FIRST_CLICK = true;
function determineAscending(current_sortby, attribute_clicked) {
  // TODO: consider making a fancy one liner out of this
  let retVal = true;
  if (IS_FIRST_CLICK && attribute_clicked === "date") {
    retVal = true;
  } else if (attribute_clicked !== current_sortby.attribute) {
    retVal = true;
  } else {
    retVal = !current_sortby.ascending;
  }

  IS_FIRST_CLICK = false;
  return retVal;
}

export default function DashboardListHeader(props) {
  // TODO: not sure how exactly the sorting is going to work, some external ui testing is required
  //  eg: initially ill sort by most recent first, but what happens if I then click the date sort option?
  //    I think it shouldn't change the first time, then if you click it again it flips to descending
  // TODO: also look into making an arrow icon appear to indicate how the list is being sorted
  return (
    <thead>
      {
        // loop over header rows (in case I ever want subheaders)
        props.headergroups.map((headerGroup) => (
          // apply header row props
          <tr {...headerGroup.getHeaderGroupProps()}>
            {
              // loop over headers in a particular row
              headerGroup.headers.map((column) => (
                // apply header cell props
                <th {...column.getHeaderProps()}>
                  {
                    column.render('Header')
                  }
                </th>
              ))
            }
          </tr>
        ))
      }
    </thead>
  );
}