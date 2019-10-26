import axios from "axios"
import {GithubConfig} from "@/config"

const messages : {[key:string]:((inv:Invitation & {repositoryOwner:string}) => string) | undefined} = {
    201:({repositoryName,repositoryOwner}) => `Invitationを送ったよ。 https://github.com/${repositoryOwner}/${repositoryName}/invitations`,
    204:({username,repositoryName,repositoryOwner}) => `User[${username}]はもう[${repositoryOwner}/${repositoryName}]にContributorとして追加されてるよ。`
}

type ResultType = "ErrorFromGithub" | "InternalError" | "OK"

export interface InvitationResult {
    message:string;
    type:ResultType
}

export interface Invitation {
    username:string;
    repositoryName:string;
}

export interface InviteService {
    (invitaion:Invitation):Promise<InvitationResult>
}

export const InviteServiceImpl = (config:GithubConfig):InviteService => {
    return async ({username,repositoryName}: Invitation) => {
        const repositoryOwner = config.TARGET_REPOGITORY_OWNER
        const url = `https://api.github.com/repos/${repositoryOwner}/${repositoryName}/collaborators/${username}?permission=push`
        const res = await axios.put(url,null,{
            headers:{
                "Authorization":`token ${config.KEY_ADD_CONTRIBUTOR}`
            }
        })
        const msg = messages[res.status];
        if(msg){
            return {
                message:msg({username,repositoryName,repositoryOwner}),
                type:"OK"
            }
        }
        return {
            message:`GitHubからの想定外のレスポンス : ${res.status}`,
            type:"ErrorFromGithub"
        }
    }
}