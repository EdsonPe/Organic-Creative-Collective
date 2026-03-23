
import React from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import { MOCK_GUILDS } from '../constants';
import { Guild } from '../types';

const GuildCard: React.FC<{ guild: Guild }> = ({ guild }) => {
    return (
        <Card className="flex flex-col text-center items-center transform transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-900/50">
            <img src={guild.imageUrl} alt={guild.name} className="w-full h-32 object-cover rounded-lg mb-4" />
            <h3 className="text-xl font-bold text-white">{guild.name}</h3>
            <p className="text-sm text-gray-400 mt-2 flex-grow">{guild.description}</p>
            <div className="mt-4 text-xs text-indigo-300 font-semibold bg-indigo-500/10 px-3 py-1 rounded-full">
                {guild.members} Membros
            </div>
            <Button variant="secondary" className="mt-6 w-full">
                Ver Guilda
            </Button>
        </Card>
    );
};

const GuildsView: React.FC = () => {
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Guildas Criativas</h1>
                    <p className="text-gray-400 mt-1">Comunidades focadas em áreas específicas para colaborar e financiar projetos.</p>
                </div>
                <Button>
                    Criar Nova Guilda
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {MOCK_GUILDS.map((guild) => (
                    <GuildCard key={guild.id} guild={guild} />
                ))}
            </div>
        </div>
    );
};

export default GuildsView;
