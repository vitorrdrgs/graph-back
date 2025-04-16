import { query } from '../db/db.js';

export default class Graph {
    constructor(){

    }

    static async get_graphs_by_user_id(id){
        const res = await query("SELECT * FROM graphs WHERE user_id = $1", [id]);
        console.log(res);
    }
}
