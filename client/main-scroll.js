import React from "react";
import styled from "styled-components";
import Vid from "./vid";

const Middle = styled.div`
  position: relative;
  height: 100%;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  -webkit-overflow-scrolling: touch;
  height: calc(100vh - 75px);
`;

export default React.memo(({ vids, onScroll, children, mainScrollRef }) => {
  console.log("scroll render");
  return (
    <Middle onScroll={onScroll} ref={mainScrollRef}>
      {vids.map((vid, i) => (
        <Vid key={vid.file} {...vid} />
      ))}
      {children}
    </Middle>
  );
});
