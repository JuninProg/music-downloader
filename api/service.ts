import * as uuid from 'uuid';
import { createReadStream, ReadStream } from 'fs';
import { mkdir } from 'fs/promises';
import { BackgroundQueue, JobName, QueueName } from './queue';
import { FlowJob } from 'bullmq';
import { IFetchMusicLinkWorkerDTO, IZipMusicsWorkerDTO } from './worker';

const TEMP_DIR_PATH = process.env.TEMP_DIR_PATH as string;
const DOWNLOAD_INITIAL_LINK = process.env.DOWNLOAD_INITIAL_LINK as string;

export function getUniqueId(): string {
  const parts = uuid.v4().split('-');
  const part1 = parts.pop() as string;
  const part2 = parts.pop() as string;
  return part1 + part2;
}

export interface IDir {
  name: string;
  links: string[];
}

export interface IMusicsDTO {
  dirs: IDir[];
}

export async function downloadMusics(
  data: IMusicsDTO
): Promise<{ zipFileLink: string }> {
  const uniqueId = getUniqueId();
  const localRootDirPath = `${TEMP_DIR_PATH}/${uniqueId}`;
  const FORMAT = 'zip';
  const zipFileName = `${uniqueId}.${FORMAT}`;
  const zipFilePath = `${localRootDirPath}/${zipFileName}`;
  const zipFileLink = `${DOWNLOAD_INITIAL_LINK}/musics/${zipFileName}`;
  const queueName: QueueName = 'download_musics';

  const dirsToCreate: string[] = [];
  const fetchMusicLinkJobs: FlowJob[] = [];

  for (const dir of data.dirs) {
    const localDirPath = `${localRootDirPath}/${dir.name}`;
    dirsToCreate.push(localDirPath);
    for (const link of dir.links) {
      const jobName: JobName = 'fetch_music_link';
      const jobData: IFetchMusicLinkWorkerDTO = {
        id: uniqueId,
        localDirPath,
        musicLink: link,
      };
      fetchMusicLinkJobs.push({
        name: jobName,
        queueName,
        data: jobData,
      });
    }
  }

  const CHUNK_SIZE = 10;
  while (dirsToCreate.length > 0)
    await Promise.all(
      dirsToCreate
        .splice(0, CHUNK_SIZE)
        .map((dirToCreate) => mkdir(dirToCreate, { recursive: true }))
    );

  const zipData: IZipMusicsWorkerDTO = {
    id: uniqueId,
    localDirToZip: localRootDirPath,
    zipFilePath,
  };

  const zipJobName: JobName = 'zip_musics';

  await BackgroundQueue.add({
    name: zipJobName,
    queueName,
    children: fetchMusicLinkJobs,
    data: zipData,
  });

  return { zipFileLink };
}

export function getZipedMusics(zipFileName: string): ReadStream {
  const uniqueId = zipFileName.split('.')[0];
  const zipFilePath = `${TEMP_DIR_PATH}/${uniqueId}/${zipFileName}`;
  return createReadStream(zipFilePath);
}
