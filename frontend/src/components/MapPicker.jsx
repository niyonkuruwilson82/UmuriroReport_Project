import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const icon = L.icon({
  iconUrl:'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize:[25,41], iconAnchor:[12,41]
});

function Clicker({setPosition}) {
  useMapEvents({click(e){setPosition([e.latlng.lat,e.latlng.lng])}});
  return null;
}

export default function MapPicker({position,setPosition}) {
  const center = position || [-1.9441,30.0619];
  return <MapContainer center={center} zoom={10} style={{height:300,borderRadius:12}}>
    <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
    <Clicker setPosition={setPosition}/>
    {position && <Marker position={position} icon={icon}/>}
  </MapContainer>
}