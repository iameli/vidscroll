export const combinedMaster = `#EXTM3U
#EXT-X-VERSION:6
#EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="group_audio",NAME="audio_0",DEFAULT=YES,URI="stream_0.m3u8"
#EXT-X-STREAM-INF:RESOLUTION=136x240,CODECS="avc1.42c014,mp4a.40.2",BANDWIDTH=580800,AUDIO="group_audio"
stream_1.m3u8
#EXT-X-STREAM-INF:RESOLUTION=202x360,CODECS="avc1.4d4014,mp4a.40.2",BANDWIDTH=1020800,AUDIO="group_audio"
stream_2.m3u8
#EXT-X-STREAM-INF:RESOLUTION=270x480,CODECS="avc1.4d4015,mp4a.40.2",BANDWIDTH=2120800,AUDIO="group_audio"
stream_3.m3u8
#EXT-X-STREAM-INF:RESOLUTION=406x720,CODECS="avc1.4d401e,mp4a.40.2",BANDWIDTH=4100800,AUDIO="group_audio"
stream_4.m3u8`;

export const testMaster = {
  allowCache: true,
  discontinuityStarts: [],
  segments: [],
  mediaGroups: {
    AUDIO: {
      group_audio: {
        audio_0: { default: true, autoselect: true, uri: "stream_0.m3u8" }
      }
    },
    VIDEO: {},
    "CLOSED-CAPTIONS": {},
    SUBTITLES: {}
  },
  playlists: [
    {
      attributes: {
        AUDIO: "group_audio",
        BANDWIDTH: 580800,
        CODECS: "avc1.42c014,mp4a.40.2",
        RESOLUTION: { width: 136, height: 240 }
      },
      uri: "stream_1.m3u8",
      timeline: 0
    },
    {
      attributes: {
        AUDIO: "group_audio",
        BANDWIDTH: 1020800,
        CODECS: "avc1.4d4014,mp4a.40.2",
        RESOLUTION: { width: 202, height: 360 }
      },
      uri: "stream_2.m3u8",
      timeline: 0
    },
    {
      attributes: {
        AUDIO: "group_audio",
        BANDWIDTH: 2120800,
        CODECS: "avc1.4d4015,mp4a.40.2",
        RESOLUTION: { width: 270, height: 480 }
      },
      uri: "stream_3.m3u8",
      timeline: 0
    },
    {
      attributes: {
        AUDIO: "group_audio",
        BANDWIDTH: 4100800,
        CODECS: "avc1.4d401e,mp4a.40.2",
        RESOLUTION: { width: 406, height: 720 }
      },
      uri: "stream_4.m3u8",
      timeline: 0
    },
    {
      attributes: {
        AUDIO: "group_audio",
        BANDWIDTH: 5860800,
        CODECS: "avc1.4d401f,mp4a.40.2",
        RESOLUTION: { width: 608, height: 1080 }
      },
      uri: "stream_5.m3u8",
      timeline: 0
    }
  ]
};

export const testMasterPrinted = `#EXTM3U
#EXT-X-VERSION:6
#EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="group_audio",NAME="audio_0",DEFAULT=YES,URI="stream_0.m3u8"
#EXT-X-STREAM-INF:RESOLUTION=136x240,CODECS="avc1.42c014,mp4a.40.2",BANDWIDTH=580800,AUDIO="group_audio"
stream_1.m3u8
#EXT-X-STREAM-INF:RESOLUTION=202x360,CODECS="avc1.4d4014,mp4a.40.2",BANDWIDTH=1020800,AUDIO="group_audio"
stream_2.m3u8
#EXT-X-STREAM-INF:RESOLUTION=270x480,CODECS="avc1.4d4015,mp4a.40.2",BANDWIDTH=2120800,AUDIO="group_audio"
stream_3.m3u8
#EXT-X-STREAM-INF:RESOLUTION=406x720,CODECS="avc1.4d401e,mp4a.40.2",BANDWIDTH=4100800,AUDIO="group_audio"
stream_4.m3u8
#EXT-X-STREAM-INF:RESOLUTION=608x1080,CODECS="avc1.4d401f,mp4a.40.2",BANDWIDTH=5860800,AUDIO="group_audio"
stream_5.m3u8`;

