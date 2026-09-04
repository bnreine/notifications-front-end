import WhatsAppDestinationCard from './whatsapp-destination-card';
import WhatsAppAddMenuItem from './whatsapp-add-menu-item';
import IconComponent from '../icon-component';
import whatsAppSvg from '../../../assets/icons/WhatsApp.svg';

const whatsappRegistry = {
  DestinationCard: WhatsAppDestinationCard,
  AddMenuItem: WhatsAppAddMenuItem,
  IconComponent: () => <IconComponent iconSvg={whatsAppSvg} alt={'whatsapp'} />,
};

export default whatsappRegistry;
