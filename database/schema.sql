-- ========================================================================
-- AI Personalized Travel Itinerary Planner - Supabase & PostgreSQL Schema
-- ========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TRIPS / ITINERARIES TABLE
CREATE TABLE IF NOT EXISTS public.trips (
    id VARCHAR(64) PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    destination VARCHAR(128) NOT NULL,
    country VARCHAR(128) NOT NULL,
    title VARCHAR(255) NOT NULL,
    duration_days INTEGER NOT NULL CHECK (duration_days >= 1 AND duration_days <= 30),
    budget_tier VARCHAR(32) NOT NULL,
    travel_style VARCHAR(64) NOT NULL,
    companion_type VARCHAR(64) NOT NULL,
    group_size INTEGER NOT NULL DEFAULT 1 CHECK (group_size >= 1),
    overview_summary TEXT,
    hero_image_url TEXT,
    total_cost_usd NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    cost_per_person_usd NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    data_json JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for high-performance lookup
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON public.trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_destination ON public.trips(destination);
CREATE INDEX IF NOT EXISTS idx_trips_created_at ON public.trips(created_at DESC);

-- 2. NORMALIZED DAYS TABLE (Optional query acceleration)
CREATE TABLE IF NOT EXISTS public.trip_days (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id VARCHAR(64) REFERENCES public.trips(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL,
    theme VARCHAR(255) NOT NULL,
    transportation_tip TEXT,
    daily_budget_usd NUMERIC(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_trip_days_trip ON public.trip_days(trip_id, day_number);

-- 3. ACTIVITIES TABLE
CREATE TABLE IF NOT EXISTS public.trip_activities (
    id VARCHAR(64) PRIMARY KEY,
    trip_id VARCHAR(64) REFERENCES public.trips(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL,
    time_slot VARCHAR(32) NOT NULL,
    title VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    category VARCHAR(64),
    estimated_cost_usd NUMERIC(10, 2) DEFAULT 0.00,
    booking_tip TEXT,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_trip_activities_trip ON public.trip_activities(trip_id);

-- 4. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_activities ENABLE ROW LEVEL SECURITY;

-- Allow public read & write for anonymous demo sessions, or restrict by auth.uid()
CREATE POLICY "Public or authenticated users can manage their trips" 
ON public.trips
FOR ALL 
USING (true)
WITH CHECK (true);

CREATE POLICY "Public or authenticated users can manage trip days" 
ON public.trip_days
FOR ALL 
USING (true)
WITH CHECK (true);

CREATE POLICY "Public or authenticated users can manage trip activities" 
ON public.trip_activities
FOR ALL 
USING (true)
WITH CHECK (true);
