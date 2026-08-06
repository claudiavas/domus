import { useEffect, useState } from 'react';
import { RequestCard } from './RequestCard/RequestCard';
import { Box, Card, Skeleton, Grid } from '@mui/material';
import { getActiveRequest } from '../../apiService/apiService';
import { useContext } from 'react';
import { AuthContext } from '../../Contexts/AuthContext';
import { useTranslation } from 'react-i18next';


export function RequestList({ myRequestsSwitch, alUsarBusqueda }) {
  const { profile } = useContext(AuthContext);
  const { t } = useTranslation('ui');
  const [requesting, setRequest] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequest = async () => {
    try {
      const data = await getActiveRequest();
      setRequest(data);
      setLoading(false);
    } catch (error) {

      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequest();
  }, []);

  if (loading) {
    return (
      <div>
        {[1, 2].map((k) => (
          <Card key={k} sx={{ p: 2, mb: '20px', mx: { md: '15px' } }}>
            <Skeleton width="40%" height={32} />
            <Skeleton width="60%" />
            <Skeleton width="80%" />
          </Card>
        ))}
      </div>
    );
  }

  const mias = requesting.filter((r) => r.user?._id && r.user._id === profile?._id);
  if (!mias.length) {
    return <h1>{t('noSearches')}</h1>;
  }

  return (
    <Grid container spacing={2}>
      {requesting
        .filter((r) => r.user?._id && r.user._id === profile?._id) // own searches only
        .map((request) => (
        <Grid item xs={12} md={6} key={request._id}>
        <RequestCard
          key={request._id}
          _id={request._id}
          showRealEstateLogo={request.showRealEstateLogo}
          user={request.user || {}} // a request without an owner must not break the card
          alUsarBusqueda={alUsarBusqueda}
          requestCompleta={request}
          title={request.title}
          type={request.type}
          transaction={request.transaction}
          country={request.country}
          province={request.province}
          municipality={request.municipality}
          population={request.population}
          neighborhood={request.neighborhood}
          minM2={request.minM2}
          maxM2={request.maxM2}
          currency={request.currency}
          minPrice={request.minPrice}
          maxPrice={request.maxPrice}
          floorLevel={request.floorLevel}
          facing={request.facing}
          propertyAge={request.propertyAge}
          rooms={request.rooms}
          baths={request.baths}
          garages={request.garages}
          condition={request.condition}
          furnished={request.furnished}
          kitchenEquipment={request.kitchenEquipment}
          closets={request.closets}
          airConditioned={request.airConditioned}
          heating={request.heating}
          elevator={request.elevator}
          outsideView={request.outsideView}
          garden={request.garden}
          pool={request.pool}
          terrace={request.terrace}
          storage={request.storage}
          accessible={request.accessible}
        />
        </Grid>
      ))}
    </Grid>
  );
}
