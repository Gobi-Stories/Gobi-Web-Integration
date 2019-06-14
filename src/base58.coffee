assertNonNegativeSafeInteger = (val) ->
  if typeof val != 'number' or isNaN(val) or val < 0 or val > Number.MAX_SAFE_INTEGER or Math.floor(val) != val
    throw new Error('Value passed is not a non-negative safe integer.')
  return

assertString = (str) ->
  if typeof str != 'string'
    throw new Error('Value passed is not a string.')
  return

assertBase58Character = (character) ->
  if alphabetLookup[character] == undefined
    throw new Error('Value passed is not a valid Base58 string.')
  return

int_to_base58 = (num) ->
  str = ''
  modulus = undefined
  num = Number(num)
  assertNonNegativeSafeInteger num
  while num >= base
    modulus = num % base
    str = alphabet[modulus] + str
    num = Math.floor(num / base)
  alphabet[num] + str

base58_to_int = (str) ->
  assertString str
  str.slice().reverse().reduce ((num, character, index) ->
    assertBase58Character character
    num + alphabetLookup[character] * base ** index
  ), 0

'use strict'
Object.defineProperty exports, '__esModule', value: true
alphabet = '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ'
base = alphabet.length
# Create a lookup table to fetch character index
alphabetLookup = alphabet.split('').reduce(((lookup, char, index) ->
  lookup[char] = index
  lookup
), {})
exports.int_to_base58 = int_to_base58
exports.base58_to_int = base58_to_int
