
import React, { useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import { MOCK_PROPOSALS } from '../constants';
import { Proposal } from '../types';

const ProposalCard = ({ proposal }: { proposal: Proposal }) => {
    const totalVotes = proposal.votes.for + proposal.votes.against;
    const forPercentage = totalVotes > 0 ? (proposal.votes.for / totalVotes) * 100 : 0;
    const againstPercentage = totalVotes > 0 ? (proposal.votes.against / totalVotes) * 100 : 0;
    const timeLeft = Math.max(0, Math.ceil((proposal.endDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24)));

    const statusBadge = {
        active: 'bg-blue-500/20 text-blue-300',
        passed: 'bg-green-500/20 text-green-300',
        failed: 'bg-red-500/20 text-red-300',
    };

    return (
        <Card className="flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold pr-4">{proposal.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${statusBadge[proposal.status]}`}>
                        {proposal.status === 'active' ? `${timeLeft}d restantes` : proposal.status}
                    </span>
                </div>
                <p className="text-sm text-gray-400 mt-2">{proposal.description}</p>
            </div>
            <div className="mt-4">
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div className="bg-green-500 h-2.5 rounded-l-full" style={{ width: `${forPercentage}%` }}></div>
                </div>
                <div className="flex justify-between text-xs mt-1 text-gray-400">
                    <span>A favor: {proposal.votes.for} ({forPercentage.toFixed(1)}%)</span>
                    <span>Contra: {proposal.votes.against} ({againstPercentage.toFixed(1)}%)</span>
                </div>
            </div>
             {proposal.status === 'active' && (
                <div className="flex space-x-2 mt-4">
                    <Button variant="secondary" className="w-full">Votar a Favor</Button>
                    <Button variant="secondary" className="w-full hover:bg-red-800/50">Votar Contra</Button>
                </div>
            )}
        </Card>
    );
}

const ProposalsView: React.FC = () => {
    const [filter, setFilter] = useState<'all' | 'active' | 'passed' | 'failed'>('all');

    const filteredProposals = MOCK_PROPOSALS.filter(p => {
        if (filter === 'all') return true;
        return p.status === filter;
    });
    
    const FilterButton = ({ f, children }: { f: typeof filter, children: React.ReactNode }) => (
        <button 
            onClick={() => setFilter(f)} 
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === f ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
        >
            {children}
        </button>
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h1 className="text-3xl font-bold">Propostas da DAO</h1>
                <div className="flex items-center space-x-2">
                    <FilterButton f="all">Todas</FilterButton>
                    <FilterButton f="active">Ativas</FilterButton>
                    <FilterButton f="passed">Aprovadas</FilterButton>
                    <FilterButton f="failed">Rejeitadas</FilterButton>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProposals.map(p => <ProposalCard key={p.id} proposal={p} />)}
            </div>
            {filteredProposals.length === 0 && (
                <Card className="text-center py-12">
                    <p className="text-gray-400">Nenhuma proposta encontrada com o filtro selecionado.</p>
                </Card>
            )}
        </div>
    );
};

export default ProposalsView;
