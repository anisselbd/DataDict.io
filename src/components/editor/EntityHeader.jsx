
import { Badge } from "@/components/ui/badge";

export function EntityHeader({ entity }) {
    if (!entity) return null;

    return (
        <div className="mb-8 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-3">
                <h1 className="text-3xl font-black tracking-tight text-gray-900">{entity.name}</h1>
                <div className="flex gap-2">
                    {entity.tags?.map(tag => (
                        <Badge key={tag} variant="secondary" className="px-2.5 py-0.5 text-xs font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 uppercase tracking-wide border border-gray-200">
                            {tag}
                        </Badge>
                    ))}
                </div>
            </div>
            <p className="text-lg text-gray-500 max-w-2xl leading-relaxed">
                {entity.description}
            </p>
        </div>
    );
}
