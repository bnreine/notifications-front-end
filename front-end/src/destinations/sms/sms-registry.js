import SmsDestinationCard from './sms-destination-card';
import SmsAddMenuItem from './sms-add-menu-item';
import IconComponent from '../icon-component';
import smsSvg from '../../../assets/icons/sms.svg';

const smsRegistry = {
  DestinationCard: SmsDestinationCard,
  AddMenuItem: SmsAddMenuItem,
  IconComponent: () => <IconComponent iconSvg={smsSvg} alt={'sms'} />,
};

export default smsRegistry;
