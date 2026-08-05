import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
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


{/* 
//Location

export function LocationFilter() {

  const { provinces } = useContext(LocationContext);
  const [municipalities, setMunicipalities] = useState([]);
  const [populations, setPopulations] = useState([]);
  const [neighborhoods, setNeighborhoods] = useState([]);

  const [selectedMunicipality, setSelectedMunicipality] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState([]);
  const [selectedPopulation, setSelectedPopulation] = useState([]);
  // const [selectedNeighborhood, setSelectedNeighborhood] = useState([]);

  const [formData, setFormData] = useState({});


  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(formData, formData)
    // Borrar los errores previos antes de la validación
    // clearErrors();   
    try {
      // await validationSchema.validate(formData, { abortEarly: false });
      const response = await addHousing(formData);
      console.log(formData, formData)
      setHousing([...housing, formData]); // Actualizar el estado de housing en el contexto
    } catch (error) {
      console.error(error);
    }
  };
  
  const { province, setProvince } = useContext(HousingContext);
  const { municipality, setMunicipality } = useContext(HousingContext);
  const { neighborhood, setNeighborhood } = useContext(HousingContext);
  const { population, setPopulation } = useContext(HousingContext);


  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    setProvince(setSelectedProvince.value);
    setMunicipality(setSelectedMunicipality.value);
    //setNeighborhood(setSelectedNeighborhood.value);
    setPopulation(setSelectedPopulation.value);


    switch (name) {
      case 'province':
        setProvince(value);
        setSelectedProvince(value);
        break;
      case 'municipality':
        setMunicipality(value);
        setSelectedMunicipality(value);
        break;
      case 'neighborhood':
        setNeighborhood(value);
        setSelectedNeighborhood(value);
        break;
      case 'population':
        setPopulation(value);
        setSelectedPopulation(value);
        break;

    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: fieldValue,
    }));
  };

  const fetchMunicipalities = async () => {
    try {
      const { data } = await axios.get(`https://apiv1.geoapi.es/municipios?CPRO=${selectedProvince.CPRO}&type=JSON&key=eb280e481fbc76bc3be11e0e4b108687b76439c4d70beb2fbab3d7e56d772760&sandbox=0`);
      setMunicipalities(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPopulations = async () => {
    try {
      const { data } = await axios.get(`https://apiv1.geoapi.es/poblaciones?CPRO=${selectedProvince.CPRO}&CMUM=${selectedMunicipality.CMUM}&type=JSON&key=eb280e481fbc76bc3be11e0e4b108687b76439c4d70beb2fbab3d7e56d772760&sandbox=0`);
      setPopulations(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchNeighborhoods = async () => {
    try {
      const encodedNENTS150 = selectedPopulation.NENTSI50.replace(/\s/g, '%20');
      const { data } = await axios.get(`https://apiv1.geoapi.es/nucleos?CPRO=${selectedProvince.CPRO}&CMUM=${selectedMunicipality.CMUM}&NENTSI50=${encodedNENTS150}&type=JSON&key=eb280e481fbc76bc3be11e0e4b108687b76439c4d70beb2fbab3d7e56d772760&sandbox=0`);
      setNeighborhoods(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (selectedProvince) {
      fetchMunicipalities();
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedMunicipality) {
      fetchPopulations();
    }
  }, [selectedMunicipality]);

  useEffect(() => {
    if (selectedPopulation) {
      fetchNeighborhoods();
    }
  }, [selectedPopulation]);




  ///////////////////////////////////////////////////////////////////////

  return (
    <div>

      <FormControl size="small" sx={{ width: '90%', ml: '1em' }}>
        <InputLabel id="province-label">Provincia*</InputLabel>
        <Select
          labelId="province-label"
          name="province"
          value={formData.province}
          onChange={setProvince}
        // error={!!errors.province}
        // helpertext={errors.province}
        >

          {provinces.map((province) => (
            <MenuItem key={province.CPRO} value={province}>
              {province.PRO}
            </MenuItem>
          ))}

        </Select>
      </FormControl> 

<FormControl size="small" sx={{ width: '90%', ml: '1em' }} disabled={!municipalities.length}>
        <InputLabel id="municipality-label">Municipio*</InputLabel>
        <Select
          labelId="municipality-label"
          name="municipality"
          value={formData.municipality}
          onChange={handleChange}
        // error={!!errors.municipality}
        // helpertext={errors.municipality}
        >

          {municipalities.map((municipality) => (
            <MenuItem key={municipality.CMUM} value={municipality}>
              {municipality.DMUN50}
            </MenuItem>
          ))}

        </Select>
      </FormControl> 
      <FormControl size="small" sx={{ width: '90%', ml: '1em' }} disabled={!populations.length}>
        <InputLabel id="province-label">Población*</InputLabel>
        <Select
          labelId="population-label"
          name="population"
          value={formData.population}
          onChange={handleChange}
        // error={!!errors.province}
        // helpertext={errors.province}
        >

          {populations.map((population) => (
            <MenuItem key={population.CUN} value={population}>
              {population.NENTSI50}
            </MenuItem>
          ))}

        </Select>
      </FormControl> 


 <FormControl size="small" sx={{ width: '90%', ml: '1em' }} disabled={!neighborhoods.length}>
        <InputLabel id="neighborhood-label">Barrio*</InputLabel>
        <Select
          labelId="neighborhood-label*"
          name="neighborhood"
          value={formData.neighborhood}
          onChange={handleChange}
        // error={!!errors.neighborhood} 
        // helpertext={errors.neighborhood}
        >

          {neighborhoods.map((neighborhood) => (
            <MenuItem key={neighborhood.CUN} value={neighborhood}>
              {neighborhood.NNUCLE50}
            </MenuItem>
          ))}

        </Select>
      </FormControl> 

    </div>

  );
}
*/}
 
