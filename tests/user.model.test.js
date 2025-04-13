import { jest } from "@jest/globals";

jest.unstable_mockModule("../src/db/db.js", () => ({
  query: jest.fn()
}));

let User;
let query;

beforeAll(async () => {
  const db = await import("../src/db/db.js");
  query = db.query;

  const mod = await import("../src/models/user.js");
  User = mod.default;
});

beforeEach(() => {
  query.mockReset();
});

test('create() inserts and returns a user', async () => {
  const mockUser = {
    id: 1,
    name: "Alice",
    email: "alice@example.com",
    password: "secret",
  };

  query.mockResolvedValue({ rows: [mockUser] });

  const user = new User(mockUser.name, mockUser.email, mockUser.password);
  const result = await user.create();

  expect(query).toHaveBeenCalledWith(
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
    [user.name, user.email, user.password]
  );
  expect(result).toEqual(mockUser);
});

test('create() returns null on query failure', async () => {
  query.mockRejectedValue(new Error("DB error"));

  const user = new User("Fail", "fail@example.com", "pw");
  const result = await user.create();

  expect(result).toBeNull();
});

test('update() updates and returns a user', async () => {
  const mockUser = {
    id: 1,
    name: "Bob",
    email: "bob@example.com",
    password: "pw123"
  };

  query.mockResolvedValue({ rows: [mockUser] });

  const user = new User(mockUser.name, mockUser.email, mockUser.password, mockUser.id);
  const result = await user.update();

  expect(query).toHaveBeenCalledWith(
    "UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING *",
    [user.name, user.email, user.password, user.id]
  );
  expect(result).toEqual(mockUser);
});

test('update() returns null on failure', async () => {
  query.mockRejectedValue(new Error("fail"));

  const user = new User("Name", "email@example.com", "pw", 1);
  const result = await user.update();

  expect(result).toBeNull();
});

test('get_all_users() returns a list of users', async () => {
  const mockUsers = [
    { id: 1, name: "One", email: "one@example.com", password: "a" },
    { id: 2, name: "Two", email: "two@example.com", password: "b" }
  ];

  query.mockResolvedValue({ rows: mockUsers });

  const result = await User.get_all_users();

  expect(query).toHaveBeenCalledWith("SELECT * FROM users");
  expect(result).toEqual(mockUsers);
});

test('get_user_by_id() returns a User instance', async () => {
  const mockRow = { id: 1, name: "ID User", email: "id@example.com", password: "pw" };

  query.mockResolvedValue({ rows: [mockRow] });

  const result = await User.get_user_by_id(1);

  expect(query).toHaveBeenCalledWith("SELECT * FROM users WHERE id = $1", [1]);
  expect(result).toBeInstanceOf(User);
  expect(result.id).toBe(1);
});

test('get_user_by_id() returns null if no user', async () => {
  query.mockResolvedValue({ rows: [] });

  const result = await User.get_user_by_id(1);
  expect(result).toBeNull();
});

test('get_user_by_email() returns a User instance', async () => {
  const mockRow = { id: 2, name: "Email User", email: "e@example.com", password: "pw" };

  query.mockResolvedValue({ rows: [mockRow] });

  const result = await User.get_user_by_email("e@example.com");

  expect(query).toHaveBeenCalledWith("SELECT * FROM users WHERE email = $1", ["e@example.com"]);
  expect(result).toBeInstanceOf(User);
  expect(result.email).toBe("e@example.com");
});

test('get_user_by_email() returns null if not found', async () => {
  query.mockResolvedValue({ rows: [] });

  const result = await User.get_user_by_email("not@found.com");
  expect(result).toBeNull();
});

test('to_json() returns JSON string without password', () => {
  const user = new User("Jane", "jane@example.com", "pw", 123);
  const json = user.to_json();

  expect(JSON.parse(json)).toEqual({
    id: 123,
    name: "Jane",
    email: "jane@example.com"
  });
});

test('to_object() returns plain object without password', () => {
  const user = new User("John", "john@example.com", "pw", 456);
  const obj = user.to_object();

  expect(obj).toEqual({
    id: 456,
    name: "John",
    email: "john@example.com"
  });
});