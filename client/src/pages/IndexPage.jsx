import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";

export default function IndexPage() {
  const [places, setPlaces] = useState([]);
  const [searchParams] = useSearchParams();
  const searched = searchParams.get("places");

  useEffect(() => {
    if (searched) {
      axios
        .get("/api/accom/places", {
          params: {
            searched,
          },
        })
        .then((response) => {
          setPlaces([...response.data]);
        });
    } else {
      axios.get("/api/accom/places").then((response) => {
        setPlaces([...response.data]);
      });
    }
  }, [searched]);

  return (
    <div className="mt-8 gap-x-6 gap-y-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {places.length > 0 &&
        places.map((place) => (
          <Link key={place._id} to={"/place/" + place._id}>
            <div className="bg-gray-400 rounded-2xl">
              <img className="rounded-2xl h-72 w-full mb-2 object-cover aspect-square" src={place.photos?.[0]} />
            </div>
            <h2 className="font-bold">{place.address}</h2>
            <h3 className="text-sm text-gray-500 ">{place.title}</h3>
            <div className="mt-1">
              <span className="font-bold">£{place.price} </span>per night
            </div>
            {new Date(place.checkIn).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "2-digit" }) + " "}
            to
            {" " + new Date(place.checkOut).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "2-digit" })}
          </Link>
        ))}
    </div>
  );
}
