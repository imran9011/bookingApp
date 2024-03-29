import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../src/UserContext";
import axios from "axios";

export default function Header() {
  const { user, setUser, setReady } = useContext(UserContext);
  const [clickOptions, setClickOptions] = useState(false);
  const [search, setSearch] = useState("");
  const clickedMenu = useRef(null);
  const clickedButton = useRef(null);

  const closeOpenMenus = (e) => {
    if (clickedMenu.current && clickOptions && !clickedMenu.current.contains(e.target) && !clickedButton.current.contains(e.target)) {
      setClickOptions(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", closeOpenMenus);
    return () => {
      document.removeEventListener("mousedown", closeOpenMenus);
    };
  }, [clickOptions]);

  async function logOut() {
    await axios.post("/api/auth/logout", {}, { withCredentials: true });
    setUser(null);
    setClickOptions(false);
    setReady(false);
  }

  return (
    <div>
      <header className="flex justify-between">
        <Link to={"/"} className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 -rotate-90">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
          <span className="font-bold text-xl">BookingApp</span>
        </Link>
        <div className="flex items-center w-2/5 max-w-sm gap-2 border border-gray-300 px-2 rounded-full shadow-md shadow-gray-300">
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="border-none p-0 m-0 h-8" placeholder="Search name or location..." />
          <Link to={{ pathname: "/search", search: "places=" + search }} className="bg-rose-500 text-white p-1 rounded-full h-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </Link>
        </div>
        <div className="block">
          <div className="flex items-center gap-2 border border-gray-300 rounded-full py-2 px-4 shadow-md shadow-gray-300">
            <button ref={clickedButton} className="bg-transparent p-0 m-0" onClick={() => setClickOptions(!clickOptions)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            <Link to={user ? "/account" : "/login"} className="flex items-center gap-2">
              <div className="bg-gray-500 text-white rounded-full border border-gray-500 overflow-hidden">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 relative top-1">
                  <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                </svg>
              </div>
              <div>{!!user ? <p className="max-w-[3rem] sm:max-w-[5rem] md:max-w-[10rem] truncate">{user.name}</p> : null}</div>
            </Link>
          </div>
          <div ref={clickedMenu} className={(clickOptions ? "" : "hidden ") + "z-50 absolute right-8 p-3 w-48 h-max mt-4 rounded-lg bg-white border border-gray-300 shadow-md shadow-gray-300"}>
            {user ? (
              <div className="flex flex-col gap-2">
                <Link onClick={() => setClickOptions(false)} to={"/account"}>
                  My profile
                </Link>
                <Link onClick={() => setClickOptions(false)} to={"/account/bookings"}>
                  My bookings
                </Link>
                <Link onClick={() => setClickOptions(false)} to={"/account/places"}>
                  My accommodations
                </Link>
                <Link
                  to={"/"}
                  onClick={() => {
                    logOut();
                    setClickOptions(false);
                  }}>
                  Sign-out
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link onClick={() => setClickOptions(false)} to={"/login"}>
                  log-in
                </Link>
                <Link onClick={() => setClickOptions(false)} to={"/register"}>
                  sign-up
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}
