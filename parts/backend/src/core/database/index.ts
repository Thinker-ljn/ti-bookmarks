import DB from './instance'

import { PromiseConnection } from './connection'
const connection = PromiseConnection.Instance
connection.connect()

DB.setConnection(connection)

export default DB
