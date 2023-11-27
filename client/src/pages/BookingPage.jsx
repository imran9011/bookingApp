import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddressLink from "../../components/AddressLink";
import PlaceGallery from "../../components/PlaceGallery";
import BookingDates from "../../components/BookingDates";

export default function BookingPage() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      axios
        .get("/api/user/bookings", { withCredentials: "include" })
        .then((response) => {
          const findBooking = response.data.find(({ _id }) => _id === id);
          if (findBooking) {
            setBooking(findBooking);
          }
        })
        .catch((e) => {
          setError(e.response.status);
        });
    }
  }, [id]);

  if (error) {
    return "Error: " + error;
  }

  if (!booking) {
    return "Booking not found";
  }

  return (
    <div className="my-8">
      My singular Bookings<>{booking.place.title}</>
      <AddressLink className="my-2 block">{booking.place.address}</AddressLink>
      <div className="bg-gray-200 p-6 my-6 rounded-2xl flex justify-between items-center">
        <div>
          <h2 className="text-2xl mb-4">Your booking information:</h2>
          <BookingDates booking={booking} />
        </div>
        <div className="bg-rose-500 p-6 text-white rounded-2xl">
          <div>Total Price: </div>
          <div className="text-2xl">${booking.price}</div>
        </div>
      </div>
      <PlaceGallery place={booking.place} />
    </div>
  );
}
