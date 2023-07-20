import { Effect, Clock } from 'effect';

Clock.Clock.pipe(
  Effect.flatMap((clock) => clock.currentTimeMillis),
  Effect.flatMap((millis) => Effect.log(millis.toString())),
  Effect.provideService(Clock.Clock, Clock.make()),
  Effect.repeatN(5),
  Effect.runPromise
);
