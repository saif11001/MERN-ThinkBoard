import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="navbar px-6 shadow-sm" style={{ backgroundColor: "#1F4959" }}>

      <div className="navbar-start">
        <div className="dropdown">

          <div tabIndex={0} role="button"
            className="btn btn-ghost btn-circle transition-all duration-300 hover:rotate-90 hover:scale-110"
            style={{ color: "#FFFFFF" }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </div>

          <ul tabIndex={-1}
            className="menu menu-sm dropdown-content rounded-box z-10 mt-3 w-52 p-2 shadow"
            style={{ backgroundColor: "#011425", color: "#FFFFFF" }}>
            <li>
              <Link to="/"
                className="transition-all duration-200 hover:pl-5"
                style={{ color: "#FFFFFF" }}
                onMouseEnter={e => e.target.style.backgroundColor = "#1F4959"}
                onMouseLeave={e => e.target.style.backgroundColor = "transparent"}>
                🏠 Homepage
              </Link>
            </li>
            <li>
              <Link to="/create"
                className="transition-all duration-200 hover:pl-5"
                style={{ color: "#FFFFFF" }}
                onMouseEnter={e => e.target.style.backgroundColor = "#1F4959"}
                onMouseLeave={e => e.target.style.backgroundColor = "transparent"}>
                📝 Create Note
              </Link>
            </li>
          </ul>

        </div>
      </div>

      <div className="navbar-center">
        <Link to="/"
          className="text-xl font-semibold"
          style={{ color: "#FFFFFF" }}>
          Think Board
        </Link>
      </div>

      <div className="navbar-end">
        <div className="btn btn-ghost btn-circle avatar transition-all duration-300 hover:scale-110 hover:rotate-6">
          <div className="w-9 rounded-full ring-2 ring-[#5C7C89] ring-offset-2 ring-offset-[#1F4959]">
            <img
              alt="avatar"
              src="https://img.daisyui.com/images/profile/demo/spiderperson@192.webp"
            />
          </div>
        </div>
      </div>

    </div>
  );
};

export default Navbar;