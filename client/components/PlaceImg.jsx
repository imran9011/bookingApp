export default function PlaceImg({ place, index = 0, className = null }) {
  if (!place.photos?.length) {
    return "";
  }
  if (!className) {
    className = "h-full w-full object-cover";
  }
  return (
    <>
      {place.photos.length > 0 && (
        <>
          <img className={className} src={import.meta.env.VITE_HOME_URL + "/uploads/" + place.photos[index]}></img>
        </>
      )}
    </>
  );
}
