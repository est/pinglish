# Pinglish 规格 v1.0

> Pinglish 是一个 **面向键盘、可逆、无附加符号** 的汉语罗马字方案。
> 它不是官方标准，而是一次公开的设计练习：如果 1958 年的《汉语拼音方案》
> 生在 2026 年，它可能会长成什么样？

## 0. 一句话

**一个音一个写法，一个写法一个音；所有字符都在键盘上；声调就是数字。**

## 1. 设计原则

1. **纯 ASCII。** 不使用 `ü`、声调符号、任何附加符号。`v` 就是元音 /y/。
2. **不简写。** `iou`、`uei`、`uen` 永远写全；没有 `iu`、`ui`、`un` 的缩写。
3. **不改写。** `au` 不写 `ao`，`ung` 不写 `ong`，`iung` 不写 `iong`，`ien` 不写 `ian`。
4. **不设形式声母。** 没有 `y`、`w` 隔音字母。零声母直接写韵母，必要时用 `'` 分音节。
5. **舌尖元音独立。** `zi/ci/si/zhi/chi/shi/ri` 的韵母写作 `y`，不再和 `i` 混用。
6. **声调后置。** 声调用音节末尾的数字 `1–4` 表示，轻声用 `0`。声调是拼写的一部分。
7. **可逆。** 任意合法 Pinglish 字符串都能唯一还原为拼音音节序列。
8. **少用字母。** 只使用 22 个拉丁字母：`a b c d e f g h i k l m n o p r s t u v y z`。
   不使用 `j`、`q`、`w`、`x`。

## 2. 声母

| Pinglish | 拼音 | IPA | 例 |
| --- | --- | --- | --- |
| b | b | p | 八 ba1 |
| p | p | pʰ | 怕 pa4 |
| m | m | m | 妈 ma1 |
| f | f | f | 发 fa1 |
| d | d | t | 大 da4 |
| t | t | tʰ | 他 ta1 |
| n | n | n | 你 ni3 |
| l | l | l | 来 lai2 |
| g | g | k | 高 gau1 |
| k | k | kʰ | 开 kai1 |
| h | h | x | 好 hau3 |
| g | j | tɕ | 鸡 gi1 |
| k | q | tɕʰ | 七 ki1 |
| h | x | ɕ | 西 hi1 |
| zh | zh | tʂ | 知 zhy1 |
| ch | ch | tʂʰ | 吃 chy1 |
| sh | sh | ʂ | 诗 shy1 |
| r | r | ɻ | 日 ry4 |
| z | z | ts | 资 zy1 |
| c | c | tsʰ | 次 cy4 |
| s | s | s | 思 sy1 |

`g/k/h` 在 `i`、`v` 前读舌面音 [tɕ/tɕʰ/ɕ]，在其他位置读 [k/kʰ/x]。
这是互补分布：`gi/ki/hi` 与 `ga/ka/ha` 不会冲突，因此不需要 `j/q/x`。

## 3. 韵母

| Pinglish | 拼音 | 例 |
| --- | --- | --- |
| a | a | 啊 a1 |
| o | o | 哦 o4 |
| e | e | 鹅 e2 |
| eh | ê | 欸 eh1 |
| ai | ai | 爱 ai4 |
| ei | ei | 诶 ei1 |
| au | ao | 熬 au2 |
| ou | ou | 欧 ou1 |
| an | an | 安 an1 |
| en | en | 恩 en1 |
| ang | ang | 昂 ang2 |
| eng | eng | 鞥 eng1 |
| er | er | 儿 er2 |
| i | i | 衣 i1 |
| ia | ia | 呀 ia1 |
| ie | ie | 耶 ie1 |
| iau | iao | 腰 iau1 |
| iou | iou/iu | 优 iou1 |
| ien | ian | 烟 ien1 |
| in | in | 因 in1 |
| iang | iang | 央 iang1 |
| ing | ing | 英 ing1 |
| iung | iong | 雍 iung1 |
| u | u | 乌 u1 |
| ua | ua | 蛙 ua1 |
| uo | uo | 窝 uo1 |
| uai | uai | 歪 uai1 |
| uei | uei/ui | 威 uei1 |
| uan | uan | 弯 uan1 |
| uen | uen/un | 温 uen1 |
| uang | uang | 汪 uang1 |
| ueng | ueng | 翁 ueng1 |
| ung | ong | 东 dung1 |
| v | ü | 迂 v1 |
| ve | üe | 月 ve4 |
| ven | üan | 冤 ven1 |
| vn | ün | 晕 vn1 |
| y | -i（舌尖） | 资 zy1、知 zhy1 |

补充规则：

