import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import VideoCompat from "./video-compat";

const VideoSquish = styled.div`
  width: 100vw;
  overflow-x: hidden;
  position: fixed;
  left: 0px;
  top: ${props => props.top}px;
  z-index: 100;
  opacity: 0;
  z-index: 0;
  display: ${props => (props.visible ? "block" : "none")};
  ${props =>
    props.fixed &&
    `
    position: fixed;
    width: 90px;
    height: 160px;
    top: 10px;
    left: 10px;
    background-color: green;
    z-index: 9999;
    opacity: 1;
  `}
`;

const Video = styled(VideoCompat)`
  width: 115vw;
  margin-left: -7.5vw;
  z-index: 100;
  background-color: black;
`;

export default props => {
  const { src, videoRef, fixed, visible } = props;
  const top = 0;
  const video = useRef();
  return (
    <VideoSquish
      top={top}
      visible={visible}
      fixed={fixed}
      onClick={() => {
        video.play();
      }}
    >
      <Video
        onClick={() => {
          // video.play();
        }}
        onTouchEnd={() => {
          // video.play();
        }}
        src={src}
        ref={videoRef}
        onPlaying={() => {
          props.onPlaying && props.onPlaying();
        }}
        onCanPlayThrough={() => {
          console.log("canplaythrough");
        }}
        onSeeking={e => {
          console.log("seeking");
          props.onSeeking(e);
        }}
        onSeeked={e => {
          console.log("seeked");
          props.onSeeked(e);
        }}
        playsInline
      />
    </VideoSquish>
  );
};
