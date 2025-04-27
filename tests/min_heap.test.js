import MinHeap from '../src/services/min_heap.js'

test('MinHeap extracts the element with smallest cost correctly', () => {
  const heap = new MinHeap()
  heap.insert({ vertex: 0, cost: 2 })
  heap.insert({ vertex: 1, cost: 1 })

  expect(heap.extract()).toEqual({ vertex: 1, cost: 1 })
})

test('MinHeap maintains correct order when inserting duplicate values', () => {
  const heap = new MinHeap()
  heap.insert({ vertex: 0, cost: 2 })
  heap.insert({ vertex: 0, cost: 2 })

  expect(heap.extract()).toEqual({ vertex: 0, cost: 2 })
})

test('MinHeap correctly deletes smallest element', () => {
  const heap = new MinHeap()
  heap.insert({ vertex: 0, cost: 2 })
  heap.insert({ vertex: 1, cost: 5 })
  heap.insert({ vertex: 2, cost: 3 })

  heap.delete({ vertex: 0, cost: 2 })

  expect(heap.extract()).toEqual({ vertex: 2, cost: 3 })
})

test('MinHeap correctly inserts elements', () => {
  const heap = new MinHeap()

  heap.insert({ vertex: 0, cost: 10 })
  expect(heap.arr).toEqual([{ vertex: 0, cost: 10 }])

  heap.insert({ vertex: 1, cost: 7 })
  expect(heap.arr).toEqual([
    { vertex: 1, cost: 7 },
    { vertex: 0, cost: 10 },
  ])

  heap.insert({ vertex: 2, cost: 11 })
  expect(heap.arr).toEqual([
    { vertex: 1, cost: 7 },
    { vertex: 0, cost: 10 },
    { vertex: 2, cost: 11 },
  ])

  heap.insert({ vertex: 3, cost: 5 })
  expect(heap.arr).toEqual([
    { vertex: 3, cost: 5 },
    { vertex: 1, cost: 7 },
    { vertex: 2, cost: 11 },
    { vertex: 0, cost: 10 },
  ])

  heap.insert({ vertex: 4, cost: 4 })
  expect(heap.arr).toEqual([
    { vertex: 4, cost: 4 },
    { vertex: 3, cost: 5 },
    { vertex: 2, cost: 11 },
    { vertex: 0, cost: 10 },
    { vertex: 1, cost: 7 },
  ])

  heap.insert({ vertex: 5, cost: 13 })
  expect(heap.arr).toEqual([
    { vertex: 4, cost: 4 },
    { vertex: 3, cost: 5 },
    { vertex: 2, cost: 11 },
    { vertex: 0, cost: 10 },
    { vertex: 1, cost: 7 },
    { vertex: 5, cost: 13 },
  ])
})