export const testMediaPrinted = `#EXTM3U
#EXT-X-PLAYLIST-TYPE:VOD
#EXT-X-VERSION:6
#EXT-X-INDEPENDENT-SEGMENTS
#EXT-X-MEDIA-SEQUENCE:0
#EXT-X-TARGETDURATION:4
#EXTINF:4.004,
https://videodelivery.net/4c0e44fb7aa83ca78a01689979617e91/video/240/stream_1-seg_0.ts
#EXTINF:4.004,
https://videodelivery.net/4c0e44fb7aa83ca78a01689979617e91/video/240/stream_1-seg_1.ts
#EXTINF:4.004,
https://videodelivery.net/4c0e44fb7aa83ca78a01689979617e91/video/240/stream_1-seg_2.ts
#EXTINF:4.004,
https://videodelivery.net/4c0e44fb7aa83ca78a01689979617e91/video/240/stream_1-seg_3.ts
#EXTINF:4.004,
https://videodelivery.net/4c0e44fb7aa83ca78a01689979617e91/video/240/stream_1-seg_4.ts
#EXTINF:4.004,
https://videodelivery.net/4c0e44fb7aa83ca78a01689979617e91/video/240/stream_1-seg_5.ts
#EXTINF:4.004,
https://videodelivery.net/4c0e44fb7aa83ca78a01689979617e91/video/240/stream_1-seg_6.ts
#EXTINF:4.004,
https://videodelivery.net/4c0e44fb7aa83ca78a01689979617e91/video/240/stream_1-seg_7.ts
#EXTINF:4.004,
https://videodelivery.net/4c0e44fb7aa83ca78a01689979617e91/video/240/stream_1-seg_8.ts
#EXTINF:4.004,
https://videodelivery.net/4c0e44fb7aa83ca78a01689979617e91/video/240/stream_1-seg_9.ts
#EXTINF:4.004,
https://videodelivery.net/4c0e44fb7aa83ca78a01689979617e91/video/240/stream_1-seg_10.ts
#EXTINF:4.004,
https://videodelivery.net/4c0e44fb7aa83ca78a01689979617e91/video/240/stream_1-seg_11.ts
#EXTINF:4.004,
https://videodelivery.net/4c0e44fb7aa83ca78a01689979617e91/video/240/stream_1-seg_12.ts
#EXTINF:4.004,
https://videodelivery.net/4c0e44fb7aa83ca78a01689979617e91/video/240/stream_1-seg_13.ts
#EXTINF:0.934,
https://videodelivery.net/4c0e44fb7aa83ca78a01689979617e91/video/240/stream_1-seg_14.ts
#EXT-X-ENDLIST`;

