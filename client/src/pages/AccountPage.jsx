import { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import PlacesPage from "./PlacePage";
import AccountNav from "../../components/AccountNav";

export default function AccountPage() {
  const { ready, user, setUser, setReady, verifyUser } = useContext(UserContext);
  const { subpage } = useParams();
  const [redirectHome, setRedirectHome] = useState(false);

  useEffect(() => {
    if (!user) {
      verifyUser().catch((e) => {
        setRedirectHome(true);
      });
    }
  }, []);

  async function logOut() {
    await axios.post("/api/auth/logout", {}, { withCredentials: true });
    setRedirectHome(true);
    setUser(null);
    setReady(false);
  }

  if (redirectHome) {
    return <Navigate to={"/login"} />;
  }

  if (!ready) {
    return "loading...";
  }

  if (ready && !user && !redirectHome) {
    return <Navigate to={"/login"} />;
  }
  return (
    <div>
      <AccountNav />
      {!subpage && (
        <div className="text-center max-w-lg mx-auto">
          Logged in as {user.name}- ({user.email})
          <button onClick={logOut} className="primary max-w-sm mt-2">
            Logout
          </button>
        </div>
      )}
      {subpage === "places" && <PlacesPage />}
    </div>
  );
}
