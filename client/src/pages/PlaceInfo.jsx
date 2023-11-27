import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BookingWidget from "../../components/BookingWidget";
import PlaceGallery from "../../components/PlaceGallery";
import AddressLink from "../../components/AddressLink";

export default function PlaceInfo() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);

  useEffect(() => {
    if (!id) {
      return;
    }
    async function getData() {
      const { data } = await axios.get("/api/accom/places/" + id, { withCredentials: "include" });
      setPlace(data);
    }
    getData();
  }, [id]);

  if (!place) {
    return <h1>Loading</h1>;
  }

  return (
    <div className="mt-4 bg-gray-100 -mx-8 px-8 pt-8">
      <h1 className="text-2xl">{place.title}</h1>
      <AddressLink>{place.address}</AddressLink>
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
        <div className="flex justify-center">
          <PlaceGallery place={place} />
        </div>
        <div className="lg:max-w-2xl lg:col-span-1 gap-8 ">
          <div>
            <div className="">
              <h2 className="font-semibold text-2xl mb-2">Description</h2>
              {place.description}
            </div>
            <br />
            Check in from: {new Date(place.checkIn).toLocaleDateString()}
            <br />
            Check out: {new Date(place.checkOut).toLocaleDateString()}
            <br />
            Max number of guests: {place.maxGuests}
          </div>
        </div>
        <div className="mt-8 lg:mt-0">
          <BookingWidget place={place} />
        </div>
      </div>
      <div className="bg-white mt-4 -mx-8 px-8 py-8 border-t">
        <div>
          <h2 className="font-semibold text-2xl">Extra Info</h2>
        </div>
        <div className="mb-4 text-sm text-gray-700 leading-4">{place.extraInfo}</div>
      </div>
    </div>
  );
}
