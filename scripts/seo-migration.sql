-- SEO Migration: Add/Update slug fields and indexes
-- This script optimizes the database for SEO-friendly slug-based URLs

-- =============================================
-- DESTINATIONS TABLE
-- =============================================
-- Check if slug column exists and add if missing
ALTER TABLE public.destinations 
ADD COLUMN IF NOT EXISTS slug varchar(255) UNIQUE;

-- Create an index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_destinations_slug ON public.destinations(slug);

-- Generate slugs for existing destinations that don't have one
-- This uses the generate_slug function if available, otherwise uses a simple transformation
UPDATE public.destinations 
SET slug = LOWER(TRIM(REGEXP_REPLACE(name, '[^\w\s-]', '', 'g')))
WHERE slug IS NULL OR slug = '';

-- Make slug NOT NULL
ALTER TABLE public.destinations
ALTER COLUMN slug SET NOT NULL;

-- =============================================
-- JOURNEYS TABLE  
-- =============================================
-- Check if slug column exists and add if missing
ALTER TABLE public.journeys
ADD COLUMN IF NOT EXISTS slug varchar(255) UNIQUE;

-- Create an index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_journeys_slug ON public.journeys(slug);

-- Generate slugs for existing journeys that don't have one
UPDATE public.journeys
SET slug = LOWER(TRIM(REGEXP_REPLACE(title, '[^\w\s-]', '', 'g')))
WHERE slug IS NULL OR slug = '';

-- Make slug NOT NULL
ALTER TABLE public.journeys
ALTER COLUMN slug SET NOT NULL;

-- =============================================
-- EXPERIENCES TABLE
-- =============================================
-- Experiences will use title-based slugs in the application
-- No database changes needed, but we can add a slug column for consistency

ALTER TABLE public.experiences
ADD COLUMN IF NOT EXISTS slug varchar(255) UNIQUE;

-- Generate slugs for existing experiences
UPDATE public.experiences
SET slug = LOWER(TRIM(REGEXP_REPLACE(title, '[^\w\s-]', '', 'g')))
WHERE slug IS NULL OR slug = '';

-- =============================================
-- EXPERIENTIAL_STAYS TABLE
-- =============================================
-- Experiential stays will use name-based slugs
ALTER TABLE public.experiential_stays
ADD COLUMN IF NOT EXISTS slug varchar(255) UNIQUE;

-- Generate slugs
UPDATE public.experiential_stays
SET slug = LOWER(TRIM(REGEXP_REPLACE(name, '[^\w\s-]', '', 'g')))
WHERE slug IS NULL OR slug = '';

-- =============================================
-- CREATE FUNCTION FOR AUTO-GENERATING SLUGS
-- =============================================
CREATE OR REPLACE FUNCTION generate_slug(text_input text) 
RETURNS text AS $$
BEGIN
  RETURN LOWER(TRIM(REGEXP_REPLACE(text_input, '[^\w\s-]', '', 'g')));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- =============================================
-- CREATE TRIGGERS FOR AUTO-SLUG GENERATION
-- =============================================

-- Trigger for destinations
CREATE OR REPLACE FUNCTION before_destination_insert_slug() 
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_slug(NEW.name);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS destination_slug_trigger ON public.destinations;
CREATE TRIGGER destination_slug_trigger
BEFORE INSERT ON public.destinations
FOR EACH ROW EXECUTE FUNCTION before_destination_insert_slug();

-- Trigger for journeys
CREATE OR REPLACE FUNCTION before_journey_insert_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_slug(NEW.title);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS journey_slug_trigger ON public.journeys;
CREATE TRIGGER journey_slug_trigger
BEFORE INSERT ON public.journeys
FOR EACH ROW EXECUTE FUNCTION before_journey_insert_slug();

-- Trigger for experiences
CREATE OR REPLACE FUNCTION before_experience_insert_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_slug(NEW.title);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS experience_slug_trigger ON public.experiences;
CREATE TRIGGER experience_slug_trigger
BEFORE INSERT ON public.experiences
FOR EACH ROW EXECUTE FUNCTION before_experience_insert_slug();

-- =============================================
-- RESORT_ACTIVITIES TABLE
-- =============================================
ALTER TABLE public.resort_activities
ADD COLUMN IF NOT EXISTS slug varchar(255) UNIQUE;

