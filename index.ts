import express from "express"
import { InviteContributorHandler } from "./src/handlers/InviteContributorHandler";
import { InviteServiceImpl } from "./src/services/InviteContributerService";
import { GithubWebHookHandler } from "./src/handlers/GithubWebHookHandler";
import { PostRecommendIssuesMessageServiceImpl } from "./src/services/postRecommendIssuesMessage";
import {SlackEventsHandler} from "./src/handlers/SlackEventsHandler"
import Axios from "axios";

if(
    !process.env.GITHUB_KEY_ADD_CONTRIBUTOR || 
    !process.env.SLACK_VARIFICATION_TOKRN || 
    !process.env.SLACK_POSTMSG_URL_TO_KINTAI || 
    !process.env.SLACK_VARIFICATION_TOKRN_FROM_TIMER
    ){
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

const slackEventHandler = SlackEventsHandler(postRecommendService,{
    VARIFICATION_TOKRN:process.env.SLACK_VARIFICATION_TOKRN_FROM_TIMER
});

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.post("/slack/invite_me",inviteContributorHandler)
app.post("/github/webhook",GithubWebHookHandler())
app.post("/slack/heartbeat",slackEventHandler)
app.post("/slack/discussion_issue",(request,response) => {
    const payload = JSON.parse(request.body.payload)
    console.log(payload.response_url,payload.trigger_id)
    Axios.post(payload.response_url,{
        "trigger_id": payload.trigger_id,
        "view": {
          "type": "modal",
          "callback_id": "modal-identifier",
          "title": {
            "type": "plain_text",
            "text": "Just a modal"
          },
          "blocks": [
            {
              "type": "section",
              "block_id": "section-identifier",
              "text": {
                "type": "mrkdwn",
                "text": "*Welcome* to ~my~ Block Kit _modal_!"
              },
              "accessory": {
                "type": "button",
                "text": {
                  "type": "plain_text",
                  "text": "Just a button",
                },
                "action_id": "button-identifier",
              }
            }
          ],
        }
      })
    response.send("ok")
})
app.post("/slack/discussion_issue/menus",(request,response) => {
    console.log(request.body)
    response.json({
        "options": [
          {
            "text": {
              "type": "plain_text",
              "text": "*this is plain_text text*"
            },
            "value": "value-0"
          },
          {
            "text": {
              "type": "plain_text",
              "text": "*this is plain_text text*"
            },
            "value": "value-1"
          },
          {
            "text": {
              "type": "plain_text",
              "text": "*this is plain_text text*"
            },
            "value": "value-2"
          }
        ]
    })
})

app.get("/",(_,res) => {
    res.send("Welcome!");
})

app.listen(process.env.PORT || 8080,() => {
    console.log("Server is Running!!")
})