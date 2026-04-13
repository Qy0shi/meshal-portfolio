"use client";
import { useEffect, useRef } from "react";

export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = ref.current;
    if (!cursor) return;
    let rafId: number;

    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        cursor.style.left = e.clientX + "px";
        cursor.style.top = e.clientY + "px";
      });
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const isLink = !!t.closest("a, button");
      const isPara = t.tagName === "P" || t.tagName === "LI" || t.tagName === "TEXTAREA";
      cursor.classList.toggle("link-hover", isLink);
      cursor.classList.toggle("text-hover", !isLink && isPara);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, []);

  return <div id="cursor" ref={ref} />;
}