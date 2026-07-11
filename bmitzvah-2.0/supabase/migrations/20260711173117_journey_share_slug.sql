ALTER TABLE public.journeys ADD COLUMN share_slug text;
ALTER TABLE public.journeys ADD CONSTRAINT journeys_share_slug_key UNIQUE (share_slug);
