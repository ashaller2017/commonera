

|    COMMON ERA × VIBE CODING SPRINT  COSMIC CALENDAR   *The Astrology App, Re-imagined*   Product Requirements Document   *Working title · Universal entry via lunar wisdom · Jewish calendar as the hidden system* |
| :---- |

 

| 1  TL;DR |
| :---- |

 

| One-liner | A lunar wisdom app that tells you what this season holds for you — through reflection cards, seasonal archetypes, and tiny rituals. The system underneath is the Jewish calendar. |
| :---- | :---- |

 

| The problem | Millions of people use astrology, tarot, and lunar cycle apps to make sense of their emotional lives. They check Co-Star before decisions, track full moons, and follow seasonal rituals — not because they believe in it literally, but because the structure helps. Jews have had a sophisticated system for reading time, seasons, and cosmic meaning for 3,000 years. It's embedded in the Hebrew calendar — 12 months, each with a zodiac sign, a tribe, a letter, a sense, an energy, and a lesson. Even most Jewish people don't know it exists. |
| :---- | :---- |

 

| The solution | A Chani / Co-Star alternative rooted in the Jewish calendar. It reads the current Hebrew month and returns a season reading — the month's energy, what it's calling for, a tiny ritual to try, and the ancient Jewish root behind all of it. Built around three natural return moments: a monthly Season Reading, a weekly Friday Pulse (rooted in Shabbat as a weekly reset), and a mid-month full moon card. The app isn't a one-time read — it's something you come back to. |
| :---- | :---- |

 

| Sprint deliverable | A working prototype with: (1) the current Season Reading — beautiful, readable, shareable; (2) a birthday reading / birth profile — enter your birthday, get your Hebrew birth date, sign, tribe, moon phase, Hebrew letter, and a personalized reading; and (3) a 'what's coming up' panel surfacing the Friday Pulse and upcoming moon moments. There will be discoverable context explaining the Kabbalistic tradition behind the system for curious users.  |
| :---- | :---- |

 

| 2  CE MISSION FIT |
| :---- |

 

| Who it serves | Culturally Jewish millennials and Gen Z who are into astrology, wellness, or lunar practices — but have never encountered the Jewish calendar as a living wisdom tradition. They follow the full moon. They don't know their Hebrew birth month. Secondary: spiritually curious non-Jews who discover Jewish wisdom through the lunar/cosmic entry point. |
| :---- | :---- |

 

| Jewish lens | The app leads with 'what does this season hold?' The Jewish layer surfaces as a discovery, not a requirement. Users who want to go deeper can. Users who just want the ritual are fully served. Rooted in Kabbalistic tradition: each Hebrew month has a zodiac sign (mazal), a tribe, a Hebrew letter, a sense, and a characteristic energy. The foundation is the Sefer Yetzirah (Book of Formation), one of the oldest Jewish mystical texts, which assigns the 22 Hebrew letters to the constellations, planets, and months — creating a cosmic system that's ancient, rigorous, and almost entirely unknown outside observant circles. The personal layer of the app is a Kabbalistic birth profile — enter your birthday, get your Hebrew birth date, and see your birth month's sign, tribe, Hebrew letter, moon phase at birth, and a tikkun framing. The same system that powers the season reading, made personal. |
| :---- | :---- |

 

| 3  THE USER |
| :---- |

 

| PRIMARY USER | WHAT SUCCESS LOOKS LIKE |
| :---- | :---- |
| Noa, 22\. Half Jewish; feels vaguely connected to her Jewish identity but isn't sure how to engage with it. Checks Co-Star and Chani once in a while and finds it resonant. Shares quotes with friends. Into moon cycles and seasonal rituals. Doesn't know her Hebrew birth month. Wouldn't describe herself as 'into Judaism' but is curious. Wants something beautiful to consult that gives her a sense of what this moment is calling for — ideally something that connects to her heritage without feeling religious. | Noa opens the app, gets her Season Reading, and thinks: 'this is exactly where I am right now.' She finds out the reading is rooted in a 3,000-year-old Jewish system. That makes it more interesting, not off-putting. She screenshots the Season Card and sends it to a friend. She comes back on Friday for the Friday Pulse. She didn't know Shabbat was a thing she'd ever care about. She starts thinking of herself as someone who uses this calendar — and feels more connected to her Jewish identity as a result. |

 

| 4  GOALS & NON-GOALS |
| :---- |

 

| MUST HAVE | NICE TO HAVE | NOT THIS SPRINT |
| :---- | :---- | :---- |
| Season Reading for the current Hebrew month — auto-detected Month has: energy/archetype, tiny ritual, Jewish root revealed Reading is beautiful, readable, shareable — card format Works for someone who has never heard of the Hebrew calendar Birthday reading / birth profile: enter birthday → Hebrew date, sign, tribe, moon phase, tikkun framing, Hebrew letter, personalized reading "What's coming up" panel: Friday Pulse teaser \+ full/new moon dates when relevant — bakes in the return cadence without requiring those features to be fully built No login required to get value | Friday Pulse — weekly card as its own full experience (rooted in Shabbat, named universally) Full/new moon cards as their own full experiences Browse all 12 months with sign, tribe, energy, and ritual for each | Full planetary Mazal chart mapped to Sefirot — requires astronomy API; strong v2 direction Full Jewish holiday calendar Time zones — too complex for sprint Torah or religious content — stay wisdom, not observance Social or community features Prediction or fate-telling — tone is invitation, not fortune Login / user accounts |

 

