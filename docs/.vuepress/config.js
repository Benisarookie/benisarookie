module.exports = {
    title: "笔记",
    description: "笔记",
    base: "/benisarookie/",
    // dest: "./dist",
    markdown: {
      lineNumbers: true,
    },
    themeConfig: {
        subSidebar: "auto",
        sidebarDepth: 2,
        lastUpdated: "lastUpdated",
        locales: {
          "/": {
            lang: "zh-CN",
          },
        },
        // 顶部导航栏
        nav: [
          { text: "首页", link: "/" },
          // { text: "联系我", link: "/Contactme/code" },
          { text: "面试", link: "/面试/面试.md" },
          {
            text: '测试',
            items: [
                { text: '测试111', link: '/测试目录一/测试' }, // 可不写后缀 .md
                { text: '生活习惯', link: 'https://www.baidu.com/' }// 外部链接
            ]
          }],
        // 侧边栏
        sidebar:[{
          title: "idea快捷键",
          children: ["/idea快捷键/idea快捷键.md"],
          initialOpenGroupIndex: 1,
        },{
          title: "面试",
          children: ["/面试/面试.md"],
          initialOpenGroupIndex: 1,
        },{
          title: "JAVA",
          children: ["/JAVA基础/init.md"],
          initialOpenGroupIndex: 1,
        },{
          title: "RabbitMq",
          children: ["/中间件/RabbitMq/RabbitMq.md"],
          initialOpenGroupIndex: 1,
        },{
          title: "JVM",
          children: ["/JVM/JVM.md"],
          initialOpenGroupIndex: 1,
        },], 
        // 
      },
}