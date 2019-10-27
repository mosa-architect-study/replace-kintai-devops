import {SLACK_POSTMSG_URL_TO_TRIAL} from "./settings.json";
import { PostRecommendIssuesMessageServiceImpl } from "../services/postRecommendIssuesMessage";

const service = PostRecommendIssuesMessageServiceImpl({
    SLACK_POSTMSG_URL:SLACK_POSTMSG_URL_TO_TRIAL
})

service();