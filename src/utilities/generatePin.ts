/**
 * This function acts as a pin generator. It will generate exactly a
 * 6-digit integer at random.
 */
export default function generatePin(): number {
    const randomNum = 100000 + Math.random() * 900000
    return Number.parseInt(randomNum.toString(), 10)
}
