import { RouteBase } from '../../base/Route';
import { z } from 'zod';
import { ErrorMaker, ErrorToResponse } from '../../libs/ErrorMaker';

export class AddTwitchChannelRoute extends RouteBase {
    private bodyValidator = z.object({
        twitchUsername: z.string().nonempty('Informe o nome do streamer'),
        streamElementsUsername: z.string().nonempty('Informe o usuário do streamer no StreamElements')
    });

    run() {
        this.router.post('/', async (req, res) => {
            try {
                const body = this.bodyValidator.safeParse(req.body);
                if (!body.success) throw new ErrorMaker({
                    type: 'form_validation',
                    errors: body.error.errors
                });
                const channel = await this.dd.twitchChannels.addChannel(req.jwt.userId, body.data.twitchUsername, body.data.streamElementsUsername);
                res.json({
                    id: channel.id
                });
            } catch (e: any) {
                console.log(e);
                const err = ErrorToResponse(e);
                res.status(err.status).json(err.error);
            }
        });
    }
}