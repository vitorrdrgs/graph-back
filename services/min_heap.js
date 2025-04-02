class MinHeap {
    constructor(arr = []) {
        if (Array.isArray(arr)) {
            this.#arr = arr.slice();
            if (this.#arr.length) {
                for (let i = Math.floor(this.#arr.length / 2) - 1; i >= 0; --i) {
                    this.heapify(i);
                }
            }
        } else {
            throw new Error("Argument must be an array");
        }
    }

    #arr = [];

    peek() {
        return this.#arr.length ? this.#arr[0] : null;
    }

    insert(value) {
        this.#arr.push(value);
        this.bubbleUp(this.#arr.length - 1);
    }

    delete(value) {
        let index = -1;
        for(let i=0; i < this.#arr.length; ++i){
            if(value.cost === this.#arr[i].cost && value.vertex === this.#arr[i].vertex){
                index = i;
                break;
            }
        }

        if (index === -1) return;

        let lastIndex = this.#arr.length - 1;
        if (index !== lastIndex) {
            this.#arr[index] = this.#arr[lastIndex];
            this.#arr.pop();

            let parent = Math.floor((index - 1) / 2);
            if (index > 0 && this.#arr[index].cost < this.#arr[parent].cost) {
                this.bubbleUp(index);
            } else {
                this.heapify(index);
            }
        } else {
            this.#arr.pop();
        }
    }

    bubbleUp(index) {
        while (index > 0) {
            let parent = Math.floor((index - 1) / 2);
            if (this.#arr[parent].cost > this.#arr[index].cost) {
                [this.#arr[index], this.#arr[parent]] = [this.#arr[parent], this.#arr[index]];
                index = parent;
            } else {
                break;
            }
        }
    }

    heapify(i) {
        let smallest = i;
        let l = 2 * i + 1;
        let r = 2 * i + 2;

        if (l < this.#arr.length && this.#arr[l].cost < this.#arr[smallest].cost) smallest = l;
        if (r < this.#arr.length && this.#arr[r].cost < this.#arr[smallest].cost) smallest = r;

        if (smallest !== i) {
            [this.#arr[i], this.#arr[smallest]] = [this.#arr[smallest], this.#arr[i]];
            this.heapify(smallest);
        }
    }

    print() {
        console.log(this.#arr);
    }

    empty() {
        return this.#arr.length === 0;
    }

    extract() {
        const n = this.#arr.length;
        if (n === 0) {
            return Number.MAX_VALUE;
        }
        if (n === 1) {
            const value = this.#arr.pop();
            return value;
        }

        let root = this.#arr[0];

        this.#arr[0] = this.#arr[n - 1];
        this.#arr.pop();

        this.heapify(0);
        
        return root;
    }

    get arr(){
        return this.#arr;
    }
}

export default MinHeap;