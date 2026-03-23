
import React, { useState, useCallback, useEffect } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import { analyzeProjectIdea } from '../services/geminiService';
import { MOCK_GUILDS } from '../constants';

interface LaunchpadViewProps {
    onNavigate: (view: 'projects' | 'guilds') => void;
    initialIdea?: string;
}

const LaunchpadView: React.FC<LaunchpadViewProps> = ({ onNavigate, initialIdea = '' }) => {
    const [rawIdea, setRawIdea] = useState(initialIdea);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [analyzedIdea, setAnalyzedIdea] = useState<{ title: string; description: string; suggestedGuildId: number } | null>(null);

    useEffect(() => {
        setRawIdea(initialIdea);
        setAnalyzedIdea(null);
    }, [initialIdea]);


    const handleAnalyze = useCallback(async () => {
        if (!rawIdea) {
            setError('Por favor, descreva sua ideia.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setAnalyzedIdea(null);
        try {
            const result = await analyzeProjectIdea(rawIdea);
            setAnalyzedIdea(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.');
        } finally {
            setIsLoading(false);
        }
    }, [rawIdea]);
    
    const suggestedGuild = analyzedIdea ? MOCK_GUILDS.find(g => g.id === analyzedIdea.suggestedGuildId) : null;
    
    const handleReset = () => {
        setAnalyzedIdea(null);
        setRawIdea('');
    }

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">Transforme sua Ideia em Realidade</h1>
                <p className="mt-4 text-lg leading-8 text-gray-300">Descreva seu conceito, e nossa IA ajudará a transformá-lo em um projeto estruturado, pronto para ser lançado em nosso coletivo.</p>
            </div>

            <Card className="p-8">
                {!analyzedIdea ? (
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="idea-prompt" className="block text-base font-semibold leading-6 text-gray-200">
                                1. Qual projeto você quer criar?
                            </label>
                            <p className="text-sm text-gray-400">Seja breve ou detalhado. Se você veio de uma oportunidade, sua ideia já está aqui. Sinta-se à vontade para refinar.</p>
                            <div className="mt-2">
                                <textarea
                                    rows={4}
                                    name="idea-prompt"
                                    id="idea-prompt"
                                    className="block w-full rounded-md border-0 bg-white/5 p-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                                    placeholder="Eu quero criar..."
                                    value={rawIdea}
                                    onChange={(e) => setRawIdea(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button onClick={handleAnalyze} isLoading={isLoading} disabled={!rawIdea.trim()}>
                                {isLoading ? 'Analisando Ideia...' : 'Analisar com IA'}
                            </Button>
                        </div>
                         {error && <p className="text-red-400 text-sm">{error}</p>}
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div>
                           <h2 className="text-2xl font-bold text-indigo-400">Projeto Estruturado pela IA</h2>
                           <p className="text-gray-400 mt-1">Aqui está uma base para o seu projeto. Você pode editar antes de enviar.</p>
                        </div>
                        
                        <div className="space-y-4">
                             <div>
                                <label className="block text-sm font-medium text-gray-300">Título do Projeto</label>
                                <input type="text" defaultValue={analyzedIdea.title} className="mt-1 w-full p-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300">Descrição</label>
                                <textarea rows={4} defaultValue={analyzedIdea.description} className="mt-1 w-full p-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"></textarea>
                            </div>
                            <div>
                               <label className="block text-sm font-medium text-gray-300">Guilda Sugerida</label>
                               {suggestedGuild ? (
                                   <div className="mt-2 p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                                       <h4 className="font-semibold">{suggestedGuild.name}</h4>
                                       <p className="text-xs text-gray-400">{suggestedGuild.description}</p>
                                   </div>
                               ) : <p className="text-gray-400">Nenhuma guilda específica foi sugerida.</p>}
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                             <Button variant="ghost" onClick={() => setAnalyzedIdea(null)}>Voltar e Editar Ideia</Button>
                             <Button onClick={() => onNavigate('projects')}>
                                Finalizar e Enviar para Financiamento
                             </Button>
                        </div>
                    </div>
                )}
            </Card>

            <div className="text-center">
                 <p className="text-sm text-gray-500">{!analyzedIdea ? 'Ou comece do zero ou explore as atividades existentes:' : 'Ou comece uma nova ideia do zero:'}</p>
                 <div className="mt-4 flex items-center justify-center gap-x-4">
                     {!analyzedIdea && <Button variant="secondary" onClick={() => onNavigate('projects')}>Ver Projetos</Button>}
                     {!analyzedIdea && <Button variant="secondary" onClick={() => onNavigate('guilds')}>Explorar Guildas</Button>}
                     {analyzedIdea && <Button variant="secondary" onClick={handleReset}>Começar uma Nova Ideia</Button>}
                 </div>
            </div>
        </div>
    );
};

export default LaunchpadView;