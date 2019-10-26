import { RequestHandler } from "express";
import {InviteService} from "../services/InviteContributerService"
import { SlackConfig } from "@/config";

export const InviteContributorHandler : (invite:InviteService,config:SlackConfig) => RequestHandler = (invite,config)=> async (request,response) => {
    try {
        if(request.body.token !== config.VARIFICATION_TOKRN){
            response.statusCode = 403
            response.send("許可されたSlack以外からのアクセス");
            return;
        } 
        const [repositoryName,username] = request.body.text.split(" ")
        if(!repositoryName || !username){
            response.send("レポジトリ名とユーザー名を入力してね。")
            return;
        }
        const res = await invite({
            repositoryName,
            username,
        })
        response.send(res.message);
    } catch (e) {
        console.log(e)
        response.statusCode = 500;
        response.send("不明なエラー")
    }
}