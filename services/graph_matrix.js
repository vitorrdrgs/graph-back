//edges = [[u1, v1, w1], ..., [un, vn, wn]]
class GraphMatrix{
    constructor(edges, n){
        for(let i=0; i < n; ++i){
            const row = [];
            for(let j=0; j < n; ++j){
                row.push(0);
            }
            this.#graph.push(row);
        }

        for(let i=0; i < edges.length; ++i){
            if(edges[i].length >= 3){
                this.insert(edges[i][0], edges[i][1], edges[i][2]);
            }else{
                this.insert(edges[i][0], edges[i][1]);
            }
        }
    }
    #graph = [];

    insert(u, v, weight=1){
        this.#graph[u][v] = weight;
        this.#graph[v][u] = weight;
    }

    delete(u, v){
        this.#graph[u][v] = 0;
        this.#graph[v][u] = 0;
    }

    edge(u, v){
        return this.#graph[u][v];
    }

    size(){
        return this.#graph.length;
    }

    to_json(){
        return JSON.stringify({graph: this.#graph});
    }

    to_object(){
        return {graph: this.#graph}
    }
}

export default GraphMatrix;