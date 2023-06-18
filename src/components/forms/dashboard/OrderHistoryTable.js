import React from "react";
import moment from "moment";
import {
  FieldTimeOutlined,
  PieChartOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import TableBody from "../../common/table/TableBody";

const OrderHistoryTable = ({ history }) => {
  const statusColor = [
    { status: "Not Processed", color: "darkred" },
    { status: "Waiting Payment", color: "red" },
    { status: "Processing", color: "blue" },
    { status: "Delivering", color: "darkorange" },
    { status: "Cancelled", color: "" },
    { status: "Completed", color: "green" },
  ];

  const columns = [
    {
      key: "arrow1",
      path: "arrow1",
      content: () => (
        <div style={{ padding: "7px 15px" }}>
          <FieldTimeOutlined />
        </div>
      ),
    },
    {
      key: "historyDate",
      path: "historyDate",
      content: (hist) =>
        moment(hist.historyDate).format("MMMM Do YYYY, h:mm:ss a"),
    },
    {
      key: "arrow2",
      path: "arrow2",
      content: () => (
        <div style={{ padding: "7px 15px" }}>
          <PieChartOutlined />
        </div>
      ),
    },
    {
      key: "historyDesc",
      path: "historyDesc",
      content: (hist) => {
        const sColor = statusColor.find((s) => s.status === hist.historyDesc);
        return hist && hist.historyDesc ? (
          <span
            style={{
              color: sColor ? sColor.color : "blue",
            }}
          >
            {hist.historyDesc}
          </span>
        ) : (
          ""
        );
      },
    },
    {
      key: "arrow3",
      path: "arrow3",
      content: () => (
        <div style={{ padding: "7px 15px" }}>
          <CommentOutlined />
        </div>
      ),
    },
    {
      key: "historyMess",
      path: "historyMess",
      content: (hist) => hist.historyMess,
    },
  ];

  return (
    <div>
      {history.length > 0 ? (
        <table className="table">
          <TableBody data={history} columns={columns} />
        </table>
      ) : (
        "No activity yet"
      )}
    </div>
  );
};

export default OrderHistoryTable;
