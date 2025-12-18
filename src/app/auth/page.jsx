'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Database, Loader2, AlertCircle } from 'lucide-react';

export default function AuthPage() {
    const router = useRouter();
    const { login, register } = useAuth();

    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
    });

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await login(formData.email, formData.password);
            } else {
                await register(formData.email, formData.password, formData.name);
            }
            router.push('/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-2xl border-0">
                <CardHeader className="text-center pb-2">
                    <div className="flex justify-center mb-4">
                        <div className="bg-primary p-3 rounded-xl shadow-lg">
                            <Database className="h-8 w-8 text-primary-foreground" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">
                        {isLogin ? 'Connexion' : 'Inscription'}
                    </CardTitle>
                    <CardDescription>
                        {isLogin
                            ? 'Accédez à vos dictionnaires de données'
                            : 'Créez votre compte Data Dictionary IO'}
                    </CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                                <AlertCircle className="h-4 w-4" />
                                {error}
                            </div>
                        )}

                        {!isLogin && (
                            <div className="space-y-2">
                                <Label htmlFor="name">Nom</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Votre nom"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="vous@exemple.com"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Mot de passe</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                minLength={6}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col gap-4">
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isLogin ? 'Se connecter' : "S'inscrire"}
                        </Button>

                        <p className="text-sm text-muted-foreground text-center">
                            {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}
                            <button
                                type="button"
                                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                                className="ml-1 text-primary hover:underline font-medium"
                            >
                                {isLogin ? "S'inscrire" : 'Se connecter'}
                            </button>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
