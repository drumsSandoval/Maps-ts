import {Map} from 'mapbox-gl';
import {useRef, useLayoutEffect} from 'react';
import {usePlaces} from '../context';
import Loading from './Loading';

const MapView = () => {
  const {isLoading, userLocation} = usePlaces();
  const mapView = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!isLoading) {
      new Map({
        container: mapView.current!,
        style: 'mapbox://styles/mapbox/streets-v11', // style URL
        center: userLocation,
        zoom: 9, // starting zoom
      });
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
        backgroundColor: 'red',
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
