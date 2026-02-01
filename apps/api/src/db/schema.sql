create extension if not exists pgcrypto;

-- ---------------------
-- users
-- ---------------------
create table users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

-- ---------------------
-- days (raw inputs)
-- ---------------------
create table days (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id),
  date date not null,

  sleep_hours numeric,
  sleep_quality int,
  mood int,
  energy int,

  note text,
  closed_at timestamptz,

  unique (user_id, date)
);

-- ---------------------
-- habits
-- ---------------------
create table habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id),
  name text not null,
  impact_weight int not null default 1,
  category text not null check (category in ('non_negotiable', 'optional')),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------
-- habit logs
-- ---------------------
create table habit_logs (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references habits(id),
  date date not null,
  status text not null check (status in ('completed', 'skipped', 'intentional_skip')),
  value numeric,
  skip_reason text,
  created_at timestamptz not null default now(),
  unique (habit_id, date)
);

-- ---------------------
-- todos / MITs
-- ---------------------
create table todos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id),
  title text not null,
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

create table mit_selections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id),
  date date not null,
  todo_id uuid not null references todos(id),
  unique (user_id, date)
);

-- ---------------------
-- daily metrics (derived)
-- ---------------------
create table daily_metrics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id),
  date date not null,

  habit_score numeric not null,
  mit_completed boolean not null,
  momentum_7d numeric,

  created_at timestamptz not null default now(),
  unique (user_id, date)
);

-- ---------------------
-- insight events
-- ---------------------
create table insight_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id),
  insight_key text not null,
  created_at timestamptz not null default now()
);

create index idx_insight_events_user_key
  on insight_events (user_id, insight_key, created_at);

-- ---------------------
-- insight feedback
-- ---------------------
create table insight_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id),
  insight_key text not null,
  date date not null,

  action_taken boolean,
  outcome_delta numeric,

  created_at timestamptz not null default now()
);

create index on insight_feedback (user_id, insight_key);
create index on insight_feedback (user_id, date);

-- ---------------------
-- goals
-- ---------------------
create table goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id),

  title text not null,
  description text,

  metric text not null check (metric in ('habit_score', 'momentum_7d', 'streak', 'count')),
  target_value numeric not null,

  start_date date not null,
  end_date date,

  status text not null default 'active',

  created_at timestamptz not null default now(),
  completed_at timestamptz
);
