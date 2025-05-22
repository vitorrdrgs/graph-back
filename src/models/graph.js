import { pool, query } from '../db/db.js'

export default class Graph {
  id;
  name;
  date_modified;
  user_id;
  user_name;
  vertices;
  edges;

  constructor(name, user_id, id = null, date_modified = null, vertices = [], edges = [], user_name = null) {
    this.id = id;
    this.name = name;
    this.user_id = user_id;
    this.user_name = user_name;
    this.date_modified = date_modified;
    this.vertices = vertices;
    this.edges = edges;
  }

  async create() {
    try {
      const res = await query(
        'INSERT INTO graphs (name, user_id) VALUES ($1, $2) RETURNING *',
        [this.name, this.user_id]
      );
      const row = res.rows[0];
      this.id = row.id;
      this.date_modified = row.date_modified;

      const userRes = await query('SELECT name FROM users WHERE id = $1', [this.user_id]);
      this.user_name = userRes.rows[0]?.name || null;

      return this;
    } catch (err) {
      console.error('Erro ao criar grafo:', err);
      return null;
    }
  }

  async update() {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const res = await client.query(
        'UPDATE graphs SET name = $1, date_modified = NOW() WHERE id = $2 RETURNING *',
        [this.name, this.id]
      );
      this.date_modified = res.rows[0].date_modified;

      const [prevVerticesRes, prevEdgesRes] = await Promise.all([
        client.query('SELECT * FROM vertices WHERE graph_id = $1 ORDER BY id', [this.id]),
        client.query('SELECT * FROM edges WHERE graph_id = $1 ORDER BY id', [this.id]),
      ]);

      const prevVertices = new Map(prevVerticesRes.rows.map(v => [v.id, v]));
      const prevEdges = new Map(prevEdgesRes.rows.map(e => [e.id, e]));

      const vertexInserts = [];
      const vertexUpdates = [];

      for (const vertex of this.vertices) {
        if (vertex.id == null) {
          vertexInserts.push(vertex);
        } else {
          const prev = prevVertices.get(vertex.id);
          const colorInt = parseInt(vertex.color.slice(1), 16);
          const posStr = `(${vertex.x},${vertex.y})`;
          if (
            !prev ||
            vertex.label !== prev.label ||
            vertex.number !== prev.number ||
            colorInt !== prev.color ||
            vertex.geometry !== prev.geometry ||
            posStr !== prev.pos
          ) {
            vertexUpdates.push(vertex);
          }
        }
      }

      if (vertexInserts.length > 0) {
        const values = vertexInserts
          .map((_, i) => `($${i * 6 + 1}, $${i * 6 + 2}, $${i * 6 + 3}, $${i * 6 + 4}, $${i * 6 + 5}, $${i * 6 + 6})`)
          .join(', ');
        const params = vertexInserts.flatMap(v => [
          v.label,
          v.number,
          parseInt(v.color.slice(1), 16),
          v.geometry,
          `(${v.x},${v.y})`,
          this.id,
        ]);

        const insertRes = await client.query(
          `INSERT INTO vertices (label, number, color, geometry, pos, graph_id) VALUES ${values} RETURNING id`,
          params
        );
        insertRes.rows.forEach((row, idx) => {
          vertexInserts[idx].id = row.id;
        });
      }

      for (const v of vertexUpdates) {
        await client.query(
          'UPDATE vertices SET label = $1, number = $2, color = $3, geometry = $4, pos = $5 WHERE id = $6',
          [v.label, v.number, parseInt(v.color.slice(1), 16), v.geometry, `(${v.x},${v.y})`, v.id]
        );
      }

      const edgeInserts = [];
      const edgeUpdates = [];

      for (const edge of this.edges) {
        if (edge.id == null) {
          edgeInserts.push(edge);
        } else {
          const prev = prevEdges.get(edge.id);
          if (!prev || edge.weight !== prev.weight) {
            edgeUpdates.push(edge);
          }
        }
      }

      if (edgeInserts.length > 0) {
        const values = edgeInserts
          .map((_, i) => `($${i * 4 + 1}, $${i * 4 + 2}, $${i * 4 + 3}, $${i * 4 + 4})`)
          .join(', ');
        const params = edgeInserts.flatMap(e => [e.weight, e.origin_vertex, e.dest_vertex, this.id]);

        const insertRes = await client.query(
          `INSERT INTO edges (weight, origin_vertex, dest_vertex, graph_id) VALUES ${values} RETURNING id`,
          params
        );
        insertRes.rows.forEach((row, idx) => {
          edgeInserts[idx].id = row.id;
        });
      }

      for (const e of edgeUpdates) {
        await client.query('UPDATE edges SET weight = $1 WHERE id = $2', [e.weight, e.id]);
      }

      const currentVertexIds = this.vertices.filter(v => v.id != null).map(v => v.id);
      const currentEdgeIds = this.edges.filter(e => e.id != null).map(e => e.id);

      const deletedVertexIds = [...prevVertices.keys()].filter(id => !currentVertexIds.includes(id));
      const deletedEdgeIds = [...prevEdges.keys()].filter(id => !currentEdgeIds.includes(id));

      for (const id of deletedVertexIds) {
        await client.query('DELETE FROM vertices WHERE id = $1', [id]);
      }

      for (const id of deletedEdgeIds) {
        await client.query('DELETE FROM edges WHERE id = $1', [id]);
      }

      await client.query('COMMIT');

      return this;
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('Erro ao atualizar grafo:', err);
      return null;
    } finally {
      client.release();
    }
  }

  static async get_graph_by_id(id) {
    const [graph_data, vertices_data, edges_data] = await Promise.all([
      query(`
        SELECT g.*, u.name AS user_name
        FROM graphs g
        JOIN users u ON g.user_id = u.id
        WHERE g.id = $1
      `, [id]),
      query('SELECT * FROM vertices WHERE graph_id = $1', [id]),
      query('SELECT * FROM edges WHERE graph_id = $1', [id])
    ]);

    const graph_row = graph_data.rows[0];
    if (!graph_row) return null;

    const vertices = vertices_data.rows.map(vertex => ({
      id: vertex.id,
      label: vertex.label,
      number: vertex.number,
      x: vertex.pos.x,
      y: vertex.pos.y,
      color: '#' + vertex.color.toString(16).padStart(6, '0'),
      geometry: vertex.geometry,
    }));

    const edges = edges_data.rows.map(edge => ({
      id: edge.id,
      weight: edge.weight,
      origin: edge.origin_vertex,
      destination: edge.dest_vertex,
    }));

    return new Graph(
      graph_row.name,
      graph_row.user_id,
      graph_row.id,
      graph_row.date_modified,
      vertices,
      edges,
      graph_row.user_name
    );
  }

  static async get_all_graphs() {
    const res = await query('SELECT * FROM graphs');
    return res.rows.map(
      row => new Graph(row.name, row.user_id, row.id, row.date_modified)
    );
  }

  static async get_graphs_by_user_id(user_id) {
    const res = await query(
      `SELECT g.*, u.name AS user_name
        FROM graphs g
        JOIN users u ON g.user_id = u.id
        WHERE g.user_id = $1`,
      [user_id]
    );

    return res.rows.map(
      row => {
        const graph = new Graph(row.name, row.user_id, row.id, row.date_modified);
        graph.user_name = row.user_name;
        return graph;
      }
    );
  }

  to_object() {
    return {
      id: this.id,
      name: this.name,
      date_modified: this.date_modified,
      user_name: this.user_name,
      vertices: this.vertices,
      edges: this.edges
    };
  }

  to_json() {
    return JSON.stringify(this.to_object());
  }
}

