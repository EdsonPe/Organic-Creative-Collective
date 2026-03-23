import React, { useState, useCallback } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import { MOCK_USER_PROFILE, MOCK_RESOURCES, MOCK_PROJECTS } from '../constants';
import { getProjectRecommendations } from '../services/geminiService';
import { ProjectRecommendation } from '../types';

const ProfileView: React.FC = () => {
    const [recommendations, setRecommendations] = useState<ProjectRecommendation[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const userTalents = MOCK_USER_PROFILE.talents.map(id => MOCK_RESOURCES.find(r => r.id === id)).filter(Boolean);

    const handleFindProjects = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setRecommendations([]);
        try {
            const results = await getProjectRecommendations(MOCK_USER_PROFILE, MOCK_PROJECTS);
            setRecommendations(results);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
             <div>
                <h1 className="text-3xl font-bold">Meu Perfil</h1>
                <p className="text-gray-400 mt-1">Seu centro de talentos e oportunidades no coletivo.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <h3 className="text-lg font-semibold">Minha Carteira</h3>
                        <p className="text-sm text-indigo-400 font-mono truncate mt-1">{MOCK_USER_PROFILE.address}</p>
                    </Card>
                    <Card>
                        <h3 className="text-lg font-semibold">Meus Talentos</h3>
                        <div className="flex flex-wrap gap-2 mt-3">
                            {userTalents.map(talent => (
                                <span key={talent!.id} className="px-3 py-1 text-sm bg-gray-700 text-gray-200 rounded-full">
                                    {talent!.name}
                                </span>
                            ))}
                        </div>
                        <Button variant="ghost" className="w-full mt-4 text-xs">Gerenciar Talentos</Button>
                    </Card>
                </div>
                
                <div className="lg:col-span-2">
                     <Card className="p-8">
                        <h2 className="text-2xl font-bold text-indigo-400">Matchmaker de IA</h2>
                        <p className="mt-2 text-gray-300">Deixe que nosso "caça-talentos" estratégico encontre os projetos perfeitos para suas habilidades. A IA analisará seus talentos e as necessidades dos projetos atuais para sugerir as melhores colaborações.</p>
                        <Button onClick={handleFindProjects} isLoading={isLoading} className="mt-6">
                           {isLoading ? 'Analisando...' : 'Encontrar projetos para mim'}
                        </Button>

                        {isLoading && <div className="flex justify-center p-8"><LoadingSpinner /></div>}
                        
                        {error && <p className="text-red-400 text-sm mt-4">{error}</p>}

                        {recommendations.length > 0 && (
                            <div className="mt-8 space-y-4">
                                <h3 className="text-xl font-semibold">Projetos Recomendados para Você:</h3>
                                {recommendations.map(rec => {
                                    const project = MOCK_PROJECTS.find(p => p.id === rec.projectId);
                                    if (!project) return null;
                                    return (
                                        <Card key={rec.projectId} className="bg-gray-900/50">
                                            <h4 className="font-bold text-lg">{project.title}</h4>
                                            <p className="text-sm text-gray-400 mt-1 line-clamp-2">{project.description}</p>
                                            <div className="mt-3 p-3 bg-gray-800/70 rounded-lg border-l-2 border-indigo-500">
                                                <p className="text-xs font-semibold text-indigo-300">Justificativa da IA:</p>
                                                <p className="mt-1 text-xs text-gray-300 italic">"{rec.rationale}"</p>
                                            </div>
                                            <Button variant="secondary" className="w-full mt-4">Ver Detalhes do Projeto</Button>
                                        </Card>
                                    );
                                })}
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ProfileView;