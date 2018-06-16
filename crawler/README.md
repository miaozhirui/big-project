#掘金爬虫
cnpm i express ejs cheerio cron iconv-lite request-promise request request mysql -S

- 如果有些数据需要注册登录才能获取的话，自己处理cookie session
- 如果说登录是有验证如何处理
- 获取胡来的数据有可能需要接推荐系统，清理数据
- 有些服务器会有反爬的功能，所以我们有可能需要控制请求的评率， 需要频繁的换ip,还要去mock Agent
- 有些网站是客户端渲染的
- puppeteer 做爬虫，进行ui测试