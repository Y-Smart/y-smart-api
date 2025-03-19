import { AgentExecutor, createToolCallingAgent } from 'langchain/agents';
import { CommandsService } from '@modules/commands/commands.service';
import { DevicesService } from '@modules/devices/devices.service';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { MqttService } from '@modules/mqtt/mqtt.service';
import { ChatOpenAI } from '@langchain/openai';
import { tool } from '@langchain/core/tools';
import { Injectable } from '@nestjs/common';
import { z } from 'zod';

@Injectable()
export class TextService {
    private readonly _llm: ChatOpenAI;
    private readonly _tools: Array<ReturnType<typeof tool>> = [];

    constructor(
        private readonly _commandService: CommandsService,
        private readonly _deviceService: DevicesService,
        private readonly _mqttService: MqttService,
    ) {
        this._llm = new ChatOpenAI({
            openAIApiKey: process.env.OPENAI_API_KEY,
            model: 'gpt-3.5-turbo',
            temperature: 0,
        });

        const TurnOnLight = tool(
            async ({ location, userId }) => {
                console.log('location', location);
                console.log('userId', userId);
                const device = await this._deviceService.findDeviceByLocation(
                    userId,
                    'lumière',
                    location,
                );

                if (!device) {
                    return 'Aucune appareil trouvé';
                }

                await this._deviceService.updateDevice(
                    userId,
                    device._id.toString(),
                    {
                        state: 'on',
                    },
                );
                this._mqttService.publish(device._id.toString(), 'on');

                console.log(
                    `Lumière allumée dans ${location} pour le device ${device._id.toString()}`,
                );
            },
            {
                name: 'turn_on_light',
                description:
                    "Active une lumière dans une pièce spécifiée. Exemple d'entrée : 'salon'.",
                schema: z.object({
                    location: z.string(),
                    userId: z.string(),
                }),
            },
        );

        const TurnOffLight = tool(
            async ({ location, userId }) => {
                const device = await this._deviceService.findDeviceByLocation(
                    userId,
                    'lumière',
                    location,
                );

                if (!device) {
                    return 'Aucune appareil trouvé';
                }

                await this._deviceService.updateDevice(
                    userId,
                    device._id.toString(),
                    {
                        state: 'off',
                    },
                );
                this._mqttService.publish(device._id.toString(), 'off');

                console.log(
                    `Lumière éteinte dans ${location} pour le device ${device._id.toString()}`,
                );
            },
            {
                name: 'turn_off_light',
                description:
                    "Désactive une lumière dans une pièce spécifiée. Exemple d'entrée : 'salon'.",
                schema: z.object({
                    location: z.string(),
                    userId: z.string(),
                }),
            },
        );

        this._tools.push(TurnOnLight, TurnOffLight);
    }

    async createCommand(userId: string, command: string): Promise<string> {
        const prompt = ChatPromptTemplate.fromMessages([
            {
                role: 'system',
                content:
                    "Vous êtes un agent IoT chargé d'interpréter des commandes en langage naturel. Si aucune action valide n'est détectée, répondez avec 'Aucune action possible'.",
            },
            {
                role: 'user',
                content: command,
            },
            {
                role: 'system',
                content: `Ceci est le userId : ${userId}, mais pour les request utiliser le userId de la request sans le text avant et après`,
            },
            {
                role: 'system',
                content: '{agent_scratchpad}',
            },
        ]);

        const agent = createToolCallingAgent({
            llm: this._llm,
            tools: this._tools,
            prompt,
        });

        const agentExecutor = new AgentExecutor({
            agent,
            tools: this._tools,
        });

        try {
            const response = await agentExecutor.invoke({
                location: command,
                userId,
            });

            const isInvalid =
                !response ||
                response.length === 0 ||
                response.output === 'Aucune action possible';

            await this._commandService.createCommand({
                user: userId,
                command,
                status: isInvalid ? 'failed' : 'success',
                createdAt: new Date(),
            });

            if (isInvalid) {
                return "Désolé, je n'ai pas compris votre demande";
            }

            return (response.output as string) || 'La commande a été exécutée';
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return "Désolé, je n'ai pas compris votre demande";
        }
    }
}
