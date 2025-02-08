-- Create course_ratings table
CREATE TABLE IF NOT EXISTS course_ratings (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  UNIQUE(user_id, course_id)
);

-- Create course_comments table
CREATE TABLE IF NOT EXISTS course_comments (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  lesson_id TEXT REFERENCES lessons(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_id TEXT REFERENCES course_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create lesson_progress table
CREATE TABLE IF NOT EXISTS lesson_progress (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE NOT NULL,
  progress_percentage INTEGER DEFAULT 0 NOT NULL CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  last_watched_position INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  UNIQUE(user_id, lesson_id)
); 