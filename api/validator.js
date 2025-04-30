const axios = require('axios');

const keyViewerApi = "https://time-api-indol.vercel.app/api/key-viewer.js";
const apiUrl = "https://time-api-indol.vercel.app/api/date.js";

export default async function handler(req, res) {
    const { token, gistId } = req.query;

    // Pastikan token dan gistId ada
    if (!token || !gistId) {
        return res.status(400).send('Both token and gistId are required as query parameters.');
    }

    try {
        // Fetch the gist data using the provided gistId
        const response = await axios.get(`${keyViewerApi}?gistId=${gistId}`);
        const stringDatabase = response.data;

        // Find the matching token in the stringDatabase
        const result = stringDatabase.split('\n').find(line => line.startsWith(`${token},`));

        if (!result) {
            return res.status(400).send('Wrong key');
        }

        const [okey, oname, oexp, ostatus] = result.split(',');

        if (ostatus !== "admin") {
            // Fetch current date
            const currentDateResponse = await axios.get(apiUrl);
            const currentDate = currentDateResponse.data;

            if (currentDate > oexp) {
                return res.status(400).send('Key expired');
            } else {
                return res.status(200).send('Valid');
            }
        } else {
            return res.status(200).send('You are logged in as admin');
        }
    } catch (error) {
        console.error('Error processing request:', error.message);
        return res.status(500).send('Error processing request');
    }
}
