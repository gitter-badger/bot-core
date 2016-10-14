import * as BotBuilder from 'botbuilder';
import * as BotBuilderExt from '../botbuilder-ext';

/**
 * Look for outgoing messages whose channel is DirectLine and carry some attachment whose contentType
 * is 'application/vnd.microsoft.keyboard' and move them to the channelData.
 * This is needed because the Bot Framework breaks attachments of such a contentType over the DirectLine channel.
 */
export default {
    send: (event: BotBuilder.IEvent, next: Function) => {
        if (event.type === 'message') {
            let message = <BotBuilder.IMessage>event;

            let channelId = BotBuilderExt.Channel.getChannelId(message);
            if (channelId === BotBuilderExt.Channel.channels.directline) {
                if (message.attachments && message.attachments.length) {
                    // Pick the attachment with contentType 'application/vnd.microsoft.keyboard'
                    let choicesIndex = message.attachments
                        .findIndex((attachment: BotBuilder.IAttachment) =>
                            attachment.contentType === 'application/vnd.microsoft.keyboard');
                    // Move the attachment containing the choices to the channelData
                    let choices = message.attachments.splice(choicesIndex);
                    message.sourceEvent = { choices: choices[0] };
                }
            }
        }
        next();
    }
} as BotBuilder.IMiddlewareMap;