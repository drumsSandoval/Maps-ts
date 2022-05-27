import ButtonLocation from '../components/ButtonLocation';
import Icon from '../components/Icon';
import MapView from '../components/MapView';
import SearchBar from '../components/SearchBar';
import './styles.css';

const Home = () => {
  return (
    <div>
      <MapView />
      <ButtonLocation />
      <Icon />
      <SearchBar />
    </div>
  );
};

export default Home;
