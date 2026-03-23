
import React, { useState, useCallback } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import { generateOpportunities } from '../services/geminiService';
import { Opportunity } from '../types';
import { MOCK_GUILDS } from '../constants';

interface OpportunityCardProps {
    opportunity: Opportunity;
    onLaunch: (idea: string) => void;
}

const OpportunityCard: React.FC<OpportunityCardProps> = ({ opportunity, onLaunch }) => {
    const guilds = opportunity.suggestedGuilds.map(id => MOCK_GUILDS.find(g => g.id === id)).filter(Boolean);
    
    return (
        <Card className="flex flex-col justify-between transition-shadow hover:shadow-indigo-500/30 hover:shadow-lg">
            <div>
                <h3 className="text-xl font-bold text-indigo-400">{opportunity.title}</h3>
                <p className="mt-2 text-sm text-gray-300">{opportunity.description}</p>
                <div className="mt-4 p-3 bg-gray-900/50 rounded-lg border-l-2 border-gray-600">
                    <p className="text-xs font-semibold text-gray-400">Justificativa da IA:</p>
                    <p className="mt-1 text-xs text-gray-400 italic">"{opportunity.rationale}"</p>
                </div>
                {guilds.length > 0 && (
                    <div className="mt-3">
                        <p className="text-xs font-semibold text-gray-400">Guildas Sugeridas:</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {guilds.map(guild => (
                                <span key={guild!.id} className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded-full">{guild!.name}</span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <Button onClick={() => onLaunch(opportunity.description)} className="mt-6 w-full">
                Lançar este Projeto
            </Button>
        </Card>
    );
};

const OpportunityMarketView: React.FC<{ onLaunch: (idea: string) => void }> = ({ onLaunch }) => {
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setOpportunities([]);
        try {
            const result = await generateOpportunities();
            setOpportunities(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">Mercado de Oportunidades</h1>
                <p className="mt-4 text-lg leading-8 text-gray-300">Descubra novas fronteiras criativas. Nossa IA analisa o coletivo para encontrar e sugerir projetos inovadores com alto potencial.</p>
            </div>

            <Card className="text-center p-8">
                <h2 className="text-xl font-semibold">Pronto para Inovar?</h2>
                <p className="mt-2 text-gray-400">Clique abaixo para que a IA gere um novo conjunto de oportunidades de projeto com base nas atividades recentes da DAO.</p>
                <Button onClick={handleGenerate} isLoading={isLoading} className="mt-4">
                    {isLoading ? 'Analisando o Coletivo...' : 'Gerar Novas Oportunidades'}
                </Button>
            </Card>

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            {isLoading && (
                <div className="flex justify-center items-center py-10">
                    <div className="text-center">
                        <LoadingSpinner />
                        <p className="mt-2 text-gray-400">Buscando sinergias...</p>
                    </div>
                </div>
            )}
            
            {opportunities.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {opportunities.map((op, index) => (
                        <OpportunityCard key={index} opportunity={op} onLaunch={onLaunch} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default OpportunityMarketView;
