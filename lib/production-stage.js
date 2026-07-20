const { Stage } = require('aws-cdk-lib');
const { NotificationsFrontEndStack } = require('./notifications-front-end-stack');

class ProductionStage extends Stage {
  constructor(scope, id, props) {
    super(scope, id, props);

    new NotificationsFrontEndStack(this, 'NotificationsFrontEndStack', props);
  }
}

module.exports = { ProductionStage };
