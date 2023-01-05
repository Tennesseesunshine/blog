var ghpages = require('gh-pages');

ghpages.publish('./docs/.vuepress/dist', {
    branch: 'gh-pages',
}, function (err) {
    if (err) {
        console.error('err', err)
        exit(1)
    }
    console.log('docs同步完成!');
    exit(0)
});