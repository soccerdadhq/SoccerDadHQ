-- SoccerDadHQ directory schema scaffold
-- Dialect: PostgreSQL-compatible SQL

CREATE TABLE clubs (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  city TEXT NOT NULL,
  state CHAR(2) NOT NULL,
  zip_code TEXT NOT NULL,
  website TEXT,
  phone TEXT,
  email TEXT,
  logo_url TEXT,
  leagues TEXT[] DEFAULT '{}',
  gender_programs TEXT[] DEFAULT '{}',
  age_groups TEXT[] DEFAULT '{}',
  tryout_info TEXT,
  registration_link TEXT,
  description TEXT,
  social_links JSONB DEFAULT '{}'::jsonb,
  is_claimed BOOLEAN DEFAULT FALSE,
  claim_fee_status TEXT DEFAULT 'not_configured',
  claim_fee_renewal_date DATE,
  moderation_status TEXT NOT NULL DEFAULT 'approved',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE coaches (
  id UUID PRIMARY KEY,
  club_id UUID REFERENCES clubs(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  city TEXT NOT NULL,
  state CHAR(2) NOT NULL,
  bio TEXT,
  age_groups_coached TEXT[] DEFAULT '{}',
  leagues TEXT[] DEFAULT '{}',
  gender_programs TEXT[] DEFAULT '{}',
  contact_links JSONB DEFAULT '{}'::jsonb,
  is_claimed BOOLEAN DEFAULT FALSE,
  moderation_status TEXT NOT NULL DEFAULT 'approved',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE club_submissions (
  id UUID PRIMARY KEY,
  club_name TEXT NOT NULL,
  city TEXT NOT NULL,
  state CHAR(2) NOT NULL,
  zip_code TEXT NOT NULL,
  website TEXT,
  contact_email TEXT,
  leagues TEXT[] DEFAULT '{}',
  gender_programs TEXT[] DEFAULT '{}',
  age_groups TEXT[] DEFAULT '{}',
  notes TEXT,
  moderation_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE coach_submissions (
  id UUID PRIMARY KEY,
  coach_name TEXT NOT NULL,
  club_name TEXT,
  city TEXT NOT NULL,
  state CHAR(2) NOT NULL,
  bio TEXT,
  age_groups_coached TEXT[] DEFAULT '{}',
  leagues TEXT[] DEFAULT '{}',
  gender_programs TEXT[] DEFAULT '{}',
  notes TEXT,
  moderation_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE club_claims (
  id UUID PRIMARY KEY,
  club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  claimant_name TEXT NOT NULL,
  role_title TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  club_website TEXT,
  message_proof TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  reviewed_by TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE coach_claims (
  id UUID PRIMARY KEY,
  coach_id UUID NOT NULL REFERENCES coaches(id) ON DELETE CASCADE,
  claimant_name TEXT NOT NULL,
  role_title TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message_proof TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  reviewed_by TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE club_reviews (
  id UUID PRIMARY KEY,
  club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  reviewer_user_id UUID NOT NULL,
  is_anonymous_public BOOLEAN NOT NULL DEFAULT TRUE,
  communication SMALLINT NOT NULL CHECK (communication BETWEEN 1 AND 5),
  player_development SMALLINT NOT NULL CHECK (player_development BETWEEN 1 AND 5),
  organization SMALLINT NOT NULL CHECK (organization BETWEEN 1 AND 5),
  coaching_quality SMALLINT NOT NULL CHECK (coaching_quality BETWEEN 1 AND 5),
  value_for_money SMALLINT NOT NULL CHECK (value_for_money BETWEEN 1 AND 5),
  overall_experience SMALLINT NOT NULL CHECK (overall_experience BETWEEN 1 AND 5),
  review_text TEXT,
  moderation_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE coach_reviews (
  id UUID PRIMARY KEY,
  coach_id UUID NOT NULL REFERENCES coaches(id) ON DELETE CASCADE,
  reviewer_user_id UUID NOT NULL,
  is_anonymous_public BOOLEAN NOT NULL DEFAULT TRUE,
  communication SMALLINT NOT NULL CHECK (communication BETWEEN 1 AND 5),
  player_development SMALLINT NOT NULL CHECK (player_development BETWEEN 1 AND 5),
  game_knowledge SMALLINT NOT NULL CHECK (game_knowledge BETWEEN 1 AND 5),
  fairness SMALLINT NOT NULL CHECK (fairness BETWEEN 1 AND 5),
  motivation_leadership SMALLINT NOT NULL CHECK (motivation_leadership BETWEEN 1 AND 5),
  overall_experience SMALLINT NOT NULL CHECK (overall_experience BETWEEN 1 AND 5),
  review_text TEXT,
  moderation_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE ad_slots (
  id UUID PRIMARY KEY,
  slot_key TEXT UNIQUE NOT NULL,
  slot_name TEXT NOT NULL,
  location_description TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
