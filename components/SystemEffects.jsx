"use client";

import { usePathname } from "next/navigation";

import BackgroundEffects from "./BackgroundEffects";
import BearScene from "./BearScene";

export default function SystemEffects() {

  const pathname = usePathname();

  //--------------------------------
  // Disable effects on Gravity Game
  //--------------------------------

  const disableEffects =
    pathname === "/games/gravity";

  if (disableEffects) {
    return null;
  }

  return (
    <>
      <BackgroundEffects />
      <BearScene />
    </>
  );
}