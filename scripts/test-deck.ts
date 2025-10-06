import { nextIndex, clampIndex } from "@/utils/deck";
import { getSlides } from "@/lib/markdown";

function assert(name: string, cond: boolean) {
  if (!cond) {
    console.log("[dc][FAIL]", name);
    process.exitCode = 1;
  } else {
    console.log("[dc][PASS]", name);
  }
}

const total = 5;
assert("nextIndex within range", nextIndex(2, total) === 3);
assert("nextIndex stays at boundary", nextIndex(total, total) === total);
assert("clamp below 1 -> 1", clampIndex(0, total) === 1);
assert("clamp above total -> total", clampIndex(999, total) === total);

console.log("[dc] test markdown");
(async () => {
  const res = await fetch("http://localhost:3000/print?format=json", {
    cache: "no-store",
  });
  console.log(res);
  const data = await res.json();
  console.log(data);
  // const data = (await res.json()) as Awaited<ReturnType<typeof getSlides>>;
  // console.log("data dari json" + data);
})();
