/* 撒油拿拉 Sayonara —— 礼顿生闷气期间不留堂 */
(() => {
  const SC = () => window.SugarCube || {};
  const getV = () => { const S = SC().State || window.State; return S && S.variables; };
  const today = () => { try { return window.Time ? window.Time.days : NaN; } catch (e) { return NaN; } };

  // 礼顿接下来 days 天都不留你的堂（取更长的那个）
  function sayonaraSulk(days) {
    const V = getV(), d = today();
    if (!V || isNaN(d)) return;
    if (!V.sayonara || typeof V.sayonara !== 'object') V.sayonara = {};
    V.sayonara.sulkUntil = Math.max(V.sayonara.sulkUntil || 0, d + days);
  }
  function sayonaraSulking() {
    const V = getV(), d = today();
    return !!(V && V.sayonara && typeof V.sayonara.sulkUntil === 'number' && !isNaN(d) && d < V.sayonara.sulkUntil);
  }
  // 文字动画：跟着原版设置走，关掉动画时只保留发光
  function sayoFx(kind) {
    const V = getV();
    const o = (V && V.options) || {};
    const on = flag => !!(o.textAnimsAll && o[flag]);
    switch (kind) {
      case 'drunk': return on('textAnimsDrunk') ? 'drunk-text drunk-2' : 'drunk-text';
      case 'jitter': return on('textAnimsHeat') ? 'jitter-text jitter-2' : 'jitter-text';
      case 'hypno': return on('textAnimsHypno') ? 'hypno-text hypno' : 'hypno-text';
      default: return '';
    }
  }
  Object.assign(window, { sayonaraSulk, sayonaraSulking, sayoFx });


  /* ===== 礼顿的内裤图鉴 ===== */
  const BOXERS = [
    { id: 'grey',    name: '灰色四角裤',         rarity: '普通', weight: 10, colour: 'black',
      line: '一条灰色四角裤，无聊得和它的主人一模一样。' },
    { id: 'white',   name: '白色三角裤',         rarity: '普通', weight: 10, colour: 'white',
      line: '一条白色三角裤，松紧带已经有点松了。' },
    { id: 'navy',    name: '深蓝格子四角裤',     rarity: '普通', weight: 10, colour: 'blue',
      line: '一条深蓝格子四角裤，格子方方正正的，像一本行为守则。' },
    { id: 'stripe',  name: '红紫条纹四角裤',     rarity: '稀有', weight: 5, colour: 'purple',
      line: '一条红紫相间的条纹四角裤。你没想到礼顿私底下这么张扬。' },
    { id: 'clash',   name: '橙绿撞色四角裤',     rarity: '稀有', weight: 5, colour: 'orange',
      line: '一条橙绿撞色的四角裤，颜色刺眼得像警示牌。' },
    { id: 'duck',    name: '小鸭子四角裤',       rarity: '稀有', weight: 5, colour: 'gold',
      line: '一条印满了黄色小鸭子的四角裤。小鸭子们排着队，整整齐齐。' },
    { id: 'rule',    name: '"校规第一条"四角裤', rarity: '稀有', weight: 5, colour: 'teal',
      line: '一条印满了"校规第一条"的四角裤。你没看清第一条到底是什么。' },
    { id: 'heart',   name: '粉色爱心四角裤',     rarity: '史诗', weight: 2, colour: 'pink',
      line: '一条粉色的、印满了爱心的四角裤。老来俏。' },
    { id: 'flower',  name: '大花内裤',           rarity: '史诗', weight: 2, colour: 'sayo-flower',
      line: '一条印着鲜艳大花的四角裤，配色饱和度给人留下了深刻的印象。' },
    { id: 'checker', name: '棋盘格四角裤',       rarity: '史诗', weight: 2, colour: 'sayo-checker',
      line: '一条黑白棋盘格的四角裤。格线有点歪。你不确定能不能在这上面下棋。' },
    { id: 'face',    name: '证件照四角裤',       rarity: '传说', weight: 1, colour: 'red',
      line: '一条正面印着礼顿自己证件照的四角裤。照片上的礼顿面带微笑，和此刻满脸通红的本人形成了鲜明对比。' },
    { id: 'glow',    name: '夜光四角裤',         rarity: '传说', weight: 1, colour: 'green',
      line: '一条……在发光的四角裤。荧绿色的，在昏暗的书架间幽幽地亮着。' },
  ];
  function sayoBoxerRoll() {
    const V = getV();
    const total = BOXERS.reduce((s, b) => s + b.weight, 0);
    const S = SC().State || window.State;
    const rnd = (S && typeof S.random === 'function') ? S.random() : Math.random();
    let r = Math.floor(rnd * total) + 1;
    let pick = BOXERS[0];
    for (const b of BOXERS) { if (r <= b.weight) { pick = b; break; } r -= b.weight; }
    if (V) {
      if (!V.sayonara || typeof V.sayonara !== 'object') V.sayonara = {};
      if (!Array.isArray(V.sayonara.boxers)) V.sayonara.boxers = [];
      V.sayonara.boxerNew = !V.sayonara.boxers.includes(pick.id);
      if (V.sayonara.boxerNew) V.sayonara.boxers.push(pick.id);
      V.sayonara.boxerLast = pick.id;
    }
    return pick.id;
  }
  const BOXER_ICONS = {"grey": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA/klEQVR4nGNgGAWjYIABIzZBCRGZ/7Sw7MWbJxj2YQhIiMj8Lywtp4X9DP3dnRiOYKKJTSQAFmyCT58+HlgH3L9/Z2AdYGioj8L/9OkzyQa/fv2afAdoaemg8N+9e0eyA7i4uIlSN+CJcHA5QEJE5v+EKROxKnz37i0ckwuS0pIxCrkBDwGsiRAbEBISpokDKAqBprpGhqa6xoFzADUA3AH4EiAMvHz5As5uqmtkePHmCeOLN08YkUMBWQ02gJ4QB08IEAPExSUYGBgQvoeJI4cCTA1NHEALMOAOQCkHLlw4T5Fhjx49JFnPgIcASvuM2MYotsYlNfSPglEwIAAAGg9UewdYmbkAAAAASUVORK5CYII=", "white": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA80lEQVR4nO2VwQqCMBiAf6UXEAwMtKOQJx/BV+hQrxv4AJ5SokuSQkKikNB13US3lfuHq0P7QNAx/L45VACN5t8x6AHHdolKYVWXjHMkVw29wAUdkSQnBet+DxMQx4ffBoThhpnUdU/0jfP8IhcQRREzqW07dIBlWULzzOFFVZfGaumhZaLstnvmLTDpSaoieHIAzhYMIsjtXvRjRXHtzz1vPYscgPMEqAiUCCsH4HwJaRzbJdk5Q4vT9DgpFwqQjQj8YFIO8GELhlR1aQR+MLtcOAATgZGjAkQisHJpHNslTfMYHbK/celaWviVlWs0Go0KXoUx0F6YQh3mAAAAAElFTkSuQmCC", "navy": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACjUlEQVR4nO1WTWsTURQ9CTWZGE2MTphIJ1A1xYClpZS4EYRuhIIL/4Hg3pW/w5Xb/gBX3RbcFIQuJBSxG1tsQ8BJOzFDJh/NZD46GReTmcyb9xITMHSTs3pz3n3vnrnvvDsDLLDADSPCInO86MwjmaxIVD6KyPGiE8+8mEd+GOohJSI6l0wzYIlFmoZ6swL0fmMuyeLTCnj0/B3k02/+88DWkH28iXbtnIhLLz9Bo/Kd4Lw402j63J1sHmrtBDDoF2MKyDzcRPtC9p9tq4u0sAara5MChDV06w2Ks7o2ohrnc3cfFKA1VQyMUyoX8xY8e/OZ4Axt9iPpqVWKuyx/pG4BswIAUD3a98e21YW4vg3l7AcRwxc2IB0fEJwXp2ujCmbyT1H/VWbmIa5hjhcdvviBGaj3GrCMFiyjNU7zPxG995JqclQF+j0FAJBI8j53bd4CABh9N7ltD/w57vZ9WqzWhKl3CC7Gpdy5UOzYIwiDS2axFEtNGz41CEOwDAiMN+HZl/cAgMKrT9Qcy4QAbUSqAtWjfaxs7aB+MjLNtdlmGs5D0JxenKkrPieslqD+pq8gEDBhjhedZP4tM8iDFWjRurwHWZEisiJFWpVdn+93ahP34HKvCSMSFQgazzMj4F5DAIhzacQSrunCZtI1t/MlwQ+NaRLzYVN6mOlrGEu4AluVXeIcZUWK6PKe+xKp5Vm2JCsgFEv+eGVrxx97JuQLG0MB7M3E9W0/rqemiTlhdbT3ZfkrW4BnPKFYmqoThiEdH8zcCQkBV+pPl5RsaB3yy3fVPIfeu5gowOj/YcY5jg3HGTDXEAKMgFHiHN10jDFGCq9hxQX309sjnmpEEzMMwfq5/B/rF1jgRvAXyFsiH3849msAAAAASUVORK5CYII=", "stripe": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABaklEQVR4nO1WMUvDQBh9kUjToqDQaosFN0HRSacudu8kFPUn9B84+hu6OrkKurjZzcnFVTq0HYSEhDSaocRcSmscpHe2uZSoCdchb/ruy9333j0+Lh+QIoVgSLxkMV/2kyAzLDXAJ/PIjzfrSfDjEbf+rIilRJh+gYADAGATU6yAvqOKFVAtnKNCrum6JZ/Q+Ijc0PhZOQvNvxEdALA/fKD5q1FEATtrh6g493TdXT5gRHKLxu+58HxWXgEA7LlPrLDnBLiEN+FiCSjmy/7l7h13o+2ZsD0T+pD8mey0dBF45IQ7wG1CHtYzGwCA0liJVcC/HGj2Gmj2GuIExAEqYF4DTtB3NRrX9A4MS5UMS5V+uvDqfcytMduIi+NAFBSyWwDY7Sd5w1Klmt4BAGxncskJSALCBUy9Ay82+3GsEovGmtKlcZsMQou13e9vms/2j8Aevk9/HDgj3IGp+SzqMMobLuM4nyKFEHwBpk13jems8tkAAAAASUVORK5CYII=", "clash": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABFUlEQVR4nGNgGAWjYIABIzZBCRGZ/7Sw7MWbJxj2sWCzXEFFiRb2MzAwMPxHdwQTrWwiFmCEAAMDA8PXr18G1gGfPn0cWAcsiPqEKvD5L04DSrWwp5dvT79hiP2c+ZM4BzhosqMKvMftACEjIazirHysGGLvGD5hiA14IhxcDpAQkfn/vA+7wofv/sIxuUBxgixGITfgIYA1EWID8kLMNHEARSEg2czMcMnn2sA5gBoA7gB8CRAGbr76A2dLNjMzvHjzhPHFmyeMyKHw9dFXvGagJ8TBEwLEAHUxSJqF+R4mjhwK3HLctHMALcCAOwClHDh76QeR2rCXCZ9uYFY2hMCAhwBK+4zYxii2xiU19I+CUTAgAADPaVYhICx3bAAAAABJRU5ErkJggg==", "duck": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABo0lEQVR4nGNgGAWjYIABIzZBCRGZ/7Sw7MWbJxj2YQhIiMj8Ny7dRwv7Gc52O2E4gokmNpEAWLAJfnx6dWAd8O7+6YF1gHe0Kwr/y7sfJBts/NaTYeePaShih48T6QB1CwcU/ocX3xiK+bgZej99JcryYj5uhks3GRhMN2cxLHQ6gVctUYmwmI8bQm/gJqgOppaBgYGg5QwMOEIABpL5oTnmG4TqDSAuBEgBKHlSQkTmf8uZx5gOeM7A8PAZA8PsL9cZGBgYGAQl5Aga/OzOZaziywpCUMoCvCEw9yOkQPzw6RvD+y+PCFpKDsDrAGRAjK/JARSVhD0+6gw9Pup41cRzW1DPAcgpnBgAszx+H25HwB2AngCxWX7zPiIr9vioM7x484TxxZsnjMih8PrRbYZiPm4UnyNnx6gJa1BqW4JpIJmfEZ4NGRionxWJToQMDAwM6ooMDFs+IXwPE4eGwv+SLTcZROVUGXo/fWV49hV7NiTZAXM//mf48OkbIWVkg8HVHrhy4ChFhj25cZ5kPQMeAhh1ATGasDUuqaF/FIyCAQEAv4OIhOhquJkAAAAASUVORK5CYII=", "rule": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABhElEQVR4nGNgGAWjYIABIzZBCRGZ/7Sw7MWbJxj2YQhIiMj8/7J8Pi3sZ+CJTMRwBBNNbCIBsGAT/Hf79sA64O/lywPrgB1hXij8T+/fkmzw/QePMcQ6iHWAg4MNCv/ty+ckO0BAgJ8odXgToa6uLYOuri0DAwMDg41DEIONQxDR7PikQob4pEKCDsAaAjBw+fJhBgYGBgZNTUuGIwfWocjB+EcOrINbiqxm4bx+gpYzMKCVAxIiMv+fv8ZMgG9fPmd4/OQZnC8rI0XQ4KvXbmIVDw/LRSkLBmc5AAOw+D+wZxVDZEwOAwMDZpDjYsPin1BUUJQGdHTcGBgYGBgERHjgYjBAbBogKgpwJUBcfFIA3AG4EiAyuHP3Ppyto+PG8OLNE8YXb54wwkICXQ02sHLVZJTalug0YOMQxPDr1y+GU8e2wOMaHSCroWka+PDmC0pWgobC/ytXdsHV0DQNUBMMrnJg7649FBl24eJVkvUMeAhg1AXEaMLWuKSG/lEwCgYEAAD8ibBE+IcpWAAAAABJRU5ErkJggg==", "heart": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABhUlEQVR4nGNgGAWjYIABIzZBCRGZ/7Sw7MWbJxj2YQhIiMj8fx42kxb2M0iuSsdwBBNNbCIBsGATfP76zsA6YPezKwPrALkIN1SBD+9INvjui6eYgjeJdICDoRWqwOsXRFn6qKSXQa6nmOFRSS+DUI4fUXoIJsK/yfVwwwlZjkw/711IuQPQLcfnCLmeYhS+ZHE86Q6QEJH5/3zDSTifeW4jnP3091eG/+VRDA9fPyfoCHTHwMDO6h6MQo5gFMAcIVWTSkgpXstxAayJkFJDSQEUlYSSqf4Mkqn+9HEAMQkRGcByAaHcAK8Y0BMgiuXxpQwMDAwM9359YlBi42NgYGBgMP94CF6xSIjI/H8+eyMDAwMDw82nDxk4+9cwXP/5HsUM5Fzh3loC10tUCKCnAUJpgpQsSXQUyPUUMyix8THI9RQzSKb6o1SrL948YYSlBXVpeRRLCZUHJCVCUnMDMYXR4GoPnD2xnyLDzt69TrKeAQ8BlPYZsY1RbI1LaugfBaNgQAAA6X6J/x8Wb7wAAAAASUVORK5CYII=", "flower": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACuUlEQVR4nO2WT0hUURTGf/5LGxchDTELJaFFEUgMKCjYQovnThiIIRLCTS1EQmiioSbFScHKQKQsciPBSEyQNIHhgM1G0EXgYiAwERSHdGEYhKY547R4vttc332vWSSzmW937z3vnHO/851zH+SRR45RoNp0OSvTRxFsfSNhilesCn5y9NxRxIcbpA8nUXg0kbKHiQGAnaWfuU1g68tmbhN4+U7W4Pd0Uvlxb22Ans99yrNE6re0fnH+JjBqsjOp0uWsTMcLT0l7a/t7AHi1EOFomzIggCfoYKJ7G4DWuh6S7l6GRn6J887iHVMn2IqwqXWKxuFysQ5H2/AEHUpbrxZionubmpExaq494H1zUgpuBdsEYpEWZm5tCac1I2Pihl4tJNkKZmaW4LYX5lfFma9hILsEVPQbTleuelmZnOPbQW0tS9F4Bp6GwV0ltgZn/QA8S5aZhpwlA02tU7LTV8+h7rTS1mDDE3QQ72gnPv6Qxf4AXR3HrdwLSIJQMdA4XM7bzh9i7Qk6KJkZtRUjwNekXn9fw4BgAMxC/GcCABcvjykDaujzIkqF2DM6xUjgMA4noCyBRD829VbAzlYlRpFA5u1jkRap/UCnfjm1K+qtscn6RqJgfSNRYDABsJzaFa1qBDS0MDjrNwlRUKGi3/nmA0wvwIUTxDvaWU7tUl1UKiVgfBulAq8W4vHHK1QXlZK+e19vRXcVi/0ByW9mGUwlkOifXoDeZr23QRkc9HdeY5NwtE3YML8K1++IeWA1C0wJxCItfxeXzkLPJ70NMQ8fW7ir4PUTMQ8yOyETyscI9PYrGT9GLOJjbX/vYM5nJ0ZP0MGjewe0T+oasBrLkgbKagcZmAsoDTPRpXhUXM7K9FCyTGnvr++T/HZZacAuuL9e/exmY2vn13SLbAKofi7/x/d55JET/AErXh76fForPgAAAABJRU5ErkJggg==", "checker": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABnElEQVR4nO1WMWvCQBT+tB1E2y2FDFkEBwcD0XZwcPAndOggJWBnoXvBqUOHzgWXUnGQ0h/Swckl/oIaqLUZdBBEA+mUI+9ypqY23JJvet+9d/e+e3kvHJAihWRkRIuqonlJJJs5dihfaEFVNK9lXieRH2/D15CIbCKZYuBYtDiff8kVYNtTuQKm0w9m9/vPWK1WjHc6tyS213si3PdvNhsAQLd7x3wP94/7CSgUTpndbDaxXC4Zz+cLJLbRaBDu+7PZIwBAtVoVpYgWYFljZut6Da67ZXw0eiex9ToV4PsnkwkAwDRvIgVInwIiQFU07/M7uQbMneRCPznpFQj1gK7XCLesMWnCXd+c96/XawDAcDgg/qvLFuEHVWDhLFAuVQ45QjwFAJ0EQHzzYHLez9981zSwCqiK5inqWbTcAMqlCmaOnZk5diZOFfhGJBXg59+H625D35pPyvsN44LwYEWCffCnHvBv7/O4VQhC+hhKF0B6oFgsMXsweCGBhnH+62HBGH6/abaFe6RXgLzP9n2Mih6X/7E/RQop+AEZBYRow37NKgAAAABJRU5ErkJggg==", "face": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABcUlEQVR4nO1WMUjDQBR9EXVwlAitVEHoEN31JqGbS4eCW52zdNDJQTBTxQ6Z2qHL7W5unbo6ZY0gIsXFQKOGSm0JxSUO0kB6kV6vCbfkbf/D++/l59/dBzJkkAwlLplTC0EaYq7nMHqrceLbB9U09IGnu2DWxEo6SvxgOgAA/vhdroHx8E2ugV2NROKfyQgAYF6fchW9vLmHP/KY/GD4wmdAze9H4on/BQAolUqwnj209ONY4XP6AKKp2KQ21tY3WAOvLCfWAA9osxGJ9YsroTpCp4A2GyiWa2FcLNcYQ0IGcmohOKrcziVZeh29TjuMe502LL0+l7d3WGUuOaFfQKjBCBJq4FGglvAMEGqIUpczQDQVQAUAkN/aAQD0P//uDfIPJzEDJ2ethfI8CIeQdwCnsLsmXM9RXM9R7K7JzZsdROmPkZCB6ddP40W7sLSBJCHdQOQUfDj2UsW+B4s/49I7ENnPeJfRuOUyCX6GDFLwC/LzcAptRFtaAAAAAElFTkSuQmCC", "glow": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACMUlEQVR4nOWXv0sjQRTHvwl2HhjjcgQLw9kdXJTLFRFEELGwDFgZDq6++ppLY2GKXLPgv5Amaa/RIoIgpjCg0bhyQVDDBc4s596tEfWKwx9NdpyZnWRn1ywp/FZ5w7z5fHf25e0M8NIVEA2uPHyN+QFbDnzTHA204b4YAKDxJhgDFDzuk4EKb4IYoOH59PcvftBT2aTKmwiI4JMrk37wUV2u2kwEfSG50IBo0KyY/TVwUbror4GlD9M4hI4JRAAALdyg1vqNt0OvyRyneKd6gvFXYRKfXf/FL/yTM9CaHcBHzJB43dCwqCRIXDYajvF8+KmVaKaO+eEYcoVNG0tYhDN4Q35vo46EMsYs7ibWTB2x4YgI09kADafN9BoOAAG+B6xmP9vgf9DCxv4PvA+PAgCUaMgRvrZ1wMAtM7nCJtMLhDsgenILLrsTIrhINgM83KoBJRqCEg3hdPDK3xrg4d1qIJPOo6iWpOGaqTsbkIWXjQYzXwYu2okgHAqQXrx5bJC4qJaQyibVVDapZtJ5Am8eG11r4NPSHNpf2ziAmHQNdHpSXlWz6eo1MAZEcDpujNwioYwhk87Tf6WKtQtlo4GFKbYDOr0GxoCbAhTJaw3Y5AVOy00fYD5Gu3s1HF3qeBeKYBc1ACBx/ec5iTupvndO5t/hnsm/+38vzGd2wJosG/Pykm/7FnRcnRLdy9tDnvNth1KZBcCdbJ+TLzqWy8h2wfCaL7qYOEp0xepF/svUI3D2kARqvXAdAAAAAElFTkSuQmCC"};
  const sayoBoxer = id => BOXERS.find(b => b.id === id) || null;
  const sayoBoxerIcon = id => BOXER_ICONS[id] || '';
  Object.assign(window, { sayoBoxerRoll, sayoBoxer, sayoBoxerIcon, sayoBoxerList: BOXERS });

  $(document).on(':passagestart', () => {
    try {
      const V = getV();
      if (!V || !sayonaraSulking()) return;
      if (V.daily && V.daily.school) V.daily.school.detentionAttended = 1;
      if (typeof V.detention === 'number' && V.detention > 0) V.detention = 0;
    } catch (e) { console.error('[Sayonara]', e); }
  });
})();
