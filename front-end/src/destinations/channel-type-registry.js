import slackRegistry from './slack-registry';
import defaultRegistry from './default-registry';
import whatsAppRegistry from './whatsapp-registry';
import smsRegistry from './sms-registry';

const channelTypeRegistry = {
  slack: slackRegistry,
  whatsapp: whatsAppRegistry,
  sms: smsRegistry,
  default: defaultRegistry,
};

export default channelTypeRegistry;
