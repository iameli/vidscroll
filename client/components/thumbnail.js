import React, { useEffect, useState } from "react";
import styled from "styled-components";
import useApi from "../api";
import { useUser } from "../user-context";

const Box = styled.div`
  padding-top: 144%;
  position: relative;
  background-color: black;
  cursor: pointer;
`;

const Content = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
`;

const DebugText = styled.div`
  z-index: 1001;
  position: absolute;
  height: 100%;
  width: 100%;
  top: 5px;
  right: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000,
    1px 1px 0 #000;
`;

export default ({ vidId, onClick }) => {
  const [vid, setVid] = useState(null);
  const [publishing, setPublishing] = useState(false);
  const api = useApi();
  const user = useUser();
  useEffect(() => {
    api.getVid(vidId).then(setVid);
  }, [vidId, publishing]);

  if (!vid) {
    return <Box />;
  }

  let state = "";
  if (publishing) {
    state = "publishing";
  } else if (vid.stream.result.status.state !== "ready") {
    state = vid.stream.result.status.state;
  } else if (!vid.published) {
    state = "unpublished";
  }

  const myVid = user.id === vid.userId;

  return (
    <Box
      onClick={async () => {
        if (!vid) {
          return;
        }
        if (vid.published) {
          return;
        }
        if (state === "unpublished" && myVid) {
          setPublishing(true);
          await api.publishVid(vidId);
          setPublishing(false);
        }
      }}
    >
      <DebugText>
        <span>{state}</span>
      </DebugText>
      <Content
        src={`https://cloudflarestream.com/${vid.uid}/thumbnails/thumbnail.gif?time=0s&height=200&duration=4s`}
      />
    </Box>
  );
};
