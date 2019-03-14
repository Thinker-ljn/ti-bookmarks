import * as bodyParser from 'koa-bodyparser'
import * as serve from 'koa-static'
// import 'module-alias/register'
import * as path from 'path'
import Core from './core';
import { router } from './router';

const app = new Core()

app.use(serve(path.join(__dirname, '..', 'public')))
app.use(bodyParser())
app.use(router.routes())

export default app
