const express = require('express');
const asciidoctor = require('asciidoctor')();
const TurndownService = require('turndown');
const { exec } = require('child_process');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/preview', express.text({ type: '*/*' }), (req, res) => {
    const asciidocSource = req.body;
    const html = asciidoctor.convert(asciidocSource);
    res.send(html);
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