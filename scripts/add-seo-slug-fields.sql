-- =========================================
-- SEO Optimization: Add slug fields for better URL structure
-- =========================================

-- Add slug field to journeys table if it doesn't exist
ALTER TABLE journeys 
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS seo_title TEXT,
ADD COLUMN IF NOT EXISTS seo_description TEXT,
ADD COLUMN IF NOT EXISTS seo_image TEXT,
ADD COLUMN IF NOT EXISTS meta_keywords TEXT[] DEFAULT '{}';

-- Add slug field to destinations table if it doesn't exist
ALTER TABLE destinations
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS seo_title TEXT,
ADD COLUMN IF NOT EXISTS seo_description TEXT,
ADD COLUMN IF NOT EXISTS seo_image TEXT,
ADD COLUMN IF NOT EXISTS meta_keywords TEXT[] DEFAULT '{}';

-- Add slug field to experiences table if it doesn't exist
ALTER TABLE experiences
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS seo_title TEXT,
ADD COLUMN IF NOT EXISTS seo_description TEXT,
ADD COLUMN IF NOT EXISTS seo_image TEXT,
ADD COLUMN IF NOT EXISTS meta_keywords TEXT[] DEFAULT '{}';

-- Add slug field to experiential_stays table if it doesn't exist
ALTER TABLE experiential_stays
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS seo_title TEXT,
ADD COLUMN IF NOT EXISTS seo_description TEXT,
ADD COLUMN IF NOT EXISTS seo_image TEXT,
ADD COLUMN IF NOT EXISTS meta_keywords TEXT[] DEFAULT '{}';

-- Add slug field to packages table (blog posts) if it doesn't exist
ALTER TABLE packages
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS seo_title TEXT,
ADD COLUMN IF NOT EXISTS seo_description TEXT,
ADD COLUMN IF NOT EXISTS seo_image TEXT,
ADD COLUMN IF NOT EXISTS meta_keywords TEXT[] DEFAULT '{}';

-- Create indexes for slug fields for faster lookups
CREATE INDEX IF NOT EXISTS idx_journeys_slug ON journeys(slug);
CREATE INDEX IF NOT EXISTS idx_destinations_slug ON destinations(slug);
CREATE INDEX IF NOT EXISTS idx_experiences_slug ON experiences(slug);
CREATE INDEX IF NOT EXISTS idx_experiential_stays_slug ON experiential_stays(slug);
CREATE INDEX IF NOT EXISTS idx_packages_slug ON packages(slug);

-- Create indexes for SEO fields
CREATE INDEX IF NOT EXISTS idx_journeys_updated_at ON journeys(updated_at);
CREATE INDEX IF NOT EXISTS idx_destinations_updated_at ON destinations(updated_at);
CREATE INDEX IF NOT EXISTS idx_experiences_updated_at ON experiences(updated_at);
CREATE INDEX IF NOT EXISTS idx_experiential_stays_updated_at ON experiential_stays(updated_at);
CREATE INDEX IF NOT EXISTS idx_packages_updated_at ON packages(updated_at);

-- Add canonical_url field to track any overrides
ALTER TABLE journeys ADD COLUMN IF NOT EXISTS canonical_url TEXT;
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS canonical_url TEXT;
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS canonical_url TEXT;
ALTER TABLE experiential_stays ADD COLUMN IF NOT EXISTS canonical_url TEXT;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS canonical_url TEXT;

-- Create a function to generate slugs from titles
CREATE OR REPLACE FUNCTION generate_slug(text_input TEXT) RETURNS TEXT AS $$
BEGIN
  RETURN LOWER(
    TRIM(
      REGEXP_REPLACE(
        REGEXP_REPLACE(text_input, '[^a-zA-Z0-9\s-]', '', 'g'),
        '\s+',
        '-',
        'g'
      ),
      '-'
    )
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Update existing journeys with slugs if they don't have them
UPDATE journeys 
SET slug = generate_slug(title)
WHERE slug IS NULL AND title IS NOT NULL;

-- Update existing destinations with slugs if they don't have them
UPDATE destinations 
SET slug = generate_slug(name)
WHERE slug IS NULL AND name IS NOT NULL;

-- Update existing experiences with slugs if they don't have them
UPDATE experiences 
SET slug = generate_slug(title)
WHERE slug IS NULL AND title IS NOT NULL;

-- Update existing experiential_stays with slugs if they don't have them
UPDATE experiential_stays 
SET slug = generate_slug(name)
WHERE slug IS NULL AND name IS NOT NULL;

-- Update existing packages with slugs if they don't have them
UPDATE packages 
SET slug = generate_slug(title)
WHERE slug IS NULL AND title IS NOT NULL;

-- Add NOT NULL constraint after populating
ALTER TABLE journeys 
ALTER COLUMN slug SET NOT NULL;

ALTER TABLE destinations 
ALTER COLUMN slug SET NOT NULL;

ALTER TABLE experiences 
ALTER COLUMN slug SET NOT NULL;

ALTER TABLE experiential_stays 
ALTER COLUMN slug SET NOT NULL;

ALTER TABLE packages 
ALTER COLUMN slug SET NOT NULL;

-- Create trigger to auto-generate slugs on insert
CREATE OR REPLACE FUNCTION auto_generate_slug_journeys() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL THEN
    NEW.slug := generate_slug(NEW.title);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER journeys_slug_trigger
BEFORE INSERT ON journeys
FOR EACH ROW
EXECUTE FUNCTION auto_generate_slug_journeys();

-- Similar triggers for other tables
CREATE OR REPLACE FUNCTION auto_generate_slug_destinations() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL THEN
    NEW.slug := generate_slug(NEW.name);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER destinations_slug_trigger
BEFORE INSERT ON destinations
FOR EACH ROW
EXECUTE FUNCTION auto_generate_slug_destinations();

CREATE OR REPLACE FUNCTION auto_generate_slug_experiences() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL THEN
    NEW.slug := generate_slug(NEW.title);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER experiences_slug_trigger
BEFORE INSERT ON experiences
FOR EACH ROW
EXECUTE FUNCTION auto_generate_slug_experiences();

CREATE OR REPLACE FUNCTION auto_generate_slug_stays() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL THEN
    NEW.slug := generate_slug(NEW.name);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER stays_slug_trigger
BEFORE INSERT ON experiential_stays
FOR EACH ROW
EXECUTE FUNCTION auto_generate_slug_stays();

CREATE OR REPLACE FUNCTION auto_generate_slug_packages() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL THEN
    NEW.slug := generate_slug(NEW.title);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER packages_slug_trigger
BEFORE INSERT ON packages
FOR EACH ROW
EXECUTE FUNCTION auto_generate_slug_packages();
