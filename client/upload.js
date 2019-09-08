import React, { useRef, useState } from "react";
import styled from "styled-components";
import tus from "tus-js-client";
import LoadingBar from "./loading-bar";
import { useUser } from "./user-context";
import useApi from "./api";

const UploadScreen = styled.div`
  width: 100%;
  height: 100%;
  color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 1em;
`;

const FileUpload = styled.input`
  visibility: hidden;
`;

const FileUploadLabel = styled.label`
  width: 90%;
  height: 90%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: relative;
`;

const BigEmoji = styled.span`
  font-size: 50vw;
  text-align: center;
`;

const FileUploadDescription = styled.p`
  text-align: center;
`;

export default () => {
  const fileRef = useRef();
  const [status, setStatus] = useState("START");
  const [file, setFile] = useState(null);
  const [percent, setPercent] = useState(0);
  const api = useApi();

  const user = useUser();
  if (!user) {
    return <p>Please log in to upload.</p>;
  }

  const upload = file => {
    var options = {
      endpoint: "/upload",
      chunkSize: 5 * 1024 * 1024, // Cloudflare Stream requires a minimum chunk size of 5MB.
      resume: true,
      metadata: {
        filename: file.name,
        filetype: file.type
      },
      uploadSize: file.size,
      onError: function(error) {
        throw error;
      },
      onProgress: function(bytesUploaded, bytesTotal) {
        var percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
        setPercent(percentage);
      },
      onSuccess: async () => {
        const index = upload.url.lastIndexOf("/") + 1;
        const uid = upload.url.substr(index);
        setStatus("FINALIZING");
        await api.createVid({ uid });
        setStatus("COMPLETE");
        setPercent(0);
      }
    };

    var upload = new tus.Upload(file, options);
    upload.start();
  };

  if (status === "UPLOADING" || status === "FINALIZING") {
    return (
      <UploadScreen>
        {status === "UPLOADING" ? (
          <p>uploading {file ? file.name : "unknown"}...</p>
        ) : (
          <p>creating vid...</p>
        )}
        <LoadingBar percent={percent} />
      </UploadScreen>
    );
  }

  if (status === "COMPLETE") {
    return (
      <UploadScreen
        onClick={() => {
          setFile(null);
          setStatus("START");
        }}
      >
        <BigEmoji>🔄</BigEmoji>
        <FileUploadDescription>
          Done. Tap to upload again.
        </FileUploadDescription>
      </UploadScreen>
    );
  }

  return (
    <UploadScreen>
      <FileUploadLabel>
        <FileUpload
          type="file"
          ref={fileRef}
          onChange={() => {
            const file = fileRef.current.files[0];
            if (!file) {
              return;
            }
            setStatus("UPLOADING");
            setFile(file);
            upload(file);
          }}
        />
        <BigEmoji>⏫</BigEmoji>
        <FileUploadDescription>tap to upload</FileUploadDescription>
      </FileUploadLabel>
    </UploadScreen>
  );
};
