import { useContext } from 'react';
import { Box, Card, Skeleton } from '@mui/material';
import HouseCard from './Card/HouseCard';
import { HousingContext } from '../../Contexts/HousingContext';
import { AuthContext } from '../../Contexts/AuthContext';
import HousingContextFilter from '../../FilterHousing/HousingContextFilter';
import { useTranslation } from 'react-i18next';
//import { RoomFilter } from '../../FilterHousing';
//import { Link } from 'react-router-dom';

export function HousingList({myHousingSwitch}) {

  const {t} = useTranslation(['translation', 'filters']);
  
  console.log("myHousingSwitch", myHousingSwitch);
  const { housing, isLoading } = useContext(HousingContext);
  console.log("Los datos de Housing son:", housing)
  const { profile } = useContext(AuthContext);
  const { meter, room, baths, garage, minPrice, maxPrice, checkbox, province, municipality, neighborhood, population } = useContext(HousingContextFilter)
  const housingFiltrado = housing.filter((house) => {
  
    // Aplicar el filtro de habitaciones y metros cuadrados
    const myHousingFilter = myHousingSwitch ? house.user._id === profile._id : true;
    const cumpleFiltroHabitaciones = room ? house.rooms >= parseInt(room) : true;
    const cumpleFiltroMetrosCuadrados = house.squareMeters >= meter;
    const cumpleFiltroBaths = baths ? house.baths >= parseInt(baths) : true;
    const cumpleFiltroGarage = garage ? house.garages >= parseInt(garage) : true;
    const cumpleFiltroMinPrice = minPrice ? house.price >= Number(minPrice) : true;
    const cumpleFiltroMaxPrice = maxPrice ? house.price <= Number(maxPrice) : true;
    // Los nombres del modelo de vivienda difieren de los del estado de checkboxes
    const cumpleFiltroCheckbox =  (!checkbox.closet || house.closets) &&
    (!checkbox.air_condicioned || house.airConditioned) &&
    (!checkbox.heating || house.heating) &&
    (!checkbox.elevator || house.elevator) &&
    (!checkbox.outside_view || house.outsideView) &&
    (!checkbox.garden || house.garden) &&
    (!checkbox.pool || house.pool) &&
    (!checkbox.terrace || house.terrace) &&
    (!checkbox.storage || house.storage) &&
    (!checkbox.accessible || house.accessible);
    const cumpleFiltroProvince = province ? (house.province?.CPRO === province.CPRO) : true;
    const cumpleFiltroMunicipality = municipality ? (house.municipality?.CMUM === municipality.CMUM) : true;
    const cumpleFiltroNeighborhood = neighborhood ? (house.neighborhood?.NNUCLE50 === neighborhood.NNUCLE50) : true;
    const cumpleFiltroPopulation = population ? (house.population?.CUN === population.CUN) : true;
    

    return myHousingFilter  && cumpleFiltroHabitaciones &&  cumpleFiltroMetrosCuadrados && cumpleFiltroBaths && cumpleFiltroGarage && cumpleFiltroMinPrice  && cumpleFiltroMaxPrice && cumpleFiltroCheckbox && cumpleFiltroProvince && cumpleFiltroMunicipality &&cumpleFiltroPopulation && cumpleFiltroNeighborhood  ;
  })
  // Las viviendas del usuario logueado se muestran al final: al navegar
  // interesa ver primero la oferta de otros (las propias tienen su switch)
  .sort((a, b) => {
    const aMia = a.user?._id === profile?._id ? 1 : 0;
    const bMia = b.user?._id === profile?._id ? 1 : 0;
    return aMia - bMia;
  });


  // Esqueletos con la silueta de la tarjeta mientras llegan los datos
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
    return <h1>No hay datos de viviendas disponibles.</h1>;
  }

  return (
    <div>
      {/* Renderizar los elementos filtrados */}
      {housingFiltrado.map((house) => (
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
          pool={house.pool}
          terrace={house.terrace}
          garden={house.garden}
          showRealEstateLogo={house.showRealEstateLogo}
          user={house.user}
          userId={house.user._id}
        />
      ))}
    </div>







    // <>
    // <div>

    //   {housing
    //     .filter((house) => {
    //       if (room && room !== '') {
    //         return house.rooms === parseInt(room);
    //       }
    //       return true;
    //     })
    //     .map((house) => (
    //       <HouseCard
    //         key={house._id}
    //         _id={house._id}
    //         house={house.description}
    //         province={house.province}
    //         municipality={house.municipality}
    //         population={house.population}
    //         neighborhood={house.neighborhood}
    //         currency={house.currency}
    //         price={house.price}
    //         squareMeters={house.squareMeters}
    //         description={house.description}
    //         rooms={house.rooms}
    //         baths={house.baths}
    //       />
    //       // </Link>
    //     ))}
    // </div>
    // </>
  );

}
