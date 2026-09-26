CREATE TABLE IF NOT EXISTS submissions
(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  submissionId TEXT UNIQUE,
  problemId TEXT,
  verdict TEXT,
  score INTEGER,
  submissionTime TEXT,
  code TEXT,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP
);