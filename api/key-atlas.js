const axios = require('axios');

const gistId = "83ac1fadc40dc75b884d097c86398719";

export default async function handler(req, res) {
    try {
        // Fetch the gist data
        const gistResponse = await axios.get(`https://api.github.com/gists/${gistId}`);
        
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
