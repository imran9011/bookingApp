import { Link, Navigate } from "react-router-dom";
import AccountNav from "../../components/AccountNav";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import PlaceImg from "../../components/PlaceImg";
import { UserContext } from "../UserContext";

export default function PlacesPage() {
  const [places, setPlaces] = useState([]);
  const { ready } = useContext(UserContext);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    axios
      .get("/api/accom/user-places", { withCredentials: true })
      .then((response) => {
        setPlaces(response.data);
      })
      .catch((e) => {
        setRedirect(true);
      });
  }, []);

  if (!ready) {
    if (redirect) {
      return <Navigate to={"/login"} />;
    }
    return "loading...";
  }

  return (
    <div>
      <AccountNav />
      <div>
        <div className="text-center">
          <Link className="inline-flex bg-rose-500 text-white py-2 px-6 rounded-full" to={"/account/places/new"}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
            </svg>
            Add new Place
          </Link>
        </div>
        <div className="mt-4 w-full flex flex-col items-center">
          <ul className="md:w-11/12 lg:w-4/5">
            {places.length > 0 &&
              places.map((place) => (
                <Link to={"/account/places/" + place._id} key={place._id} className="flex overflow-hidden mb-4 cursor-pointer bg-gray-100 gap-4 p-4 rounded-2xl">
                  <div className="w-40 h-40 rounded-lg overflow-hidden bg-gray-300 shrink-0 lg:w-60 lg:h-60">
                    <PlaceImg place={place} />
                  </div>
                  <div className="grow-0 shrink h-36">
                    <h2 className="text-xl">{place.title}</h2>
                    <p className="text-sm line-clamp-6 overflow-hidden text-ellipsis">{place.description}</p>
                  </div>
                </Link>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
