import {createContext, useContext, useEffect, useReducer} from 'react';
import {AnySourceData, LngLatBounds, Map, Marker, Popup} from 'mapbox-gl';
import {usePlaces} from './Places';
import {directionsApi} from '../MapHandler';
import {DirectionsResponse} from '../interfaces/Directions';

interface MapContextProps extends MapState {
  setMap: (map: Map) => void;
  getRouteBetweenPoints: (
    start: [number, number],
    end: [number, number],
  ) => Promise<void>;
}
interface MapState {
  isMapReady: boolean;
  map?: Map;
  markers: Marker[];
}

interface Props {
  children: JSX.Element | JSX.Element[];
}

const MapContext = createContext<MapContextProps>({} as MapContextProps);

type MapAction =
  | {type: 'setMap'; payload: Map}
  | {type: 'setMarkers'; payload: Marker[]};

const MapReducer = (state: MapState, action: MapAction): MapState => {
  switch (action.type) {
    case 'setMap':
      return {
        ...state,
        map: action.payload,
        isMapReady: true,
      };
    case 'setMarkers':
      return {
        ...state,
        markers: action.payload,
      };
    default:
      return state;
  }
};

const INITAL_STATE: MapState = {
  isMapReady: false,
  map: undefined,
  markers: [],
};

const Maps = ({children}: Props) => {
  const [state, dispatch] = useReducer(MapReducer, INITAL_STATE);
  const {places} = usePlaces();

  useEffect(() => {
    state.markers.forEach(marker => marker.remove());
    const newMarkers: Marker[] = [];
    for (const place of places) {
      const [lng, lat] = place.center;
      const popup = new Popup().setHTML(`
        <h6>${place.text_es}</h6>
        <p>${place.place_name_es}</p>
      `);
      const newMarker = new Marker()
        .setPopup(popup)
        .setLngLat([lng, lat])
        .addTo(state.map!);
      newMarkers.push(newMarker);
    }
    // TODO: limpiar polyline
    dispatch({type: 'setMarkers', payload: newMarkers});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [places]);

  const setMap = (map: Map) => {
    const myLocationPopup = new Popup().setHTML(`<h4>Aqui estoy</h4>
    <p>En algun lugar del mundo</p>
    `);
    new Marker({
      color: '#61FA',
    })
      .setLngLat(map.getCenter())
      .setPopup(myLocationPopup)
      .addTo(map);
    dispatch({type: 'setMap', payload: map});
  };

  const getRouteBetweenPoints = async (
    start: [number, number],
    end: [number, number],
  ) => {
    const resp = await directionsApi.get<DirectionsResponse>(
      `/${start.join(',')};${end.join(',')}`,
    );
    const {distance, duration, geometry} = resp.data.routes[0];
    const {coordinates: coords} = geometry;
    let kms = distance / 1000;
    kms = Math.round(kms * 100);
    kms /= 100;
    const minutes = Math.floor(duration / 60);
    const bounds = new LngLatBounds(start, start);
    for (const coord of coords) {
      const newCoord: [number, number] = [coord[0], coord[1]];
      bounds.extend(newCoord);
    }
    state.map?.fitBounds(bounds, {
      padding: 120,
    });
    // Polyline
    const sourceData: AnySourceData = {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: coords,
            },
          },
        ],
      },
    };
    if (state.map?.getLayer('RouteString')) {
      state.map.removeLayer('RouteString');
      state.map.removeSource('RouteString');
    }
    state.map?.addSource('RouteString', sourceData);
    state.map?.addLayer({
      id: 'RouteString',
      type: 'line',
      source: 'RouteString',
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
      paint: {
        'line-color': 'white',
        'line-width': 3,
      },
    });
  };

  return (
    <MapContext.Provider
      value={{
        ...state,
        setMap,
        getRouteBetweenPoints,
      }}>
      {children}
    </MapContext.Provider>
  );
};

export const useMap = (): MapContextProps => {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error('Context Map Error');
  }
  return context;
};

export default Maps;
