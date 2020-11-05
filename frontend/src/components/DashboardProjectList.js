import React, { useState } from "react";
import { useTable } from 'react-table';





// NOTE: the list keys are made using the following 2 assumptions:
      //  1: the "date" field is date of creation, NOT date last modified
      //  2: it is not possible to create 2 identical projects within 1ms of each other
      // let key = current.date + current.link;
      // return (
      //   <li key={key}></li>
      // );



export default function DashboardProjectList(props) {
  return (
    <tbody {...props.gettablebodyprops()}>
      {
        props.rows.map((row) => {
          // TODO: find out what this sorcery entails
          props.preparerow(row);
          return (
            <tr {...row.getRowProps()}>
              {
                row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>
                      {
                        cell.render('Cell')
                      }
                    </td>
                  );
                })
              }
            </tr>
          );
        })
      }
    </tbody>
  );
}