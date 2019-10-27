import express from "express"
import { InviteContributorHandler } from "./src/handlers/InviteContributorHandler";
import { InviteServiceImpl } from "./src/services/InviteContributerService";
import { GithubWebHookHandler } from "./src/handlers/GithubWebHookHandler";

if(!process.env.GITHUB_KEY_ADD_CONTRIBUTOR || !process.env.SLACK_VARIFICATION_TOKRN){
    throw Error("環境変数が設定されてません。")
}

const service = InviteServiceImpl({
    KEY_ADD_CONTRIBUTOR:process.env.GITHUB_KEY_ADD_CONTRIBUTOR,
    TARGET_REPOGITORY_OWNER:"mosa-architect-study"
})
const inviteContributorHandler = InviteContributorHandler(service,{
    VARIFICATION_TOKRN:process.env.SLACK_VARIFICATION_TOKRN
})

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.post("/slack/invite_me",inviteContributorHandler)
app.post("/github/webhook",GithubWebHookHandler())

app.get("/",(_,res) => {
    console.log("Heart Beat!!!")
    res.send("Welcome!");
})

app.post("/slack/events",(req,res) => {
    console.log(req.body)
    if(req.body.type === "url_verification") {
        res.send(req.body.challenge)
        return;
    }
    const event = req.body.event
    if(event && event.type === "message" && event.channel === "CPUM4P60G" && event.user === "USLACKBOT"){
        const regexp = /Reminder: (\w+)\./.exec(event.text);
        if(regexp){
            const [,command] = regexp;
            if(command === "friday"){
                console.log("Reached")
            }
        }
    }
    res.status(203).send("No Content");
})

app.listen(process.env.PORT || 8080,() => {
    console.log("Server is Running!!")
})