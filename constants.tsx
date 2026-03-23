import React from 'react';
import { NavItem, Project, Guild, Proposal, ProjectStage, ProposalStatus, Resource, UserProfile } from './types';

// Heroicons SVGs as components
const LightBulbIcon = (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.311a6.01 6.01 0 0 0-3.75 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

const FlagIcon = (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5" />
    </svg>
);


const RocketLaunchIcon = (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.769 59.769 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
    </svg>
);

const SparklesIcon = (props: React.ComponentProps<'svg'>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
  </svg>
);

const CubeTransparentIcon = (props: React.ComponentProps<'svg'>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
  </svg>
);

const DocumentTextIcon = (props: React.ComponentProps<'svg'>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
  </svg>
);

const ChartBarIcon = (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
    </svg>
);

const UserCircleIcon = (props: React.ComponentProps<'svg'>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
);


export const NAVIGATION_ITEMS: NavItem[] = [
  { name: 'Oportunidades', view: 'opportunities', icon: LightBulbIcon },
  { name: 'Sagas', view: 'sagas', icon: FlagIcon },
  { name: 'Plataforma', view: 'launchpad', icon: RocketLaunchIcon },
  { name: 'Projetos', view: 'projects', icon: DocumentTextIcon },
  { name: 'Guildas', view: 'guilds', icon: CubeTransparentIcon },
  { name: 'Estúdio IA', view: 'studio', icon: SparklesIcon },
  { name: 'Governança', view: 'governance', icon: ChartBarIcon },
  { name: 'Meu Perfil', view: 'profile', icon: UserCircleIcon },
];

export const MOCK_RESOURCES: Resource[] = [
    { id: 1, name: 'Animação 3D', type: 'skill'},
    { id: 2, name: 'Composição Musical', type: 'skill'},
    { id: 3, name: 'Roteiro', type: 'skill'},
    { id: 4, name: 'Design de Jogos', type: 'skill'},
    { id: 5, name: 'Impressora 3D', type: 'hardware'},
    { id: 6, name: 'Arte Generativa', type: 'skill' },
    { id: 7, name: 'Blender', type: 'software' },
];

export const MOCK_USER_PROFILE: UserProfile = {
    id: 'user-1',
    address: '0x1A2b...C3d4',
    talents: [2, 3, 7], // Composição Musical, Roteiro, Blender
};


export const MOCK_PROJECTS: Project[] = [
    {
        id: 1,
        title: 'Curta-metragem "Sombra Quântica"',
        description: 'Alocar 50,000 ORG tokens para a produção de um curta-metragem de 5 minutos usando técnicas de animação generativa.',
        proposer: '0x123...abc',
        votes: { for: 1250, against: 150 },
        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
        stage: 'funding',
        guildId: 1,
        neededResources: [1, 3, 7], // Animação 3D, Roteiro, Blender
    },
    {
        id: 2,
        title: 'Instalação de Arte Têxtil Digital',
        description: 'Criar uma peça de arte têxtil interativa que reage a dados da blockchain em tempo real.',
        proposer: '0x456...def',
        votes: { for: 800, against: 600 },
        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
        stage: 'funding',
        guildId: 4,
        neededResources: [6], // Arte Generativa
    },
    {
        id: 3,
        title: 'Integração com Impressora 3D',
        description: 'Conectar os designs de arte 3D da DAO a uma impressora 3D comunitária para criar esculturas físicas.',
        proposer: '0x789...ghi',
        votes: { for: 2500, against: 50 },
        endDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
        stage: 'progress',
        guildId: 4,
        neededResources: [1, 5], // Animação 3D, Impressora 3D
    },
     {
        id: 4,
        title: 'Trilha Sonora Generativa para o Metaverso',
        description: 'Desenvolver um sistema de IA que cria trilhas sonoras adaptativas para ambientes virtuais.',
        proposer: '0xabc...123',
        votes: { for: 3200, against: 150 },
        endDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
        stage: 'completed',
        guildId: 2,
        neededResources: [2, 6], // Composição Musical, Arte Generativa
    }
];

export const MOCK_GUILDS: Guild[] = [
    { id: 1, name: 'Jogos Imersivos', description: 'Focada na criação de mundos virtuais e experiências de jogo.', members: 128, imageUrl: 'https://picsum.photos/seed/games/400/200' },
    { id: 2, name: 'Música Generativa', description: 'Explorando novas fronteiras da composição musical com IA.', members: 85, imageUrl: 'https://picsum.photos/seed/music/400/200' },
    { id: 3, name: 'Educação Descentralizada', description: 'Desenvolvendo materiais educacionais abertos e interativos.', members: 212, imageUrl: 'https://picsum.photos/seed/education/400/200' },
    { id: 4, name: 'Arte Física & Digital', description: 'Projetos que fundem o mundo físico e digital, como impressão 3D e instalações interativas.', members: 43, imageUrl: 'https://picsum.photos/seed/phy-digital/400/200' },
];

const projectStageToProposalStatus = (stage: ProjectStage): ProposalStatus | null => {
    switch (stage) {
        case 'funding': return 'active';
        case 'completed': return 'passed';
        case 'failed': return 'failed';
        default: return null; // 'progress' will be filtered out
    }
};

export const MOCK_PROPOSALS: Proposal[] = MOCK_PROJECTS
    .map(project => {
        const status = projectStageToProposalStatus(project.stage);
        if (status) {
            const { stage, neededResources, ...rest } = project;
            return { ...rest, status };
        }
        return null;
    })
    .filter((p): p is Proposal => p !== null);