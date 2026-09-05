/**
 * Grove Chainable RGB LED P9813
 * micro:bit / MakeCode
 * DATA = P0, CLOCK = P14
 */
//% color="#8A2BE2" icon="\uf1fc" block="Grove P9813"
namespace groveP9813 {
    let dataPin: DigitalPin = DigitalPin.P0
    let clockPin: DigitalPin = DigitalPin.P14
    let initialized = false

    function init() {
        if (!initialized) {
            pins.digitalWritePin(dataPin, 0)
            pins.digitalWritePin(clockPin, 0)
            initialized = true
        }
    }

    function clock() {
        pins.digitalWritePin(clockPin, 1)
        control.waitMicros(2)
        pins.digitalWritePin(clockPin, 0)
        control.waitMicros(2)
    }

    function sendByte(value: number) {
        for (let i = 0; i < 8; i++) {
            pins.digitalWritePin(dataPin, (value & 0x80) ? 1 : 0)
            clock()
            value = (value << 1) & 0xFF
        }
    }

    function sendColor(r: number, g: number, b: number) {
        init()

        // P9813 start frame
        sendByte(0x00)
        sendByte(0x00)
        sendByte(0x00)
        sendByte(0x00)

        // LED frame: 11 + 2-bit high portions + 6-bit values
        let rb = Math.clamp(0, 255, r)
        let gb = Math.clamp(0, 255, g)
        let bb = Math.clamp(0, 255, b)

        let brightnessR = (rb >> 6) & 0x03
        let brightnessG = (gb >> 6) & 0x03
        let brightnessB = (bb >> 6) & 0x03

        let data0 = 0xC0 | (brightnessB << 4) | (brightnessG << 2) | brightnessR
        sendByte(data0)
        sendByte(bb & 0x3F)
        sendByte(gb & 0x3F)
        sendByte(rb & 0x3F)

        // End frame
        sendByte(0x00)
        sendByte(0x00)
        sendByte(0x00)
        sendByte(0x00)
    }

    /**
     * Configure the Grove P9813 LED on P0/P14.
     */
    //% block="initialiser LED Grove P9813 (DATA P0, CLOCK P14)"
    //% weight=100
    export function initP0P14() {
        dataPin = DigitalPin.P0
        clockPin = DigitalPin.P14
        initialized = false
        init()
        off()
    }

    /**
     * Set RGB values from 0 to 255.
     */
    //% block="LED rouge %r vert %g bleu %b"
    //% r.min=0 r.max=255
    //% g.min=0 g.max=255
    //% b.min=0 b.max=255
    //% weight=90
    export function rgb(r: number, g: number, b: number) {
        sendColor(r, g, b)
    }

    //% block="LED rouge"
    //% weight=80
    export function red() { sendColor(255, 0, 0) }

    //% block="LED vert"
    //% weight=79
    export function green() { sendColor(0, 255, 0) }

    //% block="LED bleu"
    //% weight=78
    export function blue() { sendColor(0, 0, 255) }

    //% block="LED jaune"
    //% weight=77
    export function yellow() { sendColor(255, 180, 0) }

    //% block="LED blanc"
    //% weight=76
    export function white() { sendColor(255, 255, 255) }

    //% block="LED éteinte"
    //% weight=75
    export function off() { sendColor(0, 0, 0) }
}
