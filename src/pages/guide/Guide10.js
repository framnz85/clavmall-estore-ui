import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Tooltip, Pagination } from 'antd';
import { CaretRightOutlined, DownloadOutlined, CopyOutlined } from '@ant-design/icons';
import { saveAs } from 'file-saver';
import { useSelector } from "react-redux";
import { isMobile } from 'react-device-detect';
import { toast } from 'react-toastify';

import GuideNav from '../../components/nav/GuideNav';
import Player from './Player';

import { getPromote } from '../../functions/admin';

const { Meta } = Card;
const { TextArea } = Input;

const initialState = {
    progid: "613216389261e003d696cc65",
    pageSize: 9,
    current: 1,
    sortkey: "item",
    sort: -1,
    total: 0,
    type: "all"
}

const Guide10 = () => {

  const { user } = useSelector(
    (state) => ({ ...state })
  );

  const [promote, setPromote] = useState([]);
  const [showPage, setShowPage] = useState(initialState);
  const [copyDesc, setCopyDesc] = useState("Copy Description");

  useEffect(() => {
    loadPromotion(showPage.current, showPage.pageSize, showPage.type);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadPromotion = (page, pageSize, type) => {
    getPromote({ ...showPage, pageSize, current: page, type }, user.token).then(res => {
        if (res.data.err) {
          toast.error(res.data.err);
        } else {
          setPromote(res.data.promote);
          setShowPage({
              ...showPage,
              pageSize,
              current: page,
              total: res.data.total,
              type
          });
        }
    })
  }

  const downloadImage = (img) => {
      saveAs(img, "", {autoBom: true} );
  }

  const copyClipboard = (num) => {
      const copyText = document.getElementById("myInput" + num);
      copyText.select();
      copyText.setSelectionRange(0, 99999); // For mobile devices
      navigator.clipboard.writeText(copyText.value);
      setCopyDesc("Copied")
  }

  const guideVideos = [
    { key: "1", label: <><b>Video 1:</b> Instructions How To Use Premade Posts</>, vimeoId: 830064440 },
  ];

  return (
    <div className="container">
      <div className="row">
        <div className="col-m-2">
          <GuideNav />
        </div>
        <div className="col-md-8 bg-white mt-3 mb-5">
          
          <h4 style={{ margin: "20px 0" }}>Guide <CaretRightOutlined /> Premade Posts</h4>
          <hr />
          
          {guideVideos.map(guide => <Player key={guide.key} label={guide.label} vimeoId={guide.vimeoId} />)}

          {promote.map(prom => <Card
            key={prom._id}
            style={{
                width: isMobile ? "100%" : "30%",
                marginRight: isMobile ? 0 : 20,
                marginBottom: 20,
              backgroundColor: "#fafafa",
                float: "left"
            }}
            cover={
                <div align="center">
                  <img
                    alt="Promote Clavstore University"
                    src={`https://drive.google.com/uc?export=view&id=${prom.driveID}`}
                    style={{width: "80%", height: "80%", paddingTop: 20}}
                  />
                  <br /><strong>Type: {prom.type}</strong>
                </div>
            }
            actions={[
              <Tooltip title="Download Image">
                <Button
                  icon={<DownloadOutlined />}
                  style={{width: 100, fontSize: 12}}
                  onClick={() => downloadImage(`https://drive.google.com/uc?export=view&id=${prom.driveID}`)}
                >
                  Download
                </Button>
              </Tooltip>,                
              <Tooltip title={copyDesc}>
                <Button
                  icon={<CopyOutlined />}
                  style={{width: 100, fontSize: 12}}
                  onClick={() => copyClipboard(prom._id)}
                >
                  Copy
                </Button>
              </Tooltip>,
            ]}
        >
            <Meta
                title={prom.title}
                description={
                    <>
                        <TextArea
                            rows={4}
                            value={`${prom.script} \n\nTo see and buy, go to this link`}
                            id={`myInput${prom._id}`}
                        />
                    </>
                }
            />
          </Card>)}
          <div align="center" style={{clear: "both"}}>
            <Pagination
              total={showPage.total}
              pageSize={showPage.pageSize}
              current={showPage.current}
              onChange={(page, pageSize) => loadPromotion(page, pageSize, showPage.type)}
            />
          </div>
          <br /><br />
        </div>
      </div>
    </div>
    );
}
 
export default Guide10;