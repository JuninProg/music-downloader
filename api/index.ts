import * as dotenv from 'dotenv';
dotenv.config();

import { listen } from './src/config/server';

const PORT = parseInt(process.env.PORT as string);
const HOST = process.env.HOST as string;

listen(PORT, HOST);
