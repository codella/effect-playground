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

const contextB = Context.empty().pipe(
  Context.add(ServiceB, ServiceB.of(serviceBImpl))
);

const ServiceCDLive = Layer.merge(
  Layer.succeed(ServiceC, ServiceC.of(serviceCImpl)),
  Layer.succeed(ServiceD, ServiceD.of(serviceDImpl))
);
const ServiceELive = Layer.succeed(ServiceE, ServiceE.of(serviceEImpl));

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
  Effect.provideService(ServiceA, ServiceA.of(serviceAImpl)), // Providing ServiceA directly
  Effect.provideSomeContext(contextB), // Providing ServiceB via Context instance
  Effect.provideSomeLayer(ServiceCDLive), // Providing ServiceC and ServiceD via merged layers
  Effect.provideSomeLayer(ServiceELive) // Providing ServiceE via layer
);

Effect.runSync(provided);

/* Output:
  Using ServiceA
  Using ServiceB
  Using ServiceC
  Using ServiceD
  Using ServiceE
*/
