// ASCIIDOC EDITOR
// Written by Alexander Neri 04 June 2023
// github.com/alexneri/asciiedit

const express = require('express');


const { Configuration, OpenAIApi } = require('openai');
const configuration = new Configuration({
  organization: 'YOUROrganizationID',
  apiKey: 'YOURAPIKEY'
});
const ai = new OpenAIApi(configuration);
// Import the OpenAI library



function convertAsciidocToHtml(asciidoc, callback) {
  // Send Asciidoc content to OpenAI API to convert to HTML
  ai.complete({
    prompt: 'Convert the following content to HTML:\n' + asciidoc,
    max_tokens: 1000
  }).then(response => callback(response.choices[0].text.trim()));
}

function convertHtmlToAsciidoc(html, callback) {
  // Send HTML content to OpenAI API to convert to Asciidoc
  ai.complete({
    prompt: 'Convert this HTML content to Asciidoc:\n' + html,
    max_tokens: 1000
  }).then(response => callback(response.choices[0].text.trim()));
}

const TurndownService = require('turndown');
const { exec } = require('child_process');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/preview', express.text({ type: '*/*' }), async (req, res) => {
  const asciidocSource = req.body;


  try {
    // Convert asciidocSource to HTML using OpenAI API
    const gpt3_response = await ai.createCompletion({
      model: 'text-davinci-002',
      prompt: asciidocSource,
      max_tokens: 500
    });

    let html = gpt3_response.data.choices[0].text;
    res.send(html);
  } catch (error) {
    console.error("Error converting Asciidoc to HTML using OpenAI:", error);
    res.status(500).send("Error converting content.");
  }

});

app.post('/reverse', express.text({ type: '*/*' }), (req, res) => {
  const html = req.body;
  const turndownService = new TurndownService();
  const markdown = turndownService.turndown(html);

  exec(`echo "${markdown}" | pandoc -f markdown -t asciidoc`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    res.send(stdout);
  });
});

app.listen(port, () => {
  console.log(`Asciidoc Editor listening at http://localhost:${port}`);
});