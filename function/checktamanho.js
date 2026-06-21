
function checktamanho(item, min, max) {
  if (!item) return false

  if (item.length < min || item.length > max)
    return false
  else
    return true
}

module.exports = checktamanho
module.exports = checktamanho