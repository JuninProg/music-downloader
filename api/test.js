const { default: axios } = require('axios');
const { createReadStream } = require('fs');
const { mkdir } = require('fs/promises');
const readline = require('readline');
const { fetchYoutubeLink } = require('./dist/src/fetch');
const { timeoutPromise } = require('./dist/src/helper');

(async () => {
  try {
    const FILE_PATH =
      '/home/jose/Documents/personal/music-downloader/api/data/link música pai.txt';

    const interface = readline.createInterface({
      input: createReadStream(FILE_PATH),
    });

    let indexOfDir = -1;

    const dirs = [];

    for await (const l of interface) {
      const line = l.replaceAll(/\s/g, '');
      if (line.startsWith('Pasta:')) {
        indexOfDir += 1;
        dirs.push({
          name: line.split('Pasta:')[1],
          links: [],
        });
      } else {
        dirs[indexOfDir].links.push(line);
      }
    }

    // const data = [];

    // for (const dir of dirs) {
    //   await mkdir(
    //     `/home/jose/Documents/personal/music-downloader/api/temp/musics/${dir.name}`
    //   );

    //   for (const link of dir.links)
    //     data.push({
    //       link,
    //       localDirPath: `/home/jose/Documents/personal/music-downloader/api/temp/musics/${dir.name}`,
    //     });
    // }

    // for (const value of data)
    //   await Promise.race([
    //     fetchYoutubeLink(value),
    //     timeoutPromise(180000),
    //   ]).catch((error) => console.error(error));

    // console.log('finish');

    const response = await axios({
      url: 'http://localhost:3000/musics',
      method: 'POST',
      data: { dirs },
    });

    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
})();
