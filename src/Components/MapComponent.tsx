import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";

const center = {
  lat: -3.745,
  lng: -38.523,
};

type MapProps = {
  coordintes: {
    latitude: number;
    longitude: number;
  };
  width?: number;
  height?: number;
};

function MapComponent(props: MapProps) {
  const center = {
    lat: props.coordintes.latitude,
    lng: props.coordintes.longitude,
  };

  const styles = {
    width: props.width ? props.width : "400px",
    height: props.height ? props.height : "400px",
  };

  return (
    <div className='h-auto w-auto rounded-[40px]'>
      <APIProvider apiKey={import.meta.env.VITE_MAPS_API_KEY}>
        <Map
          id='munch_hunt_g_map'
          mapId={"63591389102871d8"}
          style={styles}
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
