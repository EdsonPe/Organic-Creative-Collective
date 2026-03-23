import React, { useState, useCallback } from 'react';
import { NAVIGATION_ITEMS } from './constants';
import AiStudioView from './views/AiStudioView';
import GovernanceView from './views/GovernanceView';
import Card from './components/Card';
import LaunchpadView from './views/LaunchpadView';
import ProjectsView from './views/ProjectsView';
import GuildsView from './views/GuildsView';
import OpportunityMarketView from './views/OpportunityMarketView';
import SagasView from './views/SagasView';
import ProfileView from './views/ProfileView';

type View = 'opportunities' | 'sagas' | 'launchpad' | 'projects' | 'guilds' | 'studio' | 'governance' | 'profile';

const Sidebar: React.FC<{ activeView: View; onNavigate: (view: View) => void }> = ({ activeView, onNavigate }) => {
  return (
    <aside className="w-64 bg-gray-900/70 backdrop-blur-lg border-r border-gray-800 flex-shrink-0 flex flex-col p-4">
      <div className="flex items-center space-x-2 mb-8">
        <div className="p-2 bg-indigo-600 rounded-lg">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
             <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.75a.75.75 0 0 1 .75.75v3.75h3.75a.75.75 0 0 1 0 1.5h-3.75v3.75a.75.75 0 0 1-1.5 0v-3.75H7.5a.75.75 0 0 1 0-1.5h3.75V4.5a.75.75 0 0 1 .75-.75Zm0 0A8.25 8.25 0 1 0 20.25 12 8.25 8.25 0 0 0 12 3.75Z" />
           </svg>
        </div>
        <h1 className="text-xl font-bold text-white">Coletivo</h1>
      </div>
      <nav className="flex-grow">
        <ul>
          {NAVIGATION_ITEMS.map((item) => (
            <li key={item.name}>
              <button
                onClick={() => onNavigate(item.view as View)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors text-sm font-medium ${
                  activeView === item.view
                    ? 'bg-indigo-600/20 text-indigo-300'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto">
        <Card className="bg-gray-800 p-4">
            <h4 className="font-semibold text-sm">Conectado como</h4>
            <p className="text-xs text-gray-400 truncate mt-1">0x1A2b...C3d4</p>
            <button className="mt-3 w-full text-xs bg-red-800/50 hover:bg-red-700/50 text-red-300 py-1.5 rounded-md transition-colors">
                Desconectar
            </button>
        </Card>
      </div>
    </aside>
  );
};

const Header: React.FC<{ title: string }> = ({ title }) => {
  return (
    <header className="bg-gray-900/70 backdrop-blur-lg border-b border-gray-800 p-4 sticky top-0 z-10">
      <h2 className="text-2xl font-bold">{title}</h2>
    </header>
  );
};

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('opportunities');
  const [ideaToLaunch, setIdeaToLaunch] = useState<string | null>(null);


  const handleNavigate = useCallback((view: View) => {
    setActiveView(view);
    if(view !== 'launchpad') {
        setIdeaToLaunch(null);
    }
  }, []);

  const handleLaunch = useCallback((idea: string) => {
    setIdeaToLaunch(idea);
    setActiveView('launchpad');
  }, []);
  
  const currentNavItem = NAVIGATION_ITEMS.find(item => item.view === activeView) || NAVIGATION_ITEMS[0];

  const renderView = () => {
    switch (activeView) {
      case 'opportunities':
        return <OpportunityMarketView onLaunch={handleLaunch} />;
      case 'sagas':
        return <SagasView onLaunch={handleLaunch} />;
      case 'launchpad':
        return <LaunchpadView onNavigate={handleNavigate} initialIdea={ideaToLaunch || ''} />;
      case 'projects':
        return <ProjectsView />;
      case 'guilds':
        return <GuildsView />;
      case 'studio':
        return <AiStudioView />;
      case 'governance':
        return <GovernanceView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <OpportunityMarketView onLaunch={handleLaunch} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      <Sidebar activeView={activeView} onNavigate={handleNavigate} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={currentNavItem.name} />
        <main className="flex-1 overflow-y-auto p-8 bg-black/20">
            {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;