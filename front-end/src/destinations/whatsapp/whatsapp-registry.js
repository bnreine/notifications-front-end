import WhatsAppDestinationCard from './whatsapp-destination-card';
import IconComponent from '../icon-component';
import whatsAppSvg from '../../../assets/icons/WhatsApp.svg';

const whatsappRegistry = {
  DestinationCard: WhatsAppDestinationCard,
  IconComponent: () => <IconComponent iconSvg={whatsAppSvg} alt={'whatsapp'} />,
};

export default whatsappRegistry;
