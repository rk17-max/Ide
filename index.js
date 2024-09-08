const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const fetch = require('node-fetch');

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get('/test', (req, res) => {
  res.send('Hello World!');
});

app.post('/test', async (req, res) => {
  const { code, language } = req.body;

  const clientId = 'your-client-id';  // Replace with your JDoodle client ID
  const clientSecret = 'your-client-secret';  // Replace with your JDoodle client secret

  if (language === 'python') {
    if (!code) {
      return res.status(400).json({ error: 'No code provided' });
    }

    const tempFilePath = path.join(__dirname, 'temp_code.py');

    fs.writeFile(tempFilePath, code, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error writing code to file' });
      }

      exec(`python ${tempFilePath}`, { timeout: 5000 }, (error, stdout, stderr) => {
        fs.unlink(tempFilePath, (err) => {
          if (err) console.error('Error deleting temp file:', err);
        });

        if (error) {
          return res.status(500).json({ error: `Execution error: ${stderr}` });
        }

        res.json({ output: stdout });
      });
    });
  } else if (language === 'java' || language === 'c' || language === 'cpp') {
    let jdoodleLanguage;
    let versionIndex;

    if (language === 'java') {
      jdoodleLanguage = 'java';
      versionIndex = '0'; // Specify Java version if needed
    } else if (language === 'c') {
      jdoodleLanguage = 'c';
      versionIndex = '5'; // Use the appropriate version index for C
    } else if (language === 'cpp') {
      jdoodleLanguage = 'cpp17'; // For C++17, adjust if using another version
      versionIndex = '0';
    } else {
      return res.status(400).json({ error: 'Unsupported language' });
    }

    try {
      const response = await fetch('https://api.jdoodle.com/v1/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          script: code,
          language: jdoodleLanguage,
          versionIndex: versionIndex,
          clientId: '37ccf6ec79d35d9686d77b0f5ea0983a',
          clientSecret: 'bacbd5257a2cf9ca583d224faede078666d5808c2da6a91d453b556914261550',
        }),
      });

      const data = await response.json();

      if (data.output) {
        res.json({ output: data.output });
      } else if (data.error) {
        res.json({ error: data.error });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred while running the code.' });
    }
  } else {
    res.status(400).json({ error: 'Unsupported language' });
  }
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