| 5  THE 12 HEBREW MONTHS — MVP CONTENT MAP |
| :---- |

 

| SPRINT NOTE · Reference content — starting point, not a locked spec *Only the current month needs to be fully functional for the sprint. Use AI to generate or expand readings. Riff on tone and framing. The table below is groundwork, not gospel. NOTE FOR CE · Please review month attributions (zodiac signs, energies, archetypes) for accuracy. Drawn from Kabbalistic tradition / Sefer Yetzirah — but sources vary and we'd love your preferred references.* |
| :---- |

 

| Month | Sign | Energy / what this season calls for | Tiny ritual / micro-practice |
| :---- | :---- | :---- | :---- |
| **Tishrei** *Sep–Oct* | Libra ♎ | New beginnings, judgment, balance. The cosmic new year — a reset you didn't know you needed. | Write one thing you're releasing and one thing you're calling in. Say it aloud. |
| **Cheshvan** *Oct–Nov* | Scorpio ♏ | The month with no holidays. Quiet, depth, shadow work. A time to go inward after the noise of Tishrei. | Spend 10 minutes in silence. No phone. Notice what surfaces. |
| **Kislev** *Nov–Dec* | Sagittarius ♐ | Dreams, fire, expansion. The month of Hanukkah — light kindled in the darkest season. | Light a candle in the dark. Sit with it for one minute before lighting any screens. |
| **Tevet** *Dec–Jan* | Capricorn ♑ | Discipline, contraction, resilience. The darkest month — when commitment matters more than inspiration. | Commit to one small daily practice this week and actually do it. No motivation required. |
| **Shevat** *Jan–Feb* | Aquarius ♒ | Renewal, sap rising, vision. Tu B'Shevat — the new year of the trees. Something is thawing. | Eat a piece of fruit slowly and intentionally. Think about what you're growing this year. |
| **Adar** *Feb–Mar* | Pisces ♓ | Joy, laughter, reversal. Purim lives here — the month when the expected order gets flipped. | Do something spontaneous and slightly silly. Joy is a practice, not a feeling that arrives. |
| **Nisan** *Mar–Apr* | Aries ♈ | Freedom, liberation, new beginnings. Passover — the original exodus energy. Leave something behind. | Identify one thing you've been carrying that isn't yours anymore. Name it. Set it down. |
| **Iyar** *Apr–May* | Taurus ♉ | Healing, integration, the journey between freedom and revelation. 49 days of counting the Omer. | Count something meaningful this week — steps toward a goal, moments of gratitude, hours of rest. |
| **Sivan** *May–Jun* | Gemini ♊ | Revelation, wisdom, the mountain. Shavuot lives here — the moment of receiving Torah, of being given something. | Read something that changes your mind about something small. Let it. |
| **Tammuz** *Jun–Jul* | Cancer ♋ | Vision, sight, the danger of looking away. A time for honest seeing — of yourself and the world. | Look directly at one thing you've been avoiding. Write one sentence about what you see. |
| **Av** *Jul–Aug* | Leo ♌ | Grief, destruction, and the seed of rebuilding. The lowest point — and the place transformation begins. | Grieve something. Let yourself feel a loss fully for five minutes. Then notice what remains. |
| **Elul** *Aug–Sep* | Virgo ♍ | Return, reflection, preparation. The month before the new year — a 30-day invitation to look back and prepare. | Write one honest question you're bringing into the new year. Carry it without answering it yet. |

 

| 6  CORE FLOW |
| :---- |

 

| SPRINT SCOPE · Steps 1–4 are must-have. Step 5 is nice to have — expect it to get built, not just hoped for. *The core experience is steps 1–4: land, get the season reading, get your personal birth profile, see what's coming. Step 5 (Friday Pulse, moon cards, browse) fills the sprint's second day and rounds out the return mechanic.* |
| :---- |

 

