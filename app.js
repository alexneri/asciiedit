// ASCIIDOC EDITOR
// Written by Alexander Neri 04 June 2023
// github.com/alexneri/asciiedit

const express = require('express');
const asciidoctor = require('asciidoctor')();
const { spawn } = require('child_process'); // Use spawn instead of exec
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index');
});

// Endpoint to convert AsciiDoc to HTML
app.post('/preview', express.text({ type: '*/*' }), (req, res) => {
  const asciidocSource = req.body;
  const html = asciidoctor.convert(asciidocSource);
  res.send(html);
});

// Endpoint to convert HTML to AsciiDoc
app.post('/reverse', express.text({ type: '*/*' }), (req, res) => {
  const html = req.body;

  // Convert HTML directly to AsciiDoc using pandoc
  const pandoc = spawn('pandoc', ['-f', 'html', '-t', 'asciidoc']);
  let asciidocOutput = '';

  pandoc.stdout.on('data', (data) => {
    asciidocOutput += data;
  });

  pandoc.stderr.on('data', (data) => {
    console.error(`pandoc error: ${data}`);
  });

  pandoc.on('close', (code) => {
    if (code !== 0) {
      console.error(`pandoc process exited with code ${code}`);
      res.status(500).send('Conversion error');
      return;
    }
    res.send(asciidocOutput);
  });

  pandoc.stdin.write(html);
  pandoc.stdin.end();
});

app.listen(port, () => {
  console.log(`Asciidoc Editor listening at http://localhost:${port}`);
});
