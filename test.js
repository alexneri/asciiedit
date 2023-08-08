const TurndownService = require('turndown');

const turndownService = new TurndownService();

turndownService.addRule('inlineCode', {
  filter: function(node) {
    return node.nodeName === 'CODE' && (!node.parentNode || node.parentNode.nodeName !== 'PRE');
  },
  replacement: function(content) {
    return '`' + content + '`';
  }
});

turndownService.addRule('codeBlock', {
  filter: function(node) {
    return node.nodeName === 'CODE' && node.parentNode && node.parentNode.nodeName === 'PRE';
  },
  replacement: function(content) {
    return '----\\n' + content + '\\n----';
  }
});

const htmlContent = "<p>There is a <code>code</code> block for us to use!</p>";
const asciidocConverted = turndownService.turndown(htmlContent);

console.log(asciidocConverted);
