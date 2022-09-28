const mediumToMarkdown = require('medium-to-markdown');

const mediumPostUrl = process.env.npm_config_url

mediumToMarkdown.convertFromUrl(mediumPostUrl)
  .then(function (markdown) {
    console.log(markdown); //=> Markdown content of medium post
  });