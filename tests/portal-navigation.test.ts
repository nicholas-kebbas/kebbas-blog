import assert from "node:assert/strict";
import { test } from "node:test";
import {
  isPlainPortalActivation,
  resolvePortalDestination,
} from "../src/lib/portal-navigation.ts";

const current = "https://kebbas.com/#top";

test("ordinary primary and keyboard-generated activations may use a portal", () => {
  assert.equal(isPlainPortalActivation({ button: 0 }), true);
  assert.equal(isPlainPortalActivation({ button: 0, target: "_self" }), true);
  assert.equal(isPlainPortalActivation({ button: 0, target: "_SELF" }), true);
});

test("browser tab/window gestures, downloads, and handled events stay native", () => {
  const native = [
    { button: 1 },
    { button: 2 },
    { button: 0, metaKey: true },
    { button: 0, ctrlKey: true },
    { button: 0, shiftKey: true },
    { button: 0, altKey: true },
    { button: 0, download: true },
    { button: 0, defaultPrevented: true },
    { button: 0, target: "_blank" },
    { button: 0, target: "_parent" },
    { button: 0, target: "_top" },
    { button: 0, target: "a-named-window" },
  ];
  for (const activation of native)
    assert.equal(
      isPlainPortalActivation(activation),
      false,
      JSON.stringify(activation),
    );
});

test("all destination chapters retain their native fragment and focus target", () => {
  for (const id of ["work", "about", "lab", "connect"]) {
    const destination = resolvePortalDestination(`#${id}`, current);
    assert.equal(destination?.kind, "anchor");
    if (destination?.kind !== "anchor")
      assert.fail("Expected an anchor destination");
    assert.equal(destination.id, id);
    assert.equal(destination.url.href, `https://kebbas.com/#${id}`);
  }
  assert.equal(
    resolvePortalDestination("#top", "https://kebbas.com/#about")?.kind,
    "anchor",
  );
});

test("encoded IDs are decoded for document lookup without changing the actual URL", () => {
  const destination = resolvePortalDestination("#space%20between", current);
  assert.equal(destination?.kind, "anchor");
  if (destination?.kind !== "anchor")
    assert.fail("Expected an anchor destination");
  assert.equal(destination.id, "space between");
  assert.equal(destination.url.hash, "#space%20between");
});

test("unchanged destinations do not replay the transition", () => {
  for (const href of ["#top", current])
    assert.equal(resolvePortalDestination(href, current), null);
  assert.equal(
    resolvePortalDestination("https://kebbas.com/", "https://kebbas.com/"),
    null,
  );
});

test("page navigation requires the complete origin, path, and query to match before treating a hash locally", () => {
  const destinations = [
    "https://github.com/nicholas-kebbas",
    "https://twitter.com/nickkebbas",
    "https://bayareahousingalpha.com",
    "https://other.example/#work",
    "http://kebbas.com/#work",
    "/another-page#work",
    "/?preview=1#work",
    "/#",
  ];
  for (const href of destinations)
    assert.equal(resolvePortalDestination(href, current)?.kind, "page", href);
});

test("non-web protocols and malformed input are left to native link behavior", () => {
  for (const href of [
    "",
    " ",
    "mailto:nick@example.com",
    "tel:123",
    "javascript:alert(1)",
    "data:text/plain,example",
    "#%EA",
    "http://[invalid",
  ]) {
    assert.equal(resolvePortalDestination(href, current), null, href);
  }
  assert.equal(resolvePortalDestination("#work", "not a URL"), null);
});
