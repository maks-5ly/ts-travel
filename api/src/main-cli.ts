import { CommandFactory } from 'nest-commander';
import { CommandsModule } from './commands/commands.module';

async function bootstrap() {
  await CommandFactory.run(CommandsModule, ['warn', 'error']);
}

bootstrap()
  .then(async () => {
    console.info('command bootstrapped ...!');
    process.exit(0);
  })
  .catch((err) => {
    console.error(`server failed to start command`, err);
    process.exit(1);
  });