//Prueba chat gpt


export function LocationFilter() {
  const { provinces } = useContext(LocationContext);
  // Los valores viven en el contexto de filtros: así "limpiar filtros" y
  // "usar búsqueda guardada" se reflejan también en estos desplegables
  const { province, setProvince, municipality, setMunicipality, population, setPopulation, neighborhood, setNeighborhood } = useContext(HousingContext);

  const [municipalities, setMunicipalities] = useState([]);
  const [populations, setPopulations] = useState([]);
  const [neighborhoods, setNeighborhoods] = useState([]);

  const GEOKEY = 'eb280e481fbc76bc3be11e0e4b108687b76439c4d70beb2fbab3d7e56d772760';

  useEffect(() => {
    if (province?.CPRO) {
      axios.get(`https://apiv1.geoapi.es/municipios?CPRO=${province.CPRO}&type=JSON&key=${GEOKEY}&sandbox=0`)
        .then(({ data }) => setMunicipalities(data.data || []))
        .catch(console.error);
    } else {
      setMunicipalities([]);
    }
  }, [province]);

  useEffect(() => {
    if (province?.CPRO && municipality?.CMUM) {
      axios.get(`https://apiv1.geoapi.es/poblaciones?CPRO=${province.CPRO}&CMUM=${municipality.CMUM}&type=JSON&key=${GEOKEY}&sandbox=0`)
        .then(({ data }) => setPopulations(data.data || []))
        .catch(console.error);
    } else {
      setPopulations([]);
    }
  }, [province, municipality]);

  useEffect(() => {
    if (province?.CPRO && municipality?.CMUM && population?.NENTSI50) {
      const nents = population.NENTSI50.replace(/\s/g, '%20');
      axios.get(`https://apiv1.geoapi.es/nucleos?CPRO=${province.CPRO}&CMUM=${municipality.CMUM}&NENTSI50=${nents}&type=JSON&key=${GEOKEY}&sandbox=0`)
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

  // El Select compara por identidad: usar el objeto de la lista con el mismo código
  const valorEnLista = (lista, sel, campo) => lista.find(x => x[campo] === sel?.[campo]) || '';

  return (
    <div>
      <FormControl size="small" sx={{ width: '90%', ml: '1em' }}>
        <InputLabel id="province-label">Provincia*</InputLabel>
        <Select labelId="province-label" label="Provincia*" name="province" value={valorEnLista(provinces, province, 'CPRO')} onChange={elegirProvincia}>
          {provinces.map((p) => (
            <MenuItem key={p.CPRO} value={p}>{p.PRO}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ width: '90%', ml: '1em' }} disabled={!municipalities.length}>
        <InputLabel id="municipality-label">Municipio*</InputLabel>
        <Select labelId="municipality-label" label="Municipio*" name="municipality" value={valorEnLista(municipalities, municipality, 'CMUM')} onChange={elegirMunicipio}>
          {municipalities.map((m) => (
            <MenuItem key={m.CMUM} value={m}>{m.DMUN50}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ width: '90%', ml: '1em' }} disabled={!populations.length}>
        <InputLabel id="population-label">Población*</InputLabel>
        <Select labelId="population-label" label="Población*" name="population" value={valorEnLista(populations, population, 'CPOB')} onChange={elegirPoblacion}>
          {populations.map((pob) => (
            <MenuItem key={pob.CPOB} value={pob}>{pob.NENTSI50}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ width: '90%', ml: '1em' }} disabled={!neighborhoods.length}>
        <InputLabel id="neighborhood-label">Barrio*</InputLabel>
        <Select labelId="neighborhood-label" label="Barrio*" name="neighborhood" value={valorEnLista(neighborhoods, neighborhood, 'NNUCLE50')} onChange={elegirBarrio}>
          {neighborhoods.map((n, i) => (
            <MenuItem key={n.NNUCLE50 || i} value={n}>{n.NNUCLE50}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

export function PriceFilterMin() {
  const { minPrice, setMinPrice } = useContext(HousingContext);


  const handleChangeMinPrice = (event) => {
    setMinPrice(event.target.value);
  };


  return (
    
    <TextField
      size="small"
      type="number"
      label="Mínimo"
      value={minPrice}
      onChange={handleChangeMinPrice}
      InputProps={{ endAdornment: <InputAdornment position="end">€</InputAdornment> }}
      sx={{ width: '43%', ml: '1em' }}
    />

  );


}

export function PriceFilterMax() {
  const { maxPrice, setMaxPrice } = useContext(HousingContext);



  const handleChangeMaxPrice = (event) => {
    setMaxPrice(event.target.value);
  };


  return (
    <TextField
      size="small"
      type="number"
      label="Máximo"
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
    console.log("Esto son los metros cuadrados seleccionados", value);
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
  //const [room, setRoom] = React.useState('');
  const { room, setRoom } = useContext(HousingContext);


  const handleChangeRooms = (event) => {
    setRoom(event.target.value);
  };

  return (
    <FormControl sx={{ my: 0.75, width: '90%', marginLeft:'1em' }} size="small">
      <InputLabel id="demo-select-small-label">Habitaciones</InputLabel>
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
  const { baths, setBaths } = useContext(HousingContext);


  const handleChangeBaths = (event) => {
    setBaths(event.target.value);
  };

  return (
    <FormControl sx={{ my: 0.75, width: '90%', marginLeft:'1em' }} size="small">
      <InputLabel id="demo-select-small-label">Baños</InputLabel>
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
  const { garage, setGarage } = useContext(HousingContext);

  const handleChangeGarage = (event) => {
    setGarage(event.target.value);
  };

  return (
    <FormControl sx={{ my: 0.75, width: '90%', marginLeft:'1em' }} size="small">
      <InputLabel id="demo-select-small-label">Garaje</InputLabel>
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
            label="Armarios"
          />
          <FormControlLabel
            control={
              <Checkbox checked={air_condicioned} onChange={handleChangeCheckbox} name="air_condicioned" />
            }
            label="Aire acondicionado"
          />
          <FormControlLabel
            control={
              <Checkbox checked={heating} onChange={handleChangeCheckbox} name="heating" />
            }
            label="Calefacción"
          />
          <FormControlLabel
            control={
              <Checkbox checked={elevator} onChange={handleChangeCheckbox} name="elevator" />
            }
            label="Ascensor"
          />
          <FormControlLabel
            control={
              <Checkbox checked={outside_view} onChange={handleChangeCheckbox} name="outside_view" />
            }
            label="Vistas al exterior"
          />
          <FormControlLabel
            control={
              <Checkbox checked={garden} onChange={handleChangeCheckbox} name="garden" />
            }
            label="Jardín"
          />
          <FormControlLabel
            control={
              <Checkbox checked={pool} onChange={handleChangeCheckbox} name="pool" />
            }
            label="Piscina"
          />
          <FormControlLabel
            control={
              <Checkbox checked={terrace} onChange={handleChangeCheckbox} name="terrace" />
            }
            label="Terraza"
          />
          <FormControlLabel
            control={
              <Checkbox checked={storage} onChange={handleChangeCheckbox} name="storage" />
            }
            label="Trastero"
          />
          <FormControlLabel
            control={
              <Checkbox checked={accessible} onChange={handleChangeCheckbox} name="accessible" />
            }
            label="Accesible"
          />
        </FormGroup>
      </FormControl>

    </Box>
  );
}




/// end checkbox filters
