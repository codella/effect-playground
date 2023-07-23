import { Effect, Context, Layer } from 'effect';

interface MyResource {
  data(): string;
}
const myResourceImpl: MyResource = {
  data: () => 'data'
};

const acquire = Effect.promise(() =>
  Promise.resolve(myResourceImpl)
).pipe(
  Effect.tap(() => Effect.log('MyResource acquired.'))
);

const release = (_res: MyResource) =>
  Effect.promise(() => Promise.resolve()).pipe(
    Effect.tap(() => Effect.log('MyResource released.'))
  );

const myManagedResource = Effect.acquireRelease(
  acquire,
  release
);

//////

export interface MyLayer {
  service(): Effect.Effect<never, never, string>;
}
export const MyLayer = Context.Tag<MyLayer>();

const scoped = myManagedResource.pipe(
  Effect.flatMap((myResource) =>
    Effect.sync(() => ({
      service() {
        return Effect.succeed(
          `LiveLayer with data: ${myResource.data()}`
        );
      }
    }))
  )
);

const live = Layer.scoped(MyLayer, scoped);

const program = MyLayer.pipe(
  Effect.flatMap((layer) => layer.service()),
  Effect.flatMap((_) => Effect.log(_))
);
const anotherProgram = MyLayer.pipe(
  Effect.flatMap((layer) => layer.service()),
  Effect.flatMap((_) => Effect.log(_))
);

// Effect.runPromise(
//   program.pipe(
//     Effect.flatMap(() => anotherProgram),
//     Effect.provideLayer(live)
//   )
// );

Effect.runPromise(
  Effect.all([program, anotherProgram]).pipe(
    Effect.provideLayer(live)
  )
);
