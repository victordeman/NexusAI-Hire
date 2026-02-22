-- Supabase Schema for NexusAI Hire

-- Create interviews table to persist interview history and metrics
CREATE TABLE IF NOT EXISTS public.interviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    history JSONB DEFAULT '[]'::jsonb,
    trust_score INTEGER DEFAULT 90,
    model_used TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create sessions table for managing active recruitment sessions
CREATE TABLE IF NOT EXISTS public.sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    session_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for interviews
CREATE POLICY "Users can view their own interviews" 
ON public.interviews FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own interviews" 
ON public.interviews FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own interviews" 
ON public.interviews FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS Policies for sessions
CREATE POLICY "Users can manage their own sessions" 
ON public.sessions FOR ALL 
USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_interviews_updated_at 
BEFORE UPDATE ON public.interviews 
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at 
BEFORE UPDATE ON public.sessions 
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
