module.exports = {
    title: '某喵喵',
    plugins: [
        'vuepress-plugin-smooth-scroll',
        '@vuepress/active-header-links',
        '@vuepress/back-to-top'
    ],
    base: process.env.NODE_ENV === 'development' ? '/' : '/blog/',
    description: '简单记录、学习笔记',
    sidebarDepth: 3,
    themeConfig: {
        lastUpdated: '最后更新',
        logo: '/assets/images/icon.jpeg',
        nav: [
            {
                text: "首页",
                link: "/"
            },
            {
                text: "笔记",
                items: [
                    {
                        text: 'Linux',
                        link: '/notes/linux/shell-export-var-to-nodejs'
                    },
                    {
                        text: 'Node',
                        link: '/notes/node/'
                    },
                    {
                        text: 'Vue',
                        link: '/notes/vue/concis-event-bus'
                    },
                    {
                        text: 'React',
                        link: '/notes/react/call-child-component-method'
                    },
                    {
                        text: 'Javascript',
                        link: '/notes/javascript/promise-resolve-and-return'
                    },
                    {
                        text: '网络',
                        link: '/notes/network/'
                    },
                    {
                        text: '浏览器相关',
                        link: '/notes/browser/anchor-setting'
                    },
                ]
            },
            {
                text: "工具使用",
                items: [
                    {
                        text: 'vscode',
                        link: '/tools/vscode/'
                    },
                    {
                        text: 'charles',
                        link: '/tools/charles/'
                    },
                    {
                        text: 'github',
                        link: '/tools/github/github-actions'
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
            '/notes/vue/': [
                'concis-event-bus'
            ],
            '/notes/react/': [
                'call-child-component-method'
            ],
            '/notes/browser/': [
                'anchor-setting',
                'browser-download'
            ],
            '/notes/javascript/': [
                'promise-resolve-and-return',
                'read-mini-reg-exp-book'
            ],
            '/tools/github/': [
                'github-actions'
            ],
        }
    }
}