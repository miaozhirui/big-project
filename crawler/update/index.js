let read = require('./read');
let write = require('./write');

(async function () {

    let tagUrl = "https://juejin.im/subscribe/all";

    //读取标签
    let tags = await read.tags(tagUrl);

    //将标签写入数据库中
    await write.tags(tags)


    for(tag of tags) {
        //获取某个标签下面的文章
       let articleList = await read.articleList(tag.url);
       //将某个标签下面的文章写入数据中
       await write.articles(articleList)
    }

    process.exit();
})()