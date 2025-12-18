export default function sitemap() {
    const baseUrl = 'https://data-dict-io.vercel.app';

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 1,
        },
        {
            url: `${baseUrl}/auth`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        // Nous pourrions ajouter dynamiquement les projets publics ici plus tard
    ]
}
