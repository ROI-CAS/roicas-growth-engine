import { useEffect, useState } from "react";

/** Coordinates mobile navigation without reacting to every tiny scroll movement. */
export function useMobileChrome() {
  const [hidden, setHidden] = useState(false);
  const [heroVisible, setHeroVisible] = useState(true);
  const [formVisible, setFormVisible] = useState(false);
  const [inlineActionVisible, setInlineActionVisible] = useState(false);

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 639px)");
    let lastY = Math.max(0, window.scrollY);
    let distance = 0;
    let previousDirection = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const editing = () =>
      document.activeElement?.matches("input, textarea, select, [contenteditable='true']") ?? false;
    const focusIn = () => {
      if (mobile.matches && editing()) setHidden(true);
    };
    const focusOut = () => {
      if (mobile.matches) setHidden(false);
    };
    const reset = () => {
      clearTimeout(timer);
      lastY = Math.max(0, window.scrollY);
      distance = 0;
      setHidden(false);
    };
    const onScroll = () => {
      const y = Math.max(0, window.scrollY);
      const delta = y - lastY;
      lastY = y;
      if (!mobile.matches) return;
      clearTimeout(timer);
      if (editing()) {
        setHidden(true);
        return;
      }
      // Keep keyboard focus usable if a visitor is navigating a fixed control.
      if (document.activeElement?.closest(".express-nav")) return;
      const direction = Math.sign(delta);
      if (direction !== previousDirection) distance = 0;
      previousDirection = direction;
      distance += Math.abs(delta);
      if (y <= 24) setHidden(false);
      else if (distance >= 12) {
        setHidden(direction > 0);
        distance = 0;
      }
      timer = setTimeout(() => {
        if (!editing()) setHidden(false);
      }, 1200);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("focusin", focusIn);
    document.addEventListener("focusout", focusOut);
    mobile.addEventListener("change", reset);

    const visibleActions = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target.id === "top") setHeroVisible(entry.isIntersecting);
          if (entry.target.id === "solicitar") setFormVisible(entry.isIntersecting);
          if (entry.target.matches(".plan-offer-actions, .plan-contact-card")) {
            if (entry.isIntersecting) visibleActions.add(entry.target);
            else visibleActions.delete(entry.target);
          }
        }
        setInlineActionVisible(visibleActions.size > 0);
      },
      { rootMargin: "-64px 0px 0px 0px", threshold: 0 },
    );
    for (const id of ["top", "solicitar"]) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }
    document
      .querySelectorAll(".plan-offer-actions, .plan-contact-card")
      .forEach((element) => observer.observe(element));
    return () => {
      clearTimeout(timer);
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("focusin", focusIn);
      document.removeEventListener("focusout", focusOut);
      mobile.removeEventListener("change", reset);
    };
  }, []);
  return { hidden, heroVisible, formVisible, inlineActionVisible };
}
