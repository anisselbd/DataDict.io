
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Database, Plus, Table, ArrowLeft, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from 'next/link';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableEntityItem({ entity, selectedId, onSelect }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: entity.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 1 : 0,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn("relative group mb-1", isDragging && "opacity-50")}
        >
            <button
                onClick={() => onSelect(entity.id)}
                className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-left",
                    selectedId === entity.id
                        ? "bg-primary/5 text-primary shadow-sm border border-primary/10"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
            >
                <Table className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    selectedId === entity.id ? "text-primary" : "text-gray-400 group-hover:text-gray-600"
                )} />
                <span className="truncate flex-1">{entity.name}</span>
            </button>

            <div
                {...attributes}
                {...listeners}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity rounded-md hover:bg-gray-200/50"
            >
                <GripVertical className="h-4 w-4" />
            </div>

            {selectedId === entity.id && (
                <div className="absolute right-9 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary animate-in zoom-in" />
            )}
        </div>
    );
}

export function EntitySidebar({ entities, selectedId, onSelect, onAdd, onReorder }) {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragEnd(event) {
        const { active, over } = event;
        if (!over) return;

        if (active.id !== over.id) {
            onReorder && onReorder(active.id, over.id);
        }
    }

    return (
        <div className="w-72 border-r bg-white flex flex-col h-screen sticky top-0 shadow-sm z-10">
            <div className="p-4 border-b flex flex-col gap-4">
                <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Dashboard
                </Link>
                <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-gray-900">
                    <div className="bg-primary p-1.5 rounded-md text-primary-foreground">
                        <Database className="h-5 w-5" />
                    </div>
                    <span>DataDict.io</span>
                </div>
            </div>

            <div className="p-4 pb-2">
                <Button onClick={onAdd} className="w-full justify-start gap-2 shadow-md hover:shadow-lg transition-all" variant="default" size="default">
                    <Plus className="h-4 w-4" />
                    New Entity
                </Button>
            </div>

            <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Collections
            </div>

            <ScrollArea className="flex-1 px-2">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={entities.map(e => e.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-1 pb-4">
                            {entities.map(entity => (
                                <SortableEntityItem
                                    key={entity.id}
                                    entity={entity}
                                    selectedId={selectedId}
                                    onSelect={onSelect}
                                />
                            ))}
                            {entities.length === 0 && (
                                <div className="px-3 py-8 text-center text-sm text-muted-foreground bg-gray-50 rounded-lg border border-dashed border-gray-200 mx-2">
                                    No entities yet
                                </div>
                            )}
                        </div>
                    </SortableContext>
                </DndContext>
            </ScrollArea>
            <div className="p-4 border-t bg-gray-50/50">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>v1.0.0</span>
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        Online
                    </span>
                </div>
            </div>
        </div>
    );
}
