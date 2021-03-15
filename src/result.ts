export interface Ok<T> {
  kind: "success";
  value: T;
}

export interface Err<E> {
  kind: "failure";
  error: E;
}

export type Result<T, E> = Ok<T> | Err<E>;
export type PromiseResult<T, E> = Promise<Result<T, E>>;

export function some<T>(t?: T): Ok<T> {
  return { kind: "success", value: t };
}
export function none<E>(e?: E): Err<E> {
  return { kind: "failure", error: e };
}
