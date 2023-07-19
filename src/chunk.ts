import { Chunk, pipe } from 'effect';

/*
 * A Chunk<A> represents a chunk of values of type A.
 * Chunks are usually backed by arrays, but expose a purely functional,
 * safe interface to the underlying elements, and they become lazy on
 * operations that would be costly with arrays, such as repeated concatenation.
 * Like lists and arrays, Chunk is an ordered collection.
 */

// Chunk.append
const chunk1 = pipe(
  Chunk.empty(),
  Chunk.append('another')
);
printChunk(chunk1);

// Chunk.
// const chunk2 = Chunk.empty()

/* utility functions */

function printChunk(chunk: Chunk.Chunk<unknown>) {
  console.log(Chunk.toReadonlyArray(chunk));
}
