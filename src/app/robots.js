export default function robots() {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/dashboard/',
        },
        sitemap: 'https://datadico.com/sitemap.xml',
    }
}
