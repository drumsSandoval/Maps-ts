import {useMap, usePlaces} from '../context';

const ButtonLocation = () => {
  const {map, isMapReady} = useMap();
  const {userLocation} = usePlaces();

  const onClick = () => {
    if (!isMapReady) {
      throw new Error('Mapa no esta listo');
    }
    if (!userLocation) {
      throw new Error('No existe  la ubicación del usuario');
    }
    map?.flyTo({
      zoom: 14,
      center: userLocation,
    });
  };

  return (
    <button
      className="btn btn-primary"
      onClick={onClick}
      style={{
        position: 'fixed',
        top: '20px',
        zIndex: 999,
        right: '20px',
      }}>
      Mi ubicación
    </button>
  );
};

export default ButtonLocation;
