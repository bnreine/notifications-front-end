import SmsDestinationCard from './sms-destination-card';
import IconComponent from '../icon-component';
import smsSvg from '../../../assets/icons/sms.svg';

const smsRegistry = {
  DestinationCard: SmsDestinationCard,
  IconComponent: () => <IconComponent iconSvg={smsSvg} alt={'sms'} />,
};

export default smsRegistry;
