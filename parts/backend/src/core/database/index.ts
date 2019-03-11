import DB from "./instance";

import { getConnection } from "./connection";
DB.setConnection(getConnection)

export default DB
