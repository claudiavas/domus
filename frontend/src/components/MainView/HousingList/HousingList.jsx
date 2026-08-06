import { useContext, useState, useEffect } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Box, Card, Skeleton, Pagination, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Switch } from '@mui/material';
import HouseCard from './Card/HouseCard';
import { HousingContext } from '../../Contexts/HousingContext';
import { AuthContext } from '../../Contexts/AuthContext';
import HousingContextFilter from '../../FilterHousing/HousingContextFilter';
import { filtraViviendas, puntuaRelevancia } from '../../../utils/filtraViviendas';
import { useTranslation } from 'react-i18next';
//import { RoomFilter } from '../../FilterHousing';
//import { Link } from 'react-router-dom';

export function HousingList({ myHousingSwitch, onToggleMias }) {

  const { t } = useTranslation('ui');
  
  const { housing, isLoading } = useContext(HousingContext);
  const { profile } = useContext(AuthContext);
  const { transaction, meter, room, baths, garage, minPrice, maxPrice, checkbox, province, municipality, neighborhood, population } = useContext(HousingContextFilter)
  // Client-side pagination, twelve listings per page
  const POR_PAGINA = 12;
  const [pagina, setPagina] = useState(1);
  const [orden, setOrden] = useState('recientes');
  const esMovil = useMediaQuery('(max-width:600px)');

  // Filters shared with the map view plus the "mine only" toggle.
  // Relevance mode scores every listing instead of excluding them
  const filtros = { transaction, meter, room, baths, garage, minPrice, maxPrice, checkbox, province, municipality, neighborhood, population };
  const esRelevancia = orden === 'relevancia';
  // Relevance mode relaxes every criterion except the operation filter,
  // which is exclusive and always applies
  const base = esRelevancia
    ? filtraViviendas(housing, { ...filtros, meter: 0, room: '', baths: '', garage: '', minPrice: '', maxPrice: '', checkbox: {}, province: undefined, municipality: undefined, population: undefined, neighborhood: undefined })
    : filtraViviendas(housing, filtros);
  const housingFiltrado = base
    .filter((house) => (myHousingSwitch ? house.user._id === profile._id : true))
  // The signed-in user's own listings sink to the end: browsing is about
  // other people's offers (there is a dedicated toggle for one's own)
  .sort((a, b) => {
    const aMia = a.user?._id === profile?._id ? 1 : 0;
    const bMia = b.user?._id === profile?._id ? 1 : 0;
    return aMia - bMia;
  });


  // Card-shaped skeletons while the data loads
  if (isLoading) {
    return (
      <div>
        {[1, 2, 3].map((k) => (
          <Box key={k} sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: '10px', mb: '20px', mx: { md: '15px' } }}>
            <Skeleton variant="rounded" sx={{ width: { xs: '100%', md: '39%' }, height: 230 }} />
            <Card sx={{ flex: 1, p: 2 }}>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <Skeleton variant="rounded" width={60} height={24} />
                <Skeleton variant="rounded" width={60} height={24} />
              </Box>
              <Skeleton width="60%" height={32} />
              <Skeleton width="40%" />
              <Skeleton width="70%" />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                <Skeleton variant="circular" width={28} height={28} />
                <Skeleton width="30%" />
              </Box>
              <Skeleton width="50%" height={28} sx={{ mt: 1 }} />
            </Card>
          </Box>
        ))}
      </div>
    );
  }

  if (!housing || housing.length === 0) {
    return <h1>{t('noListings')}</h1>;
  }

  // With active criteria every card shows its match percentage
  // (hard-filter modes always yield 100%: they satisfy everything)
  // The operation toggle alone does not produce a match percentage
  const hayCriterios = Boolean(
    room || baths || garage || minPrice || maxPrice || Number(meter) > 0 ||
    province || municipality || population || neighborhood ||
    Object.values(checkbox).some(Boolean)
  );
  const conRelevancia = hayCriterios
    ? housingFiltrado.map((h) => ({ ...h, _relevancia: puntuaRelevancia(h, filtros) }))
    : housingFiltrado;
  const ordenadas = [...conRelevancia].sort((a, b) => {
    if (orden === 'precio') return a.price - b.price;
    if (esRelevancia) return b._relevancia - a._relevancia;
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0); // newest first
  });

  const totalPaginas = Math.max(1, Math.ceil(ordenadas.length / POR_PAGINA));
  const paginaActual = Math.min(pagina, totalPaginas);
  const visibles = ordenadas.slice((paginaActual - 1) * POR_PAGINA, paginaActual * POR_PAGINA);

  const cambiarPagina = (_e, nueva) => {
    setPagina(nueva);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      {/* Mis propiedades + ordenación, en la misma línea */}
      {/* Single row on every breakpoint, with compact controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'nowrap', gap: 1, mb: 2, ml: { md: '-20px' }, mr: { md: '15px' } }}>
        {Boolean(localStorage.getItem('token')) && onToggleMias ? (
          <FormControlLabel
            sx={{ ml: 0, mr: 0, '& .MuiFormControlLabel-label': { fontSize: { xs: 13, sm: 14 }, whiteSpace: 'nowrap' } }}
            control={<Switch size="small" checked={myHousingSwitch} onChange={onToggleMias} color="primary" />}
            label={t('myProperties')}
          />
        ) : <span />}
        <FormControl size="small" sx={{
          minWidth: { xs: 140, sm: 170 },
          '& .MuiInputBase-root': { fontSize: { xs: 13, sm: 14 } },
          '& .MuiInputLabel-root': { fontSize: { xs: 13, sm: 14 } },
        }}>
          <InputLabel id="orden-label">{t('sortBy')}</InputLabel>
          <Select labelId="orden-label" label={t('sortBy')} value={orden} onChange={(e) => { setOrden(e.target.value); setPagina(1); }}>
            <MenuItem value="recientes">{t('sortRecent')}</MenuItem>
            <MenuItem value="precio">{t('sortPrice')}</MenuItem>
            <MenuItem value="relevancia">{t('sortRelevance')}</MenuItem>
          </Select>
        </FormControl>
      </Box>
      {/* Renderizar los elementos filtrados */}
      {visibles.map((house) => (
        <HouseCard
          key={house._id}
          _id={house._id}
          house={house.description}
          province={house.province}
          municipality={house.municipality}
          population={house.population}
          neighborhood={house.neighborhood}
          currency={house.currency}
          price={house.price}
          squareMeters={house.squareMeters}
          title={house.title}
          rooms={house.rooms}
          baths={house.baths}
          transaction={house.transaction}
          type={house.type}
          furnished={house.furnished}
          garages={house.garages}
          images={house.images}
          coordinates={house.coordinates}
          createdAt={house.createdAt}
          relevancia={hayCriterios ? house._relevancia : null}
          pool={house.pool}
          terrace={house.terrace}
          garden={house.garden}
          showRealEstateLogo={house.showRealEstateLogo}
          user={house.user}
          userId={house.user._id}
        />
      ))}
      {totalPaginas > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2, ml: { md: '-20px' }, mr: { md: '15px' } }}>
          <Pagination
            count={totalPaginas}
            page={paginaActual}
            onChange={cambiarPagina}
            color="primary"
            // Compact variant so every page number fits one row on mobile
            size={esMovil ? 'small' : 'medium'}
            siblingCount={esMovil ? 0 : 1}
            boundaryCount={1}
          />
        </Box>
      )}
    </div>







  );

}
