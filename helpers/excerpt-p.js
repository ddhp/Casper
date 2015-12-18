var hbs = require('express-hbs');
var _ = require('lodash');
var downsize = require('downsize');

var excerptP = function() {
  hbs.registerHelper('excerpt-p', function(options) {
    var truncateOptions = (options || {}).hash || {};
    var excerpt;

    truncateOptions = _.pick(truncateOptions, ['words', 'characters', 'append', 'round']);
    _.keys(truncateOptions).map(function (key) {
      if (key === 'words' || key === 'characters') {
        truncateOptions[key] = parseInt(truncateOptions[key], 10);
      }
    });

    if (!truncateOptions.words && !truncateOptions.characters) {
      truncateOptions.words = 50;
    }

    excerpt = downsize(this.html, truncateOptions);

    // Strip inline and bottom footnotes
    excerpt = excerpt.replace(/<a href="#fn.*?rel="footnote">.*?<\/a>/gi, '');
    excerpt = excerpt.replace(/<div class="footnotes"><ol>.*?<\/ol><\/div>/, '');
    // Strip </p> </h1,2,3,4,5,6> with \n
    excerpt = excerpt.replace(/<\/(p|h1|h2|h3|h4|h5)>/gi, '!---');
    // Strip other html
    excerpt = excerpt.replace(/<\/?[^>]+>/gi, '');

    // pre/append <p> to !--- pieces
    var pieces = excerpt.split('!---');
    excerpt = pieces.reduce(function(previous, current, index) {
      return previous + '<p>' + current + '</p>';
    }, '');

    return new hbs.handlebars.SafeString(
      excerpt
    );
  });
};

module.exports = excerptP;