| 1 | Landing | Suggested hook: "What does this season hold?" — universal, no Hebrew in sight. One tap, no login. Dark, warm, cosmic — premium, mystical wellness app. |
| :---: | :---- | :---- |
| **2** | **Season Reading (monthly · core build)** | Auto-detects the current Hebrew month. No input required. Card elements: month name (English first, Hebrew secondary) · archetype/energy in poetic language · zodiac sign \+ current moon phase · one tiny ritual. Should be beautiful enough to screenshot and share — that's the distribution mechanic. Somewhere in this experience, curious users should be able to discover the Kabbalistic grounding — what this system is, where it comes from. How that's surfaced is up to the builder (e.g. a tappable info layer, an about section). |
| **3** | **Birthday reading / birth profile (core build)** | One input: your birthday. The app converts it to your Hebrew birth date (hebcal npm handles this) and generates your personal birth profile. Profile elements: your Hebrew birth month, zodiac sign, tribal alignment, moon phase at birth, Hebrew letter, and a tikkun framing — 'what your soul came here to work on.' Personalized reading in the same tone as the season card. This is what makes it yours — the season reading is shared, the birth profile is personal. Both together is the full experience. |
| **4** | **"What's coming up" panel (core build)** | A living panel below the season reading — makes the app feel like a calendar you return to, not a one-time read. Friday Pulse: shows a countdown ('Friday Pulse arrives in 3 days') or the card itself if today is Friday. Rooted in Shabbat as a weekly reset; named universally. Moon moments: shows the next full moon or new moon date and a brief note when one is coming within 7 days. ('Full moon in 2 days — the light is at its peak in Tammuz.') Doesn't need Friday Pulse or moon cards to be fully built — even a mostly static panel communicates the cadence and gives CE something to react to. |
| **5** | **\[Optional / nice to have\] Friday Pulse \+ Moon cards \+ Browse**  | Friday Pulse as a full card: 2 sentences on the week's energy · one thing to release · one thing to carry into rest. Specific to the current month. Example in Av: 'What are you grieving? Release it. Carry the seed of what comes next.' Full/new moon cards as their own moment — brief, beautiful, specific to the month's energy. Browse all 12 months: the sign, tribe, Hebrew letter, energy, and ritual for each. Lets users explore and find their birth month without the personalized flow. |

 

| 7  AI & CONTENT DIRECTION |
| :---- |

 

| AI SHOULD | AI SHOULD NOT |
| :---- | :---- |
| Generate month energy descriptions in poetic, grounded language — not academic, not preachy, not generic horoscope-speak | Predict or make fate claims — tone is "this season invites…" not "this month you will…" |
| Generate the Kabbalistic grounding text — 2-3 sentences making the Jewish calendar root feel surprising and interesting, not like a Wikipedia article. This is for wherever the builder surfaces the discovery layer. | Lead with the Jewish framing — it should feel discoverable, not declared |
| Generate rituals that are specific and small enough to actually do today | Sound religious or observance-focused — wisdom tone, not synagogue tone |
| Adapt Friday Pulse content to the current month's energy | Be vague or generic — every reading should feel specific to this month, not reusable across months |

 

| 8  VISUAL VIBE |
| :---- |

 

| Tone | Mystical · Still · Intelligent. The app should feel like something you consult rather than something you use. Warm, dark, and slightly spiritual — not religious, not spooky. |
| :---- | :---- |

 

| Reference points | Chani (depth, seriousness, premium feel), The Pattern (introspective, data-forward), Co-Star (minimal, cosmic), Headspace (calm, habitual). Aesthetically: Costar meets a premium tarot deck meets a beautifully designed journal. |
| :---- | :---- |

 

| Visual guidelines (not rules — vibe coders have latitude here) | Dark base — deep indigo is the suggestion, but dark navy or near-black works too. Night sky energy, not institutional blue. Warm accent — gold or amber. The season card, ritual highlights, the reveal moment. Warm, earned, ancient. Moon or stars as a motif — functional, not just decorative. The current moon phase ideally appears somewhere on the reading. Hebrew letters as typographic elements — beautiful, large, confident. The letter associated with the month. Not a translation tool. No explicit Jewish symbols in the primary UI (no Star of David, no menorahs). The Jewish layer is textual and discoverable. Season cards should be shareable — beautiful on an Instagram story. That's the distribution mechanic. |
| :---- | :---- |

 

| 9  SUCCESS CRITERIA |
| :---- |

 

| \# | What we test | Target |
| :---: | :---- | :---- |
| **1** | A user with no knowledge of the Hebrew calendar gets a meaningful reading in under 60 seconds | Zero friction — no login, no form, no setup |
| **2** | The Jewish layer lands as a discovery, not a requirement | Qualitative: users describe the reveal as 'interesting' or 'surprising' — not off-putting or unexpected |
| **3** | The Season Card is beautiful enough to share unprompted | At least 1 in 5 test users says they'd send it to a friend |
| **4** | The tiny ritual is specific enough to actually do | Users can describe exactly what they'd do. No reading ends with 'reflect on your values.' |
| **5** | The 'what's coming up' panel communicates that this is a return-worthy app, not a one-time read | CE can see the weekly and monthly cadence clearly — even if Friday Pulse isn't fully built |
| **6** | A culturally Jewish user feels like this app was made for them | Qualitative: Noa-type users describe the Jewish calendar layer as 'cool' or 'something I want to know more about' |
| **7** | The birthday reading feels personal, not generic — someone can see themselves in their birth profile | Qualitative: users say the birth month reading resonates, not just that it's accurate |

 