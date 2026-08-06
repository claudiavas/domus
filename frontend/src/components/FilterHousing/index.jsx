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
import HousingContext from './HousingContextFilter';
import { LocationContext } from '../Contexts/LocationContext'
import { GEOAPI_KEY, GEOAPI_URL } from '../../config';

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
 * Cascading location selects backed by the Spanish INE geo API.
 * Values live in the shared filter context so "clear filters" and
 * "use saved search" stay in sync with the dropdowns.
 */
export function LocationFilter() {
  const { t } = useTranslation('ui');
  const { provinces } = useContext(LocationContext);
  // Values live in the shared filter context so "clear filters" and
  // "use saved search" stay in sync with these dropdowns
  const { province, setProvince, municipality, setMunicipality, population, setPopulation, neighborhood, setNeighborhood } = useContext(HousingContext);

  const [municipalities, setMunicipalities] = useState([]);
  const [populations, setPopulations] = useState([]);
  const [neighborhoods, setNeighborhoods] = useState([]);


  useEffect(() => {
    if (province?.CPRO) {
      axios.get(`${GEOAPI_URL}/municipios?CPRO=${province.CPRO}&type=JSON&key=${GEOAPI_KEY}&sandbox=0`)
        .then(({ data }) => setMunicipalities(data.data || []))
        .catch(console.error);
    } else {
      setMunicipalities([]);
    }
  }, [province]);

  useEffect(() => {
    if (province?.CPRO && municipality?.CMUM) {
      axios.get(`${GEOAPI_URL}/poblaciones?CPRO=${province.CPRO}&CMUM=${municipality.CMUM}&type=JSON&key=${GEOAPI_KEY}&sandbox=0`)
        .then(({ data }) => setPopulations(data.data || []))
        .catch(console.error);
    } else {
      setPopulations([]);
    }
  }, [province, municipality]);

  useEffect(() => {
    if (province?.CPRO && municipality?.CMUM && population?.NENTSI50) {
      const nents = population.NENTSI50.replace(/\s/g, '%20');
      axios.get(`${GEOAPI_URL}/nucleos?CPRO=${province.CPRO}&CMUM=${municipality.CMUM}&NENTSI50=${nents}&type=JSON&key=${GEOAPI_KEY}&sandbox=0`)
        .then(({ data }) => setNeighborhoods((data.data || []).filter(n => !/DISEMINADO/i.test(n.NNUCLE50 || ''))))
        .catch(console.error);
    } else {
      setNeighborhoods([]);
    }
  }, [province, municipality, population]);

  // Al cambiar un nivel se limpian los inferiores
  const elegirProvincia = (e) => { setProvince(e.target.value || undefined); setMunicipality(undefined); setPopulation(undefined); setNeighborhood(undefined); };
  const elegirMunicipio = (e) => { setMunicipality(e.target.value || undefined); setPopulation(undefined); setNeighborhood(undefined); };
  const elegirPoblacion = (e) => { setPopulation(e.target.value || undefined); setNeighborhood(undefined); };
  const elegirBarrio = (e) => { setNeighborhood(e.target.value || undefined); };

  // MUI Select compares by identity: resolve the list object with the same code
  const valorEnLista = (lista, sel, campo) => lista.find(x => x[campo] === sel?.[campo]) || '';

  return (
    // Flex column so vertical margins between the selects do not collapse
    // and the rhythm matches the rest of the panel
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <FormControl size="small" sx={{ width: '90%', ml: '1em' }}>
        <InputLabel id="province-label">{t('province')}*</InputLabel>
        <Select labelId="province-label" label={`${t('province')}*`} name="province" value={valorEnLista(provinces, province, 'CPRO')} onChange={elegirProvincia}>
          {provinces.map((p) => (
            <MenuItem key={p.CPRO} value={p}>{p.PRO}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ width: '90%', ml: '1em' }} disabled={!municipalities.length}>
        <InputLabel id="municipality-label">{t('municipality')}*</InputLabel>
        <Select labelId="municipality-label" label={`${t('municipality')}*`} name="municipality" value={valorEnLista(municipalities, municipality, 'CMUM')} onChange={elegirMunicipio}>
          {municipalities.map((m) => (
            <MenuItem key={m.CMUM} value={m}>{m.DMUN50}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ width: '90%', ml: '1em' }} disabled={!populations.length}>
        <InputLabel id="population-label">{t('population')}*</InputLabel>
        <Select labelId="population-label" label={`${t('population')}*`} name="population" value={valorEnLista(populations, population, 'CPOB')} onChange={elegirPoblacion}>
          {populations.map((pob) => (
            <MenuItem key={pob.CPOB} value={pob}>{pob.NENTSI50}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ width: '90%', ml: '1em' }} disabled={!neighborhoods.length}>
        <InputLabel id="neighborhood-label">{t('neighborhood')}*</InputLabel>
        <Select labelId="neighborhood-label" label={`${t('neighborhood')}*`} name="neighborhood" value={valorEnLista(neighborhoods, neighborhood, 'NNUCLE50')} onChange={elegirBarrio}>
          {neighborhoods.map((n, i) => (
            <MenuItem key={n.NNUCLE50 || i} value={n}>{n.NNUCLE50}</MenuItem>
          ))}
        </Select>
      </FormControl>
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
      <InputLabel id="demo-select-small-label">{t('rooms')}</InputLabel>
      <Select
        labelId="demo-select-small-label"
        id="demo-select-small"
        value={room}
        label="Room"
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
      <InputLabel id="demo-select-small-label">{t('baths')}</InputLabel>
      <Select
        labelId="demo-select-small-label"
        id="demo-select-small"
        value={baths}
        label="Bath"
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
      <InputLabel id="demo-select-small-label">{t('garage')}</InputLabel>
      <Select
        labelId="demo-select-small-label"
        id="demo-select-small"
        value={garage}
        label="Garage"
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
