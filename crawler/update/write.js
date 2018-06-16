const { query } = require('../db')

//此方法用于把标签数组保存到mysql数据库中
exports.tags = async function(tags){

    //for of里面是可以用awat的
    for(tag of tags) {

        let oldTags = await query(`SELECT * FROM tags where name = ?`, [tag.name]);

        if(Array.isArray(oldTags) && oldTags.length>0) {

            await query(`UPDATE tags SET image=?,subscribe=?,article=?, url=? WHERE id =?`, [tag.image,tag.subscribe,tag.article,tag.url,oldTags[0].id]);
        } else {

            await query(`INSERT INTO tags(name, image, url, subscribe, article) VALUES(?,?,?,?,?)`, [tag.name, tag.image, tag.url, tag.subscribe, tag.article]);
        }
    }

}

/**
 * 此方法用于将文件列表插入到数据库中
 * @param articles
 * @returns {Promise.<void>}a
 */
exports.articles = async function (articles) {
    for(article of articles){

        let oldArticles = await  query(`SELECT * FROM articles where id=?`,[article.id]);

        if(oldArticles.length > 0) {

            await query(`UPDATE articles SET title=?, content=?, href=? WHERE id =?`, [article.title, article.content, article.href, article.id]);

        } else {

            await query(`INSERT INTO articles(id, title, href, content) VALUES(?,?,?,?)`,[article.id,article.title,article.href,article.content]);
        }

        //处理文章和标签的关系,先删除文章所有的标签
        await query(`DELETE FROM article_tag WHERE article_id=?`, [article.id]);
        //查询一下此文章对应标签的id数组
        let tagWhere = "'" + article.tags.join("','") + "'";
        let tagIds = await query(`SELECT id FROM tags WHERE name in (${tagWhere})`)
        // console.log(tagIds)
        // [{id:1},{id:2}]
        for(tagId of tagIds) {

            await query(`INSERT INTO article_tag(article_id,tag_id) VALUES(?,?)`,[article.id,tagId.id])
        }
        // for(tagId in tagIds) {
        //
        //
        //
        //
        // }
    }
}



// exports.articles([
//
//     {
//         id:'id1',
//         title:'1111',
//         content:'content1',
//         href:'href1',
//         tags:['name1']
//     },
//     {
//         id:'id2',
//         title:'2222',
//         content:'content2',
//         href:'href2',
//         tags:['name2']
//     },
// ])


// exports.tags([
//     {
//         name:'name3',
//         image:'image1222',
//         subscribe:1111,
//         article:1111,
//         url:'http://www.baidu.com'
//     },
//     {
//         name:'name2',
//         image:'image2',
//         subscribe:222,
//         article:222,
//         url:'http://www.taobao.com'
//     }
// ])