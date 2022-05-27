import {ChangeEvent, useRef} from 'react';
import {usePlaces} from '../context';

const SearchBar = () => {
  const debounceRef = useRef<NodeJS.Timeout>();
  const {searchPlacesByTerm} = usePlaces();
  const onQueryChanged = (event: ChangeEvent<HTMLInputElement>) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      searchPlacesByTerm(event.target.value);
    }, 1000);
  };

  return (
    <div className="search-container">
      <input
        type="text"
        className="form-control"
        placeholder="Buscar lugar..."
        onChange={onQueryChanged}
      />
    </div>
  );
};

export default SearchBar;
