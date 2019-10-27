import { RecommendIssuesServiceImpl } from "./GithubRecommendIssuesService";
import { PostSlackRecommendIssuesMessageServiceImpl,PostSlackRecommendIssuesMessageServiceConfig } from "./PostSlackRecommendIssuesMessageService";

export interface PostRecommendIssuesMessageService {
    ():Promise<void>
}
export type PostRecommendIssuesMessageServiceConfig = PostSlackRecommendIssuesMessageServiceConfig;

export const PostRecommendIssuesMessageServiceImpl = (config:PostRecommendIssuesMessageServiceConfig) : PostRecommendIssuesMessageService => {
    const fetch = RecommendIssuesServiceImpl();
    const post = PostSlackRecommendIssuesMessageServiceImpl(config)
    return async () => {
        const issues = await fetch()
        await post(issues);
    }
}