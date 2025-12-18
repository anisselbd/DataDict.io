'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { EntitySidebar } from '@/components/editor/EntitySidebar';
import { EntityHeader } from '@/components/editor/EntityHeader';
import { FieldsTable } from '@/components/editor/FieldsTable';
import { FieldDrawer } from '@/components/editor/FieldDrawer';
import { SearchAndFilters } from '@/components/editor/SearchAndFilters';
import { getProject, getProjectEntities, getEntity, createEntity, updateEntity, deleteEntity, createField, exportProjectMarkdown, exportProjectPdf, getProjectRelations, createRelation, reorderEntities, reorderFields } from '@/lib/api';
import { arrayMove } from '@dnd-kit/sortable';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Plus, ArrowLeft, FileText, FileDown, Pencil, Trash2, Share2 } from 'lucide-react';
import { toast } from 'sonner';

export default function EditorPage() {
    const params = useParams();
    const router = useRouter();
    const projectId = params.projectId;
    const { isAuthenticated, loading: authLoading } = useAuth();

    const [project, setProject] = useState(null);
    const [entities, setEntities] = useState([]);
    const [relations, setRelations] = useState([]);
    const [selectedEntityId, setSelectedEntityId] = useState(null);
    const [selectedEntity, setSelectedEntity] = useState(null);
    const [selectedField, setSelectedField] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Search and filters
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState({ required: false, indexed: false, unique: false });

    // Entity modals
    const [showCreateEntity, setShowCreateEntity] = useState(false);
    const [showEditEntity, setShowEditEntity] = useState(false);
    const [showDeleteEntity, setShowDeleteEntity] = useState(false);
    const [entityForm, setEntityForm] = useState({ name: '', description: '' });
    const [savingEntity, setSavingEntity] = useState(false);

    // Add field modal
    const [showAddField, setShowAddField] = useState(false);
    const [newField, setNewField] = useState({
        name: '',
        type: 'VARCHAR(255)',
        required: false,
        unique: false,
        unique: false,
        indexed: false,
        targetEntityId: '',
        description: '',
        defaultValue: ''
    });
    const [savingField, setSavingField] = useState(false);

    // Redirect if not authenticated
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/auth');
        }
    }, [authLoading, isAuthenticated, router]);

    const loadData = useCallback(async () => {
        if (!projectId || !isAuthenticated) return;

        try {
            const [projData, entData, relData] = await Promise.all([
                getProject(projectId),
                getProjectEntities(projectId),
                getProjectRelations(projectId)
            ]);
            setProject(projData);
            setEntities(entData);
            setRelations(relData);
            if (entData.length > 0 && !selectedEntityId) {
                setSelectedEntityId(entData[0].id);
            }
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, [projectId, isAuthenticated, selectedEntityId]);

    // Load entity details when selected
    useEffect(() => {
        async function loadEntity() {
            if (selectedEntityId && isAuthenticated) {
                try {
                    const entity = await getEntity(selectedEntityId);
                    setSelectedEntity(entity);
                } catch (e) {
                    console.error('Failed to load entity:', e);
                }
            }
        }
        loadEntity();
    }, [selectedEntityId, isAuthenticated]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // Entity handlers
    function openCreateEntity() {
        setEntityForm({ name: '', description: '' });
        setShowCreateEntity(true);
    }

    function openEditEntity() {
        if (selectedEntity) {
            setEntityForm({ name: selectedEntity.name, description: selectedEntity.description || '' });
            setShowEditEntity(true);
        }
    }

    async function handleCreateEntity() {
        if (!entityForm.name.trim()) return;
        setSavingEntity(true);
        try {
            const newEntity = await createEntity({
                projectId,
                name: entityForm.name.trim(),
                description: entityForm.description.trim() || null
            });
            setEntities([...entities, newEntity]);
            setSelectedEntityId(newEntity.id);
            setShowCreateEntity(false);
        } catch (e) {
            setError(e.message);
        } finally {
            setSavingEntity(false);
        }
    }

    async function handleUpdateEntity() {
        if (!entityForm.name.trim() || !selectedEntity) return;
        setSavingEntity(true);
        try {
            const updated = await updateEntity(selectedEntity.id, {
                name: entityForm.name.trim(),
                description: entityForm.description.trim() || null
            });
            setEntities(entities.map(e => e.id === updated.id ? updated : e));
            setSelectedEntity(updated);
            setShowEditEntity(false);
        } catch (e) {
            setError(e.message);
        } finally {
            setSavingEntity(false);
        }
    }

    async function handleDeleteEntity() {
        if (!selectedEntity) return;
        setSavingEntity(true);
        try {
            await deleteEntity(selectedEntity.id);
            const newEntities = entities.filter(e => e.id !== selectedEntity.id);
            setEntities(newEntities);
            setSelectedEntityId(newEntities.length > 0 ? newEntities[0].id : null);
            setSelectedEntity(null);
            setShowDeleteEntity(false);
        } catch (e) {
            setError(e.message);
        } finally {
            setSavingEntity(false);
        }
    }

    const handleReorderEntities = async (activeId, overId) => {
        const oldIndex = entities.findIndex((item) => item.id === activeId);
        const newIndex = entities.findIndex((item) => item.id === overId);

        if (oldIndex === -1 || newIndex === -1) return;

        const newItems = arrayMove(entities, oldIndex, newIndex);
        setEntities(newItems);

        try {
            await reorderEntities(params.projectId, newItems.map(i => i.id));
        } catch (error) {
            console.error("Failed to reorder:", error);
            toast.error("Erreur lors de la réorganisation");
            setEntities(entities); // Revert
        }
    };

    const handleReorderFields = async (activeId, overId) => {
        if (!selectedEntity) return;

        // Prevent reordering if filters are active
        if (search || Object.values(filters).some(Boolean)) {
            toast.error("Impossible de réorganiser avec des filtres actifs");
            return;
        }

        const currentFields = selectedEntity.fields || [];
        const oldIndex = currentFields.findIndex(f => f.id === activeId);
        const newIndex = currentFields.findIndex(f => f.id === overId);

        if (oldIndex === -1 || newIndex === -1) return;

        const newFields = arrayMove(currentFields, oldIndex, newIndex);

        // Optimistic update
        setSelectedEntity(prev => ({ ...prev, fields: newFields }));

        try {
            // Need to import reorderFields from api
            await reorderFields(selectedEntity.id, newFields.map(f => f.id));
        } catch (err) {
            console.error("Failed to reorder fields", err);
            toast.error("Erreur lors de la réorganisation des champs");
            setSelectedEntity(prev => ({ ...prev, fields: currentFields })); // Revert
        }
    };


    async function handleAddField() {
        if (!newField.name || !selectedEntityId) return;

        setSavingField(true);
        try {
            // Determine actual DB type
            const dbType = newField.type === 'RELATION' ? 'VARCHAR(255)' : newField.type;

            const createdField = await createField({
                entityId: selectedEntityId,
                name: newField.name,
                type: dbType,
                required: newField.required,
                unique: newField.unique,
                indexed: newField.indexed,
                description: newField.description,
                defaultValue: newField.defaultValue || null
            });

            // Handle Relation creation
            if (newField.type === 'RELATION' && newField.targetEntityId) {
                await createRelation({
                    sourceFieldId: createdField.id,
                    targetEntityId: newField.targetEntityId
                });
            }

            // Reload data
            const [entity, updatedRelations] = await Promise.all([
                getEntity(selectedEntityId),
                getProjectRelations(projectId)
            ]);
            setSelectedEntity(entity);
            setRelations(updatedRelations);

            // Reset form
            setNewField({
                name: '',
                type: 'VARCHAR(255)',
                required: false,
                unique: false,
                indexed: false,
                targetEntityId: '',
                description: '',
                defaultValue: ''
            });
            setShowAddField(false);
            toast.success('Champ ajouté avec succès');
        } catch (e) {
            setError(e.message);
            toast.error(e.message);
        } finally {
            setSavingField(false);
        }
    }


    async function handleExportMarkdown() {
        try {
            const markdown = await exportProjectMarkdown(projectId);
            const blob = new Blob([markdown], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${project?.slug || 'data-dictionary'}.md`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (e) {
            setError('Export Markdown failed: ' + e.message);
        }
    }

    async function handleExportPdf() {
        try {
            const blob = await exportProjectPdf(projectId);
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${project?.slug || 'data-dictionary'}.pdf`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (e) {
            setError('Export PDF failed: ' + e.message);
        }
    }

    const filteredFields = selectedEntity?.fields ? selectedEntity.fields.filter(f => {
        const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase()) ||
            f.type.toLowerCase().includes(search.toLowerCase());
        const matchesReq = !filters.required || f.required;
        const matchesIdx = !filters.indexed || f.indexed;
        const matchesUniq = !filters.unique || f.unique;
        return matchesSearch && matchesReq && matchesIdx && matchesUniq;
    }) : [];

    if (authLoading || loading) {
        return (
            <div className="flex bg-white h-screen items-center justify-center text-primary">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button onClick={() => { setError(''); loadData(); }} className="text-primary hover:underline">
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    if (!project) {
        return <div className="p-8">Projet non trouvé</div>;
    }

    return (
        <div className="flex h-screen bg-gray-50/30 overflow-hidden font-sans">
            <EntitySidebar
                entities={entities}
                selectedId={selectedEntityId}
                onSelect={setSelectedEntityId}
                onAdd={openCreateEntity}
                onReorder={handleReorderEntities}
            />

            <main className="flex-1 overflow-y-auto">
                {/* Toolbar */}
                <div className="sticky top-0 z-10 bg-white border-b px-8 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard">
                            <Button variant="ghost" size="sm" className="gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Retour
                            </Button>
                        </Link>
                        <h1 className="font-semibold text-lg">{project.name}</h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                navigator.clipboard.writeText(`${window.location.origin}/p/${project.slug}`);
                                toast.success('Lien copié dans le presse-papiers');
                            }}
                            className="gap-2"
                        >
                            <Share2 className="h-4 w-4" />
                            Partager
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleExportMarkdown} className="gap-2">
                            <FileText className="h-4 w-4" />
                            Markdown
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleExportPdf} className="gap-2">
                            <FileDown className="h-4 w-4" />
                            PDF
                        </Button>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto p-8">
                    {selectedEntity ? (
                        <div className="animate-in fade-in duration-500 slide-in-from-bottom-4">
                            {/* Entity Header with Edit/Delete */}
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">{selectedEntity.name}</h2>
                                    {selectedEntity.description && (
                                        <p className="text-muted-foreground mt-1">{selectedEntity.description}</p>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm" onClick={openEditEntity} className="gap-2">
                                        <Pencil className="h-4 w-4" />
                                        Modifier
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => setShowDeleteEntity(true)} className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50">
                                        <Trash2 className="h-4 w-4" />
                                        Supprimer
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                        Définition du schéma ({filteredFields.length} champs)
                                    </h3>
                                    <Button onClick={() => setShowAddField(true)} size="sm" className="gap-2">
                                        <Plus className="h-4 w-4" />
                                        Ajouter un champ
                                    </Button>
                                </div>

                                <SearchAndFilters
                                    search={search} onSearchChange={setSearch}
                                    filters={filters} onFilterChange={(k, v) => setFilters(prev => ({ ...prev, [k]: v }))}
                                />

                                <FieldsTable
                                    fields={filteredFields}
                                    onFieldClick={setSelectedField}
                                    onReorder={handleReorderFields}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-[50vh] text-muted-foreground">
                            <p>Sélectionnez une entité ou créez-en une nouvelle</p>
                            <Button onClick={openCreateEntity} className="mt-4 gap-2">
                                <Plus className="h-4 w-4" />
                                Créer une entité
                            </Button>
                        </div>
                    )}
                </div>
            </main>

            <FieldDrawer
                field={selectedField}
                open={!!selectedField}
                onClose={() => setSelectedField(null)}
                onUpdate={async () => {
                    // Reload entity to refresh fields list
                    if (selectedEntityId) {
                        const entity = await getEntity(selectedEntityId);
                        setSelectedEntity(entity);
                    }
                    setSelectedField(null);
                }}
            />

            {/* Create Entity Modal */}
            <Dialog open={showCreateEntity} onOpenChange={setShowCreateEntity}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Créer une entité</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="entityName">Nom de l'entité *</Label>
                            <Input
                                id="entityName"
                                placeholder="ex: users, products, orders"
                                value={entityForm.name}
                                onChange={(e) => setEntityForm({ ...entityForm, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="entityDesc">Description</Label>
                            <Textarea
                                id="entityDesc"
                                placeholder="Description optionnelle..."
                                value={entityForm.description}
                                onChange={(e) => setEntityForm({ ...entityForm, description: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowCreateEntity(false)}>Annuler</Button>
                        <Button onClick={handleCreateEntity} disabled={!entityForm.name.trim() || savingEntity}>
                            {savingEntity ? 'Création...' : 'Créer'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Entity Modal */}
            <Dialog open={showEditEntity} onOpenChange={setShowEditEntity}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Modifier l'entité</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="editEntityName">Nom de l'entité *</Label>
                            <Input
                                id="editEntityName"
                                value={entityForm.name}
                                onChange={(e) => setEntityForm({ ...entityForm, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="editEntityDesc">Description</Label>
                            <Textarea
                                id="editEntityDesc"
                                value={entityForm.description}
                                onChange={(e) => setEntityForm({ ...entityForm, description: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowEditEntity(false)}>Annuler</Button>
                        <Button onClick={handleUpdateEntity} disabled={!entityForm.name.trim() || savingEntity}>
                            {savingEntity ? 'Enregistrement...' : 'Enregistrer'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Entity Modal */}
            <Dialog open={showDeleteEntity} onOpenChange={setShowDeleteEntity}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Supprimer l'entité ?</DialogTitle>
                    </DialogHeader>
                    <p className="py-4 text-muted-foreground">
                        Êtes-vous sûr de vouloir supprimer <strong>{selectedEntity?.name}</strong> ?
                        Tous les champs associés seront également supprimés. Cette action est irréversible.
                    </p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDeleteEntity(false)}>Annuler</Button>
                        <Button variant="destructive" onClick={handleDeleteEntity} disabled={savingEntity}>
                            {savingEntity ? 'Suppression...' : 'Supprimer'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add Field Modal */}
            <Sheet open={showAddField} onOpenChange={setShowAddField}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Ajouter un champ</SheetTitle>
                    </SheetHeader>

                    <div className="space-y-4 py-6">
                        <div className="space-y-2">
                            <Label htmlFor="fieldName">Nom du champ *</Label>
                            <Input
                                id="fieldName"
                                placeholder="ex: email, user_id"
                                value={newField.name}
                                onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="fieldType">Type</Label>
                            <Select value={newField.type} onValueChange={(v) => setNewField({ ...newField, type: v })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="VARCHAR(255)">VARCHAR(255)</SelectItem>
                                    <SelectItem value="TEXT">TEXT</SelectItem>
                                    <SelectItem value="INT">INT</SelectItem>
                                    <SelectItem value="BIGINT">BIGINT</SelectItem>
                                    <SelectItem value="BOOLEAN">BOOLEAN</SelectItem>
                                    <SelectItem value="DATE">DATE</SelectItem>
                                    <SelectItem value="DATETIME">DATETIME</SelectItem>
                                    <SelectItem value="TIMESTAMP">TIMESTAMP</SelectItem>
                                    <SelectItem value="FLOAT">FLOAT</SelectItem>
                                    <SelectItem value="DECIMAL">DECIMAL</SelectItem>
                                    <SelectItem value="JSON">JSON</SelectItem>
                                    <SelectItem value="UUID">UUID</SelectItem>
                                    <SelectItem value="RELATION" className="text-blue-600 font-semibold">RELATION (ForeignKey)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {newField.type === 'RELATION' && (
                            <div className="space-y-2 p-3 bg-blue-50 border border-blue-100 rounded-md">
                                <Label className="text-blue-800">Entité cible *</Label>
                                <Select
                                    value={newField.targetEntityId}
                                    onValueChange={(v) => setNewField({ ...newField, targetEntityId: v })}
                                >
                                    <SelectTrigger className="bg-white">
                                        <SelectValue placeholder="Sélectionner une entité" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {entities?.filter(e => e.id !== selectedEntityId).map(entity => (
                                            <SelectItem key={entity.id} value={entity.id}>
                                                {entity.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="fieldDesc">Description</Label>
                            <Input
                                id="fieldDesc"
                                placeholder="Description du champ"
                                value={newField.description}
                                onChange={(e) => setNewField({ ...newField, description: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="fieldDefault">Valeur par défaut</Label>
                            <Input
                                id="fieldDefault"
                                placeholder="ex: null, 0, 'active'"
                                value={newField.defaultValue}
                                onChange={(e) => setNewField({ ...newField, defaultValue: e.target.value })}
                            />
                        </div>

                        <div className="space-y-3 pt-4">
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="required"
                                    checked={newField.required}
                                    onCheckedChange={(c) => setNewField({ ...newField, required: !!c })}
                                />
                                <Label htmlFor="required" className="cursor-pointer">Obligatoire (NOT NULL)</Label>
                            </div>

                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="unique"
                                    checked={newField.unique}
                                    onCheckedChange={(c) => setNewField({ ...newField, unique: !!c })}
                                />
                                <Label htmlFor="unique" className="cursor-pointer">Unique</Label>
                            </div>

                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="indexed"
                                    checked={newField.indexed}
                                    onCheckedChange={(c) => setNewField({ ...newField, indexed: !!c })}
                                />
                                <Label htmlFor="indexed" className="cursor-pointer">Indexé</Label>
                            </div>
                        </div>
                    </div>

                    <SheetFooter>
                        <Button variant="outline" onClick={() => setShowAddField(false)}>
                            Annuler
                        </Button>
                        <Button onClick={handleAddField} disabled={!newField.name || savingField}>
                            {savingField && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            Ajouter
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </div>
    );
}
