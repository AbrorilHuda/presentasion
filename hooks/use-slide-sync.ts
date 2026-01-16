"use client";

import { useEffect, useRef } from "react";

const CHANNEL_NAME = "slide-sync";

type SlideSyncMessage = {
  type: "SLIDE_CHANGE";
  index: number;
};

export function useSlideSyncBroadcast(currentIndex: number) {
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("BroadcastChannel" in window)) {
      console.warn("BroadcastChannel not supported");
      return;
    }
    channelRef.current = new BroadcastChannel(CHANNEL_NAME);

    return () => {
      channelRef.current?.close();
      channelRef.current = null;
    };
  }, []);

  useEffect(() => {
    // Broadcast whenever currentIndex changes
    if (channelRef.current && currentIndex > 0) {
      const message: SlideSyncMessage = {
        type: "SLIDE_CHANGE",
        index: currentIndex,
      };
      channelRef.current.postMessage(message);
    }
  }, [currentIndex]);
}

export function useSlideSyncListener(onSlideChange: (index: number) => void) {
  const channelRef = useRef<BroadcastChannel | null>(null);
  const callbackRef = useRef(onSlideChange);

  // Keep callback ref up to date
  useEffect(() => {
    callbackRef.current = onSlideChange;
  }, [onSlideChange]);

  useEffect(() => {
    if (typeof window === "undefined" || !("BroadcastChannel" in window)) {
      console.warn("BroadcastChannel not supported");
      return;
    }

    // Create channel
    channelRef.current = new BroadcastChannel(CHANNEL_NAME);
    const handleMessage = (event: MessageEvent<SlideSyncMessage>) => {
      if (event.data.type === "SLIDE_CHANGE") {
        callbackRef.current(event.data.index);
      }
    };

    channelRef.current.addEventListener("message", handleMessage);

    return () => {
      channelRef.current?.removeEventListener("message", handleMessage);
      channelRef.current?.close();
      channelRef.current = null;
    };
  }, []);
}
