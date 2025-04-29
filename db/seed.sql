-- USERS
INSERT INTO users (name, email, password) VALUES
('Alice', 'alice@example.com', '$2b$10$pLOT2ZW/wDsPsWH76YBkCOuiZlc369FPCts9lj/Dhy8W8LAlVJBKy'),
('Bob', 'bob@example.com', '$2b$10$/DYsrTzqJucw/xr1DT/wReV5Wcl2lCWtYioLo33iJw5MyWKlBzR/W'),
('Charlie', 'charlie@example.com', '$2b$10$04ZRJ4AqFWdo0iKotGXmJe/dW9zntMyNwdWSVDsEQKJqEJxma9Nqm'),
('Diana', 'diana@example.com', '$2b$10$E/3BJp60gKVVzPzoeomniuMQV60n0K8OcUx10fer37muth./cKlhy'),
('Eve', 'eve@example.com', '$2b$10$j9b.ztJkxBPgHbSVWXq0wutAoJm8/1ADMueRrIAxPNTlMsQ42JlVi'),
('Frank', 'frank@example.com', '$2b$10$MqLLawuIIKZzzivOYMznQ.HJl6r3xOXcYrw6iNV3PC6/FwfQAA1Rm'),
('Grace', 'grace@example.com', '$2b$10$B3Qe2370TfkMl5KPqvWj9uJ1snuGEx0MoZnvyX8W.MKO6cwd8YnL.'),
('Heidi', 'heidi@example.com', '$2b$10$BqZ7qjuyr8pi.ux.qDM9l.XgYkdzabNT9Mb8r4LiLpsaCXPkgj4ce'),
('Ivan', 'ivan@example.com', '$2b$10$FgqAthBH3FeZI2bIEUmK4Ob.SZH6BbD8BNnB987yKl7ldBtKFjxh2'),
('Judy', 'judy@example.com', '$2b$10$q28E9pcIld5jcroxV.RJm.TTO3HaxocWdVjiYSApVkZTynTU4qivy');

-- GRAPHS
INSERT INTO graphs (name, user_id) VALUES
('Social Network', 1),
('Transport Map', 2),
('Family Tree', 3),
('Friend Connections', 4),
('Web of Trust', 5);

-- VERTICES
-- Assume vertices 1–5 belong to Graph 1 (Social Network), 6–10 to Graph 2 (Transport Map)
INSERT INTO vertices (label, number, color, geometry, pos, graph_id) VALUES
('Alice', 0, 123456, 'circle', POINT(0,0), 1),
('Bob', 1, 654321, 'square', POINT(100,200), 1),
('Charlie', 2, 112233, 'triangle', POINT(200,300), 1),
('Diana', 3, 445566, 'circle', POINT(300,400), 1),
('Eve', 4, 778899, 'square', POINT(400,500), 1),
('Frank', 5, 334455, 'triangle', POINT(500,600), 2),
('Grace', 6, 998877, 'circle', POINT(600,700), 2),
('Heidi', 7, 556677, 'triangle', POINT(700,800), 2),
('Ivan', 8, 223344, 'square', POINT(800,900), 2),
('Judy', 9, 667788, 'circle', POINT(900,1000), 2);

-- EDGES
INSERT INTO edges (weight, graph_id, origin_vertex, dest_vertex) VALUES
(1, 1, 1, 2),
(2, 1, 2, 3),
(3, 1, 3, 4),
(4, 1, 4, 5),
(5, 1, 5, 1),
(1, 2, 6, 7),
(2, 2, 7, 8),
(3, 2, 8, 9),
(4, 2, 9, 10),
(5, 2, 10, 6);