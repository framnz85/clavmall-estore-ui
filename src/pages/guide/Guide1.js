import React from 'react'
import { CaretRightOutlined } from '@ant-design/icons';

import GuideNav from '../../components/nav/GuideNav';
import Player from './Player';

const Guide1 = () => {
  const guideVideos = [
    { key: "1", label: <><b>Video 1:</b> How to setup your Homepage</>, vimeoId: 741419579 },
    { key: "2", label: <><b>Video 2:</b> Creating 1120 x 220 pixel image in MS Paint</>, vimeoId: 741422508 },
    { key: "3", label: <><b>Video 3:</b> Creating 1120 x 220 pixel image in Canva</>, vimeoId: 741424480 }
  ];
  
  return (
    <div className="container">
      <div className="row">
        <div className="col-m-2">
          <GuideNav />
        </div>
        <div className="col-md-8 bg-white mt-3 mb-5">
          
          <h4 style={{ margin: "20px 0" }}>Guide <CaretRightOutlined /> Setting Manage Home</h4>
          <hr />
          
          {guideVideos.map(guide => <Player key={guide.key} label={guide.label} vimeoId={guide.vimeoId} />)}
          
        </div>
      </div>
    </div>
  );
}
 
export default Guide1;