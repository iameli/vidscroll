import styled from "styled-components";
import React, { useRef } from "react";
import { useUser } from "../user-context";

const PadBox = styled.label`
  padding: 10px;
  cursor: ${props => (props.isMe ? "pointer" : "default")};
`;

const AvatarBox = styled.div`
  padding-top: 100%;
  position: relative;
`;

const AvatarCircle = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid #ccc;
  background-image: url(${({ userId }) => `/users/${userId}/avatar.jpg`});
`;

const FileUpload = styled.input`
  display: none;
`;

export default ({ userId }) => {
  const user = useUser();
  const uploadRef = useRef();
  const isMe = user && user.id === userId;
  return (
    <PadBox
      isMe={isMe}
      onClick={() => {
        if (!uploadRef.current) {
          return;
        }
      }}
    >
      {isMe && <FileUpload type="file" ref={uploadRef} />}
      <AvatarBox isMe={isMe}>
        <AvatarCircle userId={userId} />
      </AvatarBox>
    </PadBox>
  );
};
