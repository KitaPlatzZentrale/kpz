import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import logger from '../logger';
import { kitaList } from '../controller';

const writeFileAsync = promisify(fs.writeFile);

async function requestKitaData() {
    const url = 'https://kita-navigator.berlin.de/api/v1/kitas/umkreissuche?entfernung=500&seite=0&max=4000';
    const maxAttempts = 3;
    let attempts = 1;
    let success = false;

    while (attempts <= maxAttempts && !success) {
        try {
            const response = await axios.get(url);
            const transformed = kitaList(response.data)
            await writeFileAsync(path.join(__dirname, '../../data', 'kitas_berlin.json'), JSON.stringify(transformed));
            success = true;
            logger.info('Kita data saved successfully');
        } catch (error) {
            logger.error(`Error occurred on attempt ${attempts}: ${error.message}`);
            attempts++;
            await new Promise(resolve => setTimeout(resolve, 5000)); // wait for 5 seconds before retrying
        }
    }

    if (!success) {
        logger.error(`Maximum number of attempts (${maxAttempts}) reached. Failed to save Kita data.`);
    }
}

requestKitaData();
