-- Create meal plans table for menu management
CREATE TABLE public.meal_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price TEXT NOT NULL,
  description TEXT NOT NULL,
  breakfast TEXT[] NOT NULL DEFAULT '{}',
  lunch TEXT[] NOT NULL DEFAULT '{}',
  dinner TEXT[] NOT NULL DEFAULT '{}',
  badge TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create resort packages table
CREATE TABLE public.resort_packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  duration TEXT NOT NULL,
  price TEXT NOT NULL,
  original_price TEXT NOT NULL,
  description TEXT NOT NULL,
  includes TEXT[] NOT NULL DEFAULT '{}',
  features TEXT[] NOT NULL DEFAULT '{}',
  badge TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create resort activities table
CREATE TABLE public.resort_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  full_description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Mountain',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create gallery images table for resort
CREATE TABLE public.resort_gallery (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resort_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resort_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resort_gallery ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Anyone can view
CREATE POLICY "Anyone can view meal plans"
ON public.meal_plans
FOR SELECT
USING (true);

CREATE POLICY "Anyone can view resort packages"
ON public.resort_packages
FOR SELECT
USING (true);

CREATE POLICY "Anyone can view resort activities"
ON public.resort_activities
FOR SELECT
USING (true);

CREATE POLICY "Anyone can view gallery"
ON public.resort_gallery
FOR SELECT
USING (true);

-- RLS Policies - Only admins can manage
CREATE POLICY "Admins can manage meal plans"
ON public.meal_plans
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage resort packages"
ON public.resort_packages
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage resort activities"
ON public.resort_activities
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage gallery"
ON public.resort_gallery
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));
