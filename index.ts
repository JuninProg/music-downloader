import 'dotenv/config';

import { listen } from './api/config/server';

const PORT = parseInt(process.env.PORT as string);
const HOST = process.env.HOST as string;

listen(PORT, HOST);
