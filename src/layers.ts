import { Effect, Context, Layer } from "effect";

interface MyResource {
  perform(): void
}

const acquire = Effect.tryPromise({
  try: () => Promise.resolve({} as MyResource),
  catch: () => new Error("ouch")
}).pipe(Effect.tap(() => Effect.log("acquired")))

const release = () => Effect.promise(() => Promise.resolve()).pipe(Effect.tap(() => Effect.log("released")))

const ar = Effect.acquireRelease(acquire, release);

//////

// Define the interface for the MeasuringCup service
export interface MyScopedLayer {
  service(): Effect.Effect<never, never, number>
}
   
// Create a tag for the MeasuringCup service
export const MyScopedLayer = Context.Tag<MyScopedLayer>()

const scoped = ar.pipe(Effect.flatMap(myres => Effect.sync(() => ({
  service() {
    return Effect.succeed(4)
  }
}))))

const live = Layer.scoped(MyScopedLayer, scoped)

const program = MyScopedLayer.pipe(Effect.flatMap(layer => layer.service()))
const anotherProgram = MyScopedLayer.pipe(Effect.flatMap(layer => layer.service()))

Effect.runPromise(program.pipe(Effect.flatMap(() => anotherProgram), Effect.provideLayer(live)))