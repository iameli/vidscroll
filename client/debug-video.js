// function that prints out every video event for a <video>
const EVENTS = [
  "abort",
  "canplay",
  "canplaythrough",
  "durationchange",
  "emptied",
  "encrypted",
  "ended",
  "error",
  "interruptbegin",
  "interruptend",
  "loadeddata",
  "loadedmetadata",
  "loadstart",
  "mozaudioavailable",
  "pause",
  "play",
  "playing",
  "progress",
  "ratechange",
  "seeked",
  "seeking",
  "stalled",
  "suspend",
  "timeupdate",
  "volumechange",
  "waiting"
];

const VideoSet = new Set();

export default video => {
  if (!video) {
    return;
  }
  if (VideoSet.has(video)) {
    return;
  }
  VideoSet.add(video);
  for (const event of EVENTS) {
    video.addEventListener(event, e => {
      console.log(`[debug-video] ${event}`);
    });
  }
};
