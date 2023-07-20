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
pipe(Chunk.of(1), printChunk('Chunk.of'));

/************************************************
 * Chunk.make
 */
pipe(Chunk.make(1, 2, 3), printChunk('Chunk.make'));

/************************************************
 * Chunk.append
 */
pipe(
  Chunk.of('one'),
  Chunk.append('another'),
  printChunk('Chunk.append')
);

/************************************************
 * Chunk.appendAll
 */
pipe(
  Chunk.of(0),
  Chunk.appendAll(Chunk.make(1, 2, 3)),
  printChunk('Chunk.appendAll')
);

/************************************************
 * Chunk.appendAllNonEmpty
 */
pipe(
  Chunk.of(1),
  Chunk.appendAllNonEmpty(Chunk.empty()),
  printChunk('Chunk.appendAllNonEmpty (1)')
);
pipe(
  Chunk.empty(),
  Chunk.appendAllNonEmpty(Chunk.of(1)),
  printChunk('Chunk.appendAllNonEmpty (2)')
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
  Chunk.make(1, 2, 3, 4, 5),
  Chunk.chunksOf(3),
  printChunk('Chunk.chunksOf')
);

/************************************************
 * Chunk.compact
 */
pipe(
  Chunk.make(Option.none(), Option.some(1), Option.none()),
  Chunk.compact,
  printChunk('Chunk.compact')
);

/************************************************
 * Chunk.contains
 */
pipe(
  Chunk.make(1, 2, 3),
  Chunk.contains(2),
  print('Chunk.contains')
);

/*
 * Utility function(s)
 */

interface Printer {
  <A>(chunk: Chunk.Chunk<A>): void;
  <A>(data: A): void;
}

function printChunk(example: string): Printer {
  return function <A>(chunk: Chunk.Chunk<A>) {
    console.log(
      '************************************************'
    );
    console.log('* Output of: `' + example + '`');
    pipe(
      chunk,
      Chunk.map((el) =>
        Chunk.isChunk(el) ? Chunk.toReadonlyArray(el) : el
      ),
      Chunk.toReadonlyArray,
      console.log
    );
    console.log();
  };
}

function print(example: string) {
  return function (...data: any[]) {
    console.log(
      '************************************************'
    );
    console.log('* Output of: `' + example + '`');
    console.log(...data);
    console.log();
  };
}
