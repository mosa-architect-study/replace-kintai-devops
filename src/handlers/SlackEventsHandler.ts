import { RequestHandler } from "express";
import {PostRecommendIssuesMessageService} from "../services/postRecommendIssuesMessage"

export const SlackEventsHandler = (postRecommend:PostRecommendIssuesMessageService):RequestHandler => {
    return async (request,response) => {
        if(request.body.type === "url_verification") {
            response.send(request.body.challenge)
            return;
        }
        const event = request.body.event
        if(event && event.type === "message" && event.channel === "CPUM4P60G" && event.user === "USLACKBOT"){
            const regexp = /Reminder: (\w+)\./.exec(event.text);
            if(regexp){
                const [,command] = regexp;
                if(command === "friday"){
                    await postRecommend();
                    response.status(200).send("POST Message");
                    return;
                }
            }
        }
        response.status(200).send();
    }
}