import styled from "styled-components";
import React, { useState, useEffect } from "react";

const VideoBox = styled.div`
  width: 100vw;
  scroll-snap-align: start;
  -webkit-scroll-snap-coordinate: 0% 0%;
  z-index: 10;
`;

const VideoSquish = styled.div`
  width: 100vw;
  overflow: hidden;
  position: relative;
`;

const VideoCanvas = styled.canvas`
  width: 115vw;
  height: 204.44444vw;
  margin-left: -7.5vw;
  z-index: 2;
  position: absolute;
  top: 0;
  left: 0;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  z-index: 2;
`;

const Button = styled.button`
  display: block;
  margin: auto;
  font-size: 100%;
  font-family: inherit;
  border: 0;
  padding: 0;
  font-size: 18px;
`;

const Thumbnail = styled.div`
  width: 115vw;
  height: 204vw;
  margin-left: -7.5vw;
  z-index: 1;
  background-image: url(${props => props.bg});
  background-size: contain;
`;

export default ({ thumbnail }) => {
  const [video, setVideo] = useState(null);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    console.log("vid mount");
  }, []);
  return (
    <VideoBox>
      <VideoSquish>
        {/* <Overlay
          onClick={() => {
            if (!video) {
              return;
            }
            if (playing) {
              video.pause();
              setPlaying(false);
            } else {
              video.play();
            }
          }}
        >
          <Button>{playing ? "" : "▶️"}</Button>
        </Overlay> */}
        <VideoCanvas />
        <Thumbnail bg={`${thumbnail}`} />
        {/* <Video
          playsInline
          poster={`/vids/${href}.png`}
          // src={`/vids/${href}`}
          src={"/playlist.m3u8"}
          ref={ref => {
            setVideo(ref);
          }}
          onPlay={() => {
            setPlaying(true);
          }}
        /> */}
      </VideoSquish>
    </VideoBox>
  );
};
