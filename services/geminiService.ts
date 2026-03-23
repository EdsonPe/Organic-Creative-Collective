import { GoogleGenAI, Type } from "@google/genai";
import { MOCK_GUILDS, MOCK_PROJECTS, MOCK_RESOURCES } from "../constants";
import { Opportunity, Project, ProjectRecommendation, Saga, UserProfile } from "../types";

// Ensure API_KEY is available in the environment.
if (!process.env.API_KEY) {
  process.env.API_KEY = "YOUR_API_KEY_HERE"; 
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const recommendationsSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            projectId: { type: Type.NUMBER },
            rationale: { 
                type: Type.STRING,
                description: "Uma justificativa concisa (1-2 frases) explicando por que este projeto é uma boa combinação para os talentos do usuário."
            },
        },
        required: ["projectId", "rationale"],
    }
};

const sagaSchema = {
    type: Type.OBJECT,
    properties: {
        title: {
            type: Type.STRING,
            description: "O título geral da campanha ou saga."
        },
        narrative: {
            type: Type.STRING,
            description: "Uma narrativa central de 2-3 frases que conecta todos os projetos da saga."
        },
        chapters: {
            type: Type.ARRAY,
            description: "Uma lista de 3 a 4 projetos sequenciais que compõem a saga.",
            items: {
                type: Type.OBJECT,
                properties: {
                    title: {
                        type: Type.STRING,
                        description: "O título de um capítulo/projeto individual."
                    },
                    description: {
                        type: Type.STRING,
                        description: "Uma breve descrição do que este capítulo/projeto específico envolve."
                    }
                },
                required: ["title", "description"]
            }
        }
    },
    required: ["title", "narrative", "chapters"]
};

const ideasSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      name: {
        type: Type.STRING,
        description: 'Um nome curto e criativo para o projeto.',
      },
      description: {
        type: Type.STRING,
        description: 'Uma descrição de 2-3 frases sobre o projeto.',
      },
      tags: {
        type: Type.ARRAY,
        items: {
          type: Type.STRING,
        },
        description: '3 a 5 tags ou palavras-chave relevantes.',
      },
    },
    required: ["name", "description", "tags"],
  },
};

const projectAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        title: {
            type: Type.STRING,
            description: "Um título conciso e inspirador para o projeto."
        },
        description: {
            type: Type.STRING,
            description: "Uma descrição detalhada (2-4 frases) do projeto, seus objetivos e seu público."
        },
        suggestedGuildId: {
            type: Type.NUMBER,
            description: "O ID da Guilda mais relevante para este projeto."
        },
    },
    required: ["title", "description", "suggestedGuildId"],
};

const opportunitiesSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            title: {
                type: Type.STRING,
                description: 'Um título atraente para a nova oportunidade de projeto.'
            },
            description: {
                type: Type.STRING,
                description: 'Uma breve descrição do que seria o projeto.'
            },
            rationale: {
                type: Type.STRING,
                description: 'A lógica por trás da oportunidade, explicando por que é uma boa ideia com base nos dados da DAO (ex: sinergia entre guildas, gap de mercado).'
            },
            suggestedGuilds: {
                type: Type.ARRAY,
                items: {
                    type: Type.NUMBER
                },
                description: 'Uma lista de IDs de guildas que poderiam colaborar neste projeto.'
            }
        },
        required: ["title", "description", "rationale", "suggestedGuilds"]
    }
};

