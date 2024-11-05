import { Coordinate } from "../Context/MunchContext";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";

// @ts-nocheck

const center = {
  lat: -3.745,
  lng: -38.523,
};

type MapProps = {
  coordintes: {
    latitude: number;
    longitude: number;
  };
};

function MapComponent(props: MapProps) {
  const center = {
    lat: props.coordintes.latitude,
    lng: props.coordintes.longitude,
  };

  return (
    <div className='h-auto w-auto rounded-[40px]'>
      <APIProvider apiKey={import.meta.env.VITE_MAPS_API_KEY}>
        <Map
          id='munch_hunt_g_map'
          mapId={"63591389102871d8"}
          style={{ width: "400px", height: "400px" }}
          defaultCenter={center}
          defaultZoom={15}
          disableDefaultUI={false}
        >
          <AdvancedMarker position={center} />
        </Map>
      </APIProvider>
    </div>
  );
}

export default MapComponent;
