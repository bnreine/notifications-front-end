import { Box, Card, CardContent, Stack } from '@mui/material';
import slackSvg from '../../../assets/icons/slack.svg';
import FieldValueStack from '../field-value-stack';
import TitleSubtitleStack from '../title-subtitle-stack';

const SlackDestinationCard = ({ destination }) => (
  <Card>
    <CardContent sx={{ p: 2, paddingBottom: '16px!important' }}>
      <Stack spacing={2} direction="row">
        <Box
          component="img"
          src={slackSvg}
          alt="slack"
          sx={{
            width: 24,
            height: 24,
          }}
        />
        <Stack spacing={2}>
          <TitleSubtitleStack
            title={'Slack'}
            subTitle={'Receive notifications on Slack channels'}
          />
          <Stack
            direction="row"
            spacing={4}
            sx={{ justifyContent: 'space-between' }}
          >
            <FieldValueStack
              field={'Workspace'}
              value={destination.metadata.workspaceName}
            />

            <FieldValueStack
              field={'Channel'}
              value={destination.metadata.channelName}
            />

            <FieldValueStack field={'Status'} value={'active'} />
          </Stack>
        </Stack>
      </Stack>
    </CardContent>
  </Card>
);

export default SlackDestinationCard;
