import axios from "axios";
import { Issue } from "../../types/github";
const LABELS = ["なる早","オススメ"]
const TARGET_URL = `https://api.github.com/repos/mosa-architect-study/replace-kintai/issues`

export interface RecommendIssuesService {
    ():Promise<Issue[]>
}

export const RecommendIssuesServiceImpl = ():RecommendIssuesService => {
    return async () => {
        const res = await axios.get(TARGET_URL);
        const data = res.data as Issue[];
        const naruhaya = data
            .filter(({assignee} : Issue) => !assignee)
            .filter(({labels}) => labels.find(label => LABELS.includes(label.name)));
        return naruhaya;
    }
}