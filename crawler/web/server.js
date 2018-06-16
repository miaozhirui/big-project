const express = require('express');
const path = require('path')
const app = express();
const { query } = require('../db')

app.set('view engine', 'html');//设置后缀
app.set('views', path.join(__dirname, 'views'))//设置模板应该存放的目录
app.engine('html', require('ejs').__express)//设置什么模板处理该后缀的文件

app.get('/', async function (req, res) {


    let tags = await query('SELECT * FROM tags');
    let {tagId} = req.query;
    let articles = await query('SELECT * FROM articles JOIN article_tag on articles.id = article_tag.article_id WHERE article_tag.tag_id = ?',[tagId ? tagId : tags[0]]);

    res.render('index', {tags, articles})

})

app.get('/detail/:id', async function (req, res) {

    let id = req.params.id;

    let articles = await query('SELECT * FROM articles WHERE id=?',[id]);

    let tags = await query('SELECT tags.* FROM tags JOIN article_tag on tags.id = article_tag.tag_id WHERE article_tag.`article_id` = ?',[id]);

    console.log(tags)
    res.render('detail.html', {article:articles[0], tags})
})
app.listen(8000);

//写个定时任务
const CronJob = require('cron').CronJob;
const {spawn} = require('child_process');
const job = new CronJob('0 */30 * * * *', function () {

    let child = spawn(process.execPath, [path.resolve(__dirname, 'update/index.js')]);
    child.stdout.pipe(process.stdout);//将正确信息输出到主屏幕上面
    child.stderr.pipe(process.stderr);//将错误信息输出到主屏幕上面
    child.on('error', function () {//监听子进程错误信息

        console.log('任务执行出错了')
    })
})

job.start();