
import React, { useState, useCallback } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import { generateImage, generateProjectIdeas } from '../services/geminiService';
import { ProjectIdea } from '../types';

type StudioTab = 'art' | 'ideas' | 'tokens';

const AiStudioView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<StudioTab>('art');

  const TabButton = ({ tab, children }: { tab: StudioTab; children: React.ReactNode }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
        activeTab === tab ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Estúdio IA</h1>
        <div className="flex space-x-2 p-1 bg-gray-800 rounded-lg">
          <TabButton tab="art">Gerador de Arte</TabButton>
          <TabButton tab="ideas">Gerador de Ideias</TabButton>
          <TabButton tab="tokens">Criador de Token</TabButton>
        </div>
      </div>
      
      <Card>
        {activeTab === 'art' && <ArtGenerator />}
        {activeTab === 'ideas' && <IdeaGenerator />}
        {activeTab === 'tokens' && <TokenCreator />}
      </Card>
    </div>
  );
};

const ArtGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!prompt) {
        setError('Por favor, insira um prompt.');
        return;
    }
    setIsLoading(true);
    setError(null);
    setImageUrl(null);
    try {
      const url = await generateImage(prompt);
      setImageUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Gerador de Arte com IA</h2>
      <p className="text-gray-400">Descreva uma cena, um personagem ou um conceito abstrato para a IA criar uma imagem única.</p>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ex: um astronauta surfando em uma onda cósmica, estilo vaporwave"
        className="w-full p-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
        rows={3}
        disabled={isLoading}
      />
      <Button onClick={handleGenerate} isLoading={isLoading} disabled={!prompt}>
        Gerar Arte
      </Button>
      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      
      {isLoading && (
        <div className="w-full flex justify-center items-center h-64 bg-gray-800/50 rounded-lg">
          <div className="text-center">
            <LoadingSpinner />
            <p className="mt-2 text-gray-300">Criando magia...</p>
          </div>
        </div>
      )}
      {imageUrl && (
        <div className="mt-4">
            <h3 className="font-semibold mb-2">Resultado:</h3>
            <img src={imageUrl} alt={prompt} className="rounded-lg max-w-sm w-full mx-auto" />
            <div className="flex space-x-2 mt-4 justify-center">
                <Button variant="secondary">Salvar na Galeria</Button>
                <Button>Criar Proposta com Arte</Button>
            </div>
        </div>
      )}
    </div>
  );
};

const IdeaGenerator = () => {
  const [theme, setTheme] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ideas, setIdeas] = useState<ProjectIdea[]>([]);

  const handleGenerate = useCallback(async () => {
    if (!theme) {
        setError('Por favor, insira um tema.');
        return;
    }
    setIsLoading(true);
    setError(null);
    setIdeas([]);
    try {
      const result = await generateProjectIdeas(theme);
      setIdeas(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.');
    } finally {
      setIsLoading(false);
    }
  }, [theme]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Gerador de Ideias de Projeto</h2>
      <p className="text-gray-400">Forneça um tema ou conceito e a IA irá sugerir projetos criativos para a DAO.</p>
      <input
        type="text"
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        placeholder="Ex: sustentabilidade e arte, futuro da identidade digital"
        className="w-full p-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
        disabled={isLoading}
      />
      <Button onClick={handleGenerate} isLoading={isLoading} disabled={!theme}>
        Gerar Ideias
      </Button>
      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      
      {isLoading && <div className="flex justify-center p-8"><LoadingSpinner /></div>}
      
      {ideas.length > 0 && (
        <div className="mt-6 space-y-4">
          <h3 className="font-semibold">Ideias Geradas:</h3>
          {ideas.map((idea, index) => (
            <Card key={index} className="bg-gray-900/50">
                <h4 className="text-lg font-bold text-indigo-400">{idea.name}</h4>
                <p className="text-gray-300 mt-1">{idea.description}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                    {idea.tags.map(tag => <span key={tag} className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded-full">{tag}</span>)}
                </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const TokenCreator = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Criador de Token (ERC-20 & SBT)</h2>
      <p className="text-gray-400">Descreva seu projeto para a IA sugerir um nome e símbolo para seu token, ou preencha manualmente.</p>
      
      <div className="p-4 border-2 border-dashed border-gray-600 rounded-lg text-center">
        <h3 className="font-semibold text-gray-300">Funcionalidade em Desenvolvimento</h3>
        <p className="text-sm text-gray-400 mt-1">
            Esta ferramenta permitirá a criação de tokens para projetos e reputação com auxílio da IA.
        </p>
      </div>

       <div>
        <label htmlFor="projectName" className="block text-sm font-medium text-gray-300">Descrição do Projeto</label>
        <textarea id="projectName" rows={3} placeholder="Ex: Um jogo de realidade aumentada sobre ecologia urbana..." className="mt-1 w-full p-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition opacity-50" disabled></textarea>
      </div>
      <Button disabled>Sugerir com IA</Button>
    </div>
  );
};

export default AiStudioView;
