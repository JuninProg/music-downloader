# Music Downloader

APP para baixar músicas do YouTube. Você fornecerá uma lista de links do YouTube, a aplicação vai baixar essa lista de vídeos, extrair os aúdios e retornar um link com um arquivo zipado com essas músicas/aúdios.

## Como instalar?

É preciso ter instalado em sua máquina `docker` e `docker-compose`.

### Para ambos os ambientes

- Rode `npm i`;
- Copie o arquivo `.env.example.` para `.env` e preencha as variáveis de ambiente.

### Em desenvolvimento

- Rode `npm run api` para inicializar a API (esse processo garantirá que antes seja criada a instância do Redis);
- Rode `npm run app` para inicializar a aplicação.

### Em produção

- Rode `npm run build` para compilar a aplicação e o servidor, o diretório de saída será `./dist`.
- Os arquivos `./dist/app` devem ser servidos de forma estática para hospedar a aplicação;
- Os arquivos `./dist/server` são os do servidor, para rodar a API digite o comando `node ./dist/server/index.js`.
