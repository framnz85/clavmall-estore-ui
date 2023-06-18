import React from "react";
import { CaretRightOutlined } from "@ant-design/icons";

import GuideNav from "../../components/nav/GuideNav";
import Player from "./Player";

const Guide11 = () => {
  const guideVideos = [
    {
      key: "1",
      label: (
        <>
          <b>Video 1:</b> How to setup and use our AI Assistant Grocey.
        </>
      ),
      vimeoId: 837045187,
    },
  ];

  return (
    <div className="container">
      <div className="row">
        <div className="col-m-2">
          <GuideNav />
        </div>
        <div className="col-md-8 bg-white mt-3 mb-5">
          <h4 style={{ margin: "20px 0" }}>
            Guide <CaretRightOutlined /> Grocey Setup
          </h4>
          <hr />

          {guideVideos.map((guide) => (
            <Player
              key={guide.key}
              label={guide.label}
              vimeoId={guide.vimeoId}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Guide11;
