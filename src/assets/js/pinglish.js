/*!
 * Pinglish 1.0.0 — a keyboard-friendly, reversible romanization for Standard Chinese.
 *
 * SPEC: ../../SPEC.md
 * Tables: ../data/syllables.json (source of truth; kept in sync by the tests)
 *
 * Browser:  <script src="assets/js/pinglish.js"></script>  ->  window.Pinglish
 * Node:     const Pinglish = require('./docs/assets/js/pinglish.js')
 *
 * No runtime dependencies. chineseToPinglish()/chineseToPinyin() need the
 * pinyin-pro UMD build loaded first (globalThis.pinyinPro or window.pinyinPro).
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.Pinglish = factory();
  }
})(
  typeof globalThis !== 'undefined'
    ? globalThis
    : typeof self !== 'undefined'
      ? self
      : this,
  function () {
    'use strict';

    // Generated from docs/assets/data/syllables.json. Keep that file authoritative.
    var DATA = {
      "version": "1.0",
      "pinyinToPinglish": {
        "a": "a",
        "ai": "ai",
        "an": "an",
        "ang": "ang",
        "ao": "au",
        "ba": "ba",
        "bai": "bai",
        "ban": "ban",
        "bang": "bang",
        "bao": "bau",
        "bei": "bei",
        "ben": "ben",
        "beng": "beng",
        "bi": "bi",
        "bian": "bien",
        "biang": "biang",
        "biao": "biau",
        "bie": "bie",
        "bin": "bin",
        "bing": "bing",
        "bo": "buo",
        "bu": "bu",
        "ca": "ca",
        "cai": "cai",
        "can": "can",
        "cang": "cang",
        "cao": "cau",
        "ce": "ce",
        "cen": "cen",
        "ceng": "ceng",
        "cha": "cha",
        "chai": "chai",
        "chan": "chan",
        "chang": "chang",
        "chao": "chau",
        "che": "che",
        "chen": "chen",
        "cheng": "cheng",
        "chi": "chy",
        "chong": "chung",
        "chou": "chou",
        "chu": "chu",
        "chua": "chua",
        "chuai": "chuai",
        "chuan": "chuan",
        "chuang": "chuang",
        "chui": "chuei",
        "chun": "chuen",
        "chuo": "chuo",
        "ci": "cy",
        "cong": "cung",
        "cou": "cou",
        "cu": "cu",
        "cuan": "cuan",
        "cui": "cuei",
        "cun": "cuen",
        "cuo": "cuo",
        "da": "da",
        "dai": "dai",
        "dan": "dan",
        "dang": "dang",
        "dao": "dau",
        "de": "de",
        "den": "den",
        "deng": "deng",
        "di": "di",
        "dia": "dia",
        "dian": "dien",
        "diao": "diau",
        "die": "die",
        "ding": "ding",
        "diu": "diou",
        "dong": "dung",
        "dou": "dou",
        "du": "du",
        "duan": "duan",
        "duang": "duang",
        "dui": "duei",
        "dun": "duen",
        "duo": "duo",
        "e": "e",
        "ei": "ei",
        "en": "en",
        "eng": "eng",
        "er": "er",
        "fa": "fa",
        "fan": "fan",
        "fang": "fang",
        "fei": "fei",
        "fen": "fen",
        "feng": "feng",
        "fo": "fuo",
        "fou": "fou",
        "fu": "fu",
        "ga": "ga",
        "gai": "gai",
        "gan": "gan",
        "gang": "gang",
        "gao": "gau",
        "ge": "ge",
        "gei": "gei",
        "gen": "gen",
        "geng": "geng",
        "gong": "gung",
        "gou": "gou",
        "gu": "gu",
        "gua": "gua",
        "guai": "guai",
        "guan": "guan",
        "guang": "guang",
        "gui": "guei",
        "gun": "guen",
        "guo": "guo",
        "ha": "ha",
        "hai": "hai",
        "han": "han",
        "hang": "hang",
        "hao": "hau",
        "he": "he",
        "hei": "hei",
        "hen": "hen",
        "heng": "heng",
        "hm": "hm",
        "hng": "hng",
        "hong": "hung",
        "hou": "hou",
        "hu": "hu",
        "hua": "hua",
        "huai": "huai",
        "huan": "huan",
        "huang": "huang",
        "hui": "huei",
        "hun": "huen",
        "huo": "huo",
        "ji": "gi",
        "jia": "gia",
        "jian": "gien",
        "jiang": "giang",
        "jiao": "giau",
        "jie": "gie",
        "jin": "gin",
        "jing": "ging",
        "jiong": "giung",
        "jiu": "giou",
        "ju": "gv",
        "juan": "gven",
        "jue": "gve",
        "jun": "gvn",
        "ka": "ka",
        "kai": "kai",
        "kan": "kan",
        "kang": "kang",
        "kao": "kau",
        "ke": "ke",
        "kei": "kei",
        "ken": "ken",
        "keng": "keng",
        "kong": "kung",
        "kou": "kou",
        "ku": "ku",
        "kua": "kua",
        "kuai": "kuai",
        "kuan": "kuan",
        "kuang": "kuang",
        "kui": "kuei",
        "kun": "kuen",
        "kuo": "kuo",
        "la": "la",
        "lai": "lai",
        "lan": "lan",
        "lang": "lang",
        "lao": "lau",
        "le": "le",
        "lei": "lei",
        "leng": "leng",
        "li": "li",
        "lia": "lia",
        "lian": "lien",
        "liang": "liang",
        "liao": "liau",
        "lie": "lie",
        "lin": "lin",
        "ling": "ling",
        "liu": "liou",
        "lo": "lo",
        "long": "lung",
        "lou": "lou",
        "lu": "lu",
        "luan": "luan",
        "lun": "luen",
        "luo": "luo",
        "lü": "lv",
        "lüe": "lve",
        "m": "m",
        "ma": "ma",
        "mai": "mai",
        "man": "man",
        "mang": "mang",
        "mao": "mau",
        "me": "me",
        "mei": "mei",
        "men": "men",
        "meng": "meng",
        "mi": "mi",
        "mian": "mien",
        "miao": "miau",
        "mie": "mie",
        "min": "min",
        "ming": "ming",
        "miu": "miou",
        "mo": "muo",
        "mou": "mou",
        "mu": "mu",
        "na": "na",
        "nai": "nai",
        "nan": "nan",
        "nang": "nang",
        "nao": "nau",
        "ne": "ne",
        "nei": "nei",
        "nen": "nen",
        "neng": "neng",
        "ng": "ng",
        "ni": "ni",
        "nian": "nien",
        "niang": "niang",
        "niao": "niau",
        "nie": "nie",
        "nin": "nin",
        "ning": "ning",
        "niu": "niou",
        "nong": "nung",
        "nou": "nou",
        "nu": "nu",
        "nuan": "nuan",
        "nuo": "nuo",
        "nü": "nv",
        "nüe": "nve",
        "o": "o",
        "ou": "ou",
        "pa": "pa",
        "pai": "pai",
        "pan": "pan",
        "pang": "pang",
        "pao": "pau",
        "pei": "pei",
        "pen": "pen",
        "peng": "peng",
        "pi": "pi",
        "pian": "pien",
        "piao": "piau",
        "pie": "pie",
        "pin": "pin",
        "ping": "ping",
        "po": "puo",
        "pou": "pou",
        "pu": "pu",
        "qi": "ki",
        "qia": "kia",
        "qian": "kien",
        "qiang": "kiang",
        "qiao": "kiau",
        "qie": "kie",
        "qin": "kin",
        "qing": "king",
        "qiong": "kiung",
        "qiu": "kiou",
        "qu": "kv",
        "quan": "kven",
        "que": "kve",
        "qun": "kvn",
        "ran": "ran",
        "rang": "rang",
        "rao": "rau",
        "re": "re",
        "ren": "ren",
        "reng": "reng",
        "ri": "ry",
        "rong": "rung",
        "rou": "rou",
        "ru": "ru",
        "ruan": "ruan",
        "rui": "ruei",
        "run": "ruen",
        "ruo": "ruo",
        "sa": "sa",
        "sai": "sai",
        "san": "san",
        "sang": "sang",
        "sao": "sau",
        "se": "se",
        "sen": "sen",
        "seng": "seng",
        "sha": "sha",
        "shai": "shai",
        "shan": "shan",
        "shang": "shang",
        "shao": "shau",
        "she": "she",
        "shei": "shei",
        "shen": "shen",
        "sheng": "sheng",
        "shi": "shy",
        "shou": "shou",
        "shu": "shu",
        "shua": "shua",
        "shuai": "shuai",
        "shuan": "shuan",
        "shuang": "shuang",
        "shui": "shuei",
        "shun": "shuen",
        "shuo": "shuo",
        "si": "sy",
        "song": "sung",
        "sou": "sou",
        "su": "su",
        "suan": "suan",
        "sui": "suei",
        "sun": "suen",
        "suo": "suo",
        "ta": "ta",
        "tai": "tai",
        "tan": "tan",
        "tang": "tang",
        "tao": "tau",
        "te": "te",
        "tei": "tei",
        "teng": "teng",
        "ti": "ti",
        "tian": "tien",
        "tiao": "tiau",
        "tie": "tie",
        "ting": "ting",
        "tong": "tung",
        "tou": "tou",
        "tu": "tu",
        "tuan": "tuan",
        "tui": "tuei",
        "tun": "tuen",
        "tuo": "tuo",
        "wa": "ua",
        "wai": "uai",
        "wan": "uan",
        "wang": "uang",
        "wei": "uei",
        "wen": "uen",
        "weng": "ueng",
        "wo": "uo",
        "wu": "u",
        "xi": "hi",
        "xia": "hia",
        "xian": "hien",
        "xiang": "hiang",
        "xiao": "hiau",
        "xie": "hie",
        "xin": "hin",
        "xing": "hing",
        "xiong": "hiung",
        "xiu": "hiou",
        "xu": "hv",
        "xuan": "hven",
        "xue": "hve",
        "xun": "hvn",
        "ya": "ia",
        "yan": "ien",
        "yang": "iang",
        "yao": "iau",
        "ye": "ie",
        "yi": "i",
        "yin": "in",
        "ying": "ing",
        "yo": "io",
        "yong": "iung",
        "you": "iou",
        "yu": "v",
        "yuan": "ven",
        "yue": "ve",
        "yun": "vn",
        "za": "za",
        "zai": "zai",
        "zan": "zan",
        "zang": "zang",
        "zao": "zau",
        "ze": "ze",
        "zei": "zei",
        "zen": "zen",
        "zeng": "zeng",
        "zha": "zha",
        "zhai": "zhai",
        "zhan": "zhan",
        "zhang": "zhang",
        "zhao": "zhau",
        "zhe": "zhe",
        "zhei": "zhei",
        "zhen": "zhen",
        "zheng": "zheng",
        "zhi": "zhy",
        "zhong": "zhung",
        "zhou": "zhou",
        "zhu": "zhu",
        "zhua": "zhua",
        "zhuai": "zhuai",
        "zhuan": "zhuan",
        "zhuang": "zhuang",
        "zhui": "zhuei",
        "zhun": "zhuen",
        "zhuo": "zhuo",
        "zi": "zy",
        "zong": "zung",
        "zou": "zou",
        "zu": "zu",
        "zuan": "zuan",
        "zui": "zuei",
        "zun": "zuen",
        "zuo": "zuo",
        "ê": "eh"
      },
      "pinglishToPinyin": {
        "a": "a",
        "ai": "ai",
        "an": "an",
        "ang": "ang",
        "au": "ao",
        "ba": "ba",
        "bai": "bai",
        "ban": "ban",
        "bang": "bang",
        "bau": "bao",
        "bei": "bei",
        "ben": "ben",
        "beng": "beng",
        "bi": "bi",
        "biang": "biang",
        "biau": "biao",
        "bie": "bie",
        "bien": "bian",
        "bin": "bin",
        "bing": "bing",
        "bu": "bu",
        "buo": "bo",
        "ca": "ca",
        "cai": "cai",
        "can": "can",
        "cang": "cang",
        "cau": "cao",
        "ce": "ce",
        "cen": "cen",
        "ceng": "ceng",
        "cha": "cha",
        "chai": "chai",
        "chan": "chan",
        "chang": "chang",
        "chau": "chao",
        "che": "che",
        "chen": "chen",
        "cheng": "cheng",
        "chou": "chou",
        "chu": "chu",
        "chua": "chua",
        "chuai": "chuai",
        "chuan": "chuan",
        "chuang": "chuang",
        "chuei": "chui",
        "chuen": "chun",
        "chung": "chong",
        "chuo": "chuo",
        "chy": "chi",
        "cou": "cou",
        "cu": "cu",
        "cuan": "cuan",
        "cuei": "cui",
        "cuen": "cun",
        "cung": "cong",
        "cuo": "cuo",
        "cy": "ci",
        "da": "da",
        "dai": "dai",
        "dan": "dan",
        "dang": "dang",
        "dau": "dao",
        "de": "de",
        "den": "den",
        "deng": "deng",
        "di": "di",
        "dia": "dia",
        "diau": "diao",
        "die": "die",
        "dien": "dian",
        "ding": "ding",
        "diou": "diu",
        "dou": "dou",
        "du": "du",
        "duan": "duan",
        "duang": "duang",
        "duei": "dui",
        "duen": "dun",
        "dung": "dong",
        "duo": "duo",
        "e": "e",
        "eh": "ê",
        "ei": "ei",
        "en": "en",
        "eng": "eng",
        "er": "er",
        "fa": "fa",
        "fan": "fan",
        "fang": "fang",
        "fei": "fei",
        "fen": "fen",
        "feng": "feng",
        "fou": "fou",
        "fu": "fu",
        "fuo": "fo",
        "ga": "ga",
        "gai": "gai",
        "gan": "gan",
        "gang": "gang",
        "gau": "gao",
        "ge": "ge",
        "gei": "gei",
        "gen": "gen",
        "geng": "geng",
        "gi": "ji",
        "gia": "jia",
        "giang": "jiang",
        "giau": "jiao",
        "gie": "jie",
        "gien": "jian",
        "gin": "jin",
        "ging": "jing",
        "giou": "jiu",
        "giung": "jiong",
        "gou": "gou",
        "gu": "gu",
        "gua": "gua",
        "guai": "guai",
        "guan": "guan",
        "guang": "guang",
        "guei": "gui",
        "guen": "gun",
        "gung": "gong",
        "guo": "guo",
        "gv": "ju",
        "gve": "jue",
        "gven": "juan",
        "gvn": "jun",
        "ha": "ha",
        "hai": "hai",
        "han": "han",
        "hang": "hang",
        "hau": "hao",
        "he": "he",
        "hei": "hei",
        "hen": "hen",
        "heng": "heng",
        "hi": "xi",
        "hia": "xia",
        "hiang": "xiang",
        "hiau": "xiao",
        "hie": "xie",
        "hien": "xian",
        "hin": "xin",
        "hing": "xing",
        "hiou": "xiu",
        "hiung": "xiong",
        "hm": "hm",
        "hng": "hng",
        "hou": "hou",
        "hu": "hu",
        "hua": "hua",
        "huai": "huai",
        "huan": "huan",
        "huang": "huang",
        "huei": "hui",
        "huen": "hun",
        "hung": "hong",
        "huo": "huo",
        "hv": "xu",
        "hve": "xue",
        "hven": "xuan",
        "hvn": "xun",
        "i": "yi",
        "ia": "ya",
        "iang": "yang",
        "iau": "yao",
        "ie": "ye",
        "ien": "yan",
        "in": "yin",
        "ing": "ying",
        "io": "yo",
        "iou": "you",
        "iung": "yong",
        "ka": "ka",
        "kai": "kai",
        "kan": "kan",
        "kang": "kang",
        "kau": "kao",
        "ke": "ke",
        "kei": "kei",
        "ken": "ken",
        "keng": "keng",
        "ki": "qi",
        "kia": "qia",
        "kiang": "qiang",
        "kiau": "qiao",
        "kie": "qie",
        "kien": "qian",
        "kin": "qin",
        "king": "qing",
        "kiou": "qiu",
        "kiung": "qiong",
        "kou": "kou",
        "ku": "ku",
        "kua": "kua",
        "kuai": "kuai",
        "kuan": "kuan",
        "kuang": "kuang",
        "kuei": "kui",
        "kuen": "kun",
        "kung": "kong",
        "kuo": "kuo",
        "kv": "qu",
        "kve": "que",
        "kven": "quan",
        "kvn": "qun",
        "la": "la",
        "lai": "lai",
        "lan": "lan",
        "lang": "lang",
        "lau": "lao",
        "le": "le",
        "lei": "lei",
        "leng": "leng",
        "li": "li",
        "lia": "lia",
        "liang": "liang",
        "liau": "liao",
        "lie": "lie",
        "lien": "lian",
        "lin": "lin",
        "ling": "ling",
        "liou": "liu",
        "lo": "lo",
        "lou": "lou",
        "lu": "lu",
        "luan": "luan",
        "luen": "lun",
        "lung": "long",
        "luo": "luo",
        "lv": "lü",
        "lve": "lüe",
        "m": "m",
        "ma": "ma",
        "mai": "mai",
        "man": "man",
        "mang": "mang",
        "mau": "mao",
        "me": "me",
        "mei": "mei",
        "men": "men",
        "meng": "meng",
        "mi": "mi",
        "miau": "miao",
        "mie": "mie",
        "mien": "mian",
        "min": "min",
        "ming": "ming",
        "miou": "miu",
        "mou": "mou",
        "mu": "mu",
        "muo": "mo",
        "na": "na",
        "nai": "nai",
        "nan": "nan",
        "nang": "nang",
        "nau": "nao",
        "ne": "ne",
        "nei": "nei",
        "nen": "nen",
        "neng": "neng",
        "ng": "ng",
        "ni": "ni",
        "niang": "niang",
        "niau": "niao",
        "nie": "nie",
        "nien": "nian",
        "nin": "nin",
        "ning": "ning",
        "niou": "niu",
        "nou": "nou",
        "nu": "nu",
        "nuan": "nuan",
        "nung": "nong",
        "nuo": "nuo",
        "nv": "nü",
        "nve": "nüe",
        "o": "o",
        "ou": "ou",
        "pa": "pa",
        "pai": "pai",
        "pan": "pan",
        "pang": "pang",
        "pau": "pao",
        "pei": "pei",
        "pen": "pen",
        "peng": "peng",
        "pi": "pi",
        "piau": "piao",
        "pie": "pie",
        "pien": "pian",
        "pin": "pin",
        "ping": "ping",
        "pou": "pou",
        "pu": "pu",
        "puo": "po",
        "ran": "ran",
        "rang": "rang",
        "rau": "rao",
        "re": "re",
        "ren": "ren",
        "reng": "reng",
        "rou": "rou",
        "ru": "ru",
        "ruan": "ruan",
        "ruei": "rui",
        "ruen": "run",
        "rung": "rong",
        "ruo": "ruo",
        "ry": "ri",
        "sa": "sa",
        "sai": "sai",
        "san": "san",
        "sang": "sang",
        "sau": "sao",
        "se": "se",
        "sen": "sen",
        "seng": "seng",
        "sha": "sha",
        "shai": "shai",
        "shan": "shan",
        "shang": "shang",
        "shau": "shao",
        "she": "she",
        "shei": "shei",
        "shen": "shen",
        "sheng": "sheng",
        "shou": "shou",
        "shu": "shu",
        "shua": "shua",
        "shuai": "shuai",
        "shuan": "shuan",
        "shuang": "shuang",
        "shuei": "shui",
        "shuen": "shun",
        "shuo": "shuo",
        "shy": "shi",
        "sou": "sou",
        "su": "su",
        "suan": "suan",
        "suei": "sui",
        "suen": "sun",
        "sung": "song",
        "suo": "suo",
        "sy": "si",
        "ta": "ta",
        "tai": "tai",
        "tan": "tan",
        "tang": "tang",
        "tau": "tao",
        "te": "te",
        "tei": "tei",
        "teng": "teng",
        "ti": "ti",
        "tiau": "tiao",
        "tie": "tie",
        "tien": "tian",
        "ting": "ting",
        "tou": "tou",
        "tu": "tu",
        "tuan": "tuan",
        "tuei": "tui",
        "tuen": "tun",
        "tung": "tong",
        "tuo": "tuo",
        "u": "wu",
        "ua": "wa",
        "uai": "wai",
        "uan": "wan",
        "uang": "wang",
        "uei": "wei",
        "uen": "wen",
        "ueng": "weng",
        "uo": "wo",
        "v": "yu",
        "ve": "yue",
        "ven": "yuan",
        "vn": "yun",
        "za": "za",
        "zai": "zai",
        "zan": "zan",
        "zang": "zang",
        "zau": "zao",
        "ze": "ze",
        "zei": "zei",
        "zen": "zen",
        "zeng": "zeng",
        "zha": "zha",
        "zhai": "zhai",
        "zhan": "zhan",
        "zhang": "zhang",
        "zhau": "zhao",
        "zhe": "zhe",
        "zhei": "zhei",
        "zhen": "zhen",
        "zheng": "zheng",
        "zhou": "zhou",
        "zhu": "zhu",
        "zhua": "zhua",
        "zhuai": "zhuai",
        "zhuan": "zhuan",
        "zhuang": "zhuang",
        "zhuei": "zhui",
        "zhuen": "zhun",
        "zhung": "zhong",
        "zhuo": "zhuo",
        "zhy": "zhi",
        "zou": "zou",
        "zu": "zu",
        "zuan": "zuan",
        "zuei": "zui",
        "zuen": "zun",
        "zung": "zong",
        "zuo": "zuo",
        "zy": "zi"
      },
      "notes": "Pinglish v1.0 syllable table. The 407 base syllables of Standard Chinese were collected with pinyin-pro 3.29.5 by scanning U+3400-U+4DBF, U+4E00-U+9FFF, U+F900-U+FAFF and U+20000-U+2FA1F with pinyin(ch, {toneType:'none', type:'array', nonZh:'consecutive'}). Extras required by the task were added: ê, hm, hng, lo, shei, zhei, biang, duang, tei. The pinglishToPinyin direction has zero collisions (416/416 bijection). Tone digits 1-4 are written after the syllable; neutral tone is 0 (input 5 is normalized to 0). See SPEC.md for the mapping rules and examples. Zero-initial yu is written v (语 -> v3), matching SPEC section 4 and the yú -> v2 example on the site; the han4 yv3 string in SPEC section 6 is a typo."
    };

    var P2P = DATA.pinyinToPinglish;
    var P2P_REV = DATA.pinglishToPinyin;
    var VERSION = '1.0.0';

    // ---------------------------------------------------------------------
    // Small helpers
    // ---------------------------------------------------------------------

    function has(obj, key) {
      return Object.prototype.hasOwnProperty.call(obj, key);
    }

    function isAsciiDigit(ch) {
      return ch >= '0' && ch <= '5';
    }

    // Tone marks used by standard pinyin. Values are [plain vowel, tone].
    var ACCENT = {
      'ā': ['a', 1], 'á': ['a', 2], 'ǎ': ['a', 3], 'à': ['a', 4],
      'ō': ['o', 1], 'ó': ['o', 2], 'ǒ': ['o', 3], 'ò': ['o', 4],
      'ē': ['e', 1], 'é': ['e', 2], 'ě': ['e', 3], 'è': ['e', 4],
      'ī': ['i', 1], 'í': ['i', 2], 'ǐ': ['i', 3], 'ì': ['i', 4],
      'ū': ['u', 1], 'ú': ['u', 2], 'ǔ': ['u', 3], 'ù': ['u', 4],
      'ǖ': ['ü', 1], 'ǘ': ['ü', 2], 'ǚ': ['ü', 3], 'ǜ': ['ü', 4],
      'ń': ['n', 2], 'ň': ['n', 3], 'ǹ': ['n', 4], 'ḿ': ['m', 2]
    };

    // The reverse direction of ACCENT, for toneMark().
    var MARKS = {
      a: ['ā', 'á', 'ǎ', 'à'],
      o: ['ō', 'ó', 'ǒ', 'ò'],
      e: ['ē', 'é', 'ě', 'è'],
      i: ['ī', 'í', 'ǐ', 'ì'],
      u: ['ū', 'ú', 'ǔ', 'ù'],
      'ü': ['ǖ', 'ǘ', 'ǚ', 'ǜ']
    };

    var MAX_PINYIN = 1;
    var MAX_PINGLISH = 1;
    (function () {
      var key;
      for (key in P2P) {
        if (has(P2P, key) && key.length > MAX_PINYIN) MAX_PINYIN = key.length;
      }
      for (key in P2P_REV) {
        if (has(P2P_REV, key) && key.length > MAX_PINGLISH) MAX_PINGLISH = key.length;
      }
    })();

    // Compatibility spelling: SPEC.md §6 and the site's converter examples
    // contain "yv3" for 语 (yu3). The canonical table uses v (SPEC §4 and the
    // yú -> v2 example), but accepting yv on input keeps old strings reversible.
    var P2P_REV_PARSE = {};
    (function () {
      var key;
      for (key in P2P_REV) {
        if (has(P2P_REV, key)) P2P_REV_PARSE[key] = P2P_REV[key];
      }
      P2P_REV_PARSE.yv = 'yu';
    })();

    function isLetterChar(ch) {
      if (!ch) return false;
      var c = ch.toLowerCase();
      return (
        (c >= 'a' && c <= 'z') ||
        c === 'ü' ||
        c === 'ê' ||
        has(ACCENT, c)
      );
    }

    function isPlainLetter(ch) {
      return (
        (ch >= 'a' && ch <= 'z') ||
        ch === 'ü' ||
        ch === 'ê'
      );
    }

    // Split text into letter/digit runs and separator runs. Runs may contain
    // digits 0-5 (tone numbers); everything else is preserved verbatim.
    function tokenize(text) {
      text = String(text);
      var tokens = [];
      var i = 0;
      var n = text.length;
      while (i < n) {
        var ch = text.charAt(i);
        if (isLetterChar(ch)) {
          var j = i + 1;
          while (j < n) {
            var c = text.charAt(j);
            if (isLetterChar(c) || isAsciiDigit(c)) j++;
            else break;
          }
          tokens.push({ type: 'run', text: text.slice(i, j) });
          i = j;
        } else {
          var k = i + 1;
          while (k < n && !isLetterChar(text.charAt(k))) k++;
          tokens.push({ type: 'sep', text: text.slice(i, k) });
          i = k;
        }
      }
      return tokens;
    }

    function splitTone(s) {
      var m = /([0-5])$/.exec(s);
      if (!m) return { base: s, tone: null };
      return { base: s.slice(0, -1), tone: m[1] === '5' ? 0 : +m[1] };
    }

    // Accept the common ASCII-pinyin substitution v for ü (nv, lv, jv, ...).
    // In standard pinyin j/q/x + ü is spelled ju/qu/xu, so fold those too.
    function normalizePinyinAliases(s) {
      s = s.toLowerCase();
      if (s.indexOf('v') === -1) return s;
      s = s.replace(/v/g, 'ü');
      s = s.replace(/([jqx])ü/g, '$1u');
      s = s.replace(/yü/g, 'yu');
      return s;
    }

    // Accepts lü3, lǚ, ma5, etc. Returns an unmarked base plus a tone number
    // (null means "no tone was supplied").
    function normalizePinyinSyllable(s) {
      s = String(s).toLowerCase().replace(/^\s+|\s+$/g, '');
      var plain = '';
      var tone = null;
      var i;
      for (i = 0; i < s.length; i++) {
        var ch = s.charAt(i);
        if (has(ACCENT, ch)) {
          plain += ACCENT[ch][0];
          tone = ACCENT[ch][1];
        } else {
          plain += ch;
        }
      }
      var t = splitTone(plain);
      if (t.tone !== null) tone = t.tone;
      return { base: t.base, tone: tone };
    }

    // Longest-match segmentation against a syllable table. Greedy is correct
    // for the unambiguous Pinglish/pinyin inventories used here; tone digits
    // and apostrophes provide explicit boundaries where needed.
    function greedySplit(plain, table, maxLen) {
      var out = [];
      var i = 0;
      while (i < plain.length) {
        var found = null;
        var limit = Math.min(maxLen, plain.length - i);
        var len = limit;
        for (; len >= 1; len--) {
          var cand = plain.substr(i, len);
          if (has(table, cand)) {
            found = cand;
            break;
          }
        }
        if (!found) return null;
        out.push({ base: found, start: i, end: i + len });
        i += len;
      }
      return out;
    }

    function parseChunk(text, allowMarks) {
      text = text.toLowerCase();
      var plain = '';
      var marks = [];
      var i;
      for (i = 0; i < text.length; i++) {
        var ch = text.charAt(i);
        if (allowMarks && has(ACCENT, ch)) {
          plain += ACCENT[ch][0];
          marks.push({ index: plain.length - 1, tone: ACCENT[ch][1] });
        } else if (isPlainLetter(ch)) {
          plain += ch;
        } else {
          return null;
        }
      }
      if (!plain) return null;
      return { plain: plain, marks: marks };
    }

    // Parse a run into syllables. Tone digits terminate a syllable; tone marks
    // are attached to the syllable whose letters contain the marked vowel.
    function parseRun(run, table, maxLen, allowMarks) {
      var chunks = [];
      var buf = '';
      var i;
      for (i = 0; i < run.length; i++) {
        var ch = run.charAt(i);
        if (isAsciiDigit(ch)) {
          if (!buf) return null;
          chunks.push({ text: buf, digit: ch });
          buf = '';
        } else {
          buf += ch;
        }
      }
      if (buf) chunks.push({ text: buf, digit: null });

      var out = [];
      var c;
      for (c = 0; c < chunks.length; c++) {
        var parsed = parseChunk(chunks[c].text, allowMarks);
        if (!parsed) return null;
        var segs = greedySplit(parsed.plain, table, maxLen);
        if (!segs) return null;

        var tones = [];
        var m;
        for (m = 0; m < parsed.marks.length; m++) {
          var mark = parsed.marks[m];
          var hit = -1;
          var s;
          for (s = 0; s < segs.length; s++) {
            if (mark.index >= segs[s].start && mark.index < segs[s].end) {
              hit = s;
              break;
            }
          }
          if (hit < 0) return null;
          tones[hit] = mark.tone;
        }

        var j;
        for (j = 0; j < segs.length; j++) {
          var tone = tones[j] === undefined ? null : tones[j];
          if (chunks[c].digit !== null && j === segs.length - 1) {
            tone = chunks[c].digit === '5' ? 0 : +chunks[c].digit;
          }
          out.push({ base: segs[j].base, tone: tone });
        }
      }
      return out;
    }

    // Place a pinyin tone mark: a/e first, then ou -> o, otherwise the last
    // vowel (which also gives the iu -> u and ui -> i rules).
    function markPinyinBase(base, tone) {
      if (!tone || tone < 1 || tone > 4) return base;
      var idx = -1;
      var a = base.indexOf('a');
      var e = base.indexOf('e');
      if (a !== -1) {
        idx = a;
      } else if (e !== -1) {
        idx = e;
      } else if (base.indexOf('ou') !== -1) {
        idx = base.indexOf('ou');
      } else {
        var i;
        for (i = base.length - 1; i >= 0; i--) {
          var c = base.charAt(i);
          if (c === 'a' || c === 'e' || c === 'i' || c === 'o' || c === 'u' || c === 'ü') {
            idx = i;
            break;
          }
        }
      }
      if (idx < 0) return base;
      var vowel = base.charAt(idx);
      var forms = MARKS[vowel];
      if (!forms) return base;
      return base.slice(0, idx) + forms[tone - 1] + base.slice(idx + 1);
    }

    function startsAOE(base) {
      var c = base.charAt(0);
      return c === 'a' || c === 'o' || c === 'e';
    }

    function isWhitespaceOnly(text) {
      return /^\s+$/.test(text) && text.indexOf('\n') === -1 && text.indexOf('\r') === -1;
    }

    // ---------------------------------------------------------------------
    // Single-syllable API
    // ---------------------------------------------------------------------

    function forwardSyllable(s) {
      var n = normalizePinyinSyllable(s);
      var base = normalizePinyinAliases(n.base);
      if (!has(P2P, base)) {
        throw new Error('Pinglish.forwardSyllable: invalid pinyin syllable "' + s + '"');
      }
      return P2P[base] + (n.tone !== null ? String(n.tone) : '');
    }

    function reverseSyllable(s) {
      var t = splitTone(String(s).toLowerCase().replace(/^\s+|\s+$/g, ''));
      if (!has(P2P_REV_PARSE, t.base)) {
        throw new Error('Pinglish.reverseSyllable: invalid Pinglish syllable "' + s + '"');
      }
      return P2P_REV_PARSE[t.base] + (t.tone !== null ? String(t.tone) : '');
    }

    function toneMark(s) {
      var n = normalizePinyinSyllable(s);
      var key = n.base;
      if (!has(P2P_REV_PARSE, key) && !has(P2P, key)) {
        // ASCII pinyin spelling such as jv or nv.
        key = normalizePinyinAliases(key);
      }
      var pinyinBase;
      if (has(P2P_REV_PARSE, key)) {
        // lv -> lü, hve -> xue, gvn -> jun, yv -> yu, ...
        pinyinBase = P2P_REV_PARSE[key];
      } else if (has(P2P, key)) {
        // Already pinyin (shi, zi, xue, ...).
        pinyinBase = key;
      } else {
        throw new Error('Pinglish.toneMark: invalid syllable "' + s + '"');
      }
      return n.tone === null ? pinyinBase : markPinyinBase(pinyinBase, n.tone);
    }

    function stripToneMarks(s) {
      var tokens = tokenize(s);
      var out = '';
      var i;
      for (i = 0; i < tokens.length; i++) {
        var t = tokens[i];
        if (t.type === 'run') {
          var parsed = parseRun(normalizePinyinAliases(t.text), P2P, MAX_PINYIN, true);
          if (parsed) {
            var j;
            for (j = 0; j < parsed.length; j++) {
              out += parsed[j].base;
              if (parsed[j].tone !== null) out += String(parsed[j].tone);
            }
          } else {
            out += t.text;
          }
        } else {
          out += t.text;
        }
      }
      return out;
    }

    // ---------------------------------------------------------------------
    // Pinglish <-> pinyin text
    // ---------------------------------------------------------------------

    function classifyPinyinRun(text) {
      var parsed = parseRun(normalizePinyinAliases(text), P2P, MAX_PINYIN, true);
      if (!parsed) return null;
      var out = [];
      var i;
      for (i = 0; i < parsed.length; i++) {
        if (!has(P2P, parsed[i].base)) return null;
        out.push({
          type: 'syl',
          pinyin: parsed[i].base,
          pinglish: P2P[parsed[i].base],
          tone: parsed[i].tone
        });
      }
      return out;
    }

    function classifyPinglishRun(text) {
      var parsed = parseRun(text, P2P_REV_PARSE, MAX_PINGLISH, false);
      if (!parsed) return null;
      var out = [];
      var i;
      for (i = 0; i < parsed.length; i++) {
        if (!has(P2P_REV_PARSE, parsed[i].base)) return null;
        out.push({
          type: 'syl',
          pinyin: P2P_REV_PARSE[parsed[i].base],
          pinglish: parsed[i].base,
          tone: parsed[i].tone
        });
      }
      return out;
    }

    function renderPinglishTokens(tokens, opts) {
      var withTone = !opts || opts.tone !== false;
      var out = '';
      var lastType = null;
      var i;
      for (i = 0; i < tokens.length; i++) {
        var t = tokens[i];
        if (t.type === 'sep') {
          var next = tokens[i + 1];
          if (
            lastType === 'syl' &&
            next &&
            next.type === 'syl' &&
            startsAOE(next.pinglish) &&
            isWhitespaceOnly(t.text)
          ) {
            // A space would let the a/o/e syllable merge with the previous
            // one, so keep the boundary explicit with an apostrophe.
            out += "'";
          } else {
            out += t.text;
          }
          lastType = 'sep';
        } else if (t.type === 'syl') {
          if (lastType === 'syl' && startsAOE(t.pinglish)) out += "'";
          out += t.pinglish;
          if (withTone && t.tone !== null) out += String(t.tone);
          lastType = 'syl';
        } else {
          out += t.text;
          lastType = 'literal';
        }
      }
      return out;
    }

    function renderPinyinTokens(tokens, opts) {
      var markTones = !opts || opts.toneMarks !== false;
      var out = '';
      var lastType = null;
      var i;
      for (i = 0; i < tokens.length; i++) {
        var t = tokens[i];
        if (t.type === 'sep') {
          var next = tokens[i + 1];
          // Spaces and apostrophes are both syllable boundaries in pinyin
          // output; normalise them to a single space.
          if (
            lastType === 'syl' &&
            next &&
            next.type === 'syl' &&
            /^['\s]+$/.test(t.text) &&
            t.text.indexOf('\n') === -1 &&
            t.text.indexOf('\r') === -1
          ) {
            if (!/\s$/.test(out)) out += ' ';
          } else {
            out += t.text;
          }
          lastType = 'sep';
        } else if (t.type === 'syl') {
          if (lastType === 'syl') out += ' ';
          if (markTones) {
            out += markPinyinBase(t.pinyin, t.tone);
          } else {
            out += t.pinyin + (t.tone !== null ? String(t.tone) : '');
          }
          lastType = 'syl';
        } else {
          out += t.text;
          lastType = 'literal';
        }
      }
      return out;
    }

    function toPinglish(text, opts) {
      var tokens = tokenize(text);
      var out = [];
      var i;
      for (i = 0; i < tokens.length; i++) {
        var t = tokens[i];
        if (t.type === 'run') {
          var syls = classifyPinyinRun(t.text);
          if (syls) {
            var j;
            for (j = 0; j < syls.length; j++) out.push(syls[j]);
          } else {
            out.push({ type: 'literal', text: t.text });
          }
        } else {
          out.push({ type: 'sep', text: t.text });
        }
      }
      return renderPinglishTokens(out, opts);
    }

    function toPinyin(text, opts) {
      var tokens = tokenize(text);
      var out = [];
      var i;
      for (i = 0; i < tokens.length; i++) {
        var t = tokens[i];
        if (t.type === 'run') {
          var syls = classifyPinglishRun(t.text);
          if (syls) {
            var j;
            for (j = 0; j < syls.length; j++) out.push(syls[j]);
          } else {
            out.push({ type: 'literal', text: t.text });
          }
        } else {
          out.push({ type: 'sep', text: t.text });
        }
      }
      return renderPinyinTokens(out, opts);
    }

    function toPinglishSyllables(text) {
      var tokens = tokenize(text);
      var out = [];
      var i;
      for (i = 0; i < tokens.length; i++) {
        if (tokens[i].type !== 'run') continue;
        var syls = classifyPinyinRun(tokens[i].text);
        if (!syls) continue;
        var j;
        for (j = 0; j < syls.length; j++) {
          // tone is reported separately; callers append it themselves.
          out.push({
            pinyin: syls[j].pinyin,
            pinglish: syls[j].pinglish,
            tone: syls[j].tone
          });
        }
      }
      return out;
    }

    function toPinyinSyllables(text) {
      var tokens = tokenize(text);
      var out = [];
      var i;
      for (i = 0; i < tokens.length; i++) {
        if (tokens[i].type !== 'run') continue;
        var syls = classifyPinglishRun(tokens[i].text);
        if (!syls) continue;
        var j;
        for (j = 0; j < syls.length; j++) {
          // tone is reported separately; callers append it themselves.
          out.push({
            pinglish: syls[j].pinglish,
            pinyin: syls[j].pinyin,
            tone: syls[j].tone
          });
        }
      }
      return out;
    }

    // ---------------------------------------------------------------------
    // Chinese -> Pinglish (optional pinyin-pro bridge)
    // ---------------------------------------------------------------------

    function getPinyinPro() {
      var pp = null;
      if (typeof globalThis !== 'undefined' && globalThis.pinyinPro) {
        pp = globalThis.pinyinPro;
      } else if (typeof window !== 'undefined' && window.pinyinPro) {
        pp = window.pinyinPro;
      }
      if (!pp || typeof pp.pinyin !== 'function') {
        throw new Error(
          'Pinglish: pinyin-pro is not loaded. Include assets/vendor/pinyin-pro.js ' +
            'before assets/js/pinglish.js, or set globalThis.pinyinPro.'
        );
      }
      return pp;
    }

    function isHanCodePoint(cp) {
      return (
        (cp >= 0x3400 && cp <= 0x4dbf) ||
        (cp >= 0x4e00 && cp <= 0x9fff) ||
        (cp >= 0xf900 && cp <= 0xfaff) ||
        (cp >= 0x20000 && cp <= 0x2fa1f)
      );
    }

    // pinyin-pro gives one array item per Han character (and consecutive
    // non-Chinese chunks for everything else). Walk the original string in
    // parallel so we know which character produced each item.
    function collectChineseTokens(text) {
      var pp = getPinyinPro();
      text = String(text);
      var arr = pp.pinyin(text, {
        toneType: 'num',
        type: 'array',
        nonZh: 'consecutive'
      });
      var tokens = [];
      var pos = 0;
      var prevWasSyl = false;
      var i;

      for (i = 0; i < arr.length; i++) {
        var item = arr[i];
        var cp = text.codePointAt(pos);
        var ch = cp === undefined ? '' : String.fromCodePoint(cp);

        if (ch && isHanCodePoint(cp)) {
          pos += ch.length;
          var info = normalizePinyinSyllable(item);

          if (has(P2P, info.base)) {
            if (prevWasSyl) tokens.push({ type: 'sep', text: ' ' });
            tokens.push({
              type: 'syl',
              pinyin: info.base,
              pinglish: P2P[info.base],
              tone: info.tone
            });
            prevWasSyl = true;
          } else {
            tokens.push({ type: 'literal', text: item });
            prevWasSyl = false;
          }
        } else {
          tokens.push({ type: 'literal', text: item });
          pos += item.length;
          prevWasSyl = false;
        }
      }
      return tokens;
    }

    function chineseToPinglish(text, opts) {
      return renderPinglishTokens(collectChineseTokens(text), opts);
    }

    function chineseToPinyin(text, opts) {
      return renderPinyinTokens(collectChineseTokens(text), opts);
    }

    // ---------------------------------------------------------------------
    // Public API
    // ---------------------------------------------------------------------

    var Pinglish = {
      VERSION: VERSION,
      SPEC: {
        version: DATA.version,
        notes: DATA.notes,
        pinyinToPinglish: P2P,
        pinglishToPinyin: P2P_REV
      },
      forwardSyllable: forwardSyllable,
      reverseSyllable: reverseSyllable,
      toPinglish: toPinglish,
      toPinyin: toPinyin,
      toPinglishSyllables: toPinglishSyllables,
      toPinyinSyllables: toPinyinSyllables,
      toneMark: toneMark,
      stripToneMarks: stripToneMarks,
      chineseToPinglish: chineseToPinglish,
      chineseToPinyin: chineseToPinyin
    };

    return Pinglish;
  }
);
