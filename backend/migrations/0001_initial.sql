-- Create uploaded_images table
CREATE TABLE uploaded_images (
  id TEXT PRIMARY KEY,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size INTEGER NOT NULL,
  uploaded_at TEXT NOT NULL,
  user_id TEXT,
  r2_key TEXT NOT NULL UNIQUE,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Create analysis_results table
CREATE TABLE analysis_results (
  id TEXT PRIMARY KEY,
  image_id TEXT NOT NULL,
  user_id TEXT,
  health_score INTEGER,
  overall_health_score INTEGER,
  analysis_data TEXT NOT NULL, -- JSON blob
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (image_id) REFERENCES uploaded_images (id) ON DELETE CASCADE
);

-- Create user_sessions table for session management
CREATE TABLE user_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  session_token TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  last_accessed TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_uploaded_images_user_id ON uploaded_images (user_id);
CREATE INDEX idx_uploaded_images_uploaded_at ON uploaded_images (uploaded_at);
CREATE INDEX idx_analysis_results_image_id ON analysis_results (image_id);
CREATE INDEX idx_analysis_results_user_id ON analysis_results (user_id);
CREATE INDEX idx_analysis_results_created_at ON analysis_results (created_at);
CREATE INDEX idx_user_sessions_user_id ON user_sessions (user_id);
CREATE INDEX idx_user_sessions_token ON user_sessions (session_token);
CREATE INDEX idx_user_sessions_expires ON user_sessions (expires_at);