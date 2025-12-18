'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Database, ArrowRight, LogOut, Pencil, Trash2, Search, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getProjects, createProject, updateProject, deleteProject, duplicateProject } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { toast } from 'sonner';

export default function DashboardPage() {
    const router = useRouter();
    const { user, isAuthenticated, loading: authLoading, logout } = useAuth();

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');

    // Modal states
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/auth');
        }
    }, [authLoading, isAuthenticated, router]);

    useEffect(() => {
        if (isAuthenticated) {
            loadProjects();
        }
    }, [isAuthenticated]);

    async function loadProjects() {
        try {
            const data = await getProjects();
            setProjects(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    function openCreateModal() {
        setFormData({ name: '', description: '' });
        setShowCreateModal(true);
    }

    function openEditModal(project, e) {
        e.preventDefault();
        e.stopPropagation();
        setSelectedProject(project);
        setFormData({ name: project.name, description: project.description || '' });
        setShowEditModal(true);
    }

    function openDeleteModal(project, e) {
        e.preventDefault();
        e.stopPropagation();
        setSelectedProject(project);
        setShowDeleteModal(true);
    }

    async function handleCreate() {
        if (!formData.name.trim()) return;
        setSaving(true);
        try {
            const newProject = await createProject({
                name: formData.name.trim(),
                description: formData.description.trim() || null
            });
            setProjects([newProject, ...projects]);
            setShowCreateModal(false);
            toast.success('Projet créé avec succès');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setSaving(false);
        }
    }

    async function handleUpdate() {
        if (!formData.name.trim() || !selectedProject) return;
        setSaving(true);
        try {
            const updated = await updateProject(selectedProject.id, {
                name: formData.name.trim(),
                description: formData.description.trim() || null
            });
            setProjects(projects.map(p => p.id === updated.id ? updated : p));
            setShowEditModal(false);
            toast.success('Projet modifié');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete() {
        if (!selectedProject) return;
        setSaving(true);
        try {
            await deleteProject(selectedProject.id);
            setProjects(projects.filter(p => p.id !== selectedProject.id));
            setShowDeleteModal(false);
            toast.success('Projet supprimé');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setSaving(false);
        }
    }

    async function handleDuplicate(project, e) {
        e.preventDefault();
        e.stopPropagation();
        try {
            const newProject = await duplicateProject(project.id);
            setProjects([newProject, ...projects]);
            toast.success(`Projet "${project.name}" dupliqué`);
        } catch (error) {
            toast.error(error.message);
        }
    }

    function handleLogout() {
        logout();
        router.push('/auth');
    }

    // Filter projects by search
    const filteredProjects = projects.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(search.toLowerCase()))
    );

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background font-sans">
            {/* Header */}
            <header className="bg-card border-b sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                        <div className="bg-primary p-1.5 rounded-md text-primary-foreground">
                            <Database className="h-5 w-5" />
                        </div>
                        <span>DataDict.io</span>
                    </Link>

                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="gap-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback className="bg-primary/10 text-primary">
                                            {user?.name?.[0] || user?.email?.[0] || 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="hidden sm:inline">{user?.name || user?.email}</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Déconnexion
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto p-8 space-y-8">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Mes Projets</h1>
                        <p className="text-muted-foreground mt-1 text-lg">Gérez vos dictionnaires de données.</p>
                    </div>
                    <Button onClick={openCreateModal} size="lg" className="gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                        <Plus className="h-5 w-5" />
                        Créer un projet
                    </Button>
                </div>

                {/* Search Bar */}
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Rechercher un projet..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>

                {error && (
                    <div className="p-4 bg-destructive/10 text-destructive rounded-lg">{error}</div>
                )}

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-64 rounded-xl bg-muted animate-pulse" />
                        ))}
                    </div>
                ) : filteredProjects.length === 0 ? (
                    <div className="text-center py-16 bg-card rounded-xl border border-dashed">
                        <Database className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-muted-foreground">
                            {search ? 'Aucun résultat' : 'Aucun projet'}
                        </h3>
                        <p className="text-muted-foreground mb-4">
                            {search ? 'Essayez avec d\'autres termes' : 'Créez votre premier dictionnaire de données'}
                        </p>
                        {!search && (
                            <Button onClick={openCreateModal}>
                                <Plus className="h-4 w-4 mr-2" />
                                Créer un projet
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProjects.map((project) => (
                            <Card key={project.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <CardHeader>
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                                            <Database className="h-6 w-6" />
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => openEditModal(project, e)} title="Modifier">
                                                <Pencil className="h-4 w-4 text-muted-foreground hover:text-primary" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => handleDuplicate(project, e)} title="Dupliquer">
                                                <Copy className="h-4 w-4 text-muted-foreground hover:text-blue-500" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => openDeleteModal(project, e)} title="Supprimer">
                                                <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                                            </Button>
                                        </div>
                                    </div>
                                    <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                                        {project.name}
                                    </CardTitle>
                                    <CardDescription className="line-clamp-2 text-sm mt-2">
                                        {project.description || 'Aucune description'}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-muted-foreground bg-muted px-3 py-1 rounded-full">
                                            {project._count?.entities || 0} entités
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(project.updatedAt).toLocaleDateString('fr-FR')}
                                        </span>
                                    </div>
                                </CardContent>
                                <CardFooter className="pt-0">
                                    <Link href={`/editor/${project.id}`} className="w-full">
                                        <Button variant="outline" className="w-full justify-between hover:border-primary/50 hover:bg-primary/5 group-hover:text-primary transition-all">
                                            Ouvrir l&apos;éditeur
                                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Modal */}
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Créer un projet</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="projectName">Nom du projet *</Label>
                            <Input
                                id="projectName"
                                placeholder="Mon dictionnaire de données"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="projectDesc">Description</Label>
                            <Textarea
                                id="projectDesc"
                                placeholder="Description optionnelle..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowCreateModal(false)}>Annuler</Button>
                        <Button onClick={handleCreate} disabled={!formData.name.trim() || saving}>
                            {saving ? 'Création...' : 'Créer'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Modifier le projet</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="editProjectName">Nom du projet *</Label>
                            <Input
                                id="editProjectName"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="editProjectDesc">Description</Label>
                            <Textarea
                                id="editProjectDesc"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowEditModal(false)}>Annuler</Button>
                        <Button onClick={handleUpdate} disabled={!formData.name.trim() || saving}>
                            {saving ? 'Enregistrement...' : 'Enregistrer'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Supprimer le projet ?</DialogTitle>
                    </DialogHeader>
                    <p className="py-4 text-muted-foreground">
                        Êtes-vous sûr de vouloir supprimer <strong>{selectedProject?.name}</strong> ?
                        Cette action est irréversible.
                    </p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDeleteModal(false)}>Annuler</Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={saving}>
                            {saving ? 'Suppression...' : 'Supprimer'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
