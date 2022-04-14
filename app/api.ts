import axios, { AxiosInstance } from 'axios';

const MUSIC_API_URL = 'http://localhost:5000';

class MusicAPI {
  private api: AxiosInstance = axios.create({
    baseURL: MUSIC_API_URL,
  });

  handleError(error: unknown) {
    if (axios.isAxiosError(error)) {
      const { response } = error;

      if (!response) {
        return new Error(
          `Music-API não respondeu a requisição: ${error.message}`
        );
      } else {
        const message =
          response.data.message || response.statusText || 'erro desconhecido';
        return new Error(message);
      }
    } else {
      return new Error(
        error instanceof Error ? error.message : 'erro desconhecido'
      );
    }
  }

  async download(data: {
    dirs: { name: string; links: string[] }[];
  }): Promise<{ downloadLink: string }> {
    try {
      const response = await this.api('/musics', {
        method: 'POST',
        data,
      });

      return { downloadLink: response.data.link };
    } catch (error) {
      throw this.handleError(error);
    }
  }
}

export default new MusicAPI();
