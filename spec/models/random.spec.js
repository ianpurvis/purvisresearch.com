import { Random } from '~/models/random.js'

describe('random', () => {
  let mocks

  describe('comparison()', () => {
    beforeEach(() => {
      mocks = {
        sign: jest.spyOn(Random, 'sign').mockReturnValue('mockSign')
      }
    })
    afterEach(() => {
      mocks.sign.mockRestore()
    })
    it('returns a random sign', () => {
      expect(Random.comparison()).toBe('mockSign')
      expect(mocks.sign).toHaveBeenCalled()
    })
  })
  describe('rand()', () => {
    it('returns a random number in the interval [0,1)', () => {
      const mockRandomNumber = Math.random()
      global.Math.random = jest.fn().mockReturnValue(mockRandomNumber)

      const result = Random.rand()
      expect(result).toBe(mockRandomNumber)
      expect(global.Math.random).toHaveBeenCalled()
    })
  })
  describe('rand({ max, min })', () => {
    it('returns a random number in the interval [min,max)', () => {
      const mockRandomNumber = Math.random()
      global.Math.random = jest.fn().mockReturnValue(mockRandomNumber)

      const args = { max: 1, min: 0 }
      const result = Random.rand(args)
      expect(result).toBe(mockRandomNumber * (args.max - args.min) + args.min)
      expect(global.Math.random).toHaveBeenCalled()
    })
  })
  describe('sample(array)', () => {
    it('returns a random element from the array', () => {
      const mockRandomNumber = Math.random()
      global.Math.random = jest.fn().mockReturnValue(mockRandomNumber)
      const mockFlooredNumber = 1
      global.Math.floor = jest.fn().mockReturnValue(mockFlooredNumber)

      const array = [1, 2, 3, 4]
      const result = Random.sample(array)
      expect(result).toBe(array[mockFlooredNumber])
      expect(global.Math.random).toHaveBeenCalled()
      expect(global.Math.floor).toHaveBeenCalledWith(mockRandomNumber * array.length)
    })
  })
  describe('sign()', () => {
    beforeEach(() => {
      mocks = {
        sample: jest.spyOn(Random, 'sample').mockReturnValue('mockSample')
      }
    })
    afterEach(() => {
      mocks.sample.mockRestore()
    })
    it('returns a random sample of [-1, 1]', () => {
      expect(Random.sign()).toBe('mockSample')
      expect(mocks.sample).toHaveBeenCalledWith([-1, 1])
    })
  })
})
