'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle({ variant = 'ghost', size = 'icon' }) {
    const { theme, toggleTheme, mounted } = useTheme();

    if (!mounted) {
        return (
            <Button variant={variant} size={size} disabled>
                <Sun className="h-4 w-4" />
            </Button>
        );
    }

    return (
        <Button
            variant={variant}
            size={size}
            onClick={toggleTheme}
            title={theme === 'light' ? 'Activer le mode sombre' : 'Activer le mode clair'}
        >
            {theme === 'light' ? (
                <Moon className="h-4 w-4" />
            ) : (
                <Sun className="h-4 w-4" />
            )}
        </Button>
    );
}
