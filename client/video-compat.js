import React from "react";
import debugVideo from "./debug-video";

let HlsProm = null;

export default React.forwardRef((props, parentRef) => {
  // non-Safari browser support. attempting to implement this while providing near-zero impact on
  // the more important Safari case
  const ref = video => {
    // debugVideo(video);
    if (video && !video.canPlayType("application/vnd.apple.mpegurl")) {
      if (HlsProm === null) {
        HlsProm = import("hls.js");
      }
      HlsProm.then(Hls => {
        const hls = new Hls();
        hls.attachMedia(video);
        hls.on(Hls.Events.MEDIA_ATTACHED, function() {
          hls.loadSource(props.src);
          hls.on(Hls.Events.MANIFEST_PARSED, function(event, data) {
            video.play();
          });
        });
      });
    }
    if (typeof parentRef === "function") {
      return parentRef(video);
    } else {
      parentRef.current = video;
    }
  };

  return (
    <video {...props} ref={ref}>
      {props.children}
    </video>
  );
});
