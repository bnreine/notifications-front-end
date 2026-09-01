import slackRegistry from './slack/slack-registry';
import defaultRegistry from './default/default-registry';
import whatsAppRegistry from './whatsapp/whatsapp-registry';
import smsRegistry from './sms/sms-registry';

const channelTypeRegistry = {
  slack: slackRegistry,
  whatsapp: whatsAppRegistry,
  sms: smsRegistry,
  default: defaultRegistry,
};

export default channelTypeRegistry;
