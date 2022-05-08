import {createContext, useContext, useEffect, useReducer} from 'react';
import {getUserLocation} from '../helpers';
interface PlacesContextProps extends PlacesState {}

const PlacesContext = createContext<PlacesContextProps>(
  {} as PlacesContextProps,
);

type PlacesAction = {
  type: 'setUserLocation';
  payload: [number, number];
};

const PlacesReducer = (
  state: PlacesState,
  action: PlacesAction,
): PlacesState => {
  switch (action.type) {
    case 'setUserLocation':
      return {
        ...state,
        isLoading: false,
        userLocation: action.payload,
      };
    default:
      return state;
  }
};

interface PlacesState {
  isLoading: boolean;
  userLocation?: [number, number];
}

const INITIAL_STATE: PlacesState = {
  isLoading: true,
  userLocation: undefined,
};

const PlacesProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  const [state, dispatch] = useReducer(PlacesReducer, INITIAL_STATE);

  useEffect(() => {
    getUserLocation().then(lngLat =>
      dispatch({type: 'setUserLocation', payload: lngLat}),
    );
  }, []);

  return (
    <PlacesContext.Provider value={{...state}}>
      {children}
    </PlacesContext.Provider>
  );
};

export const usePlaces = (): PlacesContextProps => {
  const context = useContext(PlacesContext);
  if (context === undefined) {
    throw new Error('PlACES CONTEXT ERROR');
  }
  return context;
};

export default PlacesProvider;
