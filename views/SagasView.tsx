import React, { useState, useCallback } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import { generateSaga } from '../services/geminiService';
import { Saga } from '../types';

interface SagasViewProps {
    onLaunch: (idea: string) => void;
}

const SagasView: React.FC<SagasViewProps> = ({ onLaunch }) => {
    const [theme, setTheme] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [saga, setSaga] = useState<Saga | null>(null);

    const handleGenerateSaga = useCallback(async () => {
        if (!theme) {
            setError('Por favor, insira um tema para a saga.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setSaga(null);
        try {
            const result = await generateSaga(theme);
            setSaga(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.');
        } finally {
            setIsLoading(false);
        }
    }, [theme]);

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">Gerador de Sagas Criativas</h1>
                <p className="mt-4 text-lg leading-8 text-gray-300">Transforme um simples tema em uma campanha de múltiplos projetos, com uma narrativa coesa e capítulos interligados, prontos para serem construídos pelo coletivo.</p>
            </div>

            <Card className="p-8">
                <div className="space-y-4">
                    <label htmlFor="theme-prompt" className="block text-base font-semibold leading-6 text-gray-200">
                        Qual é o tema da sua Saga?
                    </label>
                    <input
                        type="text"
                        name="theme-prompt"
                        id="theme-prompt"
                        className="block w-full rounded-md border-0 bg-white/5 p-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                        placeholder="Ex: Ecofuturismo Amazônico, Renascimento Cyberpunk, Mitologia Cósmica"
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                        disabled={isLoading}
                    />
                    <div className="flex justify-end">
                        <Button onClick={handleGenerateSaga} isLoading={isLoading} disabled={!theme.trim()}>
                            {isLoading ? 'Criando Universo...' : 'Gerar Saga com IA'}
                        </Button>
                    </div>
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                </div>
            </Card>

            {isLoading && (
                <div className="flex justify-center items-center py-10">
                    <div className="text-center">
                        <LoadingSpinner />
                        <p className="mt-2 text-gray-400">Tecendo a narrativa...</p>
                    </div>
                </div>
            )}

            {saga && (
                <div className="space-y-6">
                    <Card className="bg-gradient-to-br from-indigo-900/50 to-gray-900/50 border-indigo-700">
                        <h2 className="text-3xl font-bold text-white">{saga.title}</h2>
                        <p className="mt-2 text-indigo-200 italic">"{saga.narrative}"</p>
                    </Card>

                    <h3 className="text-2xl font-semibold text-gray-200 mt-8">Capítulos da Saga:</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {saga.chapters.map((chapter, index) => (
                            <Card key={index} className="flex flex-col justify-between h-full">
                                <div>
                                    <span className="text-sm font-bold text-indigo-400">Capítulo {index + 1}</span>
                                    <h4 className="text-xl font-bold mt-1">{chapter.title}</h4>
                                    <p className="text-gray-400 mt-2 text-sm">{chapter.description}</p>
                                </div>
                                <Button onClick={() => onLaunch(chapter.description)} className="mt-6 w-full">
                                    Lançar Projeto deste Capítulo
                                </Button>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SagasView;