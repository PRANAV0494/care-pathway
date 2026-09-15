# Evaluator presentation (10 slides)

File: `synopsis/Phase1_Evaluator_Presentation.pptx`

**How to present:** Open in Microsoft PowerPoint → Slide Show → From Beginning.

- Each slide **fades** in.
- **Click** to reveal the next block (cards, numbers, figure). Do not skip-click too fast on the catalogue and workflow slides.
- Speaker notes are under each slide (View → Notes). Use those if a panel member asks “is this a doctor?” or “where are the numbers?”

Rebuild (from the `Major_Project` folder):

```
node synopsis/presentation/build_evaluator_deck.js
python synopsis/presentation/inject_animations.py synopsis/Phase1_Evaluator_Presentation.pptx synopsis/Phase1_Evaluator_Presentation.pptx
```
