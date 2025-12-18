'use client';

import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Pencil, Trash2, X, Loader2 } from "lucide-react";
import { updateField, deleteField, createRelation, deleteRelation } from "@/lib/api";

export function FieldDrawer({ field, open, onClose, onUpdate, entities, relations }) {
    const [isEditing, setIsEditing] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        description: '',
        defaultValue: '',
        required: false,
        unique: false,
        indexed: false,
        targetEntityId: ''
    });

    // Update form when field changes
    // Find existing relation for this field
    const existingRelation = relations?.find(r => r.sourceFieldId === field?.id);

    useEffect(() => {
        if (field) {
            setFormData({
                name: field.name || '',
                type: existingRelation ? 'RELATION' : (field.type || 'VARCHAR(255)'),
                description: field.description || '',
                defaultValue: field.defaultValue || '',
                required: field.required || false,
                unique: field.unique || false,
                indexed: field.indexed || false,
                targetEntityId: existingRelation ? existingRelation.targetEntityId : ''
            });
            setIsEditing(false);
        }
    }, [field, existingRelation, open]);

    if (!field) return null;

    async function handleSave() {
        setSaving(true);
        try {
            // Determine actual DB type
            const dbType = formData.type === 'RELATION' ? 'VARCHAR(255)' : formData.type;

            await updateField(field.id, {
                name: formData.name,
                type: dbType,
                description: formData.description || null,
                defaultValue: formData.defaultValue || null,
                required: formData.required,
                unique: formData.unique,
                indexed: formData.indexed
            });

            // Handle Relation
            if (formData.type === 'RELATION' && formData.targetEntityId) {
                // Check if updating or creating
                if (existingRelation) {
                    if (existingRelation.targetEntityId !== formData.targetEntityId) {
                        // Delete old and create new (simpler CRUD for now)
                        await deleteRelation(existingRelation.id);
                        await createRelation({
                            sourceFieldId: field.id,
                            targetEntityId: formData.targetEntityId
                        });
                    }
                } else {
                    await createRelation({
                        sourceFieldId: field.id,
                        targetEntityId: formData.targetEntityId
                    });
                }
            } else if (formData.type !== 'RELATION' && existingRelation) {
                // If switched away from RELATION, delete the relation
                await deleteRelation(existingRelation.id);
            }

            setIsEditing(false);
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error('Failed to update field:', error);
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete() {
        setSaving(true);
        try {
            await deleteField(field.id);
            setShowDelete(false);
            onClose();
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error('Failed to delete field:', error);
        } finally {
            setSaving(false);
        }
    }

    function handleClose() {
        setIsEditing(false);
        onClose();
    }

    return (
        <>
            <Sheet open={open} onOpenChange={handleClose}>
                <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto bg-white border-l shadow-2xl">
                    <SheetHeader className="mb-6 border-b pb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="font-mono text-xs bg-gray-50 text-gray-700 border-gray-200">
                                    {isEditing ? formData.type : field.type}
                                </Badge>
                                {(isEditing ? formData.required : field.required) && (
                                    <Badge className="bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 shadow-none">
                                        Required
                                    </Badge>
                                )}
                            </div>
                            <div className="flex items-center gap-1">
                                {!isEditing ? (
                                    <>
                                        <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => setShowDelete(true)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </>
                                ) : (
                                    <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                        <SheetTitle className="text-2xl font-bold font-mono text-gray-900 tracking-tight mt-2">
                            {isEditing ? formData.name : field.name}
                        </SheetTitle>
                    </SheetHeader>

                    {isEditing ? (
                        // Edit Mode
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="editFieldName">Nom *</Label>
                                <Input
                                    id="editFieldName"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Type</Label>
                                <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
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

                            {formData.type === 'RELATION' && (
                                <div className="space-y-2 p-3 bg-blue-50 border border-blue-100 rounded-md">
                                    <Label className="text-blue-800">Entité cible *</Label>
                                    <Select
                                        value={formData.targetEntityId}
                                        onValueChange={(v) => setFormData({ ...formData, targetEntityId: v })}
                                    >
                                        <SelectTrigger className="bg-white">
                                            <SelectValue placeholder="Sélectionner une entité" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {entities?.filter(e => e.id !== field.entityId).map(entity => (
                                                <SelectItem key={entity.id} value={entity.id}>
                                                    {entity.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="editFieldDesc">Description</Label>
                                <Textarea
                                    id="editFieldDesc"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="editFieldDefault">Valeur par défaut</Label>
                                <Input
                                    id="editFieldDefault"
                                    value={formData.defaultValue}
                                    onChange={(e) => setFormData({ ...formData, defaultValue: e.target.value })}
                                />
                            </div>

                            <div className="space-y-3 pt-4 border-t">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="editRequired"
                                        checked={formData.required}
                                        onCheckedChange={(c) => setFormData({ ...formData, required: !!c })}
                                    />
                                    <Label htmlFor="editRequired" className="cursor-pointer">Obligatoire (NOT NULL)</Label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="editUnique"
                                        checked={formData.unique}
                                        onCheckedChange={(c) => setFormData({ ...formData, unique: !!c })}
                                    />
                                    <Label htmlFor="editUnique" className="cursor-pointer">Unique</Label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="editIndexed"
                                        checked={formData.indexed}
                                        onCheckedChange={(c) => setFormData({ ...formData, indexed: !!c })}
                                    />
                                    <Label htmlFor="editIndexed" className="cursor-pointer">Indexé</Label>
                                </div>
                            </div>

                            <SheetFooter className="pt-4">
                                <Button variant="outline" onClick={() => setIsEditing(false)}>Annuler</Button>
                                <Button onClick={handleSave} disabled={!formData.name || saving}>
                                    {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                    Enregistrer
                                </Button>
                            </SheetFooter>
                        </div>
                    ) : (
                        // View Mode
                        <div className="space-y-6">
                            {existingRelation && (
                                <section className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                                    <h4 className="text-xs font-bold text-blue-800 mb-2 uppercase tracking-wider flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                                        Relation (Clé Étrangère)
                                    </h4>
                                    <div className="text-sm">
                                        <p className="text-blue-900 mb-1">Pointe vers l'entité :</p>
                                        <div className="font-semibold text-blue-700 bg-white border border-blue-200 px-3 py-2 rounded-lg inline-block">
                                            {entities?.find(e => e.id === existingRelation.targetEntityId)?.name || 'Entité inconnue'}
                                        </div>
                                    </div>
                                </section>
                            )}

                            <section>
                                <h4 className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Description</h4>
                                <p className="text-gray-700">
                                    {field.description || <span className="text-gray-400 italic">Aucune description</span>}
                                </p>
                            </section>

                            <section className="grid grid-cols-2 gap-4">
                                <div className="p-4 border rounded-xl bg-gray-50/50">
                                    <span className="text-xs font-bold text-gray-400 uppercase block mb-1">Unique</span>
                                    <span className={field.unique ? "text-green-600 font-semibold" : "text-gray-400"}>
                                        {field.unique ? "Oui" : "Non"}
                                    </span>
                                </div>
                                <div className="p-4 border rounded-xl bg-gray-50/50">
                                    <span className="text-xs font-bold text-gray-400 uppercase block mb-1">Indexé</span>
                                    <span className={field.indexed ? "text-blue-600 font-semibold" : "text-gray-400"}>
                                        {field.indexed ? "Oui" : "Non"}
                                    </span>
                                </div>
                            </section>

                            <section>
                                <h4 className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Valeur par défaut</h4>
                                <code className="block bg-gray-900 text-gray-100 p-3 rounded-lg font-mono text-sm">
                                    {field.defaultValue || "NULL"}
                                </code>
                            </section>

                            {field.constraints && field.constraints.length > 0 && (
                                <section>
                                    <h4 className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Contraintes</h4>
                                    <div className="space-y-2">
                                        {field.constraints.map((c, i) => (
                                            <div key={i} className="flex items-center gap-2 text-sm">
                                                <Badge variant="outline">{c.kind}</Badge>
                                                <code className="text-gray-600">{c.value}</code>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    )}
                </SheetContent>
            </Sheet>

            {/* Delete Confirmation */}
            <Dialog open={showDelete} onOpenChange={setShowDelete}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Supprimer le champ ?</DialogTitle>
                    </DialogHeader>
                    <p className="py-4 text-muted-foreground">
                        Êtes-vous sûr de vouloir supprimer le champ <strong>{field.name}</strong> ?
                        Cette action est irréversible.
                    </p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDelete(false)}>Annuler</Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={saving}>
                            {saving ? 'Suppression...' : 'Supprimer'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
