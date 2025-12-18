
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Key, Search, AlertCircle, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableRow({ field, onFieldClick }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: field.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 1 : 0,
    };

    return (
        <TableRow
            ref={setNodeRef}
            style={style}
            className={cn(
                "cursor-pointer hover:bg-blue-50/40 transition-colors group border-gray-100",
                isDragging && "opacity-50"
            )}
            onClick={() => onFieldClick(field)}
        >
            <TableCell className="w-[40px] px-2 text-center" onClick={(e) => e.stopPropagation()}>
                <div
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing p-1.5 hover:bg-gray-100 rounded-md inline-flex text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <GripVertical className="h-4 w-4" />
                </div>
            </TableCell>
            <TableCell className="font-medium text-gray-900 group-hover:text-primary transition-colors py-4">
                <div className="flex items-center gap-2">
                    {field.name}
                    {field.required && <AlertCircle className="h-3 w-3 text-red-500" title="Required" />}
                </div>
            </TableCell>
            <TableCell>
                <code className="bg-gray-100 px-2 py-1 rounded-md text-xs font-mono text-pink-600 font-semibold border border-gray-200">
                    {field.type}
                </code>
            </TableCell>
            <TableCell>
                <div className="flex justify-center gap-1.5">
                    {field.unique && <Badge variant="outline" className="h-6 w-6 p-0 flex items-center justify-center rounded-full bg-amber-50 text-amber-700 border-amber-200 shadow-sm" title="Unique"><Key className="h-3 w-3" /></Badge>}
                    {field.indexed && <Badge variant="outline" className="h-6 w-6 p-0 flex items-center justify-center rounded-full bg-blue-50 text-blue-700 border-blue-200 shadow-sm" title="Indexed"><Search className="h-3 w-3" /></Badge>}
                    {!field.unique && !field.indexed && <span className="text-muted-foreground text-xs text-center block w-full">-</span>}
                </div>
            </TableCell>
            <TableCell className="text-muted-foreground text-sm font-mono truncate max-w-[120px]">
                {field.defaultValue || <span className="text-gray-300 italic">null</span>}
            </TableCell>
            <TableCell className="text-muted-foreground text-sm truncate max-w-[250px]">
                {field.description || <span className="text-gray-300 italic">-</span>}
            </TableCell>
            <TableCell className="text-right text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors">
                View Details &rarr;
            </TableCell>
        </TableRow>
    );
}

export function FieldsTable({ fields, onFieldClick, onReorder }) {
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
        <div className="border rounded-xl overflow-hidden bg-white shadow-sm ring-1 ring-gray-200">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/80 hover:bg-gray-50/80 border-b border-gray-200">
                            <TableHead className="w-[40px]"></TableHead>
                            <TableHead className="w-[200px] font-semibold text-gray-700">Name</TableHead>
                            <TableHead className="font-semibold text-gray-700">Type</TableHead>
                            <TableHead className="w-[100px] font-semibold text-gray-700 text-center">Attributes</TableHead>
                            <TableHead className="font-semibold text-gray-700">Default</TableHead>
                            <TableHead className="w-[250px] font-semibold text-gray-700">Description</TableHead>
                            <TableHead className="text-right font-semibold text-gray-700">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <SortableContext
                            items={fields.map(f => f.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {fields.map((field) => (
                                <SortableRow
                                    key={field.id}
                                    field={field}
                                    onFieldClick={onFieldClick}
                                />
                            ))}
                        </SortableContext>
                        {fields.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground bg-gray-50/30">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="p-3 bg-gray-100 rounded-full">
                                            <Search className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <p>No fields defined yet.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </DndContext>
        </div>
    );
}
