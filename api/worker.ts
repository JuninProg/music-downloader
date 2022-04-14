import { Job } from 'bullmq';
import { fetchYoutubeLink } from './fetch';
import { zip } from './zip';
import { exec } from 'child_process';
import { rm } from 'fs/promises';

function execPromise(command: string): Promise<void> {
  return new Promise((resolve, reject) => {
    exec(command, (error) => {
      if (error) reject(new Error(error.message));
      resolve();
    });
  });
}

export interface IFetchMusicLinkWorkerDTO {
  id: string;
  localDirPath: string;
  musicLink: string;
}

export async function fetchMusicLinkWorker(
  data: IFetchMusicLinkWorkerDTO
): Promise<{ fileSizeInBytes: number }> {
  const partialLink = data.musicLink.substring(0, 50);

  const response = await fetchYoutubeLink({
    link: data.musicLink,
    localDirPath: data.localDirPath,
  });

  if (response === null)
    throw new Error(`Não foi possível baixar a música do link: ${partialLink}`);

  const audioFilePath = `${data.localDirPath}/${response.musicTitle}.mp3`;
  const videoFilePath = `${data.localDirPath}/${response.musicTitle}.mp4`;

  // older command: `ffmpeg -i '${videoFilePath}' -q:a 0 -map a '${audioFilePath}'`

  await execPromise(
    `ffmpeg -i '${videoFilePath}' -vn '${audioFilePath}'`
  ).catch((error) =>
    console.error(
      `FETCH_MUSIC_LINK_WORKER: ${
        error instanceof Error ? error.message : 'erro desconhecido'
      }`
    )
  );

  await rm(videoFilePath);

  return { fileSizeInBytes: response.fileSizeInBytes };
}

export interface IZipMusicsWorkerDTO {
  id: string;
  localDirToZip: string;
  zipFilePath: string;
}

export async function zipMusicsWorker(job: Job<IZipMusicsWorkerDTO>) {
  const data = job.data;

  await zip({
    localDirToZip: data.localDirToZip,
    zipFilePath: data.zipFilePath,
  });

  const children = await job.getChildrenValues();
  const totalSizeInBytes = Object.values(children)
    .filter((val) => val !== null)
    .reduce((prev, cur) => prev + cur, 0);
  const totalSizeInMb = totalSizeInBytes / 1024 / 1024;
  const zipName = data.zipFilePath.split('/').reverse()[0];

  console.log(`ZIP_FINISHED: ${zipName} - ${totalSizeInMb.toFixed(2)} Mb`);
}
