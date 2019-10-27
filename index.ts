import express from "express"
import { InviteContributorHandler } from "./src/handlers/InviteContributorHandler";
import { InviteServiceImpl } from "./src/services/InviteContributerService";
import { GithubWebHookHandler } from "./src/handlers/GithubWebHookHandler";
import { PostRecommendIssuesMessageServiceImpl } from "./src/services/postRecommendIssuesMessage";
import {SlackEventsHandler} from "./src/handlers/SlackEventsHandler"

if(!process.env.GITHUB_KEY_ADD_CONTRIBUTOR || !process.env.SLACK_VARIFICATION_TOKRN || !process.env.SLACK_POSTMSG_URL_TO_KINTAI){
    throw Error("環境変数が設定されてません。")
}

const inviteService = InviteServiceImpl({
    KEY_ADD_CONTRIBUTOR:process.env.GITHUB_KEY_ADD_CONTRIBUTOR,
    TARGET_REPOGITORY_OWNER:"mosa-architect-study"
})
const slackConfig = {
    VARIFICATION_TOKRN:process.env.SLACK_VARIFICATION_TOKRN
}
const inviteContributorHandler = InviteContributorHandler(inviteService,slackConfig)
const postRecommendService = PostRecommendIssuesMessageServiceImpl({
    SLACK_POSTMSG_URL:process.env.SLACK_POSTMSG_URL_TO_KINTAI
})

const slackEventHandler = SlackEventsHandler(postRecommendService,slackConfig);

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.post("/slack/invite_me",inviteContributorHandler)
app.post("/github/webhook",GithubWebHookHandler())
app.post("/slack/events",slackEventHandler);

app.get("/",(_,res) => {
    console.log("Heart Beat!!!")
    res.send("Welcome!");
})

app.listen(process.env.PORT || 8080,() => {
    console.log("Server is Running!!")
})