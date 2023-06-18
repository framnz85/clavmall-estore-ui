import React from "react";
import { isMobile } from 'react-device-detect';

const TableHeader = (props) => {
  const { columns, onSort, sort } = props;
  return (
    <thead className="thead-light">
      <tr>
        {!isMobile && columns.map((column) => (
          <th
            key={column.key}
            onClick={() => (column.path ? onSort(column.path) : "")}
            style={column.path ? { cursor: "pointer" } : {}}
          >
            {column.label} {column.path ? (sort === 1 ? "▼" : "▲") : ""}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
