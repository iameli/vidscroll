import makeDebug from "debug";
import path from "path";

const debug = makeDebug("vidscroll:ManifestCombiner");

const ATTR_ORDER = {
  RESOLUTION: 0,
  CODECS: 1,
  BANDWIDTH: 2,
  AUDIO: 3
};

const resolve = (root, ...relPath) => {
  const url = new URL(root);
  url.pathname = path.resolve(url.pathname, ...relPath);
  return `${url}`;
};

export default class ManifestCombiner {
  constructor(manifests, opts = {}) {
    if (opts.webRoot) {
      this.webRootUrl = new URL(opts.webRoot);
    }
    this.manifests = manifests || [];
  }

  push(manifest) {
    debug(`push(${manifest.uid})`);
    this.manifests.push(manifest);
  }

  get(name) {
    debug(`get(${name})`);
    if (this.manifests.length === 0) {
      throw new Error("no data");
    }
    if (name === "video.m3u8") {
      const firstMaster = this.manifests[0].master;
      const renditions = new Set(firstMaster.playlists.map(p => p.uri));
      for (const manifest of this.manifests) {
        const myRenditions = new Set(manifest.master.playlists.map(p => p.uri));
        for (const rendition of renditions) {
          if (!myRenditions.has(rendition)) {
            debug(
              `${manifest.uid} doesn't have rendition ${rendition}, removing.`
            );
            renditions.delete(rendition);
          }
        }
      }
      const newMaster = {
        ...firstMaster,
        playlists: firstMaster.playlists.filter(({ uri }) =>
          renditions.has(uri)
        )
      };
      return this.print(newMaster);
    }
    let firstPlaylist;
    let allPlaylists;
    if (this.manifests[0].playlists[name]) {
      firstPlaylist = this.manifests[0].playlists[name];
      if (!firstPlaylist) {
        throw new Error("not found");
      }

      allPlaylists = this.manifests.map(m => m.playlists[name]);
    } else if (name === "stream_0.m3u8") {
      firstPlaylist = this.manifests[0].mediaGroups.AUDIO.group_audio.audio_0;
      allPlaylists = this.manifests.map(
        manifest => manifest.mediaGroups.AUDIO.group_audio.audio_0
      );
    }
    const combinedPlaylist = {
      ...firstPlaylist,
      segments: []
    };

    for (let i = 0; i < this.manifests.length; i += 1) {
      const playlist = allPlaylists[i];
      const master = this.manifests[i].master;
      if (!playlist) {
        throw new Error("not found");
      }
      if (playlist.targetDuration > combinedPlaylist.targetDuration) {
        combinedPlaylist.targetDuration = playlist.targetDuration;
      }
      let discontinuity = false;
      if (combinedPlaylist.segments.length > 0) {
        discontinuity = true;
      }
      combinedPlaylist.segments.push(
        ...playlist.segments.map(seg => {
          let absoluteUrl = resolve(master.url, "..", seg.uri);
          if (this.webRootUrl) {
            const url = new URL(absoluteUrl);
            url.host = this.webRootUrl.host;
            url.protocol = this.webRootUrl.protocol;
            url.pathname = this.webRootUrl.pathname + url.pathname;
            absoluteUrl = `${url}`;
          }
          const ret = {
            ...seg,
            discontinuity,
            uri: absoluteUrl
          };
          discontinuity = false;
          return ret;
        })
      );
    }
    return this.print(combinedPlaylist);
  }

  // Given a parsed manifest, stringify it
  print(manifest) {
    manifest = {
      mediaGroups: {},
      playlists: [],
      segments: [],
      ...manifest
    };
    const output = ["#EXTM3U"];
    if (manifest.playlistType) {
      output.push(`#EXT-X-PLAYLIST-TYPE:${manifest.playlistType}`);
    }
    output.push("#EXT-X-VERSION:6");
    if (manifest.segments.length > 0) {
      output.push("#EXT-X-INDEPENDENT-SEGMENTS");
    }
    if (typeof manifest.mediaSequence === "number") {
      output.push(`#EXT-X-MEDIA-SEQUENCE:${manifest.mediaSequence}`);
    }
    if (typeof manifest.targetDuration === "number") {
      output.push(`#EXT-X-TARGETDURATION:${manifest.targetDuration}`);
    }

    for (const [type, groups] of Object.entries(manifest.mediaGroups)) {
      for (const [groupId, group] of Object.entries(groups)) {
        for (const [name, entry] of Object.entries(group)) {
          output.push(this.printMediaGroup(type, groupId, name, entry));
        }
      }
    }

    for (let { attributes, uri } of manifest.playlists) {
      output.push(this.printAttributes(attributes));
      output.push(uri);
    }

    for (const segment of manifest.segments) {
      if (segment.discontinuity) {
        output.push("#EXT-X-DISCONTINUITY");
      }
      output.push(`#EXTINF:${segment.duration},`);
      output.push(segment.uri);
    }

    if (manifest.endList === true) {
      output.push("#EXT-X-ENDLIST");
    }

    return output.join("\n");
  }

  printAttributes(attributes) {
    attributes = Object.entries(attributes).sort(([a], [b]) => {
      const orderA = typeof ATTR_ORDER[a] === "number" ? ATTR_ORDER[a] : 100;
      const orderB = typeof ATTR_ORDER[b] === "number" ? ATTR_ORDER[b] : 100;
      return orderA - orderB;
    });
    let attributeLine = [];
    for (let [name, value] of attributes) {
      if (name === "RESOLUTION") {
        const { width, height } = value;
        value = `${width}x${height}`;
      }
      if (name === "CODECS" || name === "AUDIO") {
        // Wrap CODECS in quotes
        value = JSON.stringify(value);
      }
      attributeLine.push(`${name}=${value}`);
    }
    return `#EXT-X-STREAM-INF:${attributeLine.join(",")}`;
  }

  // "mediaGroups": {
  //   "AUDIO": {
  //     "group_audio": {
  //       "audio_0": {
  //         "default": true,
  //         "autoselect": true,
  //         "uri": "stream_0.m3u8"
  //       }
  //     }
  //   },
  //   "VIDEO": {},
  //   "CLOSED-CAPTIONS": {},
  //   "SUBTITLES": {}
  // }

  // #EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="group_audio",NAME="audio_0",DEFAULT=YES,URI="stream_0.m3u8"
  printMediaGroup(type, groupId, name, entry) {
    const attrs = [];
    attrs.push(`TYPE=${type}`);
    attrs.push(`GROUP-ID=${JSON.stringify(groupId)}`);
    attrs.push(`NAME=${JSON.stringify(name)}`);
    attrs.push(`DEFAULT=${entry.default ? "YES" : "NO"}`);
    attrs.push(`URI=${JSON.stringify(entry.uri)}`);
    return `#EXT-X-MEDIA:${attrs.join(",")}`;
  }
}
