import fastify from 'fastify';

import fastifyHelmet from 'fastify-helmet';
import fastifyCors from 'fastify-cors';
import routes from '../routes';

const app = fastify();

app.register(fastifyHelmet);
app.register(fastifyCors);
app.register(routes);

async function listen(port: number, host: string): Promise<void> {
  try {
    const mode = process.env.NODE_ENV || 'development';
    const address = await app.listen(port, host);
    console.log(
      `[${mode.toUpperCase()}] Music-Downloader API running on: ${address}`
    );
  } catch (error) {
    console.error(error);
    const FAILURE_PROCESS_EXIT_CODE = 1;
    process.exit(FAILURE_PROCESS_EXIT_CODE);
  }
}

export { listen, app };
