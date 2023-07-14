import { Effect } from "effect";

declare const firstEffect: Effect.Effect<R1, E1, A1>;
declare const secondEffect: Effect.Effect<R2, E2, A2>;

// @ts-ignore
const resultingEffect: Effect.Effect<R1 | R2, E1 | E2, [A1, A2]> = Effect.all([
  firstEffect,
  secondEffect,
]);

/*
 * Defining types used above
 */

type R1 = { _requirement: unknown };
type E1 = { _tag: unknown };
type A1 = { _value: unknown };

type R2 = { _requirement: unknown };
type E2 = { _tag: unknown };
type A2 = { _value: unknown };
