import assert from 'assert'

import PCRE from '../src/lib/PCRE'

before(async function () {
  await PCRE.init()
})

describe(`PCRE multiple substitutions`, function () {
  describe(`substituteAll()`, function () {
    let re
    const pattern = "(there)"
    const replacement = "world"

    beforeEach(function () {
      re = new PCRE(pattern)
    })

    afterEach(function () {
      re.destroy()
    })

    it(`should replace all "there" instances with "world"`, function () {
      const result = re.substituteAll("hello there, there!", replacement)

      assert.strictEqual(result, "hello world, world!")
    })

    it(`should return the subject if no subtitutions are done`, function () {
      const subject = "no matches here"
      const result = re.substituteAll(subject, replacement)

      assert.strictEqual(result, subject)
    })

    it(`should handle resizing of the output buffer transparently`, function () {
      const subject = 'a'
      const re = new PCRE('a')
      const result = re.substituteAll(subject, 'bbbb')
      re.destroy()

      assert.strictEqual(result, 'bbbb')  // PCRE2_ERROR_NOMEMORY
    })

    it(`should return an error code on invalid utf16 string`, function () {
      const subject = 'a'
      const re = new PCRE('a')
      const result = re.substituteAll(subject, '\uD800') // unpaired lead surrogate
      re.destroy()

      assert.ok(result < 0)
    })
  })
})