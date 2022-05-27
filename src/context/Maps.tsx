import {createContext, useContext, useReducer} from 'react';
import {Map, Marker, Popup} from 'mapbox-gl';

interface MapContextProps {
  isMapReady: boolean;
  map?: Map;
  setMap: (map: Map) => void;
}
interface MapState {
  isMapReady: boolean;
  map?: Map;
}

interface Props {
  children: JSX.Element | JSX.Element[];
}

const MapContext = createContext<MapContextProps>({} as MapContextProps);

type MapAction = {type: 'setMap'; payload: Map};

const MapReducer = (state: MapState, action: MapAction): MapState => {
  switch (action.type) {
    case 'setMap':
      return {
        ...state,
        map: action.payload,
        isMapReady: true,
      };
    default:
      return state;
  }
};

const INITAL_STATE: MapState = {
  isMapReady: false,
  map: undefined,
};

const Maps = ({children}: Props) => {
  const [state, dispatch] = useReducer(MapReducer, INITAL_STATE);

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

  return (
    <MapContext.Provider
      value={{
        ...state,
        setMap,
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
