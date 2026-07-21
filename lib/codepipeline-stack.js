const { Stack, pipelines, Fn, aws_codebuild, aws_iam, aws_ssm } = require('aws-cdk-lib');
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

      const buildFrontEnd =          new pipelines.CodeBuildStep('BuildFrontEnd', {
          commands: [
              'cd front-end',
              'npm ci',
              'npm run build'
          ],
          primaryOutputDirectory: "front-end/dist",
      })


          productionStage.addPost(
              buildFrontEnd
      )

      const distributionId = aws_ssm.StringParameter.valueForStringParameter(
          this,
          "/notifications/prod/frontend/distribution-id"
      );

      const s3BucketName = aws_ssm.StringParameter.valueForStringParameter(
          this,
          "/notifications/prod/frontend/bucket-name"
      );

      const deployFrontEnd = new pipelines.CodeBuildStep('DeployFrontEnd', {
          input: buildFrontEnd.primaryOutput,
          commands: [
              "aws s3 sync . s3://$WEBSITE_BUCKET --delete",
              "aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths '/*'"
          ],
          env: {
              WEBSITE_BUCKET: s3BucketName,
              DISTRIBUTION_ID: distributionId,
          },
          rolePolicyStatements: [
              new aws_iam.PolicyStatement({
                  actions: [
                      "s3:ListBucket",
                      "s3:GetObject",
                      "s3:PutObject",
                      "s3:DeleteObject",
                  ],
                  resources: [
                      `arn:aws:s3:::${s3BucketName}`,
                      `arn:aws:s3:::${s3BucketName}/*`,
                  ],
              }),
              new aws_iam.PolicyStatement({
                  actions: ["cloudfront:CreateInvalidation"],
                  resources: ["*"],
              }),
          ],
      })

      productionStage.addPost(
          deployFrontEnd
      );


    pipeline.buildPipeline();
  }
}

module.exports = { CodepipelineStack };
