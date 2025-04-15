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
INSERT INTO graphs (name, date_modified, user_id) VALUES
('Social Network', NOW(), 1),
('Transport Map', NOW(), 2),
('Family Tree', NOW(), 3),
('Friend Connections', NOW(), 4),
('Web of Trust', NOW(), 5);

-- VERTICES (starting from number 0)
-- The 'id' here will be auto-generated.
-- Assuming we will fetch ids for the edges section correctly.
INSERT INTO vertices (label, number, color, geometry, pos) VALUES
('Alice', 0, 123456, 'circle', '(0,0)'),
('Bob', 1, 654321, 'square', '(1,2)'),
('Charlie', 2, 112233, 'triangle', '(2,3)'),
('Diana', 3, 445566, 'circle', '(3,4)'),
('Eve', 4, 778899, 'square', '(4,5)'),
('Frank', 5, 334455, 'triangle', '(5,6)'),
('Grace', 6, 998877, 'circle', '(6,7)'),
('Heidi', 7, 556677, 'triangle', '(7,8)'),
('Ivan', 8, 223344, 'square', '(8,9)'),
('Judy', 9, 667788, 'circle', '(9,10)');

-- Now we need to use the correct `id`s for the vertices, which will be assigned automatically.
-- EDGES (connecting vertices in the graphs)
-- We now need to use the real auto-generated `id`s.
-- Let's assume vertex ids are assigned in order from 1 to 10.

-- Here we are using the correct `id`s for the `origin_vertex` and `dest_vertex`:
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
