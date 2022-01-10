import fs from 'fs';
import ytdl from 'ytdl-core';
import { timeoutPromise } from './helper';

export interface IFetchYoutubeLinkDTO {
  link: string;
  localDirPath: string;
}

export async function fetchYoutubeLink(
  data: IFetchYoutubeLinkDTO
): Promise<{ fileSizeInBytes: number; musicTitle: string } | null> {
  const info = await Promise.race([
    ytdl.getInfo(data.link),
    // 3 min timeout
    timeoutPromise(180000),
  ]);

  return new Promise((resolve, reject) => {
    if (info === null) resolve(null);
    else {
      const musicTitle = info.videoDetails.title.trim().replaceAll('/', '');

      const filePath = `${data.localDirPath}/${musicTitle}.mp4`;

      const readable = ytdl(data.link, {
        filter: (format) => format.container === 'mp4',
      });

      let fileSizeInBytes = 0;

      readable.on('progress', (number) => {
        fileSizeInBytes += number as number;
      });

      readable.on('error', (error) => reject(error));

      const stream = readable.pipe(fs.createWriteStream(filePath));

      stream.on('error', (error) => reject(error));
      stream.on('close', () => resolve({ fileSizeInBytes, musicTitle }));
    }
  });
}
