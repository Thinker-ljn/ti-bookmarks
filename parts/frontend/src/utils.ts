type ArgumentTypes<F extends Function> = F extends (...args: infer A) => any ? A : never
type RestArgumentTypes<F extends Function> = F extends (first: any, ...restArgs: infer R) => any ? R : []
type FirstArg<T extends Function> = ArgumentTypes<T>[0]

type RestArg<T extends Function> = RestArgumentTypes<T>

function isFullArgs <T extends Function> (_args: ArgumentTypes<T> | RestArg<T>, arg1: FirstArg<T>): _args is ArgumentTypes<T> {
  return !arg1
}

export function f <T extends Function>(fn: T): (...args: ArgumentTypes<T>) => void
export function f <T extends Function>(fn: T, arg1: FirstArg<T>): (...args: RestArg<T>) => void
export function f <T extends Function>(fn: T, arg1?: FirstArg<T>): (...args: ArgumentTypes<T> | RestArg<T>) => void
{
  return (...args) => {
    if (isFullArgs(args, arg1)) {
      fn(...args)
    } else {
      fn(arg1, ...args)
    }
  }
}

export function stop (fn?: (...args: any) => any) {
  return (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    if (fn) {
      fn()
    }
  }
}
