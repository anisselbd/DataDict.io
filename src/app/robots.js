export default function robots() {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/dashboard/',
        },
        sitemap: 'https://data-dict-io.vercel.app/sitemap.xml',
    }
}
