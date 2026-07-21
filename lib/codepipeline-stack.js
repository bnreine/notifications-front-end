const { Stack, pipelines, Fn, aws_codebuild, aws_iam } = require('aws-cdk-lib');
const { CodePipeline, CodePipelineSource, ShellStep } = pipelines;
const { ProductionStage } = require('./production-stage');

class CodepipelineStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const githubConnectionArn = Fn.importValue('GlobalGitHubConnectionArn');

    const pipeline = new CodePipeline(this, 'NotificationsFrontEndPipeline', {
      codeBuildDefaults: {
        buildEnvironment: {
          buildImage: aws_codebuild.LinuxBuildImage.STANDARD_7_0,
        },
        partialBuildSpec: aws_codebuild.BuildSpec.fromObject({
          version: '0.2',
          phases: {
            install: {
              'runtime-versions': {
                nodejs: '22',
              },
            },
          },
        }),
      },
      pipelineName: 'NotificationsFrontEndPipeline',
      selfMutation: true,
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.connection('bnreine/notifications-front-end', 'main', {
          connectionArn: githubConnectionArn,
          triggerOnPush: true,
        }),
        commands: ['npm ci', 'npx cdk synth'],
      }),
    });

      const productionStage = pipeline.addStage(new ProductionStage(this, 'ProductionStage', props))


          productionStage.addPost(
          new pipelines.CodeBuildStep('BuildFrontEnd', {
              commands: [
                  'cd front-end',
                  'npm ci',
                  'npm run build',
                  'ls dist'
              ]
          })
      )

      // const deployFrontEnd = new pipelines.CodeBuildStep('DeployFrontEnd', {
      //     commands: [
      //         "aws s3 sync . s3://$WEBSITE_BUCKET --delete",
      //         "aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths '/*'"
      //     ],
      //     env: {
      //         WEBSITE_BUCKET: productionStageInternal.notificationsFrontEndStack.websiteBucket.bucketName,
      //         DISTRIBUTION_ID: productionStageInternal.notificationsFrontEndStack.distribution.distributionId,
      //     },
      //     rolePolicyStatements: [
      //         new aws_iam.PolicyStatement({
      //             actions: [
      //                 "s3:ListBucket",
      //                 "s3:GetObject",
      //                 "s3:PutObject",
      //                 "s3:DeleteObject",
      //             ],
      //             resources: [
      //                 productionStageInternal.notificationsFrontEndStack.websiteBucket.bucketArn,
      //                 `${productionStageInternal.notificationsFrontEndStack.websiteBucket.bucketArn}/*`,
      //             ],
      //         }),
      //         new aws_iam.PolicyStatement({
      //             actions: ["cloudfront:CreateInvalidation"],
      //             resources: ["*"],
      //         }),
      //     ],
      // })

      // productionStage.addPost(
      //     deployFrontEnd
      // );


    pipeline.buildPipeline();
  }
}

module.exports = { CodepipelineStack };
