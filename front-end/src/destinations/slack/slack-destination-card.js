import { Card, CardContent, Stack } from '@mui/material';
import slackSvg from '../../../assets/icons/slack.svg';
import FieldValueStack from '../field-value-stack';
import TitleSubtitleStack from '../title-subtitle-stack';
import IconComponent from '../icon-component';

const SlackDestinationCard = ({ destination }) => (
  <Card>
    <CardContent sx={{ p: 2, paddingBottom: '16px!important' }}>
      <Stack spacing={2} direction="row">
        <IconComponent iconSvg={slackSvg} alt={'slack'} />
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
