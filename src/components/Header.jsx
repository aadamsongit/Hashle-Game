import Nav from "./Nav";
import React from "react";

function Header({ handleToggle, toastMessage }) {
  return (
    <header>
      {/* Navigation Bar */}
      <Nav handleToggle={handleToggle} />

      {/* Toast for words not in the list */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-indigo-500 text-white px-4 py-2 rounded-md shadow-lg transition-opacity duration-500">
          Not in word list!
        </div>
      )}

      {/* Title For Application*/}
      <div className="flex justify-center mt-16 sm:mb-8">
        <div className="w-full max-w-[660px]">
          <h1 className="sm:text-3xl font-bold text-sm pl-[50px] sm:pl-0">
            <span className="terminal-title">
              🚀Hashle: An Evolving Word Game
            </span>
          </h1>
        </div>
      </div>
    </header>
  );
}

export default Header;
