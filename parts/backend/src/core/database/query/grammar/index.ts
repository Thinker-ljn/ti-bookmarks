import Builder from '../builder'
import BaseGrammar, { CompileResult } from './base'
import DeleteGrammar from './components/delete'
import InsertGrammar from './components/insert'
import SelectGrammar from './components/select'
import UpdateGrammar from './components/update'
import { Data } from './components/where'
import TruncateGrammar from './components/truncate';

type SqlType = 'insert' | 'delete' | 'select' | 'update' | 'truncate'
export default function grammarCompile <T extends Data> (
  builder: Builder<T>,
  type: SqlType,
  data?: T | T[],
): CompileResult {
  let compiler: BaseGrammar<T>
  switch (type) {
    case 'insert':
      compiler = new InsertGrammar<T>(builder)
      break
    case 'delete':
      compiler = new DeleteGrammar<T>(builder)
      break
    case 'select':
      compiler = new SelectGrammar<T>(builder)
      break
    case 'update':
      compiler = new UpdateGrammar<T>(builder)
      break
    case 'truncate':
      compiler = new TruncateGrammar<T>(builder)
      break
    default: throw new Error('Grammar Compiler Type Error')
  }

  return compiler.compile(data)
}
