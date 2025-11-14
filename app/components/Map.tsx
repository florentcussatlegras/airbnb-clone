// "use client";

// import L from "leaflet";
// import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
// import markerIcon from "leaflet/dist/images/marker-icon.png";
// import markerShadow from "leaflet/dist/images/marker-shadow.png";

// // @ts-expect-error - _getIconUrl is not defined in Leaflet's type declarations
// delete (L.Icon.Default.prototype as any)._getIconUrl;

// L.Icon.Default.mergeOptions({
//    iconURL: markerIcon.src,
//    iconRetinaUrl: markerIcon2x.src,
//    shadowUrl: markerShadow.src,
// });

// interface MapProps {
//    center?: number[];
// }

// const url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
// const attribution =
//    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

// const Map: React.FC<MapProps> = ({ center }) => {
//    return (
//       <MapContainer
//          center={(center as L.LatLngExpression) || [51, -0.09]}
//          zoom={center ? 4 : 2}
//          scrollWheelZoom={false}
//          className="h-[35vh] rounded-lg"
//       >
//          <TileLayer url={url} attribution={attribution} />
//          {center && <Marker position={center as L.LatLngExpression} />}
//       </MapContainer>
//    );
// };
// export default Map;

"use client";

import L from "leaflet";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Images importées depuis Leaflet
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

interface MapProps {
  center?: number[];
}

// Création d'une icône Leaflet personnalisée
const customMarker = L.icon({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
  iconSize: [25, 41],       // taille standard Leaflet
  iconAnchor: [12, 41],     // point d’ancrage (pour bien centrer)
  shadowSize: [41, 41],
});

const url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const Map: React.FC<MapProps> = ({ center }) => {
  return (
    <MapContainer
      center={(center as L.LatLngExpression) || [51, -0.09]}
      zoom={center ? 4 : 2}
      scrollWheelZoom={false}
      className="h-[35vh] rounded-lg"
    >
      <TileLayer url={url} attribution={attribution} />

      {center && (
        <Marker
          position={center as L.LatLngExpression}
          icon={customMarker}   // → utilisation de l’icône personnalisée
        />
      )}
    </MapContainer>
  );
};

export default Map;
