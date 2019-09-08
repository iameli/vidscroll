import manifestToData from "./manifest-to-data";

describe("manifestToData", () => {
  it("should turn manifest to data", () => {
    const data = manifestToData(manifestData);
    expect(data).toEqual(expectedData);
  });
});

const manifestData = `#EXTM3U
#EXT-X-PLAYLIST-TYPE:VOD
#EXT-X-VERSION:6
#EXT-X-INDEPENDENT-SEGMENTS
#EXT-X-MEDIA-SEQUENCE:0
#EXT-X-TARGETDURATION:4
#EXTINF:4.004,
https://videodelivery.net/7c28ec7c4c71d7ddfe23a50fee0d4f14/video/240/stream_1-seg_0.ts
#EXTINF:4.004,
https://videodelivery.net/7c28ec7c4c71d7ddfe23a50fee0d4f14/video/240/stream_1-seg_1.ts
#EXTINF:4.004,
https://videodelivery.net/7c28ec7c4c71d7ddfe23a50fee0d4f14/video/240/stream_1-seg_2.ts
#EXTINF:3.036367,
https://videodelivery.net/7c28ec7c4c71d7ddfe23a50fee0d4f14/video/240/stream_1-seg_3.ts
#EXT-X-DISCONTINUITY
#EXTINF:4.004,
https://videodelivery.net/27882f7ff363cc81ff7e0d3454429363/video/240/stream_1-seg_0.ts
#EXTINF:4.004,
https://videodelivery.net/27882f7ff363cc81ff7e0d3454429363/video/240/stream_1-seg_1.ts
#EXTINF:4.004,
https://videodelivery.net/27882f7ff363cc81ff7e0d3454429363/video/240/stream_1-seg_2.ts
#EXTINF:3.036367,
https://videodelivery.net/27882f7ff363cc81ff7e0d3454429363/video/240/stream_1-seg_3.ts
#EXT-X-DISCONTINUITY
#EXTINF:4,
https://videodelivery.net/673f16cc90fe79e2ef11f030a8571e44/video/240/stream_1-seg_0.ts
#EXTINF:4,
https://videodelivery.net/673f16cc90fe79e2ef11f030a8571e44/video/240/stream_1-seg_1.ts
#EXTINF:4,
https://videodelivery.net/673f16cc90fe79e2ef11f030a8571e44/video/240/stream_1-seg_2.ts
#EXTINF:3.633333,
https://videodelivery.net/673f16cc90fe79e2ef11f030a8571e44/video/240/stream_1-seg_3.ts
#EXT-X-DISCONTINUITY
#EXTINF:4,
https://videodelivery.net/e081009a78d3d9433653d745d34339f8/video/240/stream_1-seg_0.ts
#EXTINF:4,
https://videodelivery.net/e081009a78d3d9433653d745d34339f8/video/240/stream_1-seg_1.ts
#EXTINF:0.833333,
https://videodelivery.net/e081009a78d3d9433653d745d34339f8/video/240/stream_1-seg_2.ts
#EXT-X-DISCONTINUITY
#EXTINF:4.004,
https://videodelivery.net/6b0be51736e3c3ad33a890f6b1501fc3/video/240/stream_1-seg_0.ts
#EXTINF:4.004,
https://videodelivery.net/6b0be51736e3c3ad33a890f6b1501fc3/video/240/stream_1-seg_1.ts
#EXTINF:4.004,
https://videodelivery.net/6b0be51736e3c3ad33a890f6b1501fc3/video/240/stream_1-seg_2.ts
#EXTINF:4.004,
https://videodelivery.net/6b0be51736e3c3ad33a890f6b1501fc3/video/240/stream_1-seg_3.ts
#EXTINF:4.004,
https://videodelivery.net/6b0be51736e3c3ad33a890f6b1501fc3/video/240/stream_1-seg_4.ts
#EXTINF:4.004,
https://videodelivery.net/6b0be51736e3c3ad33a890f6b1501fc3/video/240/stream_1-seg_5.ts
#EXTINF:4.004,
https://videodelivery.net/6b0be51736e3c3ad33a890f6b1501fc3/video/240/stream_1-seg_6.ts
#EXTINF:4.004,
https://videodelivery.net/6b0be51736e3c3ad33a890f6b1501fc3/video/240/stream_1-seg_7.ts
#EXTINF:4.004,
https://videodelivery.net/6b0be51736e3c3ad33a890f6b1501fc3/video/240/stream_1-seg_8.ts
#EXTINF:4.004,
https://videodelivery.net/6b0be51736e3c3ad33a890f6b1501fc3/video/240/stream_1-seg_9.ts
#EXTINF:4.004,
https://videodelivery.net/6b0be51736e3c3ad33a890f6b1501fc3/video/240/stream_1-seg_10.ts
#EXTINF:4.004,
https://videodelivery.net/6b0be51736e3c3ad33a890f6b1501fc3/video/240/stream_1-seg_11.ts
#EXTINF:4.004,
https://videodelivery.net/6b0be51736e3c3ad33a890f6b1501fc3/video/240/stream_1-seg_12.ts
#EXTINF:4.004,
https://videodelivery.net/6b0be51736e3c3ad33a890f6b1501fc3/video/240/stream_1-seg_13.ts
#EXTINF:0.934267,
https://videodelivery.net/6b0be51736e3c3ad33a890f6b1501fc3/video/240/stream_1-seg_14.ts
#EXT-X-DISCONTINUITY
#EXTINF:4,
https://videodelivery.net/719f223e05bd2c5e6429bb2ba9ad96ba/video/240/stream_1-seg_0.ts
#EXTINF:4,
https://videodelivery.net/719f223e05bd2c5e6429bb2ba9ad96ba/video/240/stream_1-seg_1.ts
#EXTINF:4,
https://videodelivery.net/719f223e05bd2c5e6429bb2ba9ad96ba/video/240/stream_1-seg_2.ts
#EXTINF:4,
https://videodelivery.net/719f223e05bd2c5e6429bb2ba9ad96ba/video/240/stream_1-seg_3.ts
#EXTINF:1.533333,
https://videodelivery.net/719f223e05bd2c5e6429bb2ba9ad96ba/video/240/stream_1-seg_4.ts
#EXT-X-DISCONTINUITY
#EXTINF:4.004,
https://videodelivery.net/7c28ec7c4c71d7ddfe23a50fee0d4f14/video/240/stream_1-seg_0.ts
#EXTINF:4.004,
https://videodelivery.net/7c28ec7c4c71d7ddfe23a50fee0d4f14/video/240/stream_1-seg_1.ts
#EXTINF:4.004,
https://videodelivery.net/7c28ec7c4c71d7ddfe23a50fee0d4f14/video/240/stream_1-seg_2.ts
#EXTINF:3.036367,
https://videodelivery.net/7c28ec7c4c71d7ddfe23a50fee0d4f14/video/240/stream_1-seg_3.ts
#EXT-X-ENDLIST`;

