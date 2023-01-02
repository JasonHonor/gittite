import { beforeAll, expect, test, vi } from "vitest";
import { randomFillSync } from "crypto";

import { mockIPC } from "@tauri-apps/api/mocks";
import { invoke } from "@tauri-apps/api/tauri";

// jsdom doesn't come with a WebCrypto implementation
beforeAll(() => {
  window.crypto = {
    getRandomValues: function (buffer) {
      return randomFillSync(buffer);
    },
  };
});

test("invoke simple", async () => {
  mockIPC((cmd, args) => {
    // simulate rust command called "add"
    if (cmd === "add") {
      return args.a + args.b;
    }
  });

  // we can use the spying tools provided by vitest
  // to track the mocked function
  const spy = vi.spyOn(window, "__TAURI_IPC__");

  expect(invoke("add", { a: 12, b: 15 })).resolves.toBe(27);
  expect(spy).toHaveBeenCalled();
});
