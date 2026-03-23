import React, { useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import { MOCK_PROJECTS, MOCK_GUILDS, MOCK_RESOURCES } from '../constants';
import { Project, ProjectStage } from '../types';

const ProjectCard = ({ project }: { project: Project }) => {
    const totalVotes = project.votes.for + project.votes.against;
    const forPercentage = totalVotes > 0 ? (project.votes.for / totalVotes) * 100 : 0;
    
    const timeLeft = project.stage === 'funding' ? Math.max(0, Math.ceil((project.endDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24))) : 0;

    const stageBadge: Record<ProjectStage, {text: string, className: string}> = {
        funding: { text: `${timeLeft}d restantes`, className: 'bg-blue-500/20 text-blue-300' },
        progress: { text: 'Em Progresso', className: 'bg-yellow-500/20 text-yellow-300' },
        completed: { text: 'Concluído', className: 'bg-green-500/20 text-green-300' },
        failed: { text: 'Falhou', className: 'bg-red-500/20 text-red-300' },
    };
    
    const guild = MOCK_GUILDS.find(g => g.id === project.guildId);
    const neededTalents = project.neededResources.map(id => MOCK_RESOURCES.find(r => r.id === id)).filter(Boolean);

    return (
        <Card className="flex flex-col justify-between transition-transform hover:scale-105 duration-200">
            <div>
                <div className="flex justify-between items-start">
                     <span className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${stageBadge[project.stage].className}`}>
                        {stageBadge[project.stage].text}
                    </span>
                    {guild && <span className="text-xs text-gray-400">{guild.name}</span>}
                </div>
                <h3 className="text-lg font-bold mt-2">{project.title}</h3>
                <p className="text-sm text-gray-400 mt-2 line-clamp-3">{project.description}</p>
                 {neededTalents.length > 0 && (
                    <div className="mt-3">
                        <p className="text-xs font-semibold text-gray-400 mb-2">Talentos Necessários:</p>
                        <div className="flex flex-wrap gap-2">
                            {neededTalents.map(talent => (
                                <span key={talent!.id} className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded-full">{talent!.name}</span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div className="mt-4">
                {project.stage === 'funding' && (
                  <>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div className="bg-green-500 h-2.5 rounded-l-full" style={{ width: `${forPercentage}%` }}></div>
                    </div>
                    <div className="flex justify-between text-xs mt-1 text-gray-400">
                        <span>A favor: {project.votes.for}</span>
                        <span>Contra: {project.votes.against}</span>
                    </div>
                    <div className="flex space-x-2 mt-4">
                        <Button variant="secondary" className="w-full">Votar a Favor</Button>
                        <Button variant="secondary" className="w-full hover:bg-red-800/50">Votar Contra</Button>
                    </div>
                  </>
                )}
                 {project.stage !== 'funding' && (
                    <div className="pt-4 border-t border-gray-700/50 mt-4">
                         <p className="text-xs text-gray-500">Proponente: {project.proposer}</p>
                    </div>
                 )}
            </div>
        </Card>
    );
}

const ProjectsView: React.FC = () => {
    const [filter, setFilter] = useState<ProjectStage | 'all'>('all');

    const filteredProjects = MOCK_PROJECTS.filter(p => {
        if (filter === 'all') return true;
        return p.stage === filter;
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
                <h1 className="text-3xl font-bold">Projetos do Coletivo</h1>
                <div className="flex items-center space-x-2 flex-wrap gap-2">
                    <FilterButton f="all">Todos</FilterButton>
                    <FilterButton f="funding">Em Financiamento</FilterButton>
                    <FilterButton f="progress">Em Progresso</FilterButton>
                    <FilterButton f="completed">Concluídos</FilterButton>
                    <FilterButton f="failed">Falharam</FilterButton>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map(p => <ProjectCard key={p.id} project={p} />)}
            </div>
            {filteredProjects.length === 0 && (
                <Card className="text-center py-12">
                    <p className="text-gray-400">Nenhum projeto encontrado com o filtro selecionado.</p>
                </Card>
            )}
        </div>
    );
};

export default ProjectsView;