- `b/p/m/f + o` 写 `uo`：波 buo1、破 puo4、摸 muo1、佛 fuo2。
- `o` 单独出现只用于「哦」等叹词。
- `z/c/s/zh/ch/sh/r + i` 一律写 `y`：zy、cy、sy、zhy、chy、shy、ry。
- `j/q/x + ü` 分别写 `gv/kv/hv`：居 gv1、去 kv4、虚 hv1。
- `j/q/x + üe/üan/ün` 分别写 `gve/kve/hve`、`gven/kven/hven`、`gvn/kvn/hvn`。
- `n/l + ü` 写 `nv/lv`：女 nv3、吕 lv3。

## 4. 零声母

零声母直接写韵母，不写 `y/w`：

| 拼音 | Pinglish |
| --- | --- |
| yi | i |
| ya | ia |
| ye | ie |
| yao | iau |
| you | iou |
| yan | ien |
| yin | in |
| yang | iang |
| ying | ing |
| yong | iung |
| wu | u |
| wa | ua |
| wo | uo |
| wai | uai |
| wei | uei |
| wan | uan |
| wen | uen |
| wang | uang |
| weng | ueng |
| yu | v |
| yue | ve |
| yuan | ven |
| yun | vn |

## 5. 声调

| 声调 | 数字 | 例 |
| --- | --- | --- |
| 阴平 | 1 | 妈 ma1 |
| 阳平 | 2 | 麻 ma2 |
| 上声 | 3 | 马 ma3 |
| 去声 | 4 | 骂 ma4 |
| 轻声 | 0 | 吗 ma0 |

数字紧跟在音节后。词内音节直接连写，词间用空格：

> 我喜欢吃北京烤鸭。
> uo3 hi3 huan0 chy1 bei3 ging1 kau3 ia1.

分音节歧义时用 `'`：

> 西安 hi1'an1 ／ 先 hien1
> 天安门 tien1'an1 men2

## 6. 示例

| 汉字 | 拼音 | Pinglish |
| --- | --- | --- |
| 汉语拼音 | Hànyǔ Pīnyīn | han4 v3 pin1 in1 |
| 吕 | lǚ | lv3 |
| 女 | nǚ | nv3 |
| 薛 | xuē | hve1 |
| 学 | xué | hve2 |
| 雪 | xuě | hve3 |
| 鸡 | jī | gi1 |
| 七 | qī | ki1 |
| 西 | xī | hi1 |
| 居 | jū | gv1 |
| 去 | qù | kv4 |
| 虚 | xū | hv1 |
| 知 | zhī | zhy1 |
| 吃 | chī | chy1 |
| 诗 | shī | shy1 |
| 日 | rì | ry4 |
| 资 | zī | zy1 |
| 次 | cì | cy4 |
| 思 | sī | sy1 |
| 波 | bō | buo1 |
| 多 | duō | duo1 |
| 东 | dōng | dung1 |
| 工 | gōng | gung1 |
| 穷 | qióng | kiung2 |
| 兄 | xiōng | hiung1 |
| 烟 | yān | ien1 |
| 边 | biān | bien1 |
| 冤 | yuān | ven1 |
| 军 | jūn | gvn1 |
| 云 | yún | vn2 |

## 7. 算法

正向（拼音 → Pinglish）：

1. 分离音节末尾的声调数字。
2. 若整个音节在零声母表中，直接替换。
3. 否则按 `zh/ch/sh` → 单字母的顺序切出声母。
4. `j/q/x` 替换为 `g/k/h`，并把韵母的 `ü` 写作 `v`（`u`→`v`、`ue`→`ve`、`uan`→`ven`、`un`→`vn`）。
5. 其余声母按韵母表替换，并处理 `-i`→`y`、`b/p/m/f + o`→`uo`。
6. 拼回声母 + 韵母 + 声调数字。

反向（Pinglish → 拼音）是上述映射的逆运算；由于 407 个标准汉语音节映射后 **零碰撞**，可唯一还原。

## 8. 已知取舍

- `g/k/h` 在 `i/v` 前变读，是「一个字母两个音」。它换来的是彻底删除 `j/q/x`，并且变读条件完全可预测。
- `ien/ven` 按实际元音 [ɛ] 拼写，牺牲了与 `an/uan` 的形态对应。这是「表音优先」的选择。
- `v` 在多数语言里是辅音，这里是元音。它换来的是纯 ASCII、单字母、无需 `ü`。
- 声调数字不如声调符号美观，但它可输入、可搜索、可排序、可逆。
- `y` 表示舌尖元音，只出现在 `z/c/s/zh/ch/sh/r` 之后，不会与别的音冲突。

## 9. 参考

- 《汉语拼音方案》（1958）
- 国罗（Gwoyeu Romatzyh，1928）
- 北方话拉丁化新文字（1931）
- 1956 年《汉语拼音方案草案讨论集》
- 周有光《汉字改革概论》
- 本文档整理的知乎讨论：`docs/23148320.md`
