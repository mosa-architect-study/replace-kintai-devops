const express = require("express");
const app = express();
const axios = require("axios").default

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.post("/slack/invite_me",(request,response) =>{
    if(request.body.token === process.env.SLACK_VARIFICATION_TOKRN){
        const [reponame,username] = request.body.text.split(" ")
        const key = process.env.GITHUB_KEY_ADD_CONTRIBUTOR
        if(!reponame || !username){
            response.send("レポジトリ名とユーザー名を入力してね。") 
        }
        axios.put(`https://api.github.com/repos/mosa-architect-study/${reponame}/collaborators/${username}?permission=push`,{
        },{
            headers:{
                "Authorization":`token ${key}`
            }
        }).then(res => {
            if(res.status === 201){
                response.send(`Invitationを送ったよ。 https://github.com/mosa-architect-study/${reponame}/invitations`)
            }
            if(res.status === 204){
                response.send(`User[${username}]はもう[${reponame}]にContributorとして追加されてるよ。`)
            }
            response.send("不明なエラー");
        }).catch(() => {
            response.send("不明なエラー")
        })
    } else {
        throw new Error("許可されたSlack以外からのアクセス")
    }
})

app.listen(process.env.PORT || 8080,() => {
    console.log("Server is Running!!")
})