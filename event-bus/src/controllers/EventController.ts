import { Request, Response } from 'express';
import axios, { AxiosResponse } from 'axios';
import chalk from 'chalk';
import { randomBytes } from 'crypto';
import { Service } from 'typedi';
import { EventService } from '../services/EventService';
import { Event } from '../models/Event';

@Service()
class EventController {
	constructor(private readonly eventService: EventService) {}
	async getAllEvents(_req: Request, res: Response): Promise<Response> {
		const result = await this.eventService.getAllEvents();
		return res.json(result);
	}

	async addEvent(_req: Request, res: Response): Promise<Response> {
		console.log(`${chalk.blue.bold('New Event')}: `, _req.body);
		const { type } = _req.body as Event;

		const id = randomBytes(8).toString('hex');
		const event = { id, type };

		const result = await this.eventService.addEvent(event);
		await this.broadcastEvent(event);

		return res.status(201).json(result);
	}

	async broadcastEvent(event: Event): Promise<void | AxiosResponse>  {
		await axios.post<any, any>("http://localhost:4001/events", event).catch((err: Error) => {
			console.log(err.message);
		});
		// await axios.post<any, any>("http://localhost:4002/events", event).catch((err: Error) => {
		// 	console.log(err.message);
		// });
	}
}

export { EventController };
