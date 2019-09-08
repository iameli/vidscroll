import path from "path";
import fs from "fs-extra";
import testData from "./manifests.test-data.json";
import ManifestCombiner from "./combine-manifests";
import {
  combinedMaster,
  testMaster,
  testMasterPrinted,
  testMediaPrinted,
  testMediaCombined
} from "./manifest-text.test-data";

describe("ManifestCombiner", () => {
  let combiner;

  beforeEach(() => {
    combiner = new ManifestCombiner();
    for (const manifest of Object.values(testData)) {
      combiner.push(manifest);
    }
  });

  it("should print manifests", () => {
    const output = combiner.print(testMaster);
    expect(output).toEqual(testMasterPrinted);
  });

  it("should combine manifests", () => {
    const combiner = new ManifestCombiner();
    for (const manifest of Object.values(testData)) {
      combiner.push(manifest);
    }
    const master = combiner.get("video.m3u8");
    expect(master).toEqual(combinedMaster);
  });

  it("should print one media manifest", () => {
    const combiner2 = new ManifestCombiner();
    combiner2.push(testData["4c0e44fb7aa83ca78a01689979617e91"]);
    const media = combiner2.get("stream_1.m3u8");
    expect(media).toEqual(testMediaPrinted);
  });

  it("should combine all media manifests", () => {
    const output = combiner.get("stream_1.m3u8");
    expect(output).toEqual(testMediaCombined);
  });
});
