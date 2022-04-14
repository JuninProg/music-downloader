import { FlowProducer, Worker } from 'bullmq';
import { redisConn } from './config/redis';
import { fetchMusicLinkWorker, zipMusicsWorker } from './worker';

export type QueueName = 'download_musics';
export type JobName = 'zip_musics' | 'fetch_music_link';

export const BackgroundQueue = new FlowProducer({
  connection: redisConn.duplicate(),
});

const QUEUE: QueueName = 'download_musics';

const NUM_OF_WORKERS = parseInt(process.env.CONCURRENCY as string);

for (let i = 0; i < NUM_OF_WORKERS; i++) {
  new Worker(
    QUEUE,
    async (job) => {
      try {
        switch (job.name as JobName) {
          case 'zip_musics':
            await zipMusicsWorker(job);
            break;
          case 'fetch_music_link':
            const { fileSizeInBytes } = await fetchMusicLinkWorker(job.data);
            return fileSizeInBytes;
          default:
            throw new Error('JOB desconhecido: ' + job.name);
        }
      } catch (error) {
        console.log(
          `WORKER_${job.name.toUpperCase()}: ${
            error instanceof Error ? error.message : 'erro desconhecido'
          }`
        );
      }
    },
    { connection: redisConn.duplicate() }
  );
}
