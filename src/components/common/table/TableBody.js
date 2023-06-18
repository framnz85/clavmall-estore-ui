import React from "react";
import _ from "lodash";
import { isMobile } from 'react-device-detect';

const TableBody = (props) => {
  const { data, columns, currentPage, pageSize } = props;

  const renderCell = (item, column, index) => {
    if (column.content) return column.content(item);
    else if (column.index) return (currentPage - 1) * pageSize + index + 1;

    return _.get(item, column.path);
  };

  const createKey = (item, column) => {
    return item._id + (column.path || column.key);
  };

  return (
    <tbody>
      {data.map((item, index) => (
        <tr key={item._id+index}>
          {!isMobile && columns.map((column) => (
            <td key={createKey(item, column)}>
              {renderCell(item, column, index)}
            </td>
          ))}
          <td>
            {isMobile && columns.map((column) => 
              <div key={createKey(item, column)}>
                {column.key === "image" && <div style={{float: "left", height: 180}}>
                    {renderCell(item, column, index)}
                  </div>
                }
                {column.key !== "image" && <div>
                    {column.label && <b>{column.label}:</b>} {renderCell(item, column, index)}
                  </div>}
              </div>
            )}
          </td>
        </tr>
      ))}
    </tbody>
  );
};

export default TableBody;
