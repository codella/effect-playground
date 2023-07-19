import { Effect as T, Clock } from "effect";

const program = Clock.Clock.pipe(
  T.flatMap((clock) => clock.currentTimeMillis),
  T.flatMap((millis) => T.log(millis.toString())),
  T.provideService(Clock.Clock, Clock.make()),
  T.repeatN(5),
  T.runPromise
);
