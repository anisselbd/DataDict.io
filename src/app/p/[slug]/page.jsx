import { getPublicProject } from '@/lib/api';
import ProjectViewer from './ProjectViewer';

export async function generateMetadata({ params }) {
    const slug = params.slug;

    try {
        const project = await getPublicProject(slug);

        return {
            title: project.name,
            description: project.description || `Documentation technique pour ${project.name}`,
            openGraph: {
                title: project.name,
                description: project.description || `Documentation technique pour ${project.name}`,
                type: 'article',
                siteName: 'DataDict.io',
            },
            twitter: {
                card: 'summary_large_image',
                title: project.name,
                description: project.description || `Documentation technique pour ${project.name}`,
            }
        };
    } catch (e) {
        return {
            title: 'Projet introuvable',
            description: "Ce dictionnaire de données n'existe pas ou a été supprimé."
        };
    }
}

export default async function Page({ params }) {
    const slug = params.slug;
    let initialProject = null;

    try {
        initialProject = await getPublicProject(slug);
    } catch (e) {
        // En cas d'erreur de chargement côté serveur, on laisse le Client Component gérer ou afficher l'erreur
        // car le ProjectViewer a sa propre logique de gestion d'erreur (error state)
        console.error("Error fetching project on server:", e);
    }

    return <ProjectViewer initialProject={initialProject} />;
}
