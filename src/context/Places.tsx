import {createContext, useContext, useEffect, useReducer} from 'react';
import {getUserLocation} from '../helpers';
import {Feature, PlacesResponse} from '../interfaces/places';
import searchAPI from '../MapHandler';
interface PlacesContextProps extends PlacesState {
  searchPlacesByTerm: (query: string) => Promise<Feature[]>;
}

const PlacesContext = createContext<PlacesContextProps>(
  {} as PlacesContextProps,
);

type PlacesAction =
  | {
      type: 'setUserLocation';
      payload: [number, number];
    }
  | {type: 'setPlaces'; payload: Feature[]}
  | {type: 'setLoadingPlaces'};

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
    case 'setLoadingPlaces':
      return {
        ...state,
        isLoadingPlaces: true,
        places: [],
      };
    case 'setPlaces':
      return {
        ...state,
        places: action.payload,
        isLoadingPlaces: false,
      };
    default:
      return state;
  }
};

interface PlacesState {
  isLoading: boolean;
  userLocation?: [number, number];
  isLoadingPlaces: boolean;
  places: Feature[];
}

const INITIAL_STATE: PlacesState = {
  isLoading: true,
  userLocation: undefined,
  isLoadingPlaces: false,
  places: [],
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

  const searchPlacesByTerm = async (query: string) => {
    if (query.length === 0) {
      return []; // TODO: Limpiar State
    }
    if (!state.userLocation) {
      throw new Error('No hay ubicación del usuario');
    }
    dispatch({type: 'setLoadingPlaces'});
    const resp = await searchAPI.get<PlacesResponse>(`/${query}.json`, {
      params: {
        proximity: state.userLocation.join(','),
      },
    });
    dispatch({type: 'setPlaces', payload: resp.data.features});
    return resp.data.features;
  };

  return (
    <PlacesContext.Provider value={{...state, searchPlacesByTerm}}>
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
