module.exports = {
    title: '某喵喵',
    plugins: ['vuepress-plugin-smooth-scroll'],
    base: process.env.NODE_ENV === 'development' ? '/' : '/blog/',
    description: '简单记录、学习笔记',
    sidebarDepth: 3,
    themeConfig: {
        logo: '/assets/images/icon.jpeg',
        nav: [{
            text: "首页",
            link: "/"
        },
        {
            text: "笔记",
            items: [{
                text: 'Linux',
                link: '/notes/linux/shell-export-var-to-nodejs'
            },
            {
                text: 'Node',
                link: '/notes/node/'
            },
            {
                text: 'Vue',
                link: '/notes/vue/'
            },
            {
                text: 'React',
                link: '/notes/react/'
            },
            {
                text: '网络',
                link: '/notes/network/'
            },
            {
                text: '浏览器相关',
                link: '/notes/browser/'
            },
            ]
        },
        {
            text: "工具使用",
            items: [{
                text: 'vscode',
                link: '/tools/vscode/'
            },
            {
                text: 'charles',
                link: '/tools/charles/'
            }
            ]
        },
        {
            text: "Github",
            link: "https://github.com/Tennesseesunshine"
        }
        ],
        sidebar: {
            '/notes/linux/': [
                'shell-export-var-to-nodejs',
                'generic-commands',
            ],
            '/notes/node/': [],
        }
    }
}