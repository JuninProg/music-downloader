import AdmZip from 'adm-zip';

export interface IZipDTO {
  localDirToZip: string;
  zipFilePath: string;
}

export async function zip(data: IZipDTO): Promise<void> {
  const zip = new AdmZip();

  zip.addLocalFolder(data.localDirToZip);

  return new Promise((resolve, reject) => {
    zip.writeZip(data.zipFilePath, (error) => {
      if (error) reject(error);
      resolve();
    });
  });
}
