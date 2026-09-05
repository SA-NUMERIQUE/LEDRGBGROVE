//% color="#7A3E9D" icon="\uf1fc" block="Grove P9813"
namespace groveP9813 {
    let dataPin: DigitalPin = DigitalPin.P0
    let clockPin: DigitalPin = DigitalPin.P14
    let initialized = false

    function initPins() {
        if (!initialized) {
            pins.digitalWritePin(dataPin, 0)
            pins.digitalWritePin(clockPin, 0)
            initialized = true
        }
    }

    function clockPulse() {
        pins.digitalWritePin(clockPin, 0)
        control.waitMicros(20)
        pins.digitalWritePin(clockPin, 1)
        control.waitMicros(20)
    }

    function sendByte(value: number) {
        for (let i = 0; i < 8; i++) {
            pins.digitalWritePin(dataPin, (value & 0x80) != 0 ? 1 : 0)
            clockPulse()
            value = (value << 1) & 0xFF
        }
    }

    function clamp8(value: number): number {
        if (value < 0) return 0
        if (value > 255) return 255
        return Math.round(value)
    }

    function sendColor(red: number, green: number, blue: number) {
        red = clamp8(red)
        green = clamp8(green)
        blue = clamp8(blue)

        // P9813: 11 /B7 /B6 /G7 /G6 /R7 /R6
        let prefix = 0xC0
        if ((blue & 0x80) == 0) prefix |= 0x20
        if ((blue & 0x40) == 0) prefix |= 0x10
        if ((green & 0x80) == 0) prefix |= 0x08
        if ((green & 0x40) == 0) prefix |= 0x04
        if ((red & 0x80) == 0) prefix |= 0x02
        if ((red & 0x40) == 0) prefix |= 0x01

        sendByte(prefix)
        sendByte(blue)
        sendByte(green)
        sendByte(red)
    }

    function frame(red: number, green: number, blue: number) {
        initPins()
        sendByte(0)
        sendByte(0)
        sendByte(0)
        sendByte(0)
        sendColor(red, green, blue)
        sendByte(0)
        sendByte(0)
        sendByte(0)
        sendByte(0)
    }

    //% block="initialiser LED Grove P9813 (DATA P0, CLOCK P14)"
    //% weight=100
    export function initialiser() {
        dataPin = DigitalPin.P0
        clockPin = DigitalPin.P14
        initialized = false
        initPins()
        frame(0, 0, 0)
    }

    //% block="LED rouge"
    //% weight=90
    export function rouge() { frame(255, 0, 0) }

    //% block="LED verte"
    //% weight=89
    export function verte() { frame(0, 255, 0) }

    //% block="LED bleue"
    //% weight=88
    export function bleue() { frame(0, 0, 255) }

    //% block="LED blanche"
    //% weight=87
    export function blanche() { frame(255, 255, 255) }

    //% block="LED éteinte"
    //% weight=86
    export function eteindre() { frame(0, 0, 0) }

    //% block="LED rouge %r vert %v bleu %b"
    //% r.min=0 r.max=255
    //% v.min=0 v.max=255
    //% b.min=0 b.max=255
    //% weight=80
    export function couleur(r: number, v: number, b: number) {
        frame(r, v, b)
    }
}