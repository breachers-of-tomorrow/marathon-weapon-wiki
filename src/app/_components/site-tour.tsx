"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const TOUR_KEY = "tour_completed";
const TOUR_PHASE_KEY = "tour_phase";

function driverConfig() {
  return {
    showProgress: true,
    progressText: "{{current}} of {{total}}",
    nextBtnText: "Next",
    prevBtnText: "Back",
    doneBtnText: "Get Started",
    allowClose: true,
    overlayColor: "#000",
    overlayOpacity: 0.75,
    stagePadding: 8,
    stageRadius: 8,
    popoverClass: "cryo-tour",
    popoverOffset: 12,
    smoothScroll: true,
  } as const;
}

function startHomeTour() {
  const driverObj = driver({
    ...driverConfig(),
    steps: [
      {
        popover: {
          title: "Welcome to Marathon Weapon Wiki",
          description:
            "Your tactical database for every weapon in Marathon. Browse the full arsenal, explore stats, find the best mods, and discover community builds.",
        },
      },
      {
        element: '[data-tour="filters"]',
        popover: {
          title: "Browse the Arsenal",
          description:
            "Use the filter buttons to narrow weapons by type — Assault Rifle, Pistol, Sniper, and more. Click any type to filter the grid instantly.",
          side: "bottom" as const,
          align: "start" as const,
        },
      },
      {
        element: '[data-tour="weapon-grid"] a:first-child',
        popover: {
          title: "Weapon Stats & Mods",
          description:
            "Click any weapon card to open its full details. The Details tab breaks down every stat — Combat, Accuracy, Handling, Magazine, and Special. Browse all compatible mods and filter by rarity.",
          side: "right" as const,
          align: "start" as const,
        },
      },
    ],
    onDestroyed: () => {
      const phase = localStorage.getItem(TOUR_PHASE_KEY);
      if (phase === "navigate") {
        localStorage.setItem(TOUR_PHASE_KEY, "builds");
        window.location.href = "/weapons/bully-smg?tour=builds";
      } else {
        localStorage.setItem(TOUR_KEY, "1");
        localStorage.removeItem(TOUR_PHASE_KEY);
      }
    },
    onNextClick: (_el, _step, options) => {
      const currentStep = options.state.activeIndex;
      if (currentStep === 2) {
        localStorage.setItem(TOUR_PHASE_KEY, "navigate");
        options.driver.destroy();
        return;
      }
      options.driver.moveNext();
    },
  });

  driverObj.drive();
}

function startBuildsTour() {
  const driverObj = driver({
    ...driverConfig(),
    steps: [
      {
        element: '[data-tour="builds-section"]',
        popover: {
          title: "Community Builds",
          description:
            "See loadouts from other players, filtered by PvP, PvE, or PvEvP. Expand a build to see its exact mod setup, or upvote/downvote to rank the best ones. Hit + Build to submit your own.",
          side: "top" as const,
          align: "center" as const,
        },
      },
      {
        element: '[data-tour="submit-data"]',
        popover: {
          title: "Contribute Data",
          description:
            "Spot something missing or wrong? Use this button to submit corrections with a screenshot. Help keep the wiki accurate for everyone.",
          side: "top" as const,
          align: "start" as const,
        },
      },
    ],
    onDestroyed: () => {
      localStorage.setItem(TOUR_KEY, "1");
      localStorage.removeItem(TOUR_PHASE_KEY);
    },
  });

  driverObj.drive();
}

export function SiteTour() {
  const pathname = usePathname();

  useEffect(() => {
    if (localStorage.getItem(TOUR_KEY)) return;

    const phase = localStorage.getItem(TOUR_PHASE_KEY);
    const params = new URLSearchParams(window.location.search);
    const isTourBuilds = params.get("tour") === "builds";

    // Phase 2: On the weapon page, continue with builds tour
    if (phase === "builds" && isTourBuilds) {
      const timeout = setTimeout(() => {
        startBuildsTour();
      }, 1200);
      return () => clearTimeout(timeout);
    }

    // Phase 1: On the home page, start the tour
    if (pathname === "/") {
      const timeout = setTimeout(() => {
        startHomeTour();
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [pathname]);

  return null;
}
