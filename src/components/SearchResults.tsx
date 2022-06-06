import {useState} from 'react';
import {useMap, usePlaces} from '../context';
import {Feature} from '../interfaces/places';

const SearchResults = () => {
  const {places, isLoadingPlaces, userLocation} = usePlaces();
  const {map, getRouteBetweenPoints} = useMap();
  const [activeID, setActiveID] = useState('');

  const onPlaceClicked = (place: Feature) => {
    const [lng, lat] = place.center;
    setActiveID(place.id);
    map?.flyTo({
      zoom: 14,
      center: [lng, lat],
    });
  };

  const getRoute = (place: Feature) => {
    if (!userLocation) return;
    const [lng, lat] = place.center;
    getRouteBetweenPoints(userLocation, [lng, lat]);
  };

  if (isLoadingPlaces) {
    return (
      <div className="alert alert-primary mt-2">
        <h6>Buscando</h6>
        <p>Espere por favor...</p>
      </div>
    );
  }

  if (places.length === 0) {
    return <></>;
  }

  return (
    <ul className="list-group mt-3">
      {places.map(place => (
        <li
          className={`list-group-item list-group-item-action pointer ${
            activeID === place.id ? 'active' : ''
          }`}
          key={place.id}
          onClick={() => onPlaceClicked(place)}>
          <h6>{place.text_es}</h6>
          <p
            style={{
              fontSize: '12px',
            }}>
            {place.place_name}
          </p>
          <button
            className={`btn btn-outline-primary btn-sm ${
              activeID === place.id
                ? 'btn-outline-light'
                : 'btn-outline-primary'
            }`}
            onClick={() => getRoute(place)}>
            Direcciones
          </button>
        </li>
      ))}
    </ul>
  );
};

export default SearchResults;
