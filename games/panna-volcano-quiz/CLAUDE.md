# CLAUDE.md — Panna's Volcano Quiz

## What this is
A kids' quiz game (single `index.html`, no build step, no dependencies except the Google Font "Mitr").
Designed by Panna (อนุบาล 3, โรงเรียนเด่นหล้าพระราม 5) to practise for the end-of-term-1 exam, 9–10 Sep 2569.

## Game rules (Panna's design — do not change without asking)
- A round is 10 questions, 3 hearts.
- Lava rises inside the volcano while a question is open (`q.time` seconds, default 20). Full → eruption → −1 heart, question counts as missed, move on.
- Correct → +1 ⭐, +1 ❤️ (max 3), lava resets to 0.
- Wrong → no star, no heart lost, lava does NOT reset (next question starts with the current lava level).
- 0 hearts → round ends early.

## Language rule
Questions and UI are in Thai. Only the **English** subject (`SUBJECTS.english`) has English prompts and options.

## Exam content the subjects map to
- คิดคำนวณ: บวก(มีทด)-ลบ(ขอยืม) 2–3 หลัก (2 หลัก 80% / 3 หลัก 20% — Panna is a beginner), โจทย์ปัญหาบวก-ลบ, หาค่าตัวกลาง, ประโยคสัญลักษณ์
- ภาษาไทย: สระลดรูป/เปลี่ยนรูป, คำตรงข้าม / ลักษณนาม, อ่านเรื่องสั้นตอบคำถาม, เรียงประโยค, แต่งประโยค, คำ ห นำ
- English: food & drink, objects, feelings, vegetables & fruit, family
- เชาวน์ปัญญา: รูปร่างรูปทรงเรขาคณิต, เข้าพวก/ไม่เข้าพวก, จับคู่สิ่งของ/การกระทำที่สัมพันธ์กัน
- ความรู้ทั่วไป: บุคคล, กิจวัตรประจำวัน, สุขนิสัยที่ดี, สถานที่

## Adding a question type
1. Write a generator `const foo = () => mc(prompt, correctOption, [wrong1, wrong2, wrong3], extra)`.
   - Options are `T('text')`, `E('🍎', 'label')` (emoji, optional label) or `{ svg }`.
   - `extra` may set `media: { emoji }` / `media: { svg }`, `story: 'ข้อความ'`, `big: true` (large numeric prompt), `time: seconds`.
   - `mc` shuffles the options and records the answer index; keep exactly 3 wrongs, all distinct from the answer.
   - For a guided, multi-step question use `guided([mc(...), mc(...)])`. Each step is a normal `mc` question and may carry `hint: 'text'` (shown in a soft box under the prompt, HTML allowed). Only the last step earns the star; a right intermediate step resets the lava, a wrong one shows the answer and moves on with the lava still rising. Math uses this: word problems ask บวก/ลบ first, carry/borrow sums ask the units digit first.
2. Add it to the `gens` array of the right entry in `SUBJECTS`.
3. Questions are de-duplicated per round by prompt text; generators with random numbers are fine.

## Code style
- `const` over `let`; early returns instead of nested `if`.
- Keep it a single file; no frameworks. Test by opening `index.html` (Playwright smoke test: click through 10 questions per subject and check for page errors).
