import { useState } from 'react';
import { Card, Stack, CardContent, Skeleton } from '@mui/material';
import { useAsync } from 'react-async';
import { useSessionContext } from '../session-context';
import halson from 'halson';
import channelTypeRegistry from './channel-type-registry';
import AddDestinationButton from './add-destination-button';

const DESTINATIONS_URL =
  'https://api2.notifications.benjaminreinecke.click/destinations';
const SKELETON_COUNT = 8;

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

const DestinationCardSkeleton = () => (
  <Card sx={{ height: 138, boxSizing: 'border-box' }}>
    <CardContent
      sx={{
        p: 2,
        paddingBottom: '16px!important',
        height: '100%',
        boxSizing: 'border-box',
      }}
    >
      <Stack spacing={2} direction="row">
        <Skeleton variant="rounded" width={24} height={24} />
        <Stack spacing={2} sx={{ flex: 1 }}>
          <Stack>
            <Skeleton variant="text" width={72} sx={{ fontSize: '1rem' }} />
            <Skeleton
              variant="text"
              width={220}
              sx={{ fontSize: '0.875rem' }}
            />
          </Stack>
          <Stack direction="row" spacing={4}>
            <Stack>
              <Skeleton
                variant="text"
                width={80}
                sx={{ fontSize: '0.875rem' }}
              />
              <Skeleton
                variant="text"
                width={120}
                sx={{ fontSize: '0.875rem' }}
              />
            </Stack>
            <Stack>
              <Skeleton
                variant="text"
                width={80}
                sx={{ fontSize: '0.875rem' }}
              />
              <Skeleton
                variant="text"
                width={120}
                sx={{ fontSize: '0.875rem' }}
              />
            </Stack>
            <Stack>
              <Skeleton
                variant="text"
                width={48}
                sx={{ fontSize: '0.875rem' }}
              />
              <Skeleton
                variant="text"
                width={64}
                sx={{ fontSize: '0.875rem' }}
              />
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </CardContent>
  </Card>
);

const Destinations = () => {
  const { accessToken } = useSessionContext();
  const [destinationInMemoryUpdates, setDestinationInMemoryUpdates] = useState(
    {}
  );

  const {
    data = [],
    isPending: isLoading,
    reload,
  } = useAsync({
    promiseFn: fetchDestinations,
    accessToken,
    onResolve: () => {
      setDestinationInMemoryUpdates({});
    },
  });

  const handleDestinationChange = (destinationId, update) => {
    setDestinationInMemoryUpdates((current) => ({
      ...current,
      [destinationId]: update,
    }));
  };

  return (
    <Stack spacing={2} direction="column" sx={{ p: 2 }}>
      <Stack direction="row" justifyContent="flex-end">
        <AddDestinationButton accessToken={accessToken} onCreated={reload} />
      </Stack>
      {isLoading
        ? Array.from({ length: SKELETON_COUNT }, (_, index) => (
            <DestinationCardSkeleton key={index} />
          ))
        : data
            .map((destination) => {
              const update = destinationInMemoryUpdates[destination.id];
              return update ? { ...destination, ...update } : destination;
            })
            .filter((destination) => !destination.deleted)
            .map((destination) => {
              const DestinationCard = (
                channelTypeRegistry[destination.channelType] ||
                channelTypeRegistry.default
              ).DestinationCard;
              return (
                <DestinationCard
                  key={destination.id}
                  destination={destination}
                  accessToken={accessToken}
                  onDestinationChange={handleDestinationChange}
                />
              );
            })}
    </Stack>
  );
};

export default Destinations;
