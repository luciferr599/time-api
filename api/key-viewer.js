const axios = require('axios');

export default async function handler(req, res) {
    try {
        const { gistId } = req.query;

        if (!gistId) {
            return res.status(400).send('gistId is required as a query parameter.');
        }

        // Fetch the gist data
        const gistResponse = await axios.get(`https://api.github.com/gists/${gistId}`);

        // Check if the gist has files
        if (!gistResponse.data.files || Object.keys(gistResponse.data.files).length === 0) {
            return res.status(404).send('No files found in the gist.');
        }

        // Extract the raw URL from the gist data
        const rawUrl = gistResponse.data.files[Object.keys(gistResponse.data.files)[0]].raw_url;

        // Fetch the raw content
        const rawContentResponse = await axios.get(rawUrl);

        // Send the raw content as response
        res.status(200).send(rawContentResponse.data);
    } catch (error) {
        console.error('Error fetching gist:', error.response ? error.response.data : error.message);
        res.status(500).send('Error fetching gist');
    }
}