export const testMediaCombined = `#EXTM3U
#EXT-X-PLAYLIST-TYPE:VOD
#EXT-X-VERSION:6
#EXT-X-INDEPENDENT-SEGMENTS
#EXT-X-MEDIA-SEQUENCE:0
#EXT-X-TARGETDURATION:4
#EXTINF:4.004,
https://videodelivery.net/4c0e44fb7aa83ca78a01689979617e91/video/240/stream_1-seg_0.ts
#EXTINF:4.004,
https://videodelivery.net/4c0e44fb7aa83ca78a01689979617e91/video/240/stream_1-seg_1.ts
#EXTINF:4.004,
https://videodelivery.net/4c0e44fb7aa83ca78a01689979617e91/video/240/stream_1-seg_2.ts
#EXTINF:4.004,
https://videodelivery.net/4c0e44fb7aa83ca78a01689979617e91/video/240/stream_1-seg_3.ts
#EXTINF:4.004,
https://videodelivery.net/4c0e44fb7aa83ca78a01689979617e91/video/240/stream_1-seg_4.ts
#EXTINF:4.004,
https://videodelivery.net/4c0e44fb7aa83ca78a01689979617e91/video/240/stream_1-seg_5.ts
#EXTINF:4.004,
https://videodelivery.net/4c0e44fb7aa83ca78a01689979617e91/video/240/stream_1-seg_6.ts
#EXTINF:4.004,
https://videodelivery.net/4c0e44fb7aa83ca78a01689979617e91/video/240/stream_1-seg_7.ts
#EXTINF:4.004,
https://videodelivery.net/4c0e44fb7aa83ca78a01689979617e91/video/240/stream_1-seg_8.ts
#EXTINF:4.004,
https://videodelivery.net/4c0e44fb7aa83ca78a01689979617e91/video/240/stream_1-seg_9.ts
#EXTINF:4.004,
https://videodelivery.net/4c0e44fb7aa83ca78a01689979617e91/video/240/stream_1-seg_10.ts
#EXTINF:4.004,
https://videodelivery.net/4c0e44fb7aa83ca78a01689979617e91/video/240/stream_1-seg_11.ts
#EXTINF:4.004,
https://videodelivery.net/4c0e44fb7aa83ca78a01689979617e91/video/240/stream_1-seg_12.ts
#EXTINF:4.004,
https://videodelivery.net/4c0e44fb7aa83ca78a01689979617e91/video/240/stream_1-seg_13.ts
#EXTINF:0.934,
https://videodelivery.net/4c0e44fb7aa83ca78a01689979617e91/video/240/stream_1-seg_14.ts
#EXT-X-DISCONTINUITY
#EXTINF:4.004,
https://videodelivery.net/5d60445d3fff6a4ce31937a86895e395/video/240/stream_1-seg_0.ts
#EXTINF:4.004,
https://videodelivery.net/5d60445d3fff6a4ce31937a86895e395/video/240/stream_1-seg_1.ts
#EXTINF:4.004,
https://videodelivery.net/5d60445d3fff6a4ce31937a86895e395/video/240/stream_1-seg_2.ts
#EXTINF:3.036,
https://videodelivery.net/5d60445d3fff6a4ce31937a86895e395/video/240/stream_1-seg_3.ts
#EXT-X-DISCONTINUITY
#EXTINF:4.004,
https://videodelivery.net/df842ccace22d1c45e345c977bbec89f/video/240/stream_1-seg_0.ts
#EXTINF:4.004,
https://videodelivery.net/df842ccace22d1c45e345c977bbec89f/video/240/stream_1-seg_1.ts
#EXTINF:4.004,
https://videodelivery.net/df842ccace22d1c45e345c977bbec89f/video/240/stream_1-seg_2.ts
#EXTINF:3.036,
https://videodelivery.net/df842ccace22d1c45e345c977bbec89f/video/240/stream_1-seg_3.ts
#EXT-X-DISCONTINUITY
#EXTINF:4.000,
https://videodelivery.net/c66e998c426d56a4e35d4a3ea4f4937c/video/240/stream_1-seg_0.ts
#EXTINF:4.000,
https://videodelivery.net/c66e998c426d56a4e35d4a3ea4f4937c/video/240/stream_1-seg_1.ts
#EXTINF:0.833,
https://videodelivery.net/c66e998c426d56a4e35d4a3ea4f4937c/video/240/stream_1-seg_2.ts
#EXT-X-DISCONTINUITY
#EXTINF:4.000,
https://videodelivery.net/5fcd7f8dfc6efbed04e7acc7a47ad860/video/240/stream_1-seg_0.ts
#EXTINF:4.000,
https://videodelivery.net/5fcd7f8dfc6efbed04e7acc7a47ad860/video/240/stream_1-seg_1.ts
#EXTINF:4.000,
https://videodelivery.net/5fcd7f8dfc6efbed04e7acc7a47ad860/video/240/stream_1-seg_2.ts
#EXTINF:3.633,
https://videodelivery.net/5fcd7f8dfc6efbed04e7acc7a47ad860/video/240/stream_1-seg_3.ts
#EXT-X-DISCONTINUITY
#EXTINF:4.000,
https://videodelivery.net/89fbb0b31dd281157e73e682a231c13e/video/240/stream_1-seg_0.ts
#EXTINF:4.000,
https://videodelivery.net/89fbb0b31dd281157e73e682a231c13e/video/240/stream_1-seg_1.ts
#EXTINF:4.000,
https://videodelivery.net/89fbb0b31dd281157e73e682a231c13e/video/240/stream_1-seg_2.ts
#EXTINF:4.000,
https://videodelivery.net/89fbb0b31dd281157e73e682a231c13e/video/240/stream_1-seg_3.ts
#EXTINF:1.533,
https://videodelivery.net/89fbb0b31dd281157e73e682a231c13e/video/240/stream_1-seg_4.ts
#EXT-X-ENDLIST`;