export const getProjectRecommendations = async (userProfile: UserProfile, allProjects: Project[]): Promise<ProjectRecommendation[]> => {
    const userTalents = userProfile.talents.map(id => MOCK_RESOURCES.find(r => r.id === id)?.name).filter(Boolean).join(', ');
    const projectNeeds = allProjects.map(p => `ID ${p.id}: ${p.title} (Precisa de: ${p.neededResources.map(id => MOCK_RESOURCES.find(r => r.id === id)?.name).filter(Boolean).join(', ')})`).join('\n');

    const prompt = `Você é um "caça-talentos" estratégico para uma DAO criativa. Seu objetivo é conectar os talentos dos membros aos projetos que mais precisam deles.
Analise o perfil do usuário e a lista de projetos abertos. Recomende até 3 projetos que sejam a melhor combinação para os talentos do usuário. Forneça uma justificativa clara e concisa para cada recomendação.

Perfil do Usuário:
- Talentos: ${userTalents}

Projetos Abertos:
${projectNeeds}

Responda no formato JSON solicitado.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: recommendationsSchema,
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Erro ao obter recomendações de projeto:", error);
        throw new Error("Não foi possível obter recomendações. Tente novamente mais tarde.");
    }
};


export const generateSaga = async (theme: string): Promise<Saga> => {
    const prompt = `Você é um estratega narrativo para uma DAO criativa. Seu trabalho é criar uma campanha de múltiplos projetos, chamada de "Saga", com base em um tema fornecido. A Saga deve ter uma narrativa central forte e ser dividida em 3-4 "capítulos" que são projetos acionáveis e interconectados.

Tema: "${theme}"

Gere uma Saga completa. Para cada capítulo, forneça um título e uma descrição. Responda no formato JSON solicitado.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: sagaSchema,
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Erro ao gerar a saga:", error);
        throw new Error("Não foi possível gerar a saga. Tente um tema diferente ou verifique sua conexão.");
    }
};

export const generateOpportunities = async (): Promise<Opportunity[]> => {
    const projectsSummary = MOCK_PROJECTS.map(p => `- ${p.title} (Status: ${p.stage}, Guilda: ${p.guildId})`).join('\n');
    const guildsSummary = MOCK_GUILDS.map(g => `- ID ${g.id}: ${g.name}`).join('\n');

    const prompt = `Como um analista de mercado para uma DAO criativa, seu trabalho é identificar novas oportunidades de projeto. Analise a lista de projetos e guildas existentes para encontrar "espaços em branco" e sinergias inexploradas. Gere 3 novas oportunidades de projeto.

Projetos Atuais:
${projectsSummary}

Guildas Atuais:
${guildsSummary}

Para cada oportunidade, forneça um título, uma descrição do projeto, uma justificativa (rationale) explicando por que é uma boa oportunidade, e os IDs das guildas que deveriam colaborar. Responda no formato JSON solicitado.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: opportunitiesSchema,
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Erro ao gerar oportunidades:", error);
        throw new Error("Não foi possível gerar novas oportunidades de mercado.");
    }
};


export const analyzeProjectIdea = async (rawIdea: string) => {
    try {
        const guildList = MOCK_GUILDS.map(g => `ID: ${g.id}, Nome: ${g.name}, Descrição: ${g.description}`).join('\n');
        const prompt = `Analise a seguinte ideia de projeto de um usuário. Com base na ideia, gere um título de projeto, uma descrição elaborada e sugira o ID da Guilda mais apropriada da lista fornecida.

Ideia do usuário: "${rawIdea}"

Lista de Guildas Disponíveis:
${guildList}

Responda no formato JSON solicitado.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: projectAnalysisSchema,
            },
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);

    } catch (error) {
        console.error("Erro ao analisar a ideia de projeto:", error);
        throw new Error("Não foi possível processar sua ideia. Tente ser mais descritivo.");
    }
};


export const generateProjectIdeas = async (theme: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Gere 3 ideias de projetos criativos com base no seguinte tema: "${theme}". Os projetos devem ser adequados para uma DAO de arte e tecnologia.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: ideasSchema,
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Erro ao gerar ideias de projeto:", error);
    throw new Error("Não foi possível gerar ideias. Verifique a chave da API e a consulta.");
  }
};


export const generateImage = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: `Estilo de arte digital cinematográfica, de alta qualidade. ${prompt}`,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: '1:1',
            },
        });
        
        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        } else {
            throw new Error("Nenhuma imagem foi gerada.");
        }
    } catch (error) {
        console.error("Erro ao gerar imagem:", error);
        throw new Error("Não foi possível gerar a imagem. A API pode estar indisponível ou a solicitação foi bloqueada.");
    }
};

export const getStrategicAdvice = async (daoData: object): Promise<string> => {
    try {
        const prompt = `Como um oráculo estratégico de IA para uma DAO criativa, analise os seguintes dados da DAO e forneça uma sugestão concisa para melhorar o engajamento ou a governança.
        
        Dados da DAO:
        ${JSON.stringify(daoData, null, 2)}

        Sua sugestão:`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        return response.text;
    } catch(error) {
        console.error("Erro ao obter conselho estratégico:", error);
        throw new Error("Não foi possível obter conselho estratégico.");
    }
};