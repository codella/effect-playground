import { Chunk, Option, pipe } from 'effect';

/*
 * A Chunk<A> represents a chunk of values of type A.
 * Chunks are usually backed by arrays, but expose a purely functional,
 * safe interface to the underlying elements, and they become lazy on
 * operations that would be costly with arrays, such as repeated concatenation.
 * Like lists and arrays, Chunk is an ordered collection.
 */

/************************************************
 * Chunk.of
 */
pipe(Chunk.of(1), printChunk);

/************************************************
 * Chunk.make
 */
pipe(Chunk.make(1, 2, 3), printChunk);

/************************************************
 * Chunk.append
 */
pipe(Chunk.of('one'), Chunk.append('another'), printChunk);

/************************************************
 * Chunk.appendAll
 */
pipe(
  Chunk.of(0),
  Chunk.appendAll(Chunk.make(1, 2, 3)),
  printChunk
);

/************************************************
 * Chunk.appendAllNonEmpty
 */
pipe(
  Chunk.of(1),
  Chunk.appendAllNonEmpty(Chunk.empty()),
  printChunk
);
pipe(
  Chunk.empty(),
  Chunk.appendAllNonEmpty(Chunk.of(1)),
  printChunk
);

// -- This won't compile (by design)
// pipe(
//   Chunk.empty(),
//   Chunk.appendAllNonEmpty(Chunk.empty()),
//   printChunk
// );

/************************************************
 * Chunk.appendAllNonEmpty
 */
pipe(
  Chunk.make(1, 2, 3, 4, 5, 6),
  Chunk.chunksOf(3),
  printChunk
);

/************************************************
 * Chunk.compact
 */
pipe(
  Chunk.make(Option.none(), Option.some(1), Option.none()),
  Chunk.compact,
  printChunk
);

/************************************************
 * Chunk.contains
 */
pipe(Chunk.make(1, 2, 3), Chunk.contains(2), console.log);

/*
 * Utility function(s)
 */

function printChunk<A>(chunk: Chunk.Chunk<A>) {
  pipe(
    chunk,
    Chunk.map((el) =>
      Chunk.isChunk(el) ? Chunk.toReadonlyArray(el) : el
    ),
    Chunk.toReadonlyArray,
    console.log
  );
}
