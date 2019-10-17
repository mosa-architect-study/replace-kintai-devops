import express from "express"
import axios from "axios"

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.post("/slack/invite_me",(request,response) =>{
    if(request.body.token !== process.env.SLACK_VARIFICATION_TOKRN){
        response.statusCode = 403
        response.send("許可されたSlack以外からのアクセス");
        return;
    } 
    const [reponame,username] = request.body.text.split(" ")
    const key = process.env.GITHUB_KEY_ADD_CONTRIBUTOR
    if(!reponame || !username){
        response.send("レポジトリ名とユーザー名を入力してね。")
        return;
    }
    axios.put(`https://api.github.com/repos/mosa-architect-study/${reponame}/collaborators/${username}?permission=push`,{
    },{
        headers:{
            "Authorization":`token ${key}`
        }
    }).then(res => {
        switch (res.status) {
            case 201:
                response.send(`Invitationを送ったよ。 https://github.com/mosa-architect-study/${reponame}/invitations`)
                break;
            case 204:
                response.send(`User[${username}]はもう[${reponame}]にContributorとして追加されてるよ。`)
                break;
            default:
                response.send(`GitHubからの想定外のレスポンス : ${res.status}`);
                console.log(res.data)
                break;
        }
    }).catch(e => {
        console.log(e)
        response.send("不明なエラー")
    })
})

app.get("/",(_,res) => {
    console.log("Heart Beat!!!")
    res.send("Welcome!");
})

app.listen(process.env.PORT || 8080,() => {
    console.log("Server is Running!!")
})