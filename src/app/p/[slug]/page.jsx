'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getPublicProject } from '@/lib/api';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Book, Database, Table, Key, Search, AlertCircle, Share2, Copy, Check } from 'lucide-react';
import { cn } from "@/lib/utils";

export default function PublicPage() {
    const params = useParams();
    const slug = params.slug;

    const [project, setProject] = useState(null);
    const [selectedEntityId, setSelectedEntityId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const loadData = useCallback(async () => {
        if (!slug) return;
        try {
            const data = await getPublicProject(slug);
            setProject(data);
            if (data.entities?.length > 0) {
                setSelectedEntityId(data.entities[0].id);
            }
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, [slug]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    function copyLink() {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    const selectedEntity = project?.entities?.find(e => e.id === selectedEntityId);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-white">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50/50">
                <Database className="h-16 w-16 text-gray-300 mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Documentation non trouvée</h1>
                <p className="text-muted-foreground mb-6">{error || "Ce dictionnaire de données n'existe pas."}</p>
                <Link href="/">
                    <Button>Retour à l'accueil</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-white font-sans text-gray-900">
            {/* Sidebar */}
            <div className="w-72 border-r bg-gray-50/50 flex flex-col h-screen sticky top-0 hidden md:flex">
                <div className="p-6 border-b">
                    <div className="flex items-center gap-2 font-bold text-lg mb-1">
                        <Book className="h-5 w-5 text-primary" />
                        <span className="truncate">{project.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Documentation publique</p>
                </div>

                <ScrollArea className="flex-1 py-4">
                    <div className="px-3 space-y-1">
                        <div className="px-3 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Entités ({project.entities?.length || 0})
                        </div>
                        {project.entities?.map(entity => (
                            <button
                                key={entity.id}
                                onClick={() => setSelectedEntityId(entity.id)}
                                className={cn(
                                    "w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left group",
                                    selectedEntityId === entity.id
                                        ? "bg-primary/10 text-primary font-semibold"
                                        : "text-muted-foreground hover:bg-gray-100/80 hover:text-foreground"
                                )}
                            >
                                <Table className="h-4 w-4 shrink-0" />
                                <span className="truncate flex-1">{entity.name}</span>
                                <span className="text-xs opacity-50">{entity.fields?.length || 0}</span>
                            </button>
                        ))}
                    </div>
                </ScrollArea>

                <div className="p-4 border-t">
                    <Button variant="outline" size="sm" className="w-full gap-2" onClick={copyLink}>
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copied ? 'Copié !' : 'Copier le lien'}
                    </Button>
                </div>

                <div className="p-4 border-t text-xs text-center text-muted-foreground">
                    <Link href="/" className="hover:text-primary transition-colors">
                        Créé avec DataDict.io
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {/* Mobile Header */}
                <div className="md:hidden p-4 border-b sticky top-0 bg-white z-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-bold">
                            <Book className="h-5 w-5 text-primary" />
                            {project.name}
                        </div>
                        <Button variant="ghost" size="icon" onClick={copyLink}>
                            {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-6 py-8 md:py-12">
                    {selectedEntity ? (
                        <div className="animate-in fade-in duration-300">
                            {/* Entity Header */}
                            <div className="mb-8">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <Table className="h-5 w-5 text-primary" />
                                    </div>
                                    <h1 className="text-3xl font-bold tracking-tight">{selectedEntity.name}</h1>
                                </div>
                                {selectedEntity.description && (
                                    <p className="text-muted-foreground text-lg">{selectedEntity.description}</p>
                                )}
                            </div>

                            {/* Fields Table */}
                            <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50 border-b">
                                            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Champ</th>
                                            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Type</th>
                                            <th className="text-center px-4 py-3 text-sm font-semibold text-gray-700">Attributs</th>
                                            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Défaut</th>
                                            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedEntity.fields?.map(field => (
                                            <tr key={field.id} className="border-b last:border-0 hover:bg-gray-50/50">
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <code className="font-mono font-medium text-gray-900">{field.name}</code>
                                                        {field.required && (
                                                            <AlertCircle className="h-3 w-3 text-red-500" title="Required" />
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono text-pink-600 border">
                                                        {field.type}
                                                    </code>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex justify-center gap-1">
                                                        {field.unique && (
                                                            <Badge variant="outline" className="h-6 w-6 p-0 flex items-center justify-center rounded-full bg-amber-50 text-amber-700 border-amber-200" title="Unique">
                                                                <Key className="h-3 w-3" />
                                                            </Badge>
                                                        )}
                                                        {field.indexed && (
                                                            <Badge variant="outline" className="h-6 w-6 p-0 flex items-center justify-center rounded-full bg-blue-50 text-blue-700 border-blue-200" title="Indexed">
                                                                <Search className="h-3 w-3" />
                                                            </Badge>
                                                        )}
                                                        {!field.unique && !field.indexed && (
                                                            <span className="text-gray-300">-</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <code className="text-sm font-mono text-gray-600">
                                                        {field.defaultValue || <span className="text-gray-300 italic">null</span>}
                                                    </code>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-muted-foreground">
                                                    {field.description || <span className="text-gray-300 italic">-</span>}
                                                </td>
                                            </tr>
                                        ))}
                                        {(!selectedEntity.fields || selectedEntity.fields.length === 0) && (
                                            <tr>
                                                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                                    Aucun champ défini pour cette entité
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Entity Selector */}
                            <div className="md:hidden mt-8">
                                <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase">Autres entités</h3>
                                <div className="flex flex-wrap gap-2">
                                    {project.entities?.filter(e => e.id !== selectedEntityId).map(entity => (
                                        <Button
                                            key={entity.id}
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setSelectedEntityId(entity.id)}
                                        >
                                            {entity.name}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-16 text-muted-foreground">
                            <Table className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p>Sélectionnez une entité dans le menu</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
