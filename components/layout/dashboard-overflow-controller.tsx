"use client";

import { useEffect } from "react";

export function DashboardOverflowController() {
  useEffect(() => {
    // Add overflow-hidden to body when dashboard is mounted
    document.body.style.overflow = "hidden";

    // Cleanup: restore overflow when component unmounts
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return null;
}
