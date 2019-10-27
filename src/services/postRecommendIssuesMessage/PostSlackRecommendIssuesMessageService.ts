import axios from "axios";
import { Issue } from "../../types/github";

export interface PostSlackRecommendIssuesMessageServiceConfig {
    SLACK_POSTMSG_URL:string
}

export const PostSlackRecommendIssuesMessageServiceImpl = ({SLACK_POSTMSG_URL}:PostSlackRecommendIssuesMessageServiceConfig):PostSlackRecommendIssuesMessageService => {
    return async (issues) => {
        const content = issues.map(e => `:kuribo:<${e.html_url}|${e.title}>`).join("\n")
        const text = `オススメのissueがあるポヨ↓:カービィ:\n${content}`
        try {
            await axios.post(SLACK_POSTMSG_URL,{text})
            return {
                type:"OK"
            }
        } catch (e) {
            console.log(e)
            return {
                type:"Failure"
            }
        }
    }
}

export interface PostMessageResult {
    type : "OK" | "Failure"
}

export interface PostSlackRecommendIssuesMessageService {
    (issues:Issue[]):Promise<PostMessageResult>
}