const expectedData = [
  {
    duration: 15.048366999999999,
    offset: 0,
    thumbnail:
      "https://cloudflarestream.com/7c28ec7c4c71d7ddfe23a50fee0d4f14/thumbnails/thumbnail.jpg?time=0s&height=720"
  },
  {
    duration: 15.048366999999999,
    offset: 15.048366999999999,
    thumbnail:
      "https://cloudflarestream.com/27882f7ff363cc81ff7e0d3454429363/thumbnails/thumbnail.jpg?time=0s&height=720"
  },
  {
    duration: 15.633333,
    offset: 30.096733999999998,
    thumbnail:
      "https://cloudflarestream.com/673f16cc90fe79e2ef11f030a8571e44/thumbnails/thumbnail.jpg?time=0s&height=720"
  },
  {
    duration: 8.833333,
    offset: 45.730067,
    thumbnail:
      "https://cloudflarestream.com/e081009a78d3d9433653d745d34339f8/thumbnails/thumbnail.jpg?time=0s&height=720"
  },
  {
    duration: 56.990266999999974,
    offset: 54.5634,
    thumbnail:
      "https://cloudflarestream.com/6b0be51736e3c3ad33a890f6b1501fc3/thumbnails/thumbnail.jpg?time=0s&height=720"
  },
  {
    duration: 17.533333,
    offset: 111.55366699999998,
    thumbnail:
      "https://cloudflarestream.com/719f223e05bd2c5e6429bb2ba9ad96ba/thumbnails/thumbnail.jpg?time=0s&height=720"
  },
  {
    duration: 15.048366999999999,
    offset: 129.087,
    thumbnail:
      "https://cloudflarestream.com/7c28ec7c4c71d7ddfe23a50fee0d4f14/thumbnails/thumbnail.jpg?time=0s&height=720"
  }
];
