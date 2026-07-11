-- GENERATED FILE. Do not edit by hand. Regenerate: pnpm db:seed:gen
-- Source: src/lib/content/* (first-boot defaults). Loaded by `supabase db reset`.
-- Content is edited in the admin panel and the DB is authoritative; this seed is
-- non-destructive (`on conflict do nothing`) so re-running never clobbers edits.

begin;

insert into public.templates (key, name, emoji, tagline, description, jewish_lens, themes, celebration_ideas, getting_started, provider_types, position) values
  ('into-the-wild', 'Into the Wild', '🌲', 'Your big day belongs outside.', 'This journey happens on trails, rivers, and open sky, not in a classroom. You pick a piece of the natural world to explore, protect, or push yourself into. By the end you know it, and yourself, a whole lot better.', 'There''s an old Jewish idea that we are meant to be caretakers of the earth, not just visitors on it. If that speaks to you, your time outside can be part of that too.', array['nature', 'outdoors', 'environment', 'adventure'], array['An outdoor ceremony at a favorite park, lake, or trailhead that ends with everyone planting something together.', 'A campfire or sunrise gathering where you share what a year outdoors taught you.'], array['Pick one outdoor spot you can reach easily and go visit it with a notebook.', 'Text two friends who would actually show up for a hike or a cleanup and set a date.', 'Find your closest park district or animal shelter online and email to ask what they need.'], array['outdoor educators', 'wilderness guides', 'environmental mentors'], 0),
  ('make-something-real', 'Make Something Real', '🎨', 'Turn an idea into something people can see.', 'This journey is about making: art, music, film, code, a zine, a whole show. You choose what to build, learn the craft, and keep going until it''s finished and out in the world. The point isn''t perfect, it''s real.', 'Jewish tradition has always treated making beautiful things as a kind of devotion, calling it hiddur, the effort to make something ordinary lovely. Your project can carry that spirit if you want it to.', array['creative', 'performance', 'craft', 'building'], array['Turn the celebration into a gallery or premiere night where your work is the main event.', 'A live set you plan and headline: a band, a DJ booth, or a spoken-word stage.'], array['Pick the one medium you already love and set a tiny first deadline, like one piece by Friday.', 'Follow three makers whose work you love and copy one technique to learn it.', 'Ask a local cafe, library, or studio if you can show or perform your work there.'], array['artists', 'performance coaches', 'maker studios'], 1),
  ('make-a-difference', 'Make a Difference', '✊', 'Leave something better than you found it.', 'This journey turns care into action. You find a problem you actually care about, then spend months doing something real about it, not a one-off, a sustained effort. You end up close to the people and place you helped.', 'There''s a Jewish phrase, Tikkun Olam, the idea that the world is unfinished and yours to help repair. This whole journey is basically that idea, if it resonates.', array['service', 'social impact', 'community', 'justice'], array['A give-back party: ask for donations to your cause instead of gifts and show guests the impact.', 'Fold a group service project into the day so everyone leaves having helped.'], array['Name the one thing about the world that makes you angry or sad, and start there.', 'Find one local org already doing that work and ask how a 12 year old can plug in.', 'Set a small real goal this week, like collecting 50 items or raising your first 50 dollars.'], array['service organizations', 'community mentors', 'nonprofit partners'], 2),
  ('mind-and-meaning', 'Mind & Meaning', '📖', 'Chase a question that won''t let you go.', 'This journey is for the ones who love to think. You pick a real question, big, weird, or personal, and dig into it for months like your own private investigation. At the end you don''t just have an answer, you have a point of view.', 'Jewish learning has always prized the question over the easy answer, arguing with the text instead of just accepting it. If you like wrestling with hard ideas, you''re in good company.', array['learning', 'ideas', 'independent study', 'philosophy'], array['A salon evening where you present your findings and take real questions from guests.', 'A printed booklet or website of your research handed to everyone who comes.'], array['Write down the one question you would stay up late reading about and make it your project.', 'Get a library card or one strong source this week and start taking notes.', 'Book one 15 minute interview with someone who knows more than you.'], array['tutors', 'subject mentors', 'independent scholars'], 3),
  ('roots-and-rituals', 'Roots & Rituals', '🕯️', 'Old traditions, entirely on your terms.', 'This journey is for the tradition-curious. You explore the rituals, stories, and recipes your family comes from, and choose which ones feel like yours to keep. Nothing is required, everything is an invitation. You end up with your own version of tradition.', 'A B''Mitzvah has always been a moment of stepping into your own place in a long story. Here you get to decide which threads of that story you want to carry forward, and how.', array['tradition', 'family', 'heritage', 'story'], array['A multi-generation dinner where each generation shares a story or a blessing in their own words.', 'A display of family photos and objects with the story you collected placed next to each one.'], array['Call or sit with one older relative this week and ask them a single question about their childhood.', 'Pick the family recipe you love most and find out who it came from.', 'Start a notes file for every family story you hear so none of them get lost.'], array['culture guides', 'family ritual mentors', 'independent educators'], 4),
  ('my-own-path', 'My Own Path', '✨', 'None of these? Build your own.', 'Same journey, blank canvas. You get the exact structure everyone else gets, the milestones, the mentor, the celebration, but you fill it with whatever you''re actually into. Mash up two ideas, invent a challenge, go somewhere none of the templates go.', 'Becoming B''Mitzvah has always meant taking ownership: standing up and saying this is mine now. Designing your own path from scratch might be the most honest way to do exactly that.', array['custom', 'independent', 'original', 'hybrid'], array['A celebration you fully art-direct, mixing whatever you love: outdoor, music, food, and all.', 'An unveiling where you reveal the custom thing you built and explain why you did it your way.'], array['List five things you love that do not usually go together and look for the overlap.', 'Steal one idea from each of the other journeys and mix them into a shortlist.', 'Give your journey a name only you would pick and write it somewhere you will see it.'], array['generalist mentors', 'project coaches', 'independent guides'], 5)
on conflict (key) do nothing;

insert into public.template_milestones (template, position, title, description) values
  ('into-the-wild', 0, 'Choose Your Wild', 'Pick the landscape or cause that pulls at you, from local trails to the ocean.'),
  ('into-the-wild', 1, 'Learn the Land', 'Study your chosen place until you understand how it actually works.'),
  ('into-the-wild', 2, 'Get Your Hands Dirty', 'Take on a real outdoor challenge or restoration project over several weeks.'),
  ('into-the-wild', 3, 'Go Further', 'Push into something harder: a longer trek, a solo skill, a bigger commitment.'),
  ('into-the-wild', 4, 'Share the View', 'Bring people into what you found and why it matters to you.'),
  ('into-the-wild', 5, 'Celebrate Outside', 'Mark the day in the wild, with everyone who cheered you on.'),
  ('make-something-real', 0, 'Pick Your Medium', 'Choose the thing you want to make and can''t stop thinking about.'),
  ('make-something-real', 1, 'Learn the Craft', 'Find a mentor or method and build the skills the project needs.'),
  ('make-something-real', 2, 'Rough First Draft', 'Make a messy early version so you have something to improve.'),
  ('make-something-real', 3, 'Refine It', 'Rework it again and again until it''s genuinely yours.'),
  ('make-something-real', 4, 'Ready to Show', 'Get the finished piece polished and set up for an audience.'),
  ('make-something-real', 5, 'Opening Night', 'Unveil your work at a showcase built around what you made.'),
  ('make-a-difference', 0, 'Find Your Cause', 'Choose a problem close to you that you refuse to ignore.'),
  ('make-a-difference', 1, 'Learn the Real Story', 'Talk to people living it so you understand what actually helps.'),
  ('make-a-difference', 2, 'Make a Plan', 'Design a commitment you can keep for months, not just a day.'),
  ('make-a-difference', 3, 'Show Up Again', 'Do the work steadily, even when it stops feeling new.'),
  ('make-a-difference', 4, 'See Your Impact', 'Look back at what changed and what you learned doing it.'),
  ('make-a-difference', 5, 'Celebrate Together', 'Mark the day with the community you spent months beside.'),
  ('mind-and-meaning', 0, 'Ask a Big Question', 'Choose a question that genuinely keeps you up at night.'),
  ('mind-and-meaning', 1, 'Gather the Evidence', 'Read, watch, and collect what people already think about your question.'),
  ('mind-and-meaning', 2, 'Go to the Source', 'Interview people or explore places that bring your question to life.'),
  ('mind-and-meaning', 3, 'Form Your View', 'Wrestle with what you found until you actually believe something.'),
  ('mind-and-meaning', 4, 'Make It Make Sense', 'Shape your thinking into a talk, essay, or project others can follow.'),
  ('mind-and-meaning', 5, 'Present and Celebrate', 'Share your idea with a room, then celebrate what your mind built.'),
  ('roots-and-rituals', 0, 'Open the Story', 'Choose the traditions and family history you want to explore.'),
  ('roots-and-rituals', 1, 'Ask Your Elders', 'Talk to family about the rituals, recipes, and memories they carry.'),
  ('roots-and-rituals', 2, 'Try It On', 'Practice a few traditions firsthand to see which ones feel like yours.'),
  ('roots-and-rituals', 3, 'Make It Yours', 'Adapt what you keep so it fits who you actually are.'),
  ('roots-and-rituals', 4, 'Write Your Version', 'Shape your own ceremony, words, or ritual for the day.'),
  ('roots-and-rituals', 5, 'Gather and Celebrate', 'Bring everyone together for the tradition you built yourself.'),
  ('my-own-path', 0, 'Dream It Up', 'Sketch the journey you actually want, even if it fits no box.'),
  ('my-own-path', 1, 'Set Your Challenge', 'Define the real goal you''ll have to stretch to reach.'),
  ('my-own-path', 2, 'Find Your Guide', 'Line up a mentor or resource who fits your particular idea.'),
  ('my-own-path', 3, 'Build the Middle', 'Do the months of real work your challenge demands.'),
  ('my-own-path', 4, 'Pull It Together', 'Shape everything you did into something you can share.'),
  ('my-own-path', 5, 'Celebrate Your Way', 'Mark the day exactly how you imagined it from the start.')
on conflict (template, position) do nothing;

insert into public.activity_prompts (id, template, kind, title, description, position) values
  ('wild-trail-restore', 'into-the-wild', 'do', 'Trail You Restore', 'Adopt a nearby trail and make it your project: clear litter, log the plants and animals you spot, and leave it better than you found it.', 0),
  ('wild-pollinator-patch', 'into-the-wild', 'do', 'Plant A Pollinator Patch', 'Grow a small butterfly and bee garden with native flowers and track who shows up.', 1),
  ('wild-night-under-stars', 'into-the-wild', 'learn', 'One Night Under Stars', 'Plan a supervised overnight campout and learn to build a safe fire and read a trail map.', 2),
  ('wild-grow-and-give', 'into-the-wild', 'give', 'Grow And Give Garden', 'Start a vegetable patch and donate the harvest to a food bank.', 3),
  ('wild-shelter-makeover', 'into-the-wild', 'give', 'Shelter Makeover Day', 'Volunteer at an animal rescue: make pet toys, walk dogs, and help paint an adoption room.', 4),
  ('wild-map-wild-places', 'into-the-wild', 'create', 'Map Your Wild Places', 'Build a photo map of local wild spots and write a short field guide to share.', 5),
  ('wild-cleanup-crew', 'into-the-wild', 'do', 'Cleanup Crew You Lead', 'Organize a beach, river, or park cleanup with friends and weigh what you haul out.', 6),
  ('wild-outdoor-skill', 'into-the-wild', 'learn', 'Learn One Outdoor Skill', 'Pick a real skill like knots, navigation, first aid, or foraging basics, and get good enough to teach it.', 7),
  ('real-art-show', 'make-something-real', 'create', 'Your Own Art Show', 'Make a series of pieces, host a show, sell prints, and give the money to a cause.', 8),
  ('real-record-song', 'make-something-real', 'create', 'Write And Record A Song', 'Write an original song about something you believe in and record it for real.', 9),
  ('real-short-film', 'make-something-real', 'create', 'Short Film You Direct', 'Script, shoot, and edit a short film or mini documentary about your world.', 10),
  ('real-instruments-for-kids', 'make-something-real', 'give', 'Instruments For Kids', 'Collect used instruments and give them to a school music program that needs gear.', 11),
  ('real-design-the-look', 'make-something-real', 'create', 'Design The Whole Look', 'Design your own invitations, logo, and space so the day looks exactly like you.', 12),
  ('real-perform-your-story', 'make-something-real', 'create', 'Perform Your Story', 'Write and perform a monologue, spoken word piece, or short set about becoming who you are.', 13),
  ('real-build-real-thing', 'make-something-real', 'create', 'Build A Real Thing', 'Use wood, code, or fabric to build something useful and give it away, like park benches, an app, or blankets.', 14),
  ('real-craft-workshop', 'make-something-real', 'do', 'Teach A Craft Workshop', 'Run a hands-on craft station and teach younger kids your skill.', 15),
  ('diff-community-fridge', 'make-a-difference', 'give', 'Fill A Community Fridge', 'Organize food drives and keep a local free fridge or pantry stocked.', 16),
  ('diff-bake-fund-cause', 'make-a-difference', 'give', 'Bake To Fund A Cause', 'Run a bake sale or bake-for-change to raise money and attention for something you care about.', 17),
  ('diff-care-packages', 'make-a-difference', 'give', 'Care Packages At Scale', 'Assemble hygiene and comfort kits for shelters or hospitals: toiletries, hats, socks, and small games.', 18),
  ('diff-cheer-squad', 'make-a-difference', 'do', 'Cheer Squad For Hospitals', 'Train to visit sick kids or seniors with games, jokes, and balloon animals.', 19),
  ('diff-run-fundraiser', 'make-a-difference', 'do', 'Run A Real Fundraiser', 'Plan a walk, tournament, or event from start to finish and pick where the money goes.', 20),
  ('diff-glean-rescue-food', 'make-a-difference', 'give', 'Glean And Rescue Food', 'Join a food-rescue crew that harvests extra produce for people who need it.', 21),
  ('diff-pen-pal', 'make-a-difference', 'do', 'Pen Pal With A Purpose', 'Become a pen pal or tech buddy for homebound seniors.', 22),
  ('diff-map-a-problem', 'make-a-difference', 'learn', 'Map A Problem You''d Fix', 'Pick one issue in your town, research it, and pitch a small fix to a local group.', 23),
  ('mind-deep-dive', 'mind-and-meaning', 'learn', 'Deep Dive On One Question', 'Pick a big question you actually wonder about and spend weeks becoming the expert.', 24),
  ('mind-mini-lecture', 'mind-and-meaning', 'learn', 'Teach A Mini Lecture', 'Turn what you learned into a short, fun, TED-style talk.', 25),
  ('mind-podcast-or-zine', 'mind-and-meaning', 'create', 'Start A Podcast Or Zine', 'Interview people and publish what you find out about your topic.', 26),
  ('mind-retell-story', 'mind-and-meaning', 'create', 'Retell An Old Story New', 'Take an old family or culture story and rewrite it with your own meaning.', 27),
  ('mind-working-model', 'mind-and-meaning', 'create', 'Build A Working Model', 'Turn an idea into a real experiment, model, or piece of code that proves your point.', 28),
  ('mind-read-a-theme', 'mind-and-meaning', 'learn', 'Read Across A Whole Theme', 'Read five books or watch five talks on one theme and map how they connect.', 29),
  ('mind-interview-experts', 'mind-and-meaning', 'learn', 'Interview The Experts', 'Find real people who know your topic and interview them for what books leave out.', 30),
  ('mind-write-belief', 'mind-and-meaning', 'create', 'Write What You Believe', 'Write a short essay or manifesto on one value you have thought hard about.', 31),
  ('roots-record-grandparent', 'roots-and-rituals', 'learn', 'Record A Grandparent', 'Interview an older relative on video about their life and save it for the whole family.', 32),
  ('roots-family-cookbook', 'roots-and-rituals', 'create', 'Cook The Family Cookbook', 'Collect recipes passed down in your family and cook a full meal from them.', 33),
  ('roots-family-tree', 'roots-and-rituals', 'learn', 'Build A Family Tree', 'Map your family across countries and faiths and tell the story of how you got here.', 34),
  ('roots-story-behind-object', 'roots-and-rituals', 'learn', 'The Story Behind An Object', 'Find one meaningful family object and record the story attached to it.', 35),
  ('roots-design-ritual', 'roots-and-rituals', 'create', 'Design Your Own Ritual', 'Invent a small ceremony that feels like you, borrowing bits you love: candles, a toast, a walk, a song.', 36),
  ('roots-light-and-share', 'roots-and-rituals', 'do', 'Light And Share Night', 'Host a monthly candle-lit dinner where everyone shares a high and a low from the week.', 37),
  ('roots-memory-book', 'roots-and-rituals', 'create', 'Make A Memory Book', 'Build a scrapbook or photo book of your family''s people, places, and stories.', 38),
  ('roots-where-you-come-from', 'roots-and-rituals', 'learn', 'Learn Where You Come From', 'Pick one side of your family and learn its traditions, language, or holidays.', 39),
  ('path-remix-journeys', 'my-own-path', 'create', 'Remix Two Journeys', 'Take pieces from two different journeys and blend them into one that is only yours.', 40),
  ('path-30-day-challenge', 'my-own-path', 'do', 'The 30 Day Challenge', 'Design a personal challenge, a skill, a streak, or a quest, and document all 30 days.', 41),
  ('path-own-rulebook', 'my-own-path', 'create', 'Build Your Own Rulebook', 'Write your own list of what this milestone means and what you will do to earn it.', 42),
  ('path-sampler-season', 'my-own-path', 'do', 'Try A Sampler Season', 'Try one activity from every other journey and keep the ones that click.', 43),
  ('path-passion-project', 'my-own-path', 'create', 'Passion Into A Project', 'Take the thing you are already obsessed with and turn it into your whole journey.', 44),
  ('path-mentor-collab', 'my-own-path', 'learn', 'Collaborate With A Mentor', 'Find one adult who does something you admire and learn by doing it alongside them.', 45),
  ('path-time-capsule', 'my-own-path', 'create', 'Make A Time Capsule', 'Capture who you are right now in a box or a file to open at 18.', 46),
  ('path-document-journey', 'my-own-path', 'create', 'Document The Whole Thing', 'Vlog, blog, or journal your journey so the process itself is the project.', 47)
on conflict (id) do nothing;

insert into public.providers (key, name, tagline, overview, approach, format, location, price_range, org_type, verified, position) values
  ('wildroots-collective', 'Wildroots Collective', 'B''Mitzvah journeys that happen outside.', 'Wildroots runs season-long outdoor journeys where kids choose a landscape and learn it by living in it. Groups meet on trails, rivers, and campsites through the year, ending with a ceremony under open sky. Everything is built around the natural world, not a building.', 'They believe the outdoors is the best teacher there is, and their guides walk beside kids rather than lecture at them.', 'in-person', 'Bay Area, CA', '$1,200 to $2,800', 'organization', true, 0),
  ('maya-rosen-studio', 'Maya Rosen Studio', 'Help turning your idea into a finished thing.', 'Maya is a working artist and filmmaker who mentors one kid at a time through a single ambitious project. She meets weekly, in person or over video, and takes the work seriously from first sketch to opening night. Kids leave with something real they made and can point to.', 'Maya treats every kid like a real artist with a deadline, warm about the person and honest about the work.', 'hybrid', 'Los Angeles, CA (or video)', '$900 to $2,200', 'independent', true, 1),
  ('groundwork-youth', 'Groundwork Youth', 'Turn what you care about into months of real work.', 'Groundwork pairs kids with local nonprofits for a sustained service commitment built around a cause they choose. Coordinators help design a project that lasts a whole season, not a single afternoon. The journey ends with a celebration that includes the community the kid worked alongside.', 'They are convinced that real change comes from showing up again and again, and they build every journey around that.', 'hybrid', 'Chicago, IL (or video)', '$600 to $1,800', 'organization', true, 2),
  ('jonah-adler-mentoring', 'Jonah Adler Mentoring', 'A thinking partner for your biggest question.', 'Jonah is a former teacher who guides kids through a self-directed study on a question they choose. Over months of weekly video calls, he helps them read widely, argue carefully, and build a point of view. The journey ends in a talk the kid delivers to a real audience.', 'Jonah never hands over answers, he asks better questions until the kid finds their own.', 'virtual', 'Anywhere (video)', '$700 to $1,600', 'independent', true, 3),
  ('open-table-judaism', 'Open Table Judaism', 'Tradition you get to choose, not inherit.', 'Open Table helps families explore Jewish tradition with no expectation of joining or observing. Kids learn the stories, rituals, and meals behind a B''Mitzvah, then build their own version of the day. It''s designed for families who want the roots without the requirements.', 'They lead with invitation over obligation, meeting each family exactly where they already are.', 'hybrid', 'Denver, CO (or video)', '$800 to $2,000', 'organization', true, 4),
  ('north-star-journeys', 'North Star Journeys', 'For the kid whose idea fits no box.', 'North Star is a new outfit built for fully custom journeys, the ones that don''t match any template. A coach helps the kid design a challenge from scratch, find the right guide, and carry it through to a celebration they invent themselves. It''s the newest program in our network and still finding its feet.', 'They start from a blank page every time, treating every kid''s weird, specific idea as the whole point.', 'virtual', 'Anywhere (video)', '$500 to $1,500', 'organization', false, 5)
on conflict (key) do nothing;

insert into public.provider_testimonials (provider_key, position, quote, attribution) values
  ('wildroots-collective', 0, 'Noa came home muddy, exhausted, and more sure of herself than I''ve ever seen her.', 'Rachel, parent of Noa, 13'),
  ('wildroots-collective', 1, 'I didn''t know a trail could teach you that much about yourself.', 'Eli, 12'),
  ('maya-rosen-studio', 0, 'Maya never once made my son feel like a kid playing around. She made him feel like a filmmaker.', 'Daniel, parent of Theo, 12'),
  ('maya-rosen-studio', 1, 'My comic went from a notebook doodle to something people lined up to read.', 'Priya, 13'),
  ('groundwork-youth', 0, 'Our daughter stopped asking what her B''Mitzvah would get her and started asking what she could give.', 'Sofia, parent of Ana, 13'),
  ('groundwork-youth', 1, 'The shelter still asks when I''m coming back. That''s the part that stuck.', 'Marcus, 13'),
  ('jonah-adler-mentoring', 0, 'I watched my kid learn to defend an idea and change his mind in the same conversation.', 'Hana, parent of Sam, 12'),
  ('jonah-adler-mentoring', 1, 'Jonah made me feel like my questions were worth taking seriously.', 'Leah, 13'),
  ('open-table-judaism', 0, 'We''re an interfaith family and always felt like outsiders. Here, nobody asked us to be anything we''re not.', 'Chris, parent of Maya, 12'),
  ('open-table-judaism', 1, 'I got to keep the parts that felt like us and skip the rest. That was the whole point.', 'Zoe, 13'),
  ('north-star-journeys', 0, 'My son''s idea was so specific I didn''t think anyone could help. They just said, okay, let''s build it.', 'Rebecca, parent of Asher, 12'),
  ('north-star-journeys', 1, 'Nobody told me my plan was too weird. They helped me make it work.', 'Devon, 13')
on conflict (provider_key, position) do nothing;

insert into public.provider_templates (provider_key, template, position) values
  ('wildroots-collective', 'into-the-wild', 0),
  ('maya-rosen-studio', 'make-something-real', 0),
  ('groundwork-youth', 'make-a-difference', 0),
  ('jonah-adler-mentoring', 'mind-and-meaning', 0),
  ('open-table-judaism', 'roots-and-rituals', 0),
  ('open-table-judaism', 'my-own-path', 1),
  ('north-star-journeys', 'my-own-path', 0)
on conflict (provider_key, template) do nothing;

insert into public.quiz_questions (id, kind, prompt, helper, pick_exactly, position) values
  ('q1-words', 'words', 'Pick exactly 3 words that feel like you.', 'No overthinking, just go with your gut.', 3, 0),
  ('q2-saturday', 'single', 'It''s a free Saturday with zero plans. What sounds best?', null, null, 1),
  ('q3-trip', 'single', 'Which weekend trip would you say yes to first?', null, null, 2),
  ('q4-lead', 'single', 'Your friend group needs someone to take the lead. You''re most likely to...', null, null, 3),
  ('q5-club', 'single', 'Pick the after-school club you''d actually show up for.', null, null, 4),
  ('q6-wall', 'single', 'There''s a big empty wall and it''s yours. What goes on it?', null, null, 5),
  ('q7-proud', 'single', 'Someone asks what you''re proud of. You''d rather say...', null, null, 6),
  ('q8-rather', 'single', 'Would you rather...', null, null, 7),
  ('q9-story', 'single', 'What story do you want people to tell about your big day?', null, null, 8),
  ('q10-best-part', 'single', 'Last one. When a project is done, the best part is...', null, null, 9)
on conflict (id) do nothing;

insert into public.quiz_options (id, question_id, label, emoji, weights, position) values
  ('q1-adventurous', 'q1-words', 'Adventurous', '🧭', '{"into-the-wild":2}'::jsonb, 0),
  ('q1-wild', 'q1-words', 'Wild', '🌲', '{"into-the-wild":2}'::jsonb, 1),
  ('q1-creative', 'q1-words', 'Creative', '🎨', '{"make-something-real":2}'::jsonb, 2),
  ('q1-funny', 'q1-words', 'Funny', '🎭', '{"make-something-real":1,"my-own-path":1}'::jsonb, 3),
  ('q1-caring', 'q1-words', 'Caring', '💛', '{"make-a-difference":2}'::jsonb, 4),
  ('q1-organized', 'q1-words', 'Organized', '📋', '{"make-a-difference":1,"mind-and-meaning":1}'::jsonb, 5),
  ('q1-curious', 'q1-words', 'Curious', '🔍', '{"mind-and-meaning":2}'::jsonb, 6),
  ('q1-thoughtful', 'q1-words', 'Thoughtful', '🧠', '{"mind-and-meaning":2}'::jsonb, 7),
  ('q1-cozy', 'q1-words', 'Cozy', '🕯️', '{"roots-and-rituals":2}'::jsonb, 8),
  ('q1-loyal', 'q1-words', 'Loyal', '🤝', '{"roots-and-rituals":2}'::jsonb, 9),
  ('q1-dreamer', 'q1-words', 'Dreamer', '☁️', '{"my-own-path":2}'::jsonb, 10),
  ('q1-bold', 'q1-words', 'Bold', '🚀', '{"my-own-path":1,"make-a-difference":1}'::jsonb, 11),
  ('q2-outside', 'q2-saturday', 'Head outside and explore somewhere new', '🥾', '{"into-the-wild":3}'::jsonb, 0),
  ('q2-make', 'q2-saturday', 'Make or build something in your room', '🛠️', '{"make-something-real":3}'::jsonb, 1),
  ('q2-help', 'q2-saturday', 'Do something that helps people you care about', '🤲', '{"make-a-difference":3}'::jsonb, 2),
  ('q2-rabbit-hole', 'q2-saturday', 'Fall down a rabbit hole about something you love', '📚', '{"mind-and-meaning":3}'::jsonb, 3),
  ('q2-cook', 'q2-saturday', 'Cook or bake with family and hear their stories', '🍲', '{"roots-and-rituals":3}'::jsonb, 4),
  ('q2-mix', 'q2-saturday', 'A little of everything, your own mix', '🎛️', '{"my-own-path":3}'::jsonb, 5),
  ('q3-camping', 'q3-trip', 'Camping with a hike and a campfire', '🏕️', '{"into-the-wild":3}'::jsonb, 0),
  ('q3-backstage', 'q3-trip', 'Backstage at a show or a big art museum', '🎨', '{"make-something-real":2,"mind-and-meaning":1}'::jsonb, 1),
  ('q3-volunteering', 'q3-trip', 'A day volunteering you''d feel proud of', '🧡', '{"make-a-difference":3}'::jsonb, 2),
  ('q3-science', 'q3-trip', 'A science center or planetarium', '🔭', '{"mind-and-meaning":3}'::jsonb, 3),
  ('q3-relatives', 'q3-trip', 'Visiting relatives and old family photos', '📸', '{"roots-and-rituals":3}'::jsonb, 4),
  ('q3-plan-own', 'q3-trip', 'You''d rather plan your own trip from scratch', '🗺️', '{"my-own-path":3,"into-the-wild":1}'::jsonb, 5),
  ('q4-organize', 'q4-lead', 'Get everyone organized and moving', '📋', '{"make-a-difference":2,"my-own-path":1}'::jsonb, 0),
  ('q4-idea', 'q4-lead', 'Come up with the wild creative idea', '💡', '{"make-something-real":2,"my-own-path":1}'::jsonb, 1),
  ('q4-research', 'q4-lead', 'Research it so the group knows what they''re doing', '🔍', '{"mind-and-meaning":3}'::jsonb, 2),
  ('q4-include', 'q4-lead', 'Make sure nobody gets left out', '🤝', '{"make-a-difference":3}'::jsonb, 3),
  ('q4-different', 'q4-lead', 'Suggest doing it totally differently than expected', '🌀', '{"my-own-path":3}'::jsonb, 4),
  ('q5-outdoor', 'q5-club', 'Outdoor, hiking, or nature club', '🌲', '{"into-the-wild":3}'::jsonb, 0),
  ('q5-art', 'q5-club', 'Art, music, drama, or maker club', '🎭', '{"make-something-real":3}'::jsonb, 1),
  ('q5-volunteer', 'q5-club', 'Volunteer or community action club', '🌍', '{"make-a-difference":3}'::jsonb, 2),
  ('q5-debate', 'q5-club', 'Debate, quiz bowl, or coding club', '🧠', '{"mind-and-meaning":3}'::jsonb, 3),
  ('q5-food', 'q5-club', 'A club that celebrates food and cultures', '🥟', '{"roots-and-rituals":2,"make-a-difference":1}'::jsonb, 4),
  ('q5-own-club', 'q5-club', 'You''d start your own club', '🚩', '{"my-own-path":3}'::jsonb, 5),
  ('q6-map', 'q6-wall', 'A map of places you want to explore', '🗺️', '{"into-the-wild":3}'::jsonb, 0),
  ('q6-art', 'q6-wall', 'A giant piece of art you made', '🖼️', '{"make-something-real":3}'::jsonb, 1),
  ('q6-causes', 'q6-wall', 'A board of causes you care about', '📌', '{"make-a-difference":3}'::jsonb, 2),
  ('q6-facts', 'q6-wall', 'A wall of facts, questions, and ideas', '🧩', '{"mind-and-meaning":3}'::jsonb, 3),
  ('q6-photos', 'q6-wall', 'Photos of family and people you love', '🖤', '{"roots-and-rituals":3}'::jsonb, 4),
  ('q6-mix', 'q6-wall', 'A mix of all of it, always changing', '🌈', '{"my-own-path":3}'::jsonb, 5),
  ('q7-outdoors', 'q7-proud', 'I pushed myself and did something hard outdoors', '💪', '{"into-the-wild":2,"my-own-path":1}'::jsonb, 0),
  ('q7-made', 'q7-proud', 'I made something people actually loved', '🌟', '{"make-something-real":3}'::jsonb, 1),
  ('q7-better', 'q7-proud', 'I made something better for other people', '💗', '{"make-a-difference":3}'::jsonb, 2),
  ('q7-figured', 'q7-proud', 'I figured out something tricky on my own', '🧠', '{"mind-and-meaning":2,"my-own-path":1}'::jsonb, 3),
  ('q7-tradition', 'q7-proud', 'I kept a family tradition going', '🕯️', '{"roots-and-rituals":3}'::jsonb, 4),
  ('q7-own-way', 'q7-proud', 'I did it my own way, even if it was different', '🦄', '{"my-own-path":3}'::jsonb, 5),
  ('q8-fire', 'q8-rather', 'Learn to build a fire and read a trail', '🔥', '{"into-the-wild":3}'::jsonb, 0),
  ('q8-edit', 'q8-rather', 'Learn to edit video or play a song', '🎬', '{"make-something-real":3}'::jsonb, 1),
  ('q8-event', 'q8-rather', 'Learn to plan an event that raises money for good', '🎟️', '{"make-a-difference":2,"my-own-path":1}'::jsonb, 2),
  ('q8-how', 'q8-rather', 'Learn how something works from the inside out', '⚙️', '{"mind-and-meaning":2,"into-the-wild":1}'::jsonb, 3),
  ('q8-recipe', 'q8-rather', 'Learn a recipe passed down in your family', '🥘', '{"roots-and-rituals":3}'::jsonb, 4),
  ('q8-random', 'q8-rather', 'Learn a bunch of random skills just because', '🎲', '{"my-own-path":3}'::jsonb, 5),
  ('q9-adventurous', 'q9-story', 'The one where you did something adventurous', '🧗', '{"into-the-wild":3}'::jsonb, 0),
  ('q9-unforgettable', 'q9-story', 'The one where you made something unforgettable', '🎆', '{"make-something-real":3}'::jsonb, 1),
  ('q9-difference', 'q9-story', 'The one where you made a real difference', '🌱', '{"make-a-difference":3}'::jsonb, 2),
  ('q9-taught', 'q9-story', 'The one where you taught everyone something new', '🎓', '{"mind-and-meaning":3}'::jsonb, 3),
  ('q9-family', 'q9-story', 'The one that brought your family together', '🫶', '{"roots-and-rituals":3}'::jsonb, 4),
  ('q9-surprise', 'q9-story', 'The one nobody saw coming', '🎇', '{"my-own-path":3}'::jsonb, 5),
  ('q10-outside', 'q10-best-part', 'Being outside and feeling it in your body', '🌄', '{"into-the-wild":2,"my-own-path":1}'::jsonb, 0),
  ('q10-show', 'q10-best-part', 'Showing people the thing you made', '🎨', '{"make-something-real":3}'::jsonb, 1),
  ('q10-helped', 'q10-best-part', 'Knowing you helped someone', '🤗', '{"make-a-difference":3}'::jsonb, 2),
  ('q10-understanding', 'q10-best-part', 'Understanding something you didn''t before', '💭', '{"mind-and-meaning":3}'::jsonb, 3),
  ('q10-table', 'q10-best-part', 'Sharing it around a table with people you love', '🍽️', '{"roots-and-rituals":3}'::jsonb, 4),
  ('q10-your-way', 'q10-best-part', 'Knowing you did it exactly your way', '🛤️', '{"my-own-path":3}'::jsonb, 5)
on conflict (id) do nothing;

insert into public.timeline_options (key, label, helper, position) values
  ('under-6-months', 'In the next 6 months', 'Plenty of time to build something real, let''s get going.', 0),
  ('about-a-year', 'About a year away', 'A great runway, no rush and no cramming.', 1),
  ('more-than-a-year', 'More than a year out', 'Early is a gift, you can dream big and start slow.', 2),
  ('just-exploring', 'Just exploring for now', 'No pressure at all, look around and see what sparks.', 3)
on conflict (key) do nothing;

insert into public.comfort_options (key, label, helper, position) values
  ('cultural', 'Keep it cultural', 'Values, family, and belonging, without the religious parts.', 0),
  ('curious', 'Curious, keep it light', 'Open to a little tradition, as long as it stays optional.', 1),
  ('traditional', 'Some tradition, please', 'Lean into the rituals and roots, on your own terms.', 2)
on conflict (key) do nothing;

insert into public.stories (slug, child_name, age, template, journey_name, story, quote, celebration, position) values
  ('noa-long-way-up', 'Noa Alvarez-Klein', 13, 'into-the-wild', 'The Long Way Up', 'Noa picked a peak she could see from her bedroom window and decided she would climb it by her B''Mitzvah. She spent five months training on smaller trails, learning to read weather and pack light, with a guide who pushed her further than she thought she could go. Two weeks before the summit she rolled an ankle and nearly quit, then rebuilt her plan around a gentler route instead of giving up. On a cold, clear morning she made it to the top.', 'The mountain didn''t get smaller. I just got braver about it.', 'Her family and closest friends hiked to a meadow below the summit and met her there with blankets, food, and her grandmother''s old thermos of tea. Noa read a few words she''d written about the climb while everyone sat in the grass. It felt earned because every person there knew exactly how hard she had worked for the view.', 0),
  ('theo-the-quiet-hour', 'Theo Nakamura', 12, 'make-something-real', 'The Quiet Hour', 'Theo wanted to make a short film about the hour after his parents'' divorce, when the house went silent, which was a lot to take on at twelve. He learned to shoot and edit from a mentor over four months, then scrapped his entire first cut because it felt fake. Rebuilding it from honest footage was harder and slower, but the second version finally felt true. He premiered it to a room that went completely still.', 'I almost made something safe. I''m really glad I didn''t.', 'Theo turned the community center into a tiny cinema: folding chairs, a real screen, a handmade poster on the door. His divorced parents sat in the same row for the first time in a year, and both of them cried. It felt earned because he had told the truth and let everyone he loved see it.', 1),
  ('ana-the-standing-order', 'Ana Okafor-Levy', 13, 'make-a-difference', 'The Standing Order', 'Ana noticed the same families lining up at her local food pantry every week and decided her B''Mitzvah would be about them. For six months she volunteered every Sunday, and when she saw the pantry kept running out of fresh produce, she organized a standing donation from three neighborhood gardens. The hardest part was not the work, it was staying once it stopped feeling exciting. She kept showing up anyway.', 'Helping once is easy. I wanted to be someone they could count on.', 'The celebration was a long shared meal at the pantry, cooked partly from the produce her donations had brought in, with volunteers and families she had come to know by name. There were no speeches about her, just a room full of people eating together. It felt earned because she had spent half a year becoming part of it.', 2),
  ('sam-why-we-forget', 'Sam Whitfield-Cohen', 12, 'mind-and-meaning', 'Why We Forget', 'Sam couldn''t stop wondering why people forget the things that matter most, so he made that his question for the year. He read about memory, interviewed a neuroscientist and his own grandfather, and kept a journal of how his thinking kept flipping. Halfway through he realized his first big theory was wrong and had to start his argument over, which stung. What he built instead was something he actually believed.', 'I spent months getting to an answer, then a better question showed up.', 'Sam gave a fifteen-minute talk in a friend''s living room packed with family and neighbors, and took real questions at the end like a proper lecture. His grandfather, one of the people he had interviewed, sat in the front row. It felt earned because he had genuinely changed his own mind to get there.', 3),
  ('maya-friday-table', 'Maya Delgado-Stern', 13, 'roots-and-rituals', 'The Friday Table', 'Maya''s family never kept many traditions, so she set out to find which ones were actually hers to keep. She spent months cooking with both of her grandmothers, one from Mexico City and one from her dad''s Jewish side, writing down recipes and the stories behind them. The tricky part was blending two heritages that had never really met at the same table. In the end she built a Friday-night ritual that borrowed from both.', 'I didn''t have to choose one side of my family. I got to invite both.', 'For her celebration Maya hosted a Friday dinner she designed herself, candles and challah beside her abuela''s mole, opening the meal with words she had written. Both sides of the family sat together and, for once, nobody felt like a guest. It felt earned because she had built the tradition from scratch instead of inheriting it.', 4),
  ('kai-the-mixtape-map', 'Kai Bergman-Tran', 12, 'my-own-path', 'The Mixtape Map', 'Kai loved two things that did not obviously fit together, music and mapmaking, so he invented a journey to combine them. Over five months he mapped his whole neighborhood by the sound of each block and turned it into an album with a fold-out map. Nobody had a template for it, and there were weeks he was not sure it was a real project at all. Then people started asking to walk the map with the songs in their ears.', 'My idea was too weird to fit a box, so I built my own box.', 'Kai''s celebration was a walking tour: friends and family put in headphones and followed his map through the neighborhood, block by block, song by song, ending at his favorite taco spot. Strangers kept stopping to ask what they were doing. It felt earned because he had made something that genuinely did not exist before he thought of it.', 5)
on conflict (slug) do nothing;

commit;
