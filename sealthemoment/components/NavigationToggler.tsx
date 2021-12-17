import React, { useEffect, useState } from "react";

function Toggler() {
  const [theme, setTheme] = useState("light");

  const getColorFromMedia = () => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const getColorFromStorage = () => {
    return localStorage.getItem("theme");
  };

  const setDarkMode = () => {
    localStorage.setItem("theme", "dark");
    document.body.className = "dark";
    setTheme("dark");
  };

  const setLightMode = () => {
    localStorage.setItem("theme", "light");
    document.body.className = "light";
    setTheme("light");
  };

  useEffect(() => {
    let color = getColorFromStorage() || getColorFromMedia();
    document.body.className = color;
    setTheme(color);
  }, [theme]);

  return (
    <fieldset className="toggler" role="radiogroup" aria-label="theme-toggle">
      <label htmlFor="dark" className="toggler__label" onClick={setDarkMode}>
        Dark Mode
      </label>
      <div className="toggler__wrapper">
        <input type="radio" name="dark" id="dark" />
        <input type="radio" name="light" id="light" />
        <span aria-hidden="true" className="toggler__background"></span>
        <span
          aria-hidden="true"
          className={
            theme === "light"
              ? "toggler__button toggler__button--light"
              : "toggler__button toggler__button--dark"
          }
        ></span>
      </div>
      <label htmlFor="light" className="toggler__label" onClick={setLightMode}>
        Light Mode
      </label>
    </fieldset>
  );
}

export default Toggler;
