import React, { useEffect, useState } from "react";
import { useUser } from "./user-context";
import { Redirect } from "react-router-dom";
import { Button, Thumbnail, Avatar } from "./components";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import useApi from "./api";

const PageBox = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  padding: 1em;
  flex-direction: column;
  justify-content: flex-start;
`;

const ThumbnailGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-column-gap: 5px;
  grid-row-gap: 5px;
  padding: 5px 0;
`;

const BigName = styled.h1`
  text-align: center;
  margin-bottom: 5px;
`;

export default ({ setUserContext }) => {
  const { username } = useParams();
  const user = useUser();
  const api = useApi();
  const [vids, setVids] = useState([]);

  useEffect(() => {
    setVids([]);
    if (!user) {
      return;
    }
    api.getUserVids({ userId: user.id }).then(setVids);
  }, [user]);

  if (!username) {
    if (user) {
      return <Redirect to={`/user/${user.username}`} />;
    } else {
      return <Redirect to="/user/login" />;
    }
  }

  if (!user) {
    return (
      <PageBox>
        <BigName>{username}</BigName>
      </PageBox>
    );
  }
  return (
    <PageBox>
      <BigName>{username}</BigName>
      <ThumbnailGrid>
        <div></div>
        <Avatar userId={user.id} />
        <div></div>
        {vids.map(id => (
          <Thumbnail key={id} vidId={id} />
        ))}
      </ThumbnailGrid>
      <Button onClick={() => setUserContext(null)}>Log out</Button>
    </PageBox>
  );
};
