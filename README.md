# ElevenLabs Scribe JSON to Custom Timed SRT Tool

A simple tool for converting [ElevenLabs' Scribe](https://elevenlabs.io/blog/meet-scribe) Speech-to-Text JSON transcriptions into SRT subtitle files with custom formatting.

<img width="996" alt="scribe-srt-splitter-example" src="https://github.com/user-attachments/assets/30f73bba-86de-4766-a5b1-3926510bb1b3" />

## Overview

Scribe SRT Splitter allows you to take the detailed JSON transcriptions generated by ElevenLabs' Scribe and convert them into properly formatted SRT subtitle files. The tool gives you complete control over where subtitle breaks and line breaks appear, making it easy to create professional-quality subtitles.

### Wait! Isn't SRT export is already a thing?
Yes! But you have no choice over when it breaks between cards or adds newlines within a card.

Adjusting these after-the-fact is impossible without the per-word timing data in the full JSON export. This tool allows you to set your own new lines and breakpoints between subtitles and make your job timing subtitles far, far easier!

## Features

- **Simple Drag & Drop Interface**: Upload your Scribe JSON files with a simple drag and drop
- **Visual Editing**: Click on words to add formatting:
  - First click: add a new line
  - Second click: create a new subtitle card
  - Third click: to remove formatting
- **Live Preview**: See how your subtitles will look in real-time as you edit
- **Smart Trimming**: Automatically trims overly-long pauses to prevent subtitles from appearing too early or lingering too long
- **Project Saving**: Save your work as project files to continue editing later
- **SRT Export**: Generate SRT files ready for use in video or subtitle editing software
- **Persistent Settings**: Modify behavior of the app with persistent settings

## How to Use
⭐️ Hosted as a GitHub Page at [tie23.github.io/scribe-srt-splitter](https://tie23.github.io/scribe-srt-splitter/)

1. **Upload a Transcript**: Drag and drop your Scribe JSON file onto the upload area
2. **Format Your Subtitles**:
   - Click a word to add a line break after it (highlighted in green)
   - Click a word again to start a new subtitle card after it (highlighted in purple)
   - Click a word a third time to remove any formatting
3. **Review in Preview**: Check the preview panel to see how your subtitles will look
4. **Export Your Work**:
   - Click "Save JSON" to save your project for later editing (just upload again)
   - Click "Export SRT" to generate the final subtitle file

## Technical Details

This tool is built with:
- Next.js
- TypeScript
- Tailwind CSS v4
- [Bun](https://bun.sh/) (A fun, new TypeScript runtime)

It runs entirely in the browser with no server-side processing, making it fast and privacy-friendly. Your transcription data never leaves your computer.

## Local Development

To run this project locally:

```bash
# Clone the repository
git clone https://github.com/tie23/scribe-srt-splitter.git
cd scribe-srt-splitter

# Install dependencies
bun install

# Start development server
bun run dev
```

If you're not _bun curious_, you can just use `npm` or `yarn` and get the same results.

## See Also...
- [ElevenLabs Blog - Meet Scribe](https://elevenlabs.io/blog/meet-scribe)
- [ElevenLabs Docs - Speech to Text](https://elevenlabs.io/docs/capabilities/speech-to-text)
