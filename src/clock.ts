import { Effect, Clock } from 'effect';

Clock.Clock.pipe(
  Effect.flatMap((clock) => clock.currentTimeMillis),
  Effect.flatMap((millis) => Effect.log(millis.toString())),
  Effect.repeatN(5),
  Effect.provideService(Clock.Clock, Clock.make()),
  Effect.runPromise
);
