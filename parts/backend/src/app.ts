import dotenv from 'dotenv'
import bodyParser from 'koa-bodyparser'
import serve from 'koa-static'
import 'module-alias/register'
import path from 'path'
import Core from './core';
import plural from './core/plugins/plural';
dotenv.config()
String.prototype.plural = plural

const App = new Core()

App.use(serve(path.join(__dirname, '..', 'public')))
App.use(bodyParser())

export default App
