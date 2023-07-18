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

/// ServiceE ///
interface ServiceE {
  readonly doE: () => void;
}
const ServiceE = Context.Tag<ServiceE>();
const serviceEImpl: ServiceE = {
  doE: () => console.log("Using ServiceE"),
};
//////////////

///////////////////////
// Interesgint part! //
///////////////////////

const contextA = Context.empty().pipe(
  Context.add(ServiceA, ServiceA.of(serviceAImpl))
);

const ServiceBCLive = Layer.merge(
  Layer.succeed(ServiceB, ServiceB.of(serviceBImpl)),
  Layer.succeed(ServiceC, ServiceC.of(serviceCImpl))
);
const ServiceDLive = Layer.succeed(ServiceD, ServiceD.of(serviceDImpl));

const program = Effect.all([
  ServiceA,
  ServiceB,
  ServiceC,
  ServiceD,
  ServiceE,
]).pipe(
  Effect.flatMap(([a, b, c, d, e]) =>
    Effect.sync(() => {
      a.doA();
      b.doB();
      c.doC();
      d.doD();
      e.doE();
      return "success!";
    })
  )
);

const provided = program.pipe(
  Effect.provideSomeContext(contextA), // Context, providing only ServiceA
  Effect.provideSomeLayer(ServiceBCLive), // Merged layers, providing ServiceB and ServiceC
  Effect.provideSomeLayer(ServiceDLive), // Layer, providing Service D
  Effect.provideService(ServiceE, ServiceE.of(serviceEImpl)) // Service, providing only ServiceE
);

Effect.runSync(provided);

/* Output:
  Using ServiceA
  Using ServiceB
  Using ServiceC
  Using ServiceD
  Using ServiceE
*/
