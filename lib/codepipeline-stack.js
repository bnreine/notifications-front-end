const { Stack, pipelines, Fn, aws_codebuild } = require('aws-cdk-lib');
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
                nodejs: '20',
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

    const productionStage = pipeline.addStage(new ProductionStage(this, 'ProductionStage', props));

      productionStage.addPost(
          new pipelines.CodeBuildStep('BuildFrontEnd', {
              commands: [
                  'cd front-end',
                  'npm ci',
                  'npm run build',
                  'ls dist'
              ]
              // build webpack
          })
      );
      //
      productionStage.addPost(
          new pipelines.CodeBuildStep('DeployFrontEnd', {
              commands: [
                  'echo deploy'
              ]
              // s3 sync and invalidate
          })
      );

    pipeline.buildPipeline();
  }
}

module.exports = { CodepipelineStack };
