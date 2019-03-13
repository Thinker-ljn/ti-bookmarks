import dotenv from 'dotenv'
import bodyParser from 'koa-bodyparser'
import serve from 'koa-static'
import 'module-alias/register'
import path from 'path'
import Core from './core';
dotenv.config()

const app = new Core()

app.use(serve(path.join(__dirname, '..', 'public')))
app.use(bodyParser())

export default app
