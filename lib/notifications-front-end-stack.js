const { Stack } = require('aws-cdk-lib');
// const sqs = require('aws-cdk-lib/aws-sqs');

class NotificationsFrontEndStack extends Stack {
  /**
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    // The code that defines your stack goes here
  }
}

module.exports = { NotificationsFrontEndStack };
