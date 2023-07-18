import { Effect, Schedule } from "effect";

await Effect.log("repeating 2 times with .repeatN").pipe(
  Effect.repeatN(2),
  Effect.runSync /* not using a policy -- we can use runSync */
);

const policyOnce = Schedule.once;
await Effect.log("repeating once").pipe(
  Effect.repeat(policyOnce),
  Effect.runPromise /* using a policy requires runPromise */
);

const policy2Times = Schedule.recurs(2);
await Effect.log("repeating 2 times with .recurs").pipe(
  Effect.repeat(policy2Times),
  Effect.runPromise /* using a policy requires runPromise */
);

const policyRecurs5Times100MillisDelayBetween = Schedule.recurs(5).pipe(
  Schedule.addDelay(() => "100 millis")
);
await Effect.log(
  "delayed 300 millis, recurs 5 times with 100 millis delay between"
).pipe(
  Effect.delay("300 millis"),
  Effect.repeat(
    policyRecurs5Times100MillisDelayBetween
  ) /* need to use "seconds" even on a singular second */,
  Effect.runPromise
);

// await Effect.log("Started.").pipe(
//   Effect.flatMap(() => Effect.sleep("2 seconds")),
//   Effect.flatMap(() => Effect.log("Ended.")),
//   Effect.runPromise
// );
