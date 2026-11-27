"use client";

import { useEffect } from "react";

interface UseTvNavigationOptions {
  isModalOpen: boolean;
  onCloseModal: () => void;
}

/**
 * Enables Fire TV / Android TV D-Pad (Arrow keys, Enter, Back/Escape)
 * spatial navigation across elements marked with `data-tv-focusable="true"`.
 */
export function useTvNavigation({
  isModalOpen,
  onCloseModal,
}: UseTvNavigationOptions) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not hijack arrow keys inside text inputs unless moving vertically out
      const active = document.activeElement as HTMLElement | null;
      const isInput =
        active?.tagName === "INPUT" || active?.tagName === "TEXTAREA";

      if (e.key === "Escape" || (e.key === "Backspace" && !isInput)) {
        if (isModalOpen) {
          e.preventDefault();
          onCloseModal();
        }
        return;
      }

      if (
        !["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)
      ) {
        return;
      }

      if (isInput && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
        return;
      }

      const container = isModalOpen
        ? document.querySelector('[data-tv-modal="true"]')
        : document;
      if (!container) return;

      const candidates = Array.from(
        container.querySelectorAll<HTMLElement>('[data-tv-focusable="true"]')
      ).filter((el) => {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      });

      if (candidates.length === 0) return;

      if (!active || !candidates.includes(active)) {
        e.preventDefault();
        candidates[0].focus();
        candidates[0].scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        });
        return;
      }

      const currentRect = active.getBoundingClientRect();
      const cx = currentRect.left + currentRect.width / 2;
      const cy = currentRect.top + currentRect.height / 2;

      let best: HTMLElement | null = null;
      let bestScore = Infinity;

      for (const el of candidates) {
        if (el === active) continue;
        const rect = el.getBoundingClientRect();
        const ex = rect.left + rect.width / 2;
        const ey = rect.top + rect.height / 2;
        const dx = ex - cx;
        const dy = ey - cy;

        let isValidDirection = false;
        let primaryDist = 0;
        let secondaryDist = 0;

        if (e.key === "ArrowRight" && dx > 12) {
          isValidDirection = true;
          primaryDist = dx;
          secondaryDist = Math.abs(dy) * 2.5;
        } else if (e.key === "ArrowLeft" && dx < -12) {
          isValidDirection = true;
          primaryDist = -dx;
          secondaryDist = Math.abs(dy) * 2.5;
        } else if (e.key === "ArrowDown" && dy > 12) {
          isValidDirection = true;
          primaryDist = dy;
          secondaryDist = Math.abs(dx) * 1.4;
        } else if (e.key === "ArrowUp" && dy < -12) {
          isValidDirection = true;
          primaryDist = -dy;
          secondaryDist = Math.abs(dx) * 1.4;
        }

        if (!isValidDirection) continue;

        const score = primaryDist + secondaryDist;
        if (score < bestScore) {
          bestScore = score;
          best = el;
        }
      }

      if (best) {
        e.preventDefault();
        best.focus({ preventScroll: true });
        best.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, onCloseModal]);
}
