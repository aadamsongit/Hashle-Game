function Nav({ handleToggle }) {
  return (
    <nav className="flex justify-end items-center p-2">
      <label className="switch">
        <input type="checkbox" onClick={handleToggle} />
        <span className="slider round"></span>
      </label>
    </nav>
  );
}

export default Nav;
