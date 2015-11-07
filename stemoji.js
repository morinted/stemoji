const fs = require(`fs`);

if (process.argv.length < 3) {
  console.error(`Please provide a path to your dictionary file, to create strokes with.`)
  process.exit(1)
}

const strategy = `emoji_strategy.json`
const dict = process.argv[2]

console.log(`Reading strategy ${strategy}`)
const emojis = JSON.parse(fs.readFileSync(strategy, 'utf8'))
console.log(`Reading dictionary ${dict}`)
const dictionary = JSON.parse(fs.readFileSync(dict, 'utf8'))

if (Object.keys(emojis)
      .some(
        x => x !== emojis[x].shortname.replace(/:/g, '')
      )
   ) {
  console.error(`Error: strategy contains key that is not equal to shortname`)
  process.exit(1)
}

// We replace these emoji.
// For example, there'll be no "thumbsup" emoji,
// Instead, there'll be a "thumbs_up" emoji.
const exceptions =
  { couplekiss: [ 'couple', 'kiss' ]
  , thumbsup: [ 'thumbs', 'up' ]
  , thumbsdown: [ 'thumbs', 'down' ]
  , heartpulse: [ 'heart', 'pulse' ]
  , '8ball': [ '8', 'ball' ]
  , icecream: [ 'ice', 'cream' ]
  , trackball: [ 'track', 'ball' ]
  , crossbones: [ 'cross', 'bones' ]
  , 'e-mail': 'email'
  , paperclip: [ 'paper', 'clip' ]
  , paperclips: [ 'paper', 'clips' ]
  , pushpin: [ 'push', 'pin' ]
  , bullhorn: [ 'bull', 'horn' ]
  , counterclockwise: [ 'counter', 'clockwise' ]
  , keycap: [ 'key', 'cap' ]
  , bangbang: [ 'bang', 'bang' ]
  , bullettrain: [ 'bullet', 'train' ]
  , busstop: [ 'bus', 'stop' ]
  , fuelpump: [ 'fuel', 'pump' ]
  , motorboat: [ 'motor', 'boat' ]
  , cableway: [ 'cable', 'way' ]
  , minidisc: [ 'mini', 'disc' ]
  , minibus: [ 'mini', 'bus' ]
  , contruction: [ 'construction' ]
  , trolleybus: [ 'trolley', 'bus' ]
  , down2: [ 'down', '2' ]
  , hotsprings: [ 'hot', 'springs' ]
  , jp: [ 'japan' ]
  , kr: [ 'korean' ]
  , cn: [ 'china' ]
  , us: [ 'united states' ]
  , gb: [ 'great britain' ]
  , fr: [ 'france' ]
  , es: [ 'spain' ]
  , de: [ 'denmark' ]
  , ru: [ 'russia' ]
  , uk: [ 'united kingdom' ]
  , it: [ 'italy' ]
  }

const doSubstitutes = (emojis) => {
  // Recursively substitute these words in strings
  // Doesn't delete original code.
  const substitutes =
    { "grey": "gray"
    , "exclamation": "!"
    , "heavy_exclamation_mark": "exclamation_2"
    , "heavy_dollar_sign": "$"
    , "heavy_plus_sign": "+"
    , "heavy_division_sign": "\u00F7"
    , "heavy_minus_sign": "-"
    , "africas": "africa"
    , "ok_": "okay"
    , "tophat": "top_hat"
    , "tada": "ta-da"
    }
  return (a, shortname) => {
    let substitute = substitutes[shortname]

    const processSubstitutes = (newShort) => {
      Object.keys(substitutes).forEach(key => {
        if (newShort.includes(key)) {
          substitute = newShort.replace(new RegExp(key, 'g')
                                        , substitutes[key]
                                        )
          if (!a[substitute]) {
            a[substitute] = { ...a[newShort]
                            , shortname: substitute
                            }
            processSubstitutes(substitute)
          }
        }
      })
    }
    a[shortname] = emojis[shortname]
    processSubstitutes(shortname)
    return a
  }
}


let extendedEmojis =
  Object.keys(emojis)
    .reduce(doSubstitutes(emojis), {})

let wordNumber = /^[^\d_]+\d$/
const shortnames =
  Object.keys(extendedEmojis)
    .map(x => {
      let words =
        (x.match(wordNumber) ?
          x.substring(0, x.length - 1) + '_' + x.substring(x.length - 1) :
          x
        )
          .split('_')
          .reduce((p, n) => {
            if (exceptions[n]) {
              return p.concat(exceptions[n])
            }
            return p.concat([n])
          }, [])

      return { shortname: x
             , words
             , unicode: extendedEmojis[x].unicode
                .split('-').reduce((z, y) => {
                  return z + String.fromCodePoint(
                      parseInt(extendedEmojis[x].unicode, 16)
                    )
                }, '')
             }
             
    })

const dictionaryByWord =
  Object.keys(dictionary)
    .reduce((p, n) => {
      let word = dictionary[n].toLowerCase()
      if (!p[word]) {
        p[word] = [ n ]
      } else {
        p[word].push(n)
      }
      return p
    }, {})

let unknownWords = {}
const { valid, invalid } = shortnames
  .reduce((p, n) => {
    if (n.words.every(x => !!dictionaryByWord[x])) {
      p.valid.push(n)
    } else {
      n.words.forEach(x => {
        if (!dictionaryByWord[x]) {
          unknownWords[x] = x
        }
      })
      p.invalid.push(n)
    }
    return p
  }, { valid: [], invalid: [] })


let emojiDictionary =
  valid.reduce((p, n) => {
    // For a given emoji's list of words
    n.words
      // Get all posible entries for each word
      .map(x => dictionaryByWord[x])
      .reduce((arrays, list) => {
        // The build the dictionary for this emoji

        // An array of arrays.
        let combo = []
        // For each word
        list.forEach(word => {
          // for each valid stroke
          arrays.forEach(array => {
            // build up on the previous words
            combo.push(array.concat(word))
          })
        })
        return combo
      }, [ [ "PHOEPBLG" ] ])
      .forEach(solution => {
        p[solution.join('/')] = n.unicode
      })
    return p
  }, {})
emojiDictionary["PHOEPBLG"] = "{#}"
emojiDictionary["AOE/PHOEPBLG"] = "emoji"

console.log(JSON.stringify(Object.keys(unknownWords), null, 2))


console.log(`Successfully processed ${valid.length} emoji`)
console.log(`${invalid.length} emoji contained unknown words (printed above)`)
console.log(`Total number of entries made:`)
console.log(Object.keys(emojiDictionary).length)

const markdownList = `"` +
  Object.keys(valid).reduce
    ( (a, b) =>
        a + `- ${valid[b].unicode}: ${valid[b].words.join(' ')}\\n`
    , ''
    ) + `"`

fs.writeFileSync('emoji.md', markdownList, `utf8`)
fs.writeFileSync('emoji.json', JSON.stringify(emojiDictionary, null, 1), `utf8`)
console.log(`Done.`)
