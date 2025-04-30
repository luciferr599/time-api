// api/main.js
export default async function handler(req, res) {
  const { input_token } = req.query;
  const gistId = 'b50b5caee29f4d4cd2d645e6d6a92fd5';
  const keyViewerApi = `https://time-api-indol.vercel.app/api/key-viewer.js?gistId=${gistId}`;
  const timeApi = 'https://time-api-indol.vercel.app/api/date.js';

  if (!input_token) {
    return res.status(400).send('Token is required');
  }

  try {
    // Fetch stringDatabase from keyViewer API
    const response = await fetch(keyViewerApi);
    const { data } = await response.json();

    // Find the result line that matches the input token
    const result = data.split('\n').find(line => line.startsWith(input_token));
    if (!result) {
      return res.status(400).send('Wrong key');
    }

    // Split the result into different values
    const [okey, oname, oexp, ostatus] = result.split(',');

    // Check if the user is an admin
    if (ostatus !== 'admin') {
      // Fetch the current date from the time API
      const currentDateResponse = await fetch(timeApi);
      const { current_date } = await currentDateResponse.json();

      // Check if the current date is past the expiration date
      if (current_date > oexp) {
        return res.status(400).send('Key expired');
      } else {
        return res.status(200).send('Valid');
      }
    } else {
      return res.status(200).send('You are logged in as admin');
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
}
