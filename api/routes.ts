import { FastifyPluginCallback } from 'fastify';
import plugin from 'fastify-plugin';
import { getMusicsSchema, postMusicsSchema } from './schemas';
import { downloadMusics, getZipedMusics, IMusicsDTO } from './service';

const routes: FastifyPluginCallback = (app, opts, done): void => {
  app.post('/musics', { schema: postMusicsSchema }, async (request, reply) => {
    try {
      const data = request.body as IMusicsDTO;

      const { zipFileLink } = await downloadMusics({ dirs: data.dirs });

      reply.status(200).type('application/json');
      return { link: zipFileLink };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'erro desconhecido';
      console.error(`POST_MUSICS: ${errorMessage}`);
      reply.status(500).type('application/json');
      return {
        message: errorMessage,
      };
    }
  });

  app.get(
    '/musics/:name',
    { schema: getMusicsSchema },
    async (request, reply) => {
      try {
        const data = request.params as Record<string, unknown>;
        const zipFileName = data['name'] as string;

        const stream = getZipedMusics(zipFileName);

        reply
          .status(200)
          .type('application/zip')
          .header('content-disposition', `filename="${zipFileName}"`)
          .send(stream);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'erro desconhecido';
        console.error(`GET_MUSICS: ${errorMessage}`);
        reply.status(500).type('application/json');
        return {
          message: errorMessage,
        };
      }
    }
  );

  done();
};

export default plugin(routes);
