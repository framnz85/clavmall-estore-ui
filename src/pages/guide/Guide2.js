import React from 'react'
import { CaretRightOutlined } from '@ant-design/icons';

import GuideNav from '../../components/nav/GuideNav';
import Player from './Player';

const Guide1 = () => {
  const guideVideos = [
    { key: "1", label: <><b>Video 1:</b> Adding, Editing, and Removing Categories</>, vimeoId: 741592780 },
  ];

  return (
    <div className="container">
      <div className="row">
        <div className="col-m-2">
          <GuideNav />
        </div>
        <div className="col-md-8 bg-white mt-3 mb-5">
          
          <h4 style={{ margin: "20px 0" }}>Guide <CaretRightOutlined /> Managing Categories</h4>
          <hr />
          
          {guideVideos.map(guide => <Player key={guide.key} label={guide.label} vimeoId={guide.vimeoId} />)}

        </div>
      </div>
    </div>
    );
}
 
export default Guide1;