import express from "express"
import { InviteContributorHandler } from "@/handlers/InviteContributorHandler";
import { InviteServiceImpl } from "@/services/InviteContributerService";

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

app.get("/",(_,res) => {
    console.log("Heart Beat!!!")
    res.send("Welcome!");
})

app.listen(process.env.PORT || 8080,() => {
    console.log("Server is Running!!")
})