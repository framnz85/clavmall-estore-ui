import React from "react";

import Client from "../images/client.jpg";

const ChatSent = ({ mess }) => {
  return (
    <div className="row msg_container base_sent">
      <div className="col-md-10 col-xs-10" style={{ width: "80%", padding: 0 }}>
        <div className="messages msg_sent">
          <p>{mess.message}</p>
          <time dateTime="2009-11-13T20:00">
            {mess.user} • {mess.date}
          </time>
        </div>
      </div>
      <div
        className="col-md-2 col-xs-2 avatar"
        style={{ width: "20%", padding: 0 }}
      >
        <img src={Client} className=" img-responsive " alt={mess._id} />
      </div>
    </div>
  );
};

export default ChatSent;
