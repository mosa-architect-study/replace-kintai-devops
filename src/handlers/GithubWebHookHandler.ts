import { RequestHandler } from "express";

export const GithubWebHookHandler : () => RequestHandler = () => (request,response) => {
    response.send("ok")
}