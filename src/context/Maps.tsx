import {createContext, useContext, useReducer} from 'react';
import {Map} from 'mapbox-gl';

interface MapContextProps {
  isMapReady: boolean;
  map?: Map;
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
  return (
    <MapContext.Provider
      value={{
        ...state,
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
