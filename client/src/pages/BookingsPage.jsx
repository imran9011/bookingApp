import { useEffect, useState } from "react";
import AccountNav from "../../components/AccountNav";
import axios from "axios";
import PlaceImg from "../../components/PlaceImg";
import { Link, Navigate } from "react-router-dom";
import BookingDates from "../../components/BookingDates";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    axios
      .get("/api/user/bookings", { withCredentials: "include" })
      .then((response) => {
        setBookings(response.data);
      })
      .catch((e) => {
        setRedirect(true);
      });
  }, []);

  if (redirect) {
    return <Navigate to={"/login"} />;
  }

  return (
    <div>
      <AccountNav />
      <div className="flex flex-col gap-y-4">
        {bookings?.length > 0 &&
          bookings.map((booking) => (
            <Link key={booking._id} to={"/account/bookings/" + booking._id} className="flex gap-4 bg-gray-200 rounded-2xl overflow-hidden">
              <div className="">
                <PlaceImg className={"object-cover w-48 h-48"} place={booking.place} />
              </div>
              <div className="py-3 grow pr-3 mt-1">
                <h2 className="text-xl">{booking.place.title}</h2>
                <BookingDates booking={booking} />
                <div className="flex py-1 gap-1 items-center text-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                  </svg>
                  <></>Total price: ${booking.price}
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
