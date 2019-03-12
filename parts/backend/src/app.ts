import 'module-alias/register'
import path from 'path'
import plural from './core/plugins/plural';
import Core from './core';
import dotenv from 'dotenv'
import serve from 'koa-static'
import bodyParser from 'koa-bodyparser'
dotenv.config()
String.prototype.plural = plural

const App = new Core

App.use(serve(path.join(__dirname, '..', 'public')))
App.use(bodyParser())

export default App
