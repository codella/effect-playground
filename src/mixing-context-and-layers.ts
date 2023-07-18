import { Effect, Context, Layer } from "effect";

/// ServiceA ///
interface ServiceA {
  readonly doA: () => void;
}
const ServiceA = Context.Tag<ServiceA>();
const serviceAImpl: ServiceA = {
  doA: () => console.log("Using ServiceA"),
};
//////////////

/// ServiceB ///
interface ServiceB {
  readonly doB: () => void;
}
const ServiceB = Context.Tag<ServiceB>();
const serviceBImpl: ServiceB = {
  doB: () => console.log("Using ServiceB"),
};
/////////////////

/// ServiceC ///
interface ServiceC {
  readonly doC: () => void;
}
const ServiceC = Context.Tag<ServiceC>();
const serviceCImpl: ServiceC = {
  doC: () => console.log("Using ServiceC"),
};
//////////////

/// ServiceD ///
interface ServiceD {
  readonly doD: () => void;
}
const ServiceD = Context.Tag<ServiceD>();
const serviceDImpl: ServiceD = {
  doD: () => console.log("Using ServiceD"),
};
//////////////

///////////////////////
// Interesgint part! //
///////////////////////

const context = Context.empty().pipe(
  Context.add(ServiceA, ServiceA.of(serviceAImpl))
);

const ServiceBLive = Layer.succeed(ServiceB, ServiceB.of(serviceBImpl));
const ServiceCLive = Layer.succeed(ServiceC, ServiceC.of(serviceCImpl));
const ServiceBCLive = Layer.merge(ServiceBLive, ServiceCLive);
const ServiceDLive = Layer.succeed(ServiceD, ServiceD.of(serviceDImpl));

const program = Effect.all([ServiceA, ServiceB, ServiceC, ServiceD]).pipe(
  Effect.flatMap(([a, b, c, d]) =>
    Effect.sync(() => {
      a.doA();
      b.doB();
      c.doC();
      d.doD();
      return "success!";
    })
  )
);

const provided = program.pipe(
  Effect.provideSomeContext(context), // Context, providing only ServiceA
  Effect.provideSomeLayer(ServiceBCLive), // Merged layers, providing ServiceB and ServiceC
  Effect.provideSomeLayer(ServiceDLive) // Layer, providing Service D
);

Effect.runPromise(provided);
