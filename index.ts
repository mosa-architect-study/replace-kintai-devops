import express from "express"
import { InviteContributorHandler } from "./src/handlers/InviteContributorHandler";
import { InviteServiceImpl } from "./src/services/InviteContributerService";
import { GithubWebHookHandler } from "./src/handlers/GithubWebHookHandler";
import { PostRecommendIssuesMessageServiceImpl } from "./src/services/postRecommendIssuesMessage";
import {SlackEventsHandler} from "./src/handlers/SlackEventsHandler"

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
    console.log(JSON.parse(request.body.payload).channel)
    response.json({
        "channel": JSON.parse(request.body.payload).channel.id,
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "Danny Torrence left the following review for your property:"
            }
          },
          {
            "type": "section",
            "block_id": "section567",
            "text": {
              "type": "mrkdwn",
              "text": "<https://google.com|Overlook Hotel> \n :star: \n Doors had too many axe holes, guest in room 237 was far too rowdy, whole place felt stuck in the 1920s."
            },
            "accessory": {
              "type": "image",
              "image_url": "https://is5-ssl.mzstatic.com/image/thumb/Purple3/v4/d3/72/5c/d3725c8f-c642-5d69-1904-aa36e4297885/source/256x256bb.jpg",
              "alt_text": "Haunted hotel image"
            }
          },
          {
            "type": "section",
            "block_id": "section789",
            "fields": [
              {
                "type": "mrkdwn",
                "text": "*Average Rating*\n1.0"
              }
            ]
          }
        ]
      })
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