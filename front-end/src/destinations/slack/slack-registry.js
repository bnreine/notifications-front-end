import SlackDestinationCard from './slack-destination-card';
import IconComponent from '../icon-component';
import slackSvg from '../../../assets/icons/slack.svg';

const slackRegistry = {
  DestinationCard: SlackDestinationCard,
  IconComponent: () => <IconComponent iconSvg={slackSvg} alt={'slack'} />,
};

export default slackRegistry;
