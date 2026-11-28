import assert from "node:assert/strict";
import { test } from "node:test";
import { IMAGE_SCENES, imageLayersAt, LAST_PROCEDURAL_SCENE_INDEX, LAST_SCENE_INDEX, nearbyImageScenes, SCENES } from "../src/lib/scenes.ts";

test("the original scene positions and native city anchors stay stable", () => {
  assert.equal(SCENES.length, 26);
  assert.equal(new Set(SCENES.map((scene) => scene.id)).size, 26);
  assert.equal(SCENES[10].id, "alexandria");
  assert.equal(SCENES[14].id, "zenith");
  assert.equal(LAST_PROCEDURAL_SCENE_INDEX, 14);
  assert.equal(SCENES[LAST_SCENE_INDEX].id, "bran-bal");
  assert.equal(IMAGE_SCENES.length, 12);
});

test("the opening downloads no paintings, while a distant destination loads only its neighborhood", () => {
  assert.deepEqual(nearbyImageScenes(0), []);
  assert.deepEqual(nearbyImageScenes(10), [10]);
  assert.deepEqual(nearbyImageScenes(18), [17, 18, 19]);
  assert.deepEqual(nearbyImageScenes(25), [24, 25]);
  for (let position = 0; position <= LAST_SCENE_INDEX; position += .1) {
    assert.ok(nearbyImageScenes(position).length <= 3);
  }
});

test("neighboring paintings dissolve over an opaque outgoing image, without revealing WebGL", () => {
  const layers = imageLayersAt(17.5, new Set([16, 17, 18, 19]));
  assert.equal(layers.size, 2);
  assert.equal(layers.get(17), 1);
  assert.ok(Math.abs(layers.get(18)! - .5) < .000001);
  assert.equal(layers.has(16), false);
  assert.equal(layers.has(19), false);
});

test("slow destination images retain a decoded painting during a fast jump", () => {
  assert.deepEqual([...imageLayersAt(17.5, new Set([17]))], [[17, 1]]);
  assert.deepEqual([...imageLayersAt(17.5, new Set([18]))], [[18, 1]]);
  assert.deepEqual([...imageLayersAt(25, new Set([10]), 10)], [[10, 1]]);
  assert.equal(imageLayersAt(25, new Set()).size, 0);
});

test("Alexandria still dissolves independently into the surrounding procedural scenes", () => {
  const ready = new Set([10, 15]);
  assert.equal(imageLayersAt(9, ready).size, 0);
  assert.ok(Math.abs(imageLayersAt(9.5, ready).get(10)! - .5) < .000001);
  assert.equal(imageLayersAt(10, ready).get(10), 1);
  assert.ok(Math.abs(imageLayersAt(10.5, ready).get(10)! - .5) < .000001);
  assert.equal(imageLayersAt(11, ready).size, 0);
});

test("quantized reduced-motion positions show one complete still painting, including the final stop", () => {
  const ready = new Set(IMAGE_SCENES.map((scene) => scene.index));
  for (const scene of IMAGE_SCENES) {
    assert.deepEqual([...imageLayersAt(scene.index, ready)], [[scene.index, 1]]);
  }
});
