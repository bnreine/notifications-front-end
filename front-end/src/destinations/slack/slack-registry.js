import SlackDestinationCard from './slack-destination-card';
import SlackAddMenuItem from './slack-add-menu-item';
import IconComponent from '../icon-component';
import slackSvg from '../../../assets/icons/slack.svg';

const slackRegistry = {
  DestinationCard: SlackDestinationCard,
  AddMenuItem: SlackAddMenuItem,
  IconComponent: () => <IconComponent iconSvg={slackSvg} alt={'slack'} />,
};

export default slackRegistry;
