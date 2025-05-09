import { query } from '../db/db.js'

export default class Graph {
  id
  name
  date_modified
  user_id
  vertices
  edges

  constructor(name, user_id, id = null, date_modified = null, vertices=[], edges=[]) {
    this.id = id
    this.name = name
    this.user_id = user_id
    this.date_modified = date_modified
    this.vertices = vertices,
    this.edges = edges
  }

  async create() {
    try {
      const res = await query(
        'INSERT INTO graphs (name, user_id) VALUES ($1, $2) RETURNING *',
        [this.name, this.user_id]
      )
      const row = res.rows[0]
      this.id = row.id
      this.date_modified = row.date_modified
      return this
    } catch (err) {
      console.error('Erro ao criar grafo:', err)
      return null
    }
  }

  async update() {
    try {
      await query('BEGIN');

      const res = await query(
        'UPDATE graphs SET name = $1, date_modified = NOW() WHERE id = $2 RETURNING *',
        [this.name, this.id]
      );
      const row = res.rows[0];
      this.date_modified = row.date_modified;

      const [previousVerticesData, previousEdgesData] = await Promise.all([
        query('SELECT * FROM vertices WHERE graph_id = $1', [this.id]),
        query('SELECT * FROM edges WHERE graph_id = $1', [this.id])
      ]);

      const previousVertices = new Map(previousVerticesData.rows.map(v => [v.id, v]));
      const previousEdges = new Map(previousEdgesData.rows.map(e => [e.id, e]));

      const vertexInserts = [];
      const vertexUpdates = [];

      for (const vertex of this.vertices) {
        if (vertex.id === null) {
          vertexInserts.push(vertex);
        } else {
          const prev = previousVertices.get(vertex.id);
          if (!prev ||
            vertex.label !== prev.label ||
            vertex.number !== prev.number ||
            parseInt(vertex.color.slice(1), 16) !== prev.color ||
            vertex.geometry !== prev.geometry ||
            `(${vertex.x},${vertex.y})` !== prev.pos) {
            vertexUpdates.push(vertex);
          }
        }
      }

      if (vertexInserts.length > 0) {
        const values = [];
        const params = [];
        let i = 1;
        for (const v of vertexInserts) {
          values.push(`($${i++}, $${i++}, $${i++}, $${i++}, $${i++}, $${i++})`);
          params.push(v.label, v.number, parseInt(v.color.slice(1), 16), v.geometry, `(${v.x},${v.y})`, this.id);
        }
        const insertRes = await query(
          `INSERT INTO vertices (label, number, color, geometry, pos, graph_id) VALUES ${values.join(', ')} RETURNING id`,
          params
        );
        for (let j = 0; j < vertexInserts.length; j++) {
          vertexInserts[j].id = insertRes.rows[j].id;
        }
      }

      await Promise.all(vertexUpdates.map(v =>
        query(
          'UPDATE vertices SET label = $1, number = $2, color = $3, geometry = $4, pos = $5 WHERE id = $6',
          [v.label, v.number, parseInt(v.color.slice(1), 16), v.geometry, `(${v.x},${v.y})`, v.id]
        )
      ));

      const edgeInserts = [];
      const edgeUpdates = [];

      for (const edge of this.edges) {
        if (edge.id === null) {
          edgeInserts.push(edge);
        } else {
          const prev = previousEdges.get(edge.id);
          if (!prev || edge.weight !== prev.weight) {
            edgeUpdates.push(edge);
          }
        }
      }

      if (edgeInserts.length > 0) {
        const values = [];
        const params = [];
        let i = 1;
        for (const e of edgeInserts) {
          values.push(`($${i++}, $${i++}, $${i++}, $${i++})`);
          params.push(e.weight, e.origin_vertex, e.dest_vertex, this.id);
        }
        const insertRes = await query(
          `INSERT INTO edges (weight, origin_vertex, dest_vertex, graph_id) VALUES ${values.join(', ')} RETURNING id`,
          params
        );
        for (let j = 0; j < edgeInserts.length; j++) {
          edgeInserts[j].id = insertRes.rows[j].id;
        }
      }

      await Promise.all(edgeUpdates.map(e =>
        query('UPDATE edges SET weight = $1 WHERE id = $2', [e.weight, e.id])
      ));

      const currentVertexIds = this.vertices.filter(v => v.id !== null).map(v => v.id);
      const currentEdgeIds = this.edges.filter(e => e.id !== null).map(e => e.id);

      const deletedVertexIds = [...previousVertices.keys()].filter(id => !currentVertexIds.includes(id));
      const deletedEdgeIds = [...previousEdges.keys()].filter(id => !currentEdgeIds.includes(id));

      await Promise.all([
        ...deletedVertexIds.map(id => query('DELETE FROM vertices WHERE id = $1', [id])),
        ...deletedEdgeIds.map(id => query('DELETE FROM edges WHERE id = $1', [id]))
      ]);

      await query('COMMIT');
      return this;
    } catch (err) {
      console.error('Erro ao atualizar grafo:', err);
      await query('ROLLBACK');
      return null;
    }
  }


  static async get_graph_by_id(id) {
    const [graph_data, vertices_data, edges_data] = await Promise.all(
      [
        query('SELECT * FROM graphs WHERE id = $1', [id]),
        query('SELECT * FROM vertices WHERE graph_id = $1', [id]),
        query('SELECT * FROM edges WHERE graph_id = $1', [id])
      ]
    )

    const graph_row = graph_data.rows[0]
    if(!graph_row) return null

    const vertices_rows = vertices_data.rows
    const vertices = vertices_rows.map((vertex) => (
      {
        id: vertex.id,
        label: vertex.label,
        number: vertex.number,
        x: vertex.pos.x,
        y: vertex.pos.y,
        color: '#' + vertex.color.toString(16),
        geometry: vertex.geometry,
      }
    ));


    const edges_rows = edges_data.rows
    const edges = edges_rows.map(
      (edge) => (
        {
          id: edge.id,
          weight: edge.weight,
          origin: edge.origin_vertex,
          destination: edge.dest_vertex
        }
      )
    )

    return new Graph(
      graph_row.name,
      graph_row.user_id,
      graph_row.id,
      graph_row.date_modified,
      vertices,
      edges
    )
  }

  static async get_all_graphs() {
    const res = await query('SELECT * FROM graphs')
    return res.rows.map(
      (row) => new Graph(row.name, row.user_id, row.id, row.date_modified)
    )
  }

  static async get_graphs_by_user_id(user_id) {
    const res = await query('SELECT * FROM graphs WHERE user_id = $1', [
      user_id,
    ])
    return res.rows.map(
      (row) => new Graph(row.name, row.user_id, row.id, row.date_modified)
    )
  }

  to_object() {
    return {
      id: this.id,
      name: this.name,
      date_modified: this.date_modified,
      user_id: this.user_id,
      vertices: this.vertices,
      edges: this.edges
    }
  }

  to_json() {
    return JSON.stringify(this.to_object())
  }
}
