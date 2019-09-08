import React, { useState, useEffect, useCallback, useRef } from "react";
import styled from "styled-components";
import fetch from "isomorphic-fetch";
import Vid from "./vid";
import OneVideo from "./one-video";
import MainScroll from "./main-scroll";
import manifestToData from "./manifest-to-data";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(100vh - 75px);
  display: flex;
  z-index: 500;
  background-color: rgba(0, 0, 0, 0.5);
`;

const PlayButton = styled.div`
  font-size: 72px;
  margin: auto;
  background-color: transparent;
  border: none;
`;

/**
 * Compare two pixels, see if they're the same
 */
const samePixel = (p1, p2) => {
  // Pixels are just [r,g,b,a], so:
  for (let i = 0; i < 4; i += 1) {
    if (p1[i] !== p2[i]) {
      return false;
    }
  }
  return true;
};

export default () => {
  const [vids, setVids] = useState([]);
  const centerRef = useRef(0);
  const mainScrollRef = useRef();
  const videoRef = useRef();
  const [started, setStarted] = useState(false);
  const canvas = useRef();
  const seekRef = useRef(true);
  const context = useRef();
  const seekPixel = useRef();

  useEffect(() => {
    fetch("/stream_1.m3u8").then(async res => {
      const text = await res.text();
      const data = manifestToData(text);
      console.log(data);
      setVids(data);
    });
  }, []);

  const recomputeCenter = () => {
    let first = true;
    if (context.current) {
      first = false;
      seekPixel.current = context.current.getImageData(0, 0, 1, 1).data;
    }
    const mainScroll = mainScrollRef.current;
    const child = mainScroll && mainScroll.children[centerRef.current];
    if (!child) {
      console.log("no child", mainScroll, centerRef.current);
      return;
    }
    canvas.current = child.querySelector("canvas");
    if (!first) {
      canvas.current.style.visibility = "hidden";
    }
    canvas.current.width = canvas.current.clientWidth;
    canvas.current.height = canvas.current.clientHeight;
    context.current = canvas.current.getContext("2d");
  };

  useEffect(() => {
    if (!started) {
      return;
    }
    recomputeCenter();
    let cancel = false;
    const frame = () => {
      if (cancel) {
        console.log("ending main render loop");
        return;
      }
      requestAnimationFrame(frame);
      if (seekRef.current === true || !videoRef.current) {
        // console.log("seeking, no render");
        return;
      }
      context.current.drawImage(
        videoRef.current,
        0,
        0,
        canvas.current.clientWidth,
        canvas.current.clientHeight
      );
      if (seekPixel.current) {
        const newPixel = context.current.getImageData(0, 0, 1, 1).data;
        if (!samePixel(seekPixel.current, newPixel)) {
          canvas.current.style.visibility = "visible";
          seekPixel.current = null;
        }
      } else {
        // Loop
        const { currentTime } = videoRef.current;
        const { offset, duration } = vids[centerRef.current];
        if (currentTime >= offset + duration - 0.2) {
          seekRef.current = true;
          videoRef.current.currentTime = offset;
        }
      }
    };
    console.log("starting main render loop");
    requestAnimationFrame(frame);
    return () => {
      cancel = true;
    };
  }, [started]);

  const onScroll = useCallback(
    e => {
      const center = centerRef.current;
      const mainScroll = mainScrollRef.current;
      const scrollTop = mainScroll.scrollTop;
      const prevChild = mainScroll.children[center - 1];
      const thisChild = mainScroll.children[center];
      const nextChild = mainScroll.children[center + 1];

      let dPrev = Number.POSITIVE_INFINITY;
      let dNext = Number.POSITIVE_INFINITY;
      if (!thisChild) {
        return center;
      }
      let dThis = Math.abs(scrollTop - thisChild.offsetTop);
      if (prevChild) {
        dPrev = Math.abs(scrollTop - prevChild.offsetTop);
      }
      if (nextChild) {
        dNext = Math.abs(scrollTop - nextChild.offsetTop);
      }

      if (dPrev < dThis) {
        console.log("center down to " + (center - 1));
        seekRef.current = true;
        centerRef.current = center - 1;
      } else if (dNext < dThis) {
        console.log("center up to " + (center + 1));
        seekRef.current = true;
        centerRef.current = center + 1;
      }
      if (centerRef.current !== center) {
        if (!videoRef.current) {
          return;
        }
        videoRef.current.currentTime = vids[centerRef.current].offset;
        recomputeCenter();
      }
    },
    [vids]
  );

  const handlePlay = () => {
    console.log("handlePlay");
    if (!started && videoRef.current) {
      const video = videoRef.current;
      const start = () => {
        setStarted(true);
        video.removeEventListener("playing", start);
      };
      video.addEventListener("playing", start);
      video.play();
    }
  };

  return (
    <>
      {!started && (
        <Overlay onClick={handlePlay} onTouchEnd={handlePlay}>
          <PlayButton>⏯</PlayButton>
        </Overlay>
      )}
      <MainScroll
        vids={vids}
        mainScrollRef={mainScrollRef}
        onScroll={onScroll}
        // onTouchEnd={e => {
        //   if (!started && video) {
        //     video.play();
        //     setStarted(true);
        //   }
        // }}
        // onClick={e => {
        //   if (!started && video) {
        //     video.play();
        //     setStarted(true);
        //   }
        // }}
      ></MainScroll>
      <OneVideo
        // visible={true}
        onSeeking={() => {
          // console.log("seeking, truing");
          seekRef.current = true;
        }}
        onSeeked={() => {
          // console.log("seeked, falsing");
          seekRef.current = false;
        }}
        onPlaying={() => {
          // console.log("onPlaying!!!");
          seekRef.current = false;
        }}
        videoRef={videoRef}
        src={"/video.m3u8"}
        fixed
      />
    </>
  );
};
