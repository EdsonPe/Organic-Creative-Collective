
import React, { useState, useCallback } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import { getStrategicAdvice } from '../services/geminiService';

const StatCard = ({ title, value, icon, description }: { title: string; value: string; icon: React.ReactNode; description: string; }) => (
  <Card className="flex flex-col">
    <div className="flex justify-between items-center">
      <h3 className="text-sm font-medium text-gray-400">{title}</h3>
      <div className="text-indigo-400">{icon}</div>
    </div>
    <p className="text-3xl font-bold mt-2">{value}</p>
    <p className="text-xs text-gray-500 mt-1">{description}</p>
  </Card>
);

const GovernanceView: React.FC = () => {
    const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);
    const [advice, setAdvice] = useState('');
    const [error, setError] = useState('');

    const handleGetAdvice = useCallback(async () => {
        setIsLoadingAdvice(true);
        setError('');
        setAdvice('');
        try {
            const mockDaoData = {
                participationRate: '35%',
                activeProposals: 5,
                passedProposalsLast30d: 8,
                failedProposalsLast30d: 4,
                averageVotingTime: '48 hours',
                governanceParameters: {
                    quorum: '20%',
                    proposalThreshold: '1000 ORG tokens'
                }
            };
            const result = await getStrategicAdvice(mockDaoData);
            setAdvice(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Não foi possível obter o conselho.');
        } finally {
            setIsLoadingAdvice(false);
        }
    }, []);

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold mb-1">Painel de Saúde da Governança</h2>
                <p className="text-gray-400 text-sm">Métricas vitais sobre a tomada de decisão e participação no coletivo.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Participação de Voto"
                    value="35%"
                    description="Dos membros elegíveis"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.125-1.273-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.125-1.273.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                />
                <StatCard
                    title="Limite Mínimo de Votos"
                    value="20%"
                    description="Mínimo para validade"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                />
                <StatCard
                    title="Propostas de Gov."
                    value="2"
                    description="Ativas no momento"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z" /></svg>}
                />
                 <StatCard
                    title="Distribuição de Poder"
                    value="Baixa"
                    description="Índice Gini: 0.42"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>}
                />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <h3 className="text-lg font-semibold mb-2">Oráculo Estratégico de IA</h3>
                    <p className="text-sm text-gray-400 mb-4">Peça à IA para analisar os dados atuais do coletivo e sugerir melhorias na governança ou no engajamento.</p>
                    <Button onClick={handleGetAdvice} isLoading={isLoadingAdvice}>
                        Pedir conselho à IA
                    </Button>

                    {isLoadingAdvice && <div className="flex justify-center p-8"><LoadingSpinner /></div>}
                    
                    {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
                    
                    {advice && (
                        <div className="mt-6 p-4 bg-gray-900/50 border-l-4 border-indigo-500 rounded-r-lg">
                           <p className="text-gray-300 italic whitespace-pre-wrap">{advice}</p>
                        </div>
                    )}
                </Card>
                <Card>
                    <h3 className="text-lg font-semibold mb-4">Propostas de Governança</h3>
                     <div className="space-y-4">
                        <div className="p-3 bg-gray-900/50 rounded-lg">
                            <p className="font-semibold text-sm">Reduzir o limite de votos para 15%</p>
                            <p className="text-xs text-gray-400 mt-1">Status: Em votação (3 dias restantes)</p>
                        </div>
                        <div className="p-3 bg-gray-900/50 rounded-lg">
                            <p className="font-semibold text-sm">Aumentar o tempo de votação para 7 dias</p>
                            <p className="text-xs text-gray-400 mt-1">Status: Em votação (5 dias restantes)</p>
                        </div>
                         <Button variant="ghost" className="w-full mt-2">Ver todas as propostas de governança</Button>
                     </div>
                </Card>
            </div>
             <Card>
                <h3 className="text-lg font-semibold">Delegação de Voto</h3>
                <p className="text-sm text-gray-400 mt-1">Delegue seu poder de voto para membros da comunidade em quem você confia para votar em seu nome.</p>
                <div className="mt-4 p-4 border-2 border-dashed border-gray-600 rounded-lg text-center">
                    <h4 className="font-semibold text-gray-300">Funcionalidade em Desenvolvimento</h4>
                    <p className="text-sm text-gray-400 mt-1">
                        Em breve você poderá delegar seu voto e ver os principais delegados da comunidade.
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default GovernanceView;
