"use client";



import { useEffect } from "react";



export default function ThemeLoader() {

  useEffect(() => {

    const theme =

      localStorage.getItem("theme");



    const background =

      localStorage.getItem("background");



    if (theme === "light") {

      document.body.classList.remove("dark");

    } else {

      document.body.classList.add("dark");

    }



    if (background) {

      document.body.style.backgroundImage =

        `url(${background})`;



      document.body.style.backgroundSize =

        "cover";



      document.body.style.backgroundPosition =

        "center";



      document.body.style.backgroundAttachment =

        "fixed";

    }

  }, []);



  return null;

} 

