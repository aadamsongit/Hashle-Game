import Nav from "./Nav";
import React from "react";

function Header({ handleToggle, toastMessage, darkMode }) {
  return (
    <header>
      {/* Navigation Bar */}
      <Nav handleToggle={handleToggle} darkMode={darkMode} />

      {/* Toast for words not in the list */}
      {toastMessage && (
        <div
          className="fixed top-5 left-1/2 -translate-x-1/2 bg-indigo-500 text-white px-4 py-2 rounded-md shadow-lg transition-opacity duration-500"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          Not in word list!
        </div>
      )}

      {/* Title For Application*/}
      <div className="flex justify-center mt-16 sm:mb-12">
        <div className="w-full md:max-w-[690px] md:px-4 ipad:max-w-[700px]">
          <h1 className="sm:text-3xl font-bold text-lg pl-[50px] sm:pl-0 md:pl-0 terminal-title-parent">
            <span className="terminal-title ipad:w-[23ch]">
              🚀Hashle: An Evolving Word Game
            </span>
          </h1>
        </div>
      </div>
    </header>
  );
}

export default Header;
