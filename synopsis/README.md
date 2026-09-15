# Nirnaya-112 — GEU Phase-1 synopsis

This folder holds the Graphic Era University **Phase-1 major-project synopsis** (proposal only; no implementation yet).

## Files to submit

| File | Use |
|---|---|
| `Nirnaya-112_GEU_Phase1_Synopsis.docx` | Edit names, then print / export |
| `Nirnaya-112_GEU_Phase1_Synopsis.pdf` | Quick preview / PDF submission |

## Fill the cover before printing

Edit `COVER_FIELDS.js`:

- student names and `GE-` enrolment numbers
- guide name and designation (currently **Mr. Narayan**, Assistant Professor)
- project team ID (currently `MP2026CSE__`)
- add or remove rows in `students` if the team is not three people

Then from the `Major_Project` folder:

```
node synopsis/generate_synopsis.js
```

Open the new `.docx` in Word and Save As PDF if you need a fresh PDF.

Do **not** claim experimental accuracy numbers in this synopsis. Those come after implementation.
