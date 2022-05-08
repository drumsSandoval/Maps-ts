import {usePlaces} from '../context';
import Loading from './Loading';

const MapView = () => {
  const {isLoading, userLocation} = usePlaces();
  if (isLoading) {
    return <Loading />;
  }
  return <div>{userLocation?.join(',')}</div>;
};

export default MapView;
