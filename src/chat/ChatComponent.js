import React, { useState } from "react";
import {
  MessageOutlined,
  CaretRightOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { isMobile } from "react-device-detect";
import { toast } from "react-toastify";

import ChatSent from "./ChatSent";
import ChatReceive from "./ChatReceive";

import { getGroceyResonse } from "../functions/openai";

const ChatComponent = () => {
  const localMessages = JSON.parse(localStorage.getItem("messages"));
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(
    localMessages && localMessages.length > 0
      ? localMessages
      : [
          {
            _id: 1,
            type: "receive",
            message:
              "Hi, ako nga pala si Grocey, your AI Assistant. You can ask me about the delivery po muna sa ngayon.",
            user: "Grocey",
            date: "20m",
          },
          {
            _id: 2,
            type: "receive",
            message: "May tanong po ba kayo regarding delivery?",
            user: "Grocey",
            date: "20m",
          },
        ]
  );
  const [loading, setLoading] = useState(false);

  const { estore, user } = useSelector((state) => ({ ...state }));

  const scrollToBottom = () => {
    setTimeout(() => {
      const chatContent = document.getElementById("chat-content");
      if (chatContent) chatContent.scrollTop = chatContent.scrollHeight;
    }, 300);
  };

  const handleCloseOpen = () => {
    setOpen(!open);
    scrollToBottom();
  };

  const handleSentChat = (e) => {
    e.preventDefault();
    if (message) {
      setMessages([
        ...messages,
        {
          _id: Math.floor(Math.random() * 99999),
          type: "sent",
          message,
          user: user.name ? user.name : "Guest",
          date: "51m",
        },
      ]);
      scrollToBottom();
      setMessage("");
      setLoading(true);
      getGroceyResonse(
        message,
        estore.openaiAPI,
        estore.country.countryCode
      ).then((res) => {
        if (res.data.err) {
          toast.error(res.data.err);
          setLoading(false);
        } else {
          setMessages([
            ...messages,
            {
              _id: Math.floor(Math.random() * 99999),
              type: "sent",
              message,
              user: user.name ? user.name : "Guest",
              date: "51m",
            },
            {
              _id: Math.floor(Math.random() * 99999),
              type: "receive",
              message: res.data.message,
              user: "Grocey",
              date: "51m",
            },
          ]);
          localStorage.setItem(
            "messages",
            JSON.stringify([
              ...messages,
              {
                _id: Math.floor(Math.random() * 99999),
                type: "sent",
                message,
                user: user.name ? user.name : "Guest",
                date: "51m",
              },
              {
                _id: Math.floor(Math.random() * 99999),
                type: "receive",
                message: res.data.message,
                user: "Grocey",
                date: "51m",
              },
            ])
          );
          setLoading(false);
          scrollToBottom();
        }
      });
    }
  };
  return (
    <>
      {estore.openaiAPI && (
        <div
          className="row chat-window col-xs-5 col-md-3"
          id="chat_window_1"
          style={{
            marginLeft: "10px",
            width: open ? 350 : 110,
            marginBottom: open ? 10 : isMobile ? 60 : 20,
          }}
        >
          <div className="col-xs-12 col-md-12">
            <div className="panel panel-default">
              <div
                className="panel-heading top-bar"
                style={{
                  cursor: "pointer",
                  borderRadius: open ? 0 : 25,
                  backgroundColor: estore.headerColor,
                  color: "#eeeeee",
                }}
                onClick={handleCloseOpen}
              >
                {open ? (
                  <div>
                    <div style={{ float: "left" }}>Hi I'm Grocey</div>
                    <div style={{ float: "right" }}>
                      <CloseOutlined style={{ fontSize: 12 }} />
                    </div>
                  </div>
                ) : (
                  <div
                    align="center"
                    style={{
                      height: 30,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <strong>
                      <MessageOutlined style={{ fontSize: 24 }} />
                    </strong>
                  </div>
                )}
              </div>
              {open && (
                <div
                  className="panel-body msg_container_base"
                  id="chat-content"
                >
                  {messages.map((mess) => {
                    return mess.type === "sent" ? (
                      <ChatSent key={mess._id} mess={mess} />
                    ) : (
                      <ChatReceive key={mess._id} mess={mess} />
                    );
                  })}
                  {loading && <div align="center">...</div>}
                </div>
              )}
              {open && (
                <div className="panel-footer chat-input">
                  <form
                    onSubmit={handleSentChat}
                    className="input-group"
                    style={{ margin: 0 }}
                  >
                    <input
                      id="btn-input"
                      type="text"
                      value={message}
                      className="form-control input-sm chat_input"
                      placeholder="Write your message here..."
                      style={{ border: 0 }}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary btn-sm">
                      <CaretRightOutlined />
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatComponent;
