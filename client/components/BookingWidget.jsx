import axios from "axios";
import { differenceInCalendarDays } from "date-fns";
import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../src/UserContext";

export default function BookingWidget({ place }) {
  const { user } = useContext(UserContext);
  const checkInMin = new Date(place.checkIn).toISOString().substring(0, 10);
  const [checkIn, setCheckIn] = useState(checkInMin);
  const [checkOut, setCheckOut] = useState(new Date(place.checkIn + 86400000).toISOString().substring(0, 10));
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [loginRedirect, setLoginRedirect] = useState(false);

  let numOfDays = 0;
  const [bookingId, setBookingId] = useState("");

  useEffect(() => {
    if (user) {
      setName(user?.name);
    }
  }, [user]);

  if (checkIn && checkOut) {
    numOfDays = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
  }

  async function bookPlace() {
    try {
      if (!user) {
        setLoginRedirect(true);
        return;
      }
      const { data } = await axios.post(
        "/api/user/booking",
        {
          checkIn,
          checkOut,
          numberOfGuests,
          name,
          mobile,
          place: place._id,
          price: numOfDays * place.price,
        },
        { withCredentials: "include" }
      );
      setBookingId(data._id);
      setRedirect(true);
    } catch (error) {
      return;
    }
  }

  if (loginRedirect) {
    return <Navigate to={"/login"} />;
  }
  if (redirect) {
    return <Navigate to={"/account/bookings/" + bookingId} />;
  }

  let checkInMax = new Date(checkOut);
  checkInMax.setDate(checkInMax.getDate() - 1);
  checkInMax.setHours(checkInMax.getHours() - checkInMax.getTimezoneOffset() / 60);
  checkInMax = checkInMax.toISOString().substring(0, 10);

  let checkOutMax = new Date(place.checkOut).toISOString().substring(0, 10);

  let checkOutMin = new Date(checkIn);
  checkOutMin.setDate(checkOutMin.getDate() + 1);
  checkOutMin.setHours(checkOutMin.getHours() - checkOutMin.getTimezoneOffset() / 60);
  checkOutMin = checkOutMin.toISOString().substring(0, 10);

  return (
    <div className="bg-white shadow p-4 rounded-2xl">
      <div className="text-2xl text-center">Price: £{place.price} / night</div>
      <div className="border rounded-2xl mt-4">
        <div className="flex">
          <div className="py-3 px-4 flex-grow ">
            <label>Check in: </label>
            <input type="date" min={checkInMin} value={checkIn} max={checkInMax} onChange={(e) => setCheckIn(e.target.value)} />
          </div>
          <div className="py-3 px-4 border-l flex-grow">
            <label>Check out: </label>
            <input type="date" min={checkOutMin} value={checkOut} max={checkOutMax} onChange={(e) => setCheckOut(e.target.value)} />
          </div>
        </div>
        <div className="py-3 px-4 border-t">
          <label>Number of Guests </label>
          <input type="number" value={numberOfGuests} onChange={(e) => setNumberOfGuests(e.target.value)} min="0" max={place.maxGuests} />
        </div>
        {numOfDays > 0 && (
          <div className="py-3 px-4 border-t">
            <label>Your full name:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
            <label>Phone Number:</label>
            <input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="Phone Number" />
          </div>
        )}
      </div>
      <button onClick={bookPlace} className="primary mt-4">
        Book this place
        {numOfDays > 0 && <span>&nbsp;${numOfDays * place.price}</span>}
      </button>
    </div>
  );
}
