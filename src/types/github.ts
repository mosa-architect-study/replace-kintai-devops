export interface Issue {
    html_url:string;
    labels:Label[];
    title:string;
    assignee:object | null
}
export interface Label {
    name:string
}