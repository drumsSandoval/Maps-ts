import {Map} from 'mapbox-gl';
import {useRef, useLayoutEffect} from 'react';
import {useMap, usePlaces} from '../context';
import Loading from './Loading';

const MapView = () => {
  const {isLoading, userLocation} = usePlaces();
  const mapView = useRef<HTMLDivElement>(null);
  const {setMap} = useMap();

  useLayoutEffect(() => {
    if (!isLoading) {
      const map = new Map({
        container: mapView.current!,
        style: 'mapbox://styles/mapbox/dark-v10', // style URL
        center: userLocation,
        zoom: 9, // starting zoom
      });
      setMap(map);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  if (isLoading) {
    return <Loading />;
  }
  return (
    <div
      ref={mapView}
      style={{
        height: '100vh',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
      }}>
      {userLocation?.join(',')}
    </div>
  );
};

export default MapView;
