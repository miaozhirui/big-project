/**
 * 此文件用来读取远程文件的数据
 */
const request = require('request-promise');
const cheerio = require('cheerio');

/**
 * 获取标签
 * @param url
 * @returns {Promise.<*>}
 */
exports.tags = async (url) => {

    let options = {
        url,
        transform(body) {

            return cheerio.load(body)//转成jquery对象
        }
    }

    //https://juejin.im/subscribe/all
    return request(options).then($ => {

        let tags = [];
        let infos = $('.item .tag .info-box');
        infos.each((index, info) => {

            let tagInfo = $(info);
            let image = tagInfo.find('div.thumb').first().data('src');
            let title = tagInfo.find('.title').first().text();
            let subscribe = tagInfo.find('.subscribe').first().text();
            let article = tagInfo.find('.article').first().text();
            let href = tagInfo.children().first().attr('href');

            tags.push({
                name:title,
                image,
                url:`https://juejin.im${href}`,
                subscribe:Number(subscribe.match(/^(\d+)/)[1]),
                article:Number(article.match(/^(\d+)/)[1])
            })
        })

        return tags;
    })


}

/**
 * 获取文章列表
 * @param url
 * @returns {Promise.<*>}
 */
exports.articleList = async (url) => {

    let options = {
        url,
        transform(body){

            return cheerio.load(body)
        }
    }

    return request(options).then(async $ => {


        let articleTitles = $('.info-box .title-row .title');

        let articles = [];
        //在forEach里each里面是不能使用await方法的
        for(let i=0;i<articleTitles.length; i++) {

            let articleInfo = $(articleTitles[i]);

            let href = `https://juejin.im${articleInfo.attr('href')}`;
            let title = articleInfo.text()
            let id = articleInfo.attr('href').slice(6);

            let detail = await articleDetail(href);

            articles.push({
                id,
                href,
                title,
                content:detail.content,
                tags:detail.tags
            })
        }

        return articles;
    })
}

async function articleDetail(url) {

    let options = {

        url,
        transform(body){

            return cheerio.load(body)
        }
    }

    return request(options).then($ => {

        let content = $('.article-content').first().html();
        let tagTitles = $('.tag-list .item .tag-title');
        let tags = [];

        tagTitles.each((index, title) => {

            tags.push($(title).text())
        })

        return {
            content,
            tags
        }
    })
}

// let tagUrl = "https://juejin.im/subscribe/all";
// exports.tags(tagUrl).then(tags => {
//
//     console.log(tags)
// })

// let articleUrl = "https://juejin.im/tag/%E5%89%8D%E7%AB%AF"
// exports.articleList(articleUrl).then(item => {
//
//     console.log(item)
// });

// let url = "https://juejin.im/post/5b1d5b3951882513e83b8c78"
// exports.articleDetail(url).then(item => {
//
//     console.log(item)
// })