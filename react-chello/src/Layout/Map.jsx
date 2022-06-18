import { Wrapper, Status } from "@googlemaps/react-wrapper";
import React, { useEffect, useRef, useState } from "react";

const Map = (props) => {
  const ref = useRef(null);
  const [map, setMap] = useState();

  const center = props.center;
  const zoom = props.zoom;
  const onClick = props.onClick;

  useEffect(() => {
    const map = new window.google.maps.Map(ref.current, {
      center,
      zoom,
    });
    if (onClick) {
      map.addListener("click", onClick);
    }
  });

  return (
    <>
      <div ref={ref} className="h-full w-full" id="map"></div>
    </>
  );
};

export default function CardMap(props) {
  const ref = useRef();
  const [map, setMap] = useState();
  const onClick = props.onClick;

  const zoom = 10;
  const center = { lat: -6.182211, lng: 106.794078 };
  useEffect(() => {
    if (ref.current && !map) {
      setMap(new window.google.Map(ref.current, {}));
    }
  }, [ref, map]);

  const render = (status) => {
    return <h1>{status}</h1>;
  };

  return (
    <>
      <div className="flex h-52 w-52 ">
        <Wrapper className="w-full h-full" render={render}>
          <Map onClick={onClick} zoom={zoom} center={center}></Map>
        </Wrapper>
      </div>
    </>
  );
}
