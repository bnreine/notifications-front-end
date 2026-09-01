import slackSvg from '../../assets/icons/sms.svg';
import { Card, Stack, CardContent } from '@mui/material';
import { useAsync } from 'react-async';
import { useSessionContext } from '../session-context';
import halson from 'halson';
import channelTypeRegistry from './channel-type-registry';

const DESTINATIONS_URL =
  'https://api2.notifications.benjaminreinecke.click/destinations';

const fetchDestinations = async ({ accessToken }, {}) => {
  const response = await fetch(DESTINATIONS_URL, {
    headers: {
      Authorization: accessToken,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load destinations (${response.status})`);
  }

  const data = halson(await response.json());
  const destinations = data.getEmbeds('destinations');

  return destinations;
};

const Destinations = () => {
  const { accessToken } = useSessionContext();

  const { data = [], isLoading } = useAsync({
    promiseFn: fetchDestinations,
    accessToken,
  });

  // const destinationCard = channelTypeRegistry[DESTINATIONS_URL];

  return (
    <Stack spacing={2} direction="column" sx={{ p: 2 }}>
      {data.map((destination) => {
        const DestinationCard = (
          channelTypeRegistry[destination.channelType] ||
          channelTypeRegistry.default
        ).DestinationCard;
        return (
          <DestinationCard key={destination.id} destination={destination} />
        );
      })}
    </Stack>
  );

  // return <img  src={slackSvg}></img>
};

export default Destinations;
