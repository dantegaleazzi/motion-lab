# Next experiments — proposed, not implemented

The current release focuses on three image compositions and useful exports. These ideas come from reviewing the [animation leaderboard](https://githublb.vercel.app/topic/animation) and the primary repositories, not from copying their implementation.

| Reference                                                 | Relevant pattern                    | Potential next experiment                                                                |
| --------------------------------------------------------- | ----------------------------------- | ---------------------------------------------------------------------------------------- |
| [Anime.js](https://github.com/juliangarnier/anime)        | Staggering, timelines, easing       | A single Scrub control to inspect any frame, followed by a few curated easing presets    |
| [Motion](https://github.com/motiondivision/motion)        | Gestures, springs, scroll animation | Optional pointer response or scroll-driven motion, and a small React integration example |
| [Animate.css](https://github.com/animate-css/animate.css) | Named, easily reused effects        | A compact preset gallery: Quiet portfolio, Product reveal, Editorial flow                |

Recommended order: **Scrub → preset gallery → pointer/scroll interaction**. Keep the default interface small; place experimental controls in the advanced section. A video/timeline editor, pixel-art tool, or general animation framework would dilute this project's focus, so Manim, Aseprite and HyperFrames are inspiration rather than a scope target.
