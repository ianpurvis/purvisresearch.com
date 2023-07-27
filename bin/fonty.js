#!/usr/bin/env node
import { error } from 'node:console'
import { argv } from 'node:process'
import { readFile, writeFile } from 'node:fs/promises'
import { Font, parse } from 'opentype.js'
import { toWoff } from 'woff-tools'

// Add ligature substituting colon + space with underscore
function addDiscretionaryLigature(font) {
  const { index: colon } = font.charToGlyph(':')
  const { index: space } = font.charToGlyph(' ')
  const { index: underscore } = font.charToGlyph('_')
  const ligature = { sub: [ colon, space ], by: underscore }
  font.substitution.add('dlig', ligature)
}

// Add salt feature substituting space with underscore:
function addSalt(font) {
  const { index: space } = font.charToGlyph(' ')
  const { index: underscore } = font.charToGlyph('_')
  const substitution = { sub: space, by: underscore }
  font.substitution.add('salt', substitution)
}

function clone(font, options = {}) {
  const {
    names: {
      fontFamily: {
        en: familyName
      },
    },
    ...props
  } = font
  const glyphs = Object.values(font.glyphs.glyphs)

  return new Font({
    ...props,
    familyName,
    glyphs,
    ...options
  })
}

function nameReplace(font, pattern, replacement) {
  for (const name of Object.values(font.names)) {
    name.en = name.en.replace(pattern, replacement)
  }
}

async function main({ argv }) {

  const [
    inputPath,
    outputPath
  ] = argv.slice(2)

  const inputData = await readFile(inputPath)
  const inputFont = parse(inputData.buffer)

  // const outputFont = clone(inputFont, { styleName: 'Snake' })
  const outputFont = inputFont
  addDiscretionaryLigature(outputFont)
  addSalt(outputFont)
  outputFont.validate()

  const prevStyle = outputFont.names.fontSubfamily.en
  const nextStyle = 'Snake'
  nameReplace(outputFont, prevStyle, nextStyle)

  let outputData = Buffer.from(outputFont.toArrayBuffer())
  if (outputPath.endsWith('.woff')) {
    outputData = toWoff(outputData)
  }
  await writeFile(outputPath, outputData)
}


main({ argv }).catch(error)
