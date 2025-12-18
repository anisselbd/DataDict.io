
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Search, Filter } from "lucide-react";

export function SearchAndFilters({ search, onSearchChange, filters, onFilterChange }) {
    return (
        <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 bg-white border border-gray-100 rounded-xl shadow-sm items-center">
            <div className="relative flex-1 w-full text-gray-500 hover:text-primary transition-colors">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
                <Input
                    placeholder="Search fields by name or type..."
                    className="pl-9 h-10 bg-gray-50 border-gray-200 focus:bg-white transition-all"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            <div className="flex w-full md:w-auto items-center gap-6 overflow-x-auto pb-2 md:pb-0 px-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Filter className="h-4 w-4" />
                    <span className="hidden lg:inline">Filters:</span>
                </div>

                <div className="flex items-center space-x-2">
                    <Checkbox id="req"
                        checked={filters.required}
                        onCheckedChange={(c) => onFilterChange('required', c)}
                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <Label htmlFor="req" className="text-sm font-medium cursor-pointer">Required</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox id="idx"
                        checked={filters.indexed}
                        onCheckedChange={(c) => onFilterChange('indexed', c)}
                        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="idx" className="text-sm font-medium cursor-pointer">Indexed</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox id="uniq"
                        checked={filters.unique}
                        onCheckedChange={(c) => onFilterChange('unique', c)}
                        className="data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
                    />
                    <Label htmlFor="uniq" className="text-sm font-medium cursor-pointer">Unique</Label>
                </div>
            </div>
        </div>
    );
}
