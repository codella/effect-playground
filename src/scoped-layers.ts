import { Effect, Context, Layer } from 'effect';

//
// Defining a resource and giving an implementation
//
interface MyResource {
  data(): string;
}
const myResourceImpl: MyResource = {
  data: () => 'data'
};

//
// Defining Effects to acquire and release a
// resource, in order to define an Effect that
// provides a scoped resource.
//
const acquireMyResource = Effect.promise(() =>
  Promise.resolve(myResourceImpl)
).pipe(
  Effect.tap(() => Effect.log('MyResource acquired.'))
);

const releaseMyResource = (_res: MyResource) =>
  Effect.promise(() => Promise.resolve()).pipe(
    Effect.tap(() => Effect.log('MyResource released.'))
  );

const myScopedResource = Effect.acquireRelease(
  acquireMyResource,
  releaseMyResource
);

//
// Defining a service and its tag
//
export interface MyService {
  service(): Effect.Effect<never, never, string>;
}
export const MyService = Context.Tag<MyService>();

const scopedEffect = myScopedResource.pipe(
  Effect.flatMap((myResource) =>
    Effect.sync(
      () =>
        ({
          service() {
            return Effect.succeed(
              `LiveLayer with data: ${myResource.data()}`
            );
          }
        } as MyService)
    )
  )
);

const scopedServiceLive = Layer.scoped(
  MyService,
  scopedEffect
);

const program = MyService.pipe(
  Effect.flatMap((layer) => layer.service()),
  Effect.flatMap((_) => Effect.log(_))
);
const anotherProgram = MyService.pipe(
  Effect.flatMap((layer) => layer.service()),
  Effect.flatMap((_) => Effect.log(_))
);

// Effect.runPromise(
//   program.pipe(
//     Effect.flatMap(() => anotherProgram),
//     Effect.provideLayer(scopedServiceLive)
//   )
// );

Effect.runPromise(
  Effect.all([program, anotherProgram]).pipe(
    Effect.provideLayer(scopedServiceLive)
  )
);
