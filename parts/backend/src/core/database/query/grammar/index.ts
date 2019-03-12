import BaseGrammar, { CompileResult } from "./base";
import Builder from "../builder";
import InsertGrammar from "./components/insert";
import DeleteGrammar from "./components/delete";
import SelectGrammar from "./components/select";
import UpdateGrammar from "./components/update";
import { Data } from "./components/where";

type SqlType = 'insert' | 'delete' | 'select' | 'update'
export default function grammarCompile <T extends Data>(builder: Builder<T>, type: SqlType, data?: T | T[]): CompileResult {
  let compiler: BaseGrammar<T>
  switch (type) {
    case 'insert': compiler = new InsertGrammar<T>(builder)
    break
    case 'delete': compiler = new DeleteGrammar<T>(builder)
    break
    case 'select': compiler = new SelectGrammar<T>(builder)
    break
    case 'update': compiler = new UpdateGrammar<T>(builder)
    break
    default: throw 'Grammar Compiler Type Error'
  }

  return compiler.compile(data)
}