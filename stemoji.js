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
  , ok: [ 'okay' ]
  , hotsprings: [ 'hot', 'springs' ]
  , jp: [ 'japan' ]
  , kr: [ 'korean' ]
  , cn: [ 'china' ]
  , us: [ 'united states' ]
  , fr: [ 'france' ]
  , es: [ 'spain' ]
  , de: [ 'denmark' ]
  , ru: [ 'russia' ]
  , uk: [ 'united kingdom' ]
  , it: [ 'italy' ]
  , ca: [ 'canada' ]
  , tone1: [ 'tone', '1' ]
  , tone2: [ 'tone', '2' ]
  , tone3: [ 'tone', '3' ]
  , tone4: [ 'tone', '4' ]
  , tone5: [ 'tone', '5' ]
  }

const doSubstitutes = (emojis) => {
  // Recursively substitute these words in strings
  // Doesn't delete original code.
  const substitutes =
    { 'grey': 'gray'
    , 'exclamation': '!'
    , 'question': '?'
    , 'heavy_exclamation_mark': 'exclamation_2'
    , 'heavy_dollar_sign': '$'
    , 'heavy_plus_sign': '+'
    , 'heavy_division_sign': '\u00F7'
    , 'heavy_minus_sign': '-'
    , 'hotdog': 'hot_dog'
    , 'biohazard': 'bio_hazard'
    , 'vs': 'versus'
    , 'interrobang': 'exclamation_question'
    , 'bangbang': '!_!'
    , 'heavy_multiplication_x': 'times'
    , 'africas': 'africa'
    , 'tophat': 'top_hat'
    , 'tada': 'ta-da'
    , 'mwgb': 'm_w_g_b'
    , 'mwbb': 'm_w_b_b'
    , 'mwgg': 'm_w_g_g'
    , 'mmgb': 'm_m_g_b'
    , 'mmbb': 'm_m_b_b'
    , 'mmgg': 'm_m_g_g'
    , 'wwbb': 'w_w_b_b'
    , 'wwgg': 'w_w_g_g'
    , 'wwgb': 'w_w_g_b'
    , 'wwb': 'w_w_b'
    , 'mwg': 'm_w_g'
    , 'wwg': 'w_w_g'
    , 'mmb': 'm_m_b'
    , 'mmg': 'm_m_g'
    , 'ww': 'w_w'
    , 'mm': 'm_m'
    , 'vulcan': 'spock'
    , 'flag_gb': 'flag_great britain'
    , 'flag_ac': 'flag_a_c'
    , 'flag_ad': 'flag_a_d'
    , 'flag_ae': 'flag_a_e'
    , 'flag_af': 'flag_a_f'
    , 'flag_ag': 'flag_a_g'
    , 'flag_ai': 'flag_a_i'
    , 'flag_al': 'flag_a_l'
    , 'flag_am': 'flag_a_m'
    , 'flag_ao': 'flag_a_o'
    , 'flag_aq': 'flag_a_q'
    , 'flag_ar': 'flag_a_r'
    , 'flag_as': 'flag_a_s'
    , 'flag_at': 'flag_a_t'
    , 'flag_au': 'flag_a_u'
    , 'flag_aw': 'flag_a_w'
    , 'flag_ax': 'flag_a_x'
    , 'flag_az': 'flag_a_z'
    , 'flag_ba': 'flag_b_a'
    , 'flag_bb': 'flag_b_b'
    , 'flag_bd': 'flag_b_d'
    , 'flag_be': 'flag_b_e'
    , 'flag_bf': 'flag_b_f'
    , 'flag_bg': 'flag_b_g'
    , 'flag_bh': 'flag_b_h'
    , 'flag_bi': 'flag_b_i'
    , 'flag_bj': 'flag_b_j'
    , 'flag_bl': 'flag_b_l'
    , 'flag_bm': 'flag_b_m'
    , 'flag_bn': 'flag_b_n'
    , 'flag_bo': 'flag_b_o'
    , 'flag_bq': 'flag_b_q'
    , 'flag_br': 'flag_b_r'
    , 'flag_bs': 'flag_b_s'
    , 'flag_bt': 'flag_b_t'
    , 'flag_bv': 'flag_b_v'
    , 'flag_bw': 'flag_b_w'
    , 'flag_by': 'flag_b_y'
    , 'flag_bz': 'flag_b_z'
    , 'flag_ca': 'flag_c_a'
    , 'flag_cc': 'flag_c_c'
    , 'flag_cd': 'flag_c_d'
    , 'flag_cf': 'flag_c_f'
    , 'flag_cg': 'flag_c_g'
    , 'flag_ch': 'flag_c_h'
    , 'flag_ci': 'flag_c_i'
    , 'flag_ck': 'flag_c_k'
    , 'flag_cl': 'flag_c_l'
    , 'flag_cm': 'flag_c_m'
    , 'flag_cn': 'flag_c_n'
    , 'flag_co': 'flag_c_o'
    , 'flag_cp': 'flag_c_p'
    , 'flag_cr': 'flag_c_r'
    , 'flag_cu': 'flag_c_u'
    , 'flag_cv': 'flag_c_v'
    , 'flag_cw': 'flag_c_w'
    , 'flag_cx': 'flag_c_x'
    , 'flag_cy': 'flag_c_y'
    , 'flag_cz': 'flag_c_z'
    , 'flag_de': 'flag_d_e'
    , 'flag_dg': 'flag_d_g'
    , 'flag_dj': 'flag_d_j'
    , 'flag_dk': 'flag_d_k'
    , 'flag_dm': 'flag_d_m'
    , 'flag_do': 'flag_d_o'
    , 'flag_dz': 'flag_d_z'
    , 'flag_ea': 'flag_e_a'
    , 'flag_ec': 'flag_e_c'
    , 'flag_ee': 'flag_e_e'
    , 'flag_eg': 'flag_e_g'
    , 'flag_eh': 'flag_e_h'
    , 'flag_er': 'flag_e_r'
    , 'flag_es': 'flag_e_s'
    , 'flag_et': 'flag_e_t'
    , 'flag_eu': 'flag_e_u'
    , 'flag_fi': 'flag_f_i'
    , 'flag_fj': 'flag_f_j'
    , 'flag_fk': 'flag_f_k'
    , 'flag_fm': 'flag_f_m'
    , 'flag_fo': 'flag_f_o'
    , 'flag_fr': 'flag_f_r'
    , 'flag_ga': 'flag_g_a'
    , 'flag_gb': 'flag_g_b'
    , 'flag_gd': 'flag_g_d'
    , 'flag_ge': 'flag_g_e'
    , 'flag_gf': 'flag_g_f'
    , 'flag_gg': 'flag_g_g'
    , 'flag_gh': 'flag_g_h'
    , 'flag_gi': 'flag_g_i'
    , 'flag_gl': 'flag_g_l'
    , 'flag_gm': 'flag_g_m'
    , 'flag_gn': 'flag_g_n'
    , 'flag_gp': 'flag_g_p'
    , 'flag_gq': 'flag_g_q'
    , 'flag_gr': 'flag_g_r'
    , 'flag_gs': 'flag_g_s'
    , 'flag_gt': 'flag_g_t'
    , 'flag_gu': 'flag_g_u'
    , 'flag_gw': 'flag_g_w'
    , 'flag_gy': 'flag_g_y'
    , 'flag_hk': 'flag_h_k'
    , 'flag_hm': 'flag_h_m'
    , 'flag_hn': 'flag_h_n'
    , 'flag_hr': 'flag_h_r'
    , 'flag_ht': 'flag_h_t'
    , 'flag_hu': 'flag_h_u'
    , 'flag_ic': 'flag_i_c'
    , 'flag_id': 'flag_i_d'
    , 'flag_ie': 'flag_i_e'
    , 'flag_il': 'flag_i_l'
    , 'flag_im': 'flag_i_m'
    , 'flag_in': 'flag_i_n'
    , 'flag_io': 'flag_i_o'
    , 'flag_iq': 'flag_i_q'
    , 'flag_ir': 'flag_i_r'
    , 'flag_is': 'flag_i_s'
    , 'flag_it': 'flag_i_t'
    , 'flag_je': 'flag_j_e'
    , 'flag_jm': 'flag_j_m'
    , 'flag_jo': 'flag_j_o'
    , 'flag_jp': 'flag_j_p'
    , 'flag_ke': 'flag_k_e'
    , 'flag_kg': 'flag_k_g'
    , 'flag_kh': 'flag_k_h'
    , 'flag_ki': 'flag_k_i'
    , 'flag_km': 'flag_k_m'
    , 'flag_kn': 'flag_k_n'
    , 'flag_kp': 'flag_k_p'
    , 'flag_kr': 'flag_k_r'
    , 'flag_kw': 'flag_k_w'
    , 'flag_ky': 'flag_k_y'
    , 'flag_kz': 'flag_k_z'
    , 'flag_la': 'flag_l_a'
    , 'flag_lb': 'flag_l_b'
    , 'flag_lc': 'flag_l_c'
    , 'flag_li': 'flag_l_i'
    , 'flag_lk': 'flag_l_k'
    , 'flag_lr': 'flag_l_r'
    , 'flag_ls': 'flag_l_s'
    , 'flag_lt': 'flag_l_t'
    , 'flag_lu': 'flag_l_u'
    , 'flag_lv': 'flag_l_v'
    , 'flag_ly': 'flag_l_y'
    , 'flag_ma': 'flag_m_a'
    , 'flag_mc': 'flag_m_c'
    , 'flag_md': 'flag_m_d'
    , 'flag_me': 'flag_m_e'
    , 'flag_mf': 'flag_m_f'
    , 'flag_mg': 'flag_m_g'
    , 'flag_mh': 'flag_m_h'
    , 'flag_mk': 'flag_m_k'
    , 'flag_ml': 'flag_m_l'
    , 'flag_mm': 'flag_m_m'
    , 'flag_mn': 'flag_m_n'
    , 'flag_mo': 'flag_m_o'
    , 'flag_mp': 'flag_m_p'
    , 'flag_mq': 'flag_m_q'
    , 'flag_mr': 'flag_m_r'
    , 'flag_ms': 'flag_m_s'
    , 'flag_mt': 'flag_m_t'
    , 'flag_mu': 'flag_m_u'
    , 'flag_mv': 'flag_m_v'
    , 'flag_mw': 'flag_m_w'
    , 'flag_mx': 'flag_m_x'
    , 'flag_my': 'flag_m_y'
    , 'flag_mz': 'flag_m_z'
    , 'flag_na': 'flag_n_a'
    , 'flag_nc': 'flag_n_c'
    , 'flag_ne': 'flag_n_e'
    , 'flag_nf': 'flag_n_f'
    , 'flag_ng': 'flag_n_g'
    , 'flag_ni': 'flag_n_i'
    , 'flag_nl': 'flag_n_l'
    , 'flag_no': 'flag_n_o'
    , 'flag_np': 'flag_n_p'
    , 'flag_nr': 'flag_n_r'
    , 'flag_nu': 'flag_n_u'
    , 'flag_nz': 'flag_n_z'
    , 'flag_om': 'flag_o_m'
    , 'flag_pa': 'flag_p_a'
    , 'flag_pe': 'flag_p_e'
    , 'flag_pf': 'flag_p_f'
    , 'flag_pg': 'flag_p_g'
    , 'flag_ph': 'flag_p_h'
    , 'flag_pk': 'flag_p_k'
    , 'flag_pl': 'flag_p_l'
    , 'flag_pm': 'flag_p_m'
    , 'flag_pn': 'flag_p_n'
    , 'flag_pr': 'flag_p_r'
    , 'flag_ps': 'flag_p_s'
    , 'flag_pt': 'flag_p_t'
    , 'flag_pw': 'flag_p_w'
    , 'flag_py': 'flag_p_y'
    , 'flag_qa': 'flag_q_a'
    , 'flag_re': 'flag_r_e'
    , 'flag_ro': 'flag_r_o'
    , 'flag_rs': 'flag_r_s'
    , 'flag_ru': 'flag_r_u'
    , 'flag_rw': 'flag_r_w'
    , 'flag_sa': 'flag_s_a'
    , 'flag_sb': 'flag_s_b'
    , 'flag_sc': 'flag_s_c'
    , 'flag_sd': 'flag_s_d'
    , 'flag_se': 'flag_s_e'
    , 'flag_sg': 'flag_s_g'
    , 'flag_sh': 'flag_s_h'
    , 'flag_si': 'flag_s_i'
    , 'flag_sj': 'flag_s_j'
    , 'flag_sk': 'flag_s_k'
    , 'flag_sl': 'flag_s_l'
    , 'flag_sm': 'flag_s_m'
    , 'flag_sn': 'flag_s_n'
    , 'flag_so': 'flag_s_o'
    , 'flag_sr': 'flag_s_r'
    , 'flag_ss': 'flag_s_s'
    , 'flag_st': 'flag_s_t'
    , 'flag_sv': 'flag_s_v'
    , 'flag_sx': 'flag_s_x'
    , 'flag_sy': 'flag_s_y'
    , 'flag_sz': 'flag_s_z'
    , 'flag_ta': 'flag_t_a'
    , 'flag_tc': 'flag_t_c'
    , 'flag_td': 'flag_t_d'
    , 'flag_tf': 'flag_t_f'
    , 'flag_tg': 'flag_t_g'
    , 'flag_th': 'flag_t_h'
    , 'flag_tj': 'flag_t_j'
    , 'flag_tk': 'flag_t_k'
    , 'flag_tl': 'flag_t_l'
    , 'flag_tm': 'flag_t_m'
    , 'flag_tn': 'flag_t_n'
    , 'flag_to': 'flag_t_o'
    , 'flag_tr': 'flag_t_r'
    , 'flag_tt': 'flag_t_t'
    , 'flag_tv': 'flag_t_v'
    , 'flag_tw': 'flag_t_w'
    , 'flag_tz': 'flag_t_z'
    , 'flag_ua': 'flag_u_a'
    , 'flag_ug': 'flag_u_g'
    , 'flag_um': 'flag_u_m'
    , 'flag_us': 'flag_u_s'
    , 'flag_uy': 'flag_u_y'
    , 'flag_uz': 'flag_u_z'
    , 'flag_va': 'flag_v_a'
    , 'flag_vc': 'flag_v_c'
    , 'flag_ve': 'flag_v_e'
    , 'flag_vg': 'flag_v_g'
    , 'flag_vi': 'flag_v_i'
    , 'flag_vn': 'flag_v_n'
    , 'flag_vu': 'flag_v_u'
    , 'flag_wf': 'flag_w_f'
    , 'flag_ws': 'flag_w_s'
    , 'flag_xk': 'flag_x_k'
    , 'flag_ye': 'flag_y_e'
    , 'flag_yt': 'flag_y_t'
    , 'flag_za': 'flag_z_a'
    , 'flag_zm': 'flag_z_m'
    , 'flag_zw': 'flag_z_w'
    }

  return (a, shortname) => {
    let substitute = substitutes[shortname]

    const processSubstitutes = (newShort, newSubs) => {
      Object.keys(newSubs).forEach(key => {
        if (newShort.includes(key)) {
          substitute = newShort.replace(new RegExp(key, 'g')
                                        , newSubs[key]
                                        )
          if (!a[substitute]) {
            a[substitute] = { ...a[newShort]
                            , shortname: substitute
                            , duplicate: true
                            }
            var subs = newSubs
            if (newSubs[key].includes(key)) {
              subs = { ...newSubs }
              delete subs[key]
            }
            processSubstitutes(substitute, subs)
          }
        }
      })
    }
    a[shortname] = emojis[shortname]
    processSubstitutes(shortname, substitutes)
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
             , duplicate: extendedEmojis[x].duplicate
             , oldUnicode: extendedEmojis[x].unicode
             , unicode: extendedEmojis[x].unicode
                .split('-').reduce((z, y) => {
                  return z + String.fromCodePoint(
                      parseInt(y, 16)
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

let lastUnicode = null
const uniqueEmoji = valid.reduce((p, n) => {
  if (lastUnicode === n.unicode) {
    return p
  }
  lastUnicode = n.unicode
  return p + 1
}, 0)
console.log(`Successfully processed ${uniqueEmoji} unique emoji`)
console.log(`${invalid.length} emoji contained unknown words (printed above)`)
console.log(`Total number of entries made:`)
console.log(Object.keys(emojiDictionary).length)

lastUnicode = null
const markdownList = `"` +
  valid.reduce
    ( (a, b) => {
        if (b.unicode === lastUnicode) {
          return a + `, ${b.words.join(' ')}`
        }
        lastUnicode = b.unicode
        return a + `\\n- ${b.unicode}: ${b.words.join(' ')}`
    }
    , ''
    ) + `"`

const byUnicode =
  valid.reduce((p, n) => {
    p[n.oldUnicode] = true
    return p
  })
const noDefinition = Object.keys(emojis).reduce((p, e) => {
  if (!byUnicode[emojis[e].unicode]) {
    return p + '\n  ' + emojis[e].shortname
  }
  return p
}, '')

console.log(`These shortcodes had no definition: ${noDefinition}`)

fs.writeFileSync('emoji.md', markdownList, `utf8`)
fs.writeFileSync('emoji.json', JSON.stringify(emojiDictionary, null, 1), `utf8`)
console.log(`Done.`)
