-- USERS
INSERT INTO users (name, email, password) VALUES
('Alice', 'alice@example.com', '$2b$10$7B2UeROm1z3X4jVUBK1GH.O5bdjuf7sR6EGJiHpOtul6NQU8Ha7Ay'),
('Bob', 'bob@example.com', '$2b$10$NZZH8PFaPAZDyCAbMFB0GeExnz3W3GOrlIgbXZx7xEQxv5bxA3Eoy'),
('Charlie', 'charlie@example.com', '$2b$10$Ax.0OHe12RjER1kPaINHYewAzrSuEd1OVaO1.qgPp1RoIfKNo1Cde'),
('Diana', 'diana@example.com', '$2b$10$nHCh7sqjqhN94WxZcyTQfO45tpAOU8X8Y0xyTKkTQkKROhAO/z5K.'),
('Eve', 'eve@example.com', '$2b$10$a9aHRPHFzRv05Mgf4Zw4rOWAwVltmLtGL0NK6kReAlhd7MopEidHS'),
('Frank', 'frank@example.com', '$2b$10$XvD.kMZDJuQKx92fs4EZ5eBl8SSTBkY9S/U0SGBwW63cwxLF5AK0O'),
('Grace', 'grace@example.com', '$2b$10$tEMBAXmAYUSQlQlObKfArO9ONrDyr13cmldfXJpmwd0GOFwKplrMa'),
('Heidi', 'heidi@example.com', '$2b$10$wfdI5HZFww2eyFieyVCIvuE1ZJ6HZ3KN2jGq8Y1xYjSGJhRkSSuL6'),
('Ivan', 'ivan@example.com', '$2b$10$nznkhBAYP7HwUeK9eFKrH.u7o6/h4eMFeTbnNE15nScS5yyRMK7Ma'),
('Judy', 'judy@example.com', '$2b$10$rBQ/v/4voJj9X2gBrJvSlOsSPFrzwiUOZTntZrm.y1oFwKT3gmLfa');

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
