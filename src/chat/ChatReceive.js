import React from "react";

import Grocey from "../images/grocey.png";

const ChatReceive = ({ mess }) => {
  return (
    <div className="row msg_container base_receive">
      <div
        className="col-md-2 col-xs-2 avatar"
        style={{ width: "20%", padding: 0 }}
      >
        <img src={Grocey} className=" img-responsive " alt={mess._id} />
      </div>
      <div className="col-md-10 col-xs-10" style={{ width: "80%", padding: 0 }}>
        <div className="messages msg_receive">
          <p>{mess.message}</p>
          <time dateTime="2009-11-13T20:00">
            {mess.user} • {mess.date}
          </time>
        </div>
      </div>
    </div>
  );
};

export default ChatReceive;
