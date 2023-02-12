module.exports = {
    title: '某喵喵',
    plugins: [
        'vuepress-plugin-smooth-scroll',
        '@vuepress/active-header-links',
        '@vuepress/back-to-top'
    ],
    base: process.env.NODE_ENV === 'development' ? '/' : '/blog/',
    description: '简单记录、学习笔记',
    themeConfig: {
        sidebarDepth: 3,
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
                text: "工程效率、设计方案",
                items: [
                    {
                        text: '离线包',
                        link: '/design/offline/'
                    },
                    {
                        text: 'DevOps',
                        link: '/design/devops/gitlab-ci'
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
                    },
                    {
                        text: 'webpack',
                        link: '/tools/webpack/md-to-html-loader'
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
                'git-commands'
            ],
            '/notes/node/': [],
            '/notes/vue/': [
                'concis-event-bus',
                'px-to-vw',
                'typeScript-use',
                'vue-version'
            ],
            '/notes/react/': [
                'call-child-component-method',
                'umi-use-iconfont',
                'upload-file',
                'use-context'
            ],
            '/notes/javascript/': [
                'promise-resolve-and-return',
                'read-mini-reg-exp-book',
                'reduce',
                'lazy-load',
                'my-promiseAll-and-promiseRace',
                'pipe-compose',
                'new-instanceof',
                'sort-by-ASCII'
            ],
            '/notes/network/': [
                {
                    title: '子网划分',
                    collapsable: false,
                    children: ['', 'sub-network'],
                }
            ],
            '/notes/browser/': [
                'anchor-setting',
                'browser-download',
                'event-loop',
                'http-cache',
                'http2-notes',
                'web-browser-export-file',
                'web-performance',
                'website-realize-pwa'
            ],
            '/design/devops/': [
                'gitlab-ci'
            ],
            '/design/offline/': [
                ''
            ],
            '/tools/github/': [
                'github-actions'
            ],
            '/tools/webpack/': [
                'md-to-html-loader',
                'md-to-html-loader-optimization',
                'replace-moment-to-dayjs',
                'webpack-dynamic-load-hmr'
            ],
        }
    }
}