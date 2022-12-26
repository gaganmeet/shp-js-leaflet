import React, { useEffect, useRef, useState } from "react";
import { Map, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import shp from "shpjs";

function Leaflet() {
  const mapRef = useRef();
  const [geoJson, setGeoJson] = useState(null);
  const [url, setUrl] = useState(null);
  useEffect(() => {
    const map = mapRef.current.leafletElement;
    map.setView([34.74161249883172, 18.6328125], 2);
  }, []);

  const handleFile = async (e) => {
    // file type is shp then read the file as binary buffer and parse it using shp.parseShp
    if (e.target.files[0].name.includes(".shp")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = shp.parseShp(e.target.result);
        setGeoJson(data);
        setUrl(URL.createObjectURL(new Blob([JSON.stringify(data)], { type: "application/json" })));
      }
      reader.readAsArrayBuffer(e.target.files[0]);
    }
    else {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = await shp.parseZip(e.target.result);
        setGeoJson(data);
        setUrl(URL.createObjectURL(new Blob([JSON.stringify(data)], { type: "application/json" })));
      }
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  }

  const position = [51.505, -0.09];
  return (
    <Map center={position} zoom={13} style={{ height: "100vh" }} ref={mapRef}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {geoJson && <GeoJSON data={geoJson} />}
      <input type="file" onChange={handleFile} multiple/>
      {url ? <a href={url
      } download="geojson.json">Download GeoJSON</a> : null}  
    </Map>
  );
}

export default Leaflet;
