function Nav({ handleToggle, darkMode }) {
  return (
    <nav className="flex justify-end items-center p-2">
      <label className="switch">
        <input
          type="checkbox"
          onChange={handleToggle}
          aria-label="Toggle dark mode"
          title="Toggle dark mode"
          checked={!!darkMode}
        />
        <span className="slider round" aria-hidden="true"></span>
      </label>
    </nav>
  );
}

export default Nav;
