import { Effect, Schedule } from "effect";

Effect.log("repeating 5 times").pipe(Effect.repeatN(5), Effect.runSync)

const policy = Schedule.recurs(2)
Effect.log("repeating indefinitely").pipe(Effect.repeat(policy), Effect.runPromise)