import { Effect, Context, Layer } from "effect";

/// ServiceA ///
interface ServiceA {
  readonly doA: (input: string) => undefined;
}
const ServiceA = Context.Tag<ServiceA>();
const serviceAImpl: ServiceA = {
  doA: (_) => {},
};
//////////////

/// ServiceB ///
interface ServiceB {
  readonly doB: (input: string) => undefined;
}
const ServiceB = Context.Tag<ServiceB>();
const serviceBImpl: ServiceB = {
  doB: (_) => {},
};
/////////////////

/// ServiceC ///
interface ServiceC {
  readonly doC: (input: string) => undefined;
}
const ServiceC = Context.Tag<ServiceC>();
const serviceCImpl: ServiceC = {
  doC: (_) => {},
};
//////////////

/// ServiceD ///
interface ServiceD {
  readonly doD: (input: string) => undefined;
}
const ServiceD = Context.Tag<ServiceD>();
const serviceDImpl: ServiceD = {
  doD: (_) => {},
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
  Effect.flatMap(([_a, _b, _c, _d]) => Effect.succeed("success!"))
);

const provided = program.pipe(
  Effect.provideSomeContext(context),
  Effect.provideSomeLayer(ServiceBCLive),
  Effect.provideSomeLayer(ServiceDLive)
);
