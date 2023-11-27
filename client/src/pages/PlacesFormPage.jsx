import { useContext, useEffect, useState } from "react";
import PhotosUploader from "../../components/PhotosUploader";
import Perks from "../../components/Perks";
import axios from "axios";
import { Navigate, useParams } from "react-router-dom";
import AccountNav from "../../components/AccountNav";
import { UserContext } from "../UserContext";

export default function PlacesFormPage() {
  const { user, verifyUser } = useContext(UserContext);
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const today = new Date().toISOString().substring(0, 10);
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(new Date(Date.now() + 86400000).toISOString().substring(0, 10));
  const [maxGuests, setMaxGuests] = useState(1);
  const [redirect, setRedirect] = useState(false);
  const [price, setPrice] = useState(100);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [redirectHome, setRedirectHome] = useState(false);

  useEffect(() => {
    if (!id) {
      return;
    }
    if (!user) {
      verifyUser().catch((e) => {
        setRedirectHome(true);
        return;
      });
    }
    async function getData() {
      const { data } = await axios.get("/api/accom/places/" + id);
      setTitle(data.title);
      setAddress(data.address);
      setAddedPhotos(data.photos);
      setDescription(data.description);
      setPerks(data.perks);
      setExtraInfo(data.extraInfo);
      setCheckIn(new Date(data.checkIn).toISOString().substring(0, 10));
      setCheckOut(new Date(data.checkOut).toISOString().substring(0, 10));
      setMaxGuests(data.maxGuests);
      setPrice(data.price);
    }
    getData();
  }, [id]);

  async function addNewPlace(e) {
    e.preventDefault();
    const placeData = {
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn: new Date(checkIn).getTime(),
      checkOut: new Date(checkOut).getTime(),
      maxGuests,
      price,
    };

    if (id) {
      await axios.put(
        "/api/accom/places",
        { id, ...placeData },
        {
          withCredentials: "include",
        }
      );
      setRedirect(true);
    } else {
      await axios.post("/api/accom/places", placeData, {
        withCredentials: "include",
      });
      setRedirect(true);
    }
  }

  async function deleteAccom() {
    if (id) {
      await axios.put("/api/accom/place/delete/" + id, {}, { withCredentials: "include" });
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={"/account/places"} />;
  }

  if (redirectHome) {
    return <Navigate to={"/login"} />;
  }

  let checkInMax = new Date(checkOut);
  checkInMax.setDate(checkInMax.getDate() - 1);
  checkInMax.setHours(checkInMax.getHours() - checkInMax.getTimezoneOffset() / 60);
  checkInMax = checkInMax.toISOString().substring(0, 10);

  let checkOutMin = new Date(checkIn);
  checkOutMin.setDate(checkOutMin.getDate() + 1);
  checkOutMin.setHours(checkOutMin.getHours() - checkOutMin.getTimezoneOffset() / 60);
  checkOutMin = checkOutMin.toISOString().substring(0, 10);

  return (
    <>
      <div className="">
        <AccountNav />
        {id && (
          <div className="w-full flex justify-center">
            {!confirmDelete ? (
              <div className="w-full flex justify-center">
                <button onClick={() => setConfirmDelete(true)} className="flex items-center gap-1 p-3 px-10 rounded-2xl">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                  Delete Accommodation
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button onClick={deleteAccom} className="bg-red-500 p-3 px-10 rounded-2xl">
                  Yes
                </button>
                <button className="p-3 px-10 rounded-2xl" onClick={() => setConfirmDelete(false)}>
                  No
                </button>
              </div>
            )}
          </div>
        )}
        <form onSubmit={addNewPlace}>
          <h2 className="text-xl mt-4">Title</h2>
          <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder="title" />
          <h2 className="text-xl mt-4">Address</h2>
          <input value={address} onChange={(e) => setAddress(e.target.value)} type="text" placeholder="address" />
          <PhotosUploader addedPhotos={addedPhotos} setAddedPhotos={setAddedPhotos} />
          <h2 className="text-xl mt-4">Description</h2>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          <Perks selected={perks} onChange={setPerks} />

          <h2 className="text-xl mt-4">Extra Info</h2>
          <textarea value={extraInfo} onChange={(e) => setExtraInfo(e.target.value)} placeholder="house rules etc..."></textarea>
          <h2 className="text-xl mt-4">Check In and Check Out times and Max Guests</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div>
              <h3 className="mt-2 -mb-1">Check in time</h3>
              <input type="date" min={today} max={checkInMax} value={checkIn} onChange={(e) => setCheckIn(e.target.value)} placeholder="14:00" />
            </div>
            <div>
              <h3 className="mt-2 -mb-1">Check out time</h3>
              <input type="date" min={checkOutMin} value={checkOut} onChange={(e) => setCheckOut(e.target.value)} placeholder="18:00" />
            </div>
            <div>
              <h3 className="mt-2 -mb-1">Max Number of Guests</h3>
              <input type="number" value={maxGuests} onChange={(e) => setMaxGuests(e.target.value)} />
            </div>
            <div>
              <h3 className="mt-2 -mb-1">Price per night</h3>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
          </div>
          <button className="primary my-4">Save</button>
        </form>
      </div>
    </>
  );
}