-- Create an index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_resort_activities_slug ON public.resort_activities(slug);

-- Generate slugs for existing resort_activities
UPDATE public.resort_activities
SET slug = LOWER(TRIM(REGEXP_REPLACE(title, '[^\w\s-]', '', 'g')))
WHERE slug IS NULL OR slug = '';

-- Trigger for resort_activities
CREATE OR REPLACE FUNCTION before_resort_activity_insert_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_slug(NEW.title);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS resort_activity_slug_trigger ON public.resort_activities;
CREATE TRIGGER resort_activity_slug_trigger
BEFORE INSERT ON public.resort_activities
FOR EACH ROW EXECUTE FUNCTION before_resort_activity_insert_slug();

-- =============================================
-- RESORT_PACKAGES TABLE
-- =============================================
ALTER TABLE public.resort_packages
ADD COLUMN IF NOT EXISTS slug varchar(255) UNIQUE;

-- Create an index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_resort_packages_slug ON public.resort_packages(slug);

-- Generate slugs for existing resort_packages
UPDATE public.resort_packages
SET slug = LOWER(TRIM(REGEXP_REPLACE(name, '[^\w\s-]', '', 'g')))
WHERE slug IS NULL OR slug = '';

-- Trigger for resort_packages
CREATE OR REPLACE FUNCTION before_resort_package_insert_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_slug(NEW.name);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS resort_package_slug_trigger ON public.resort_packages;
CREATE TRIGGER resort_package_slug_trigger
BEFORE INSERT ON public.resort_packages
FOR EACH ROW EXECUTE FUNCTION before_resort_package_insert_slug();

-- =============================================
-- EXPERIENTIAL_STAYS TABLE - Enhanced
-- =============================================
ALTER TABLE public.experiential_stays
ADD COLUMN IF NOT EXISTS slug varchar(255) UNIQUE;

-- Create an index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_experiential_stays_slug ON public.experiential_stays(slug);

-- Generate slugs for existing experiential_stays
UPDATE public.experiential_stays
SET slug = LOWER(TRIM(REGEXP_REPLACE(name, '[^\w\s-]', '', 'g')))
WHERE slug IS NULL OR slug = '';

-- Trigger for experiential_stays
CREATE OR REPLACE FUNCTION before_experiential_stay_insert_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_slug(NEW.name);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS experiential_stay_slug_trigger ON public.experiential_stays;
CREATE TRIGGER experiential_stay_slug_trigger
BEFORE INSERT ON public.experiential_stays
FOR EACH ROW EXECUTE FUNCTION before_experiential_stay_insert_slug();

-- =============================================
-- PACKAGES TABLE (Blog Posts)
-- =============================================
ALTER TABLE public.packages
ADD COLUMN IF NOT EXISTS slug varchar(255) UNIQUE;

-- Create an index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_packages_slug ON public.packages(slug);

-- Generate slugs for existing packages/blog posts
UPDATE public.packages
SET slug = LOWER(TRIM(REGEXP_REPLACE(title, '[^\w\s-]', '', 'g')))
WHERE slug IS NULL OR slug = '';

-- Make slug NOT NULL
ALTER TABLE public.packages
ALTER COLUMN slug SET NOT NULL;

-- =============================================
-- VERIFY MIGRATION
-- =============================================
-- Run these queries to verify the migration was successful

SELECT 'Destinations with slugs:' as check_name, COUNT(*) as count FROM public.destinations WHERE slug IS NOT NULL;
SELECT 'Journeys with slugs:' as check_name, COUNT(*) as count FROM public.journeys WHERE slug IS NOT NULL;
SELECT 'Experiences with slugs:' as check_name, COUNT(*) as count FROM public.experiences WHERE slug IS NOT NULL;
SELECT 'Resort Activities with slugs:' as check_name, COUNT(*) as count FROM public.resort_activities WHERE slug IS NOT NULL;
SELECT 'Resort Packages with slugs:' as check_name, COUNT(*) as count FROM public.resort_packages WHERE slug IS NOT NULL;
SELECT 'Experiential Stays with slugs:' as check_name, COUNT(*) as count FROM public.experiential_stays WHERE slug IS NOT NULL;
SELECT 'Blog Posts (Packages) with slugs:' as check_name, COUNT(*) as count FROM public.packages WHERE slug IS NOT NULL;
