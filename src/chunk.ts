import { Chunk } from "effect";

/*
 * A Chunk<A> represents a chunk of values of type A.
 * Chunks are usually backed by arrays, but expose a purely functional,
 * safe interface to the underlying elements, and they become lazy on
 * operations that would be costly with arrays, such as repeated concatenation.
 * Like lists and arrays, Chunk is an ordered collection.
 */

Chunk.of;
