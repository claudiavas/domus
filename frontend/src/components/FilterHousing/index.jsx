import React, { useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Slider from '@mui/material/Slider';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import HousingContext from './HousingContextFilter';
import { PHOTON_URL } from '../../config';

/**
 * Primary filter of the panel: buy / rent / vacation rental.
 * Multiple options can be active at once (e.g. buy and rent together);
 * an empty selection shows every listing.
 */
export function TransactionFilter() {
  const { t } = useTranslation('ui');
  const { transaction, setTransaction } = useContext(HousingContext);

  return (
    <ToggleButtonGroup
      fullWidth
      size="small"
      color="primary"
      value={transaction || []}
      onChange={(_e, value) => setTransaction(value || [])}
      sx={{ width: '90%', ml: '1em', my: 0.75 }}
    >
      <ToggleButton value="sale">{t('buy')}</ToggleButton>
      <ToggleButton value="rent">{t('rent')}</ToggleButton>
      <ToggleButton value="vacation_rentals">{t('vacation')}</ToggleButton>
    </ToggleButtonGroup>
  );
}

/**
 * Formats a Photon (OpenStreetMap) feature as "name, city, state, country"
 * without repeating identical segments, plus its coordinates.
 * Shared by the filter panel and the publish/edit forms.
 */
export function photonFeatureToPlace(feature) {
  const p = feature.properties || {};
  const partes = [p.name, p.city, p.state, p.country]
    .filter(Boolean)
    .filter((v, i, arr) => arr.indexOf(v) === i);
  const [lng, lat] = feature.geometry?.coordinates || [];
  return { name: partes.join(', '), lat, lng, properties: p };
}

/**
 * Autocomplete wired to the Photon geocoder (OpenStreetMap data, no API
 * key, worldwide coverage). Notifies the picked place — { name, lat, lng,
 * properties } — through onPick; the parent decides where to store it.
 */
export function PlaceSearch({ value, onPick, label, sx }) {
  const { t } = useTranslation('ui');
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState(value?.name || '');

  // Debounced lookup while the user types; Photon needs no key and
  // already ranks results by importance
  useEffect(() => {
    if (inputValue.trim().length < 3) { setOptions([]); return; }
    const timer = setTimeout(() => {
      axios.get(`${PHOTON_URL}/?q=${encodeURIComponent(inputValue)}&limit=6`)
        .then(({ data }) => {
          const places = (data.features || [])
            .map(photonFeatureToPlace)
            .filter((o) => o.name && Number.isFinite(o.lat) && Number.isFinite(o.lng));
          setOptions(places);
        })
        .catch(() => setOptions([]));
    }, 350);
    return () => clearTimeout(timer);
  }, [inputValue]);

  return (
    <Autocomplete
      size="small"
      sx={sx}
      options={options}
      filterOptions={(x) => x}
      getOptionLabel={(o) => o?.name || ''}
      isOptionEqualToValue={(o, v) => o?.name === v?.name}
      value={value || null}
      onChange={(_e, place) => onPick(place || undefined)}
      inputValue={inputValue}
      onInputChange={(_e, nuevo) => setInputValue(nuevo)}
      noOptionsText={t('typeToSearch')}
      renderInput={(params) => <TextField {...params} label={label} />}
    />
  );
}

/**
 * Location search of the filter panel: a place autocomplete plus a radius
 * slider. The picked place and radius live in the shared filter context so
 * "clear filters" stays in sync; listings are then distance-filtered.
 */
export function LocationFilter() {
  const { t } = useTranslation('ui');
  const { location, setLocation, radius, setRadius } = useContext(HousingContext);

  return (
    // Flex column so vertical margins between the fields do not collapse
    // and the rhythm matches the rest of the panel
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <PlaceSearch
        value={location}
        onPick={(place) => setLocation(place ? { name: place.name, lat: place.lat, lng: place.lng } : undefined)}
        label={t('searchLocation')}
        sx={{ width: '90%', ml: '1em' }}
      />
      {location && (
        <Box sx={{ width: '90%', ml: '1em', mt: 0.5 }}>
          <FormLabel sx={{ fontSize: 13 }}>{`${t('radius')}: ${radius} km`}</FormLabel>
          <Slider
            size="small"
            value={radius}
            min={5}
            max={100}
            step={5}
            valueLabelDisplay="auto"
            onChange={(_e, valor) => setRadius(valor)}
          />
        </Box>
      )}
    </Box>
  );
}

export function PriceFilterMin() {
  const { t } = useTranslation('ui');
  const { minPrice, setMinPrice } = useContext(HousingContext);


  const handleChangeMinPrice = (event) => {
    setMinPrice(event.target.value);
  };


  return (
    
    <TextField
      size="small"
      type="number"
      label={t('min')}
      value={minPrice}
      onChange={handleChangeMinPrice}
      InputProps={{ endAdornment: <InputAdornment position="end">€</InputAdornment> }}
      sx={{ width: '43%', ml: '1em' }}
    />

  );


}

export function PriceFilterMax() {
  const { t } = useTranslation('ui');
  const { maxPrice, setMaxPrice } = useContext(HousingContext);



  const handleChangeMaxPrice = (event) => {
    setMaxPrice(event.target.value);
  };


  return (
    <TextField
      size="small"
      type="number"
      label={t('max')}
      value={maxPrice}
      onChange={handleChangeMaxPrice}
      InputProps={{ endAdornment: <InputAdornment position="end">€</InputAdornment> }}
      sx={{ width: '43%', ml: '0.5em' }}
    />

  );

}

///// End Price filter
///// Start Square_meters filter

function meters(value) {
  return `${value}²`;
}

export function SquareMeters() {

  const { meter, setMeter } = useContext(HousingContext);
  const [filterValue, setFilterValue] = useState(60);

  const handleChangeMeters = (event, value) => {
    setFilterValue(value)
    setMeter(value)
  };


  return (
    <Box sx={{ width: '90%', marginLeft:'1em' }}>
      <Slider
        aria-label="M²"
        value={filterValue}
        getAriaValueText={meters}
        valueLabelDisplay="auto"
        step={20}
        marks={true}
        min={30}
        max={300}
        onChange={handleChangeMeters}
      />
    </Box>
  );
}
///// End Square_meters filter
/// rooms filter
export function RoomFilter() {
  const { t } = useTranslation('ui');
  //const [room, setRoom] = React.useState('');
  const { room, setRoom } = useContext(HousingContext);


  const handleChangeRooms = (event) => {
    setRoom(event.target.value);
  };

  return (
    <FormControl sx={{ my: 0.75, width: '90%', marginLeft:'1em' }} size="small">
      <InputLabel id="rooms-filter-label">{t('rooms')}</InputLabel>
      <Select
        labelId="rooms-filter-label"
        id="rooms-filter"
        value={room}
        label={t('rooms')}
        onChange={handleChangeRooms}
      >

        <MenuItem value={1}>1+</MenuItem>
        <MenuItem value={2}>2+</MenuItem>
        <MenuItem value={3}>3+</MenuItem>
        <MenuItem value={4}>4+</MenuItem>
        <MenuItem value={5}>5+</MenuItem>
        <MenuItem value={6}>6+</MenuItem>

      </Select>
    </FormControl>
  );
}
/// end rooms filter



/// baths filter
export function BathFilter() {
  const { t } = useTranslation('ui');
  const { baths, setBaths } = useContext(HousingContext);


  const handleChangeBaths = (event) => {
    setBaths(event.target.value);
  };

  return (
    <FormControl sx={{ my: 0.75, width: '90%', marginLeft:'1em' }} size="small">
      <InputLabel id="baths-filter-label">{t('baths')}</InputLabel>
      <Select
        labelId="baths-filter-label"
        id="baths-filter"
        value={baths}
        label={t('baths')}
        onChange={handleChangeBaths}
      >

        <MenuItem value={1}>1+</MenuItem>
        <MenuItem value={2}>2+</MenuItem>
        <MenuItem value={3}>3+</MenuItem>
        <MenuItem value={4}>4+</MenuItem>
        <MenuItem value={5}>5+</MenuItem>

      </Select>
    </FormControl>
  );
}
/// end baths filter

/// garages filter
export function GaragesFilter() {
  const { t } = useTranslation('ui');
  const { garage, setGarage } = useContext(HousingContext);

  const handleChangeGarage = (event) => {
    setGarage(event.target.value);
  };

  return (
    <FormControl sx={{ my: 0.75, width: '90%', marginLeft:'1em' }} size="small">
      <InputLabel id="garage-filter-label">{t('garage')}</InputLabel>
      <Select
        labelId="garage-filter-label"
        id="garage-filter"
        value={garage}
        label={t('garage')}
        onChange={handleChangeGarage}
      >

        <MenuItem value={1}>1+</MenuItem>
        <MenuItem value={2}>2+</MenuItem>
        <MenuItem value={3}>3+</MenuItem>

      </Select>
    </FormControl>
  );
}
/// end garages filter

/// checkbox filters
export function CheckboxesFilters() {
  const { t } = useTranslation('ui');
  const { checkbox, setCheckbox } = useContext(HousingContext);

  const handleChangeCheckbox = (event) => {
    setCheckbox({
      ...checkbox,
      [event.target.name]: event.target.checked,
    });
  };

  const { closet, air_condicioned, heating, elevator, outside_view, garden, pool, terrace, storage, accessible } = checkbox;
  const error = [closet, air_condicioned, heating, elevator, outside_view, garden, pool, terrace, storage, accessible].filter((v) => v).length !== 2;

  return (
    <Box sx={{ display: 'flex' }}>
      <FormControl sx={{ marginLeft:'1em', marginBottom:'33%' }} component="fieldset" variant="standard">
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox checked={closet} onChange={handleChangeCheckbox} name="closet" />
            }
            label={t('closets')}
          />
          <FormControlLabel
            control={
              <Checkbox checked={air_condicioned} onChange={handleChangeCheckbox} name="air_condicioned" />
            }
            label={t('airConditioning')}
          />
          <FormControlLabel
            control={
              <Checkbox checked={heating} onChange={handleChangeCheckbox} name="heating" />
            }
            label={t('heating')}
          />
          <FormControlLabel
            control={
              <Checkbox checked={elevator} onChange={handleChangeCheckbox} name="elevator" />
            }
            label={t('elevator')}
          />
          <FormControlLabel
            control={
              <Checkbox checked={outside_view} onChange={handleChangeCheckbox} name="outside_view" />
            }
            label={t('outsideView')}
          />
          <FormControlLabel
            control={
              <Checkbox checked={garden} onChange={handleChangeCheckbox} name="garden" />
            }
            label={t('garden')}
          />
          <FormControlLabel
            control={
              <Checkbox checked={pool} onChange={handleChangeCheckbox} name="pool" />
            }
            label={t('pool')}
          />
          <FormControlLabel
            control={
              <Checkbox checked={terrace} onChange={handleChangeCheckbox} name="terrace" />
            }
            label={t('terrace')}
          />
          <FormControlLabel
            control={
              <Checkbox checked={storage} onChange={handleChangeCheckbox} name="storage" />
            }
            label={t('storage')}
          />
          <FormControlLabel
            control={
              <Checkbox checked={accessible} onChange={handleChangeCheckbox} name="accessible" />
            }
            label={t('accessible')}
          />
        </FormGroup>
      </FormControl>

    </Box>
  );
}




/// end checkbox filters
