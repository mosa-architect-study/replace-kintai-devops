import { RequestHandler } from "express";
import {PostRecommendIssuesMessageService} from "../services/postRecommendIssuesMessage"
import { SlackConfig } from "../config";

export const SlackEventsHandler = (postRecommend:PostRecommendIssuesMessageService,config:SlackConfig):RequestHandler => {
    return async (request,response) => {
        if(request.body.type === "url_verification") {
            response.send(request.body.challenge)
            return;
        }
        if(request.body.token !== config.VARIFICATION_TOKRN){
            response.statusCode = 403
            response.send("許可されたSlack以外からのアクセス");
            return;
        } 
        const event = request.body.event
        if(event && event.type === "app_mention" && event.channel === "CPUM4P60G"){
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