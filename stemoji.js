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

// List of exceptions to the emoji naming scheme
// that I expect.
const exceptions =
  { couplekiss: [ 'couple', 'kiss' ]
  , thumbsup: [ 'thumbs', 'up' ]
  , thumbsdown: [ 'thumbs', 'down' ]
  , heartpulse: [ 'heart', 'pulse' ]
  , tophat: [ 'top', 'hat' ]
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
  , tada: [ 'ta-da' ]
  , minidisc: [ 'mini', 'disc' ]
  , minibus: [ 'mini', 'bus' ]
  , contruction: [ 'construction' ]
  , trolleybus: [ 'trolley', 'bus' ]
  , down2: [ 'down', '2' ]
  , hotsprings: [ 'hot', 'springs' ]
  }

let wordNumber = /^[^\d_]+\d$/
const shortnames =
  Object.keys(emojis)
    .filter(x => !emojis[x].shortname.includes('flag'))
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
             , unicode: String.fromCodePoint(parseInt(emojis[x].unicode, 16))
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
        // The build the dictionary for this
        // emoji

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

console.log(JSON.stringify(Object.keys(unknownWords), null, 2))


console.log(`Successfully processed ${valid.length} emoji`)
console.log(`${invalid.length} emoji contained unknown words (printed above)`)
console.log(`Total number of entries made:`)
console.log(Object.keys(emojiDictionary).length)

const markdownList =
  Object.keys(valid).reduce
    ( (a, b) =>
        a + `\\n- ${valid[b].unicode}: ${valid[b].words.join(' ')}`
    , ''
    )

fs.writeFileSync('emoji.md', markdownList, `utf8`)
fs.writeFileSync('emoji.json', JSON.stringify(emojiDictionary, null, 1), `utf8`)
console.log(`Done.`)
