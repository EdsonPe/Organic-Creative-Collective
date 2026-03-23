
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../components/Card';
import { MOCK_PROPOSALS } from '../constants';
import { Proposal } from '../types';

const StatCard = ({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) => (
  <Card className="flex flex-col justify-between">
    <div className="flex justify-between items-start">
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        <div className="text-indigo-400">{icon}</div>
    </div>
    <p className="text-3xl font-bold mt-2">{value}</p>
  </Card>
);

const activityData = [
  { name: 'Jan', propostas: 4 },
  { name: 'Fev', propostas: 3 },
  { name: 'Mar', propostas: 5 },
  { name: 'Abr', propostas: 7 },
  { name: 'Mai', propostas: 6 },
  { name: 'Jun', propostas: 8 },
];

const ActiveProposalItem = ({ proposal }: { proposal: Proposal }) => {
    const timeLeft = Math.max(0, Math.ceil((proposal.endDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24)));
    return (
        <div className="flex items-center justify-between p-3 hover:bg-gray-700/50 rounded-lg transition-colors">
            <div>
                <p className="font-semibold">{proposal.title}</p>
                <p className="text-xs text-gray-400">Proponente: {proposal.proposer}</p>
            </div>
            <div className="text-right">
                <p className="text-sm font-medium">{timeLeft} dias restantes</p>
                <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-green-400">▲ {proposal.votes.for}</span>
                    <span className="text-xs text-red-400">▼ {proposal.votes.against}</span>
                </div>
            </div>
        </div>
    );
};

const DashboardView: React.FC = () => {
  const activeProposals = MOCK_PROPOSALS.filter(p => p.status === 'active');

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Tokens em Posse" value="1,840 ORG" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
        <StatCard title="Poder de Voto" value="2.5%" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
        <StatCard title="Reputação (SBTs)" value="7" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-12v4m-2-2h4m6 4v4m-2-2h4M17 3l4 4M3 17l4 4" /></svg>} />
        <StatCard title="Propostas Ativas" value={activeProposals.length.toString()} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Atividade da DAO (Últimos 6 meses)</h3>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activityData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                        <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                        <YAxis stroke="#9ca3af" fontSize={12} />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', border: '1px solid #4b5563', borderRadius: '0.5rem' }} cursor={{fill: 'rgba(139, 92, 246, 0.1)'}} />
                        <Bar dataKey="propostas" fill="#818cf8" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
        <Card>
            <h3 className="text-lg font-semibold mb-4">Propostas Ativas</h3>
            <div className="space-y-2">
                {activeProposals.length > 0 ? (
                    activeProposals.map(p => <ActiveProposalItem key={p.id} proposal={p} />)
                ) : (
                    <p className="text-sm text-gray-400">Nenhuma proposta ativa no momento.</p>
                )}
            </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardView;
