const axios = require('axios');

export default async function handler(req, res) {
    const gistId = "83ac1fadc40dc75b884d097c86398719";
    try {
        const gistResponse = await axios.get(`https://api.github.com/gists/${gistId}`);
        const rawUrl = gistResponse.data.files[Object.keys(gistResponse.data.files)[0]].raw_url;
        const rawContentResponse = await axios.get(rawUrl);
        res.status(200).json({ content: rawContentResponse.data });
    } catch (error) {
        res.status(error.response?.status || 500).json({ message: error.message });
    }
}
