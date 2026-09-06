//% color="#7A3E9D" icon="\uf1fc" block="Grove P9813 x7"
namespace groveP9813 {
    const N = 7
    const DATA = DigitalPin.P0
    const CLOCK = DigitalPin.P14
    let r = [0,0,0,0,0,0,0]
    let g = [0,0,0,0,0,0,0]
    let b = [0,0,0,0,0,0,0]

    export enum Couleur {
        //% block="rouge"
        Rouge,
        //% block="vert"
        Vert,
        //% block="bleu"
        Bleu,
        //% block="jaune"
        Jaune,
        //% block="blanc"
        Blanc,
        //% block="éteinte"
        Eteinte
    }

    function pulse() {
        pins.digitalWritePin(CLOCK, 1)
        control.waitMicros(20)
        pins.digitalWritePin(CLOCK, 0)
        control.waitMicros(20)
    }

    function byte(v: number) {
        for (let bit = 7; bit >= 0; bit--) {
            pins.digitalWritePin(DATA, (v & (1 << bit)) != 0 ? 1 : 0)
            pulse()
        }
    }

    function limit(v: number): number {
        if (v < 0) return 0
        if (v > 255) return 255
        return Math.round(v)
    }

    function color(rr: number, gg: number, bb: number) {
        rr = limit(rr); gg = limit(gg); bb = limit(bb)
        let f = 0xC0
        if ((bb & 0x80) == 0) f |= 0x20
        if ((bb & 0x40) == 0) f |= 0x10
        if ((gg & 0x80) == 0) f |= 0x08
        if ((gg & 0x40) == 0) f |= 0x04
        if ((rr & 0x80) == 0) f |= 0x02
        if ((rr & 0x40) == 0) f |= 0x01
        byte(f); byte(bb); byte(gg); byte(rr)
    }

    function send() {
        pins.digitalWritePin(DATA, 0)
        pins.digitalWritePin(CLOCK, 0)
        byte(0); byte(0); byte(0); byte(0)
        for (let i = 0; i < N; i++) color(r[i], g[i], b[i])
        byte(0); byte(0); byte(0); byte(0)
    }

    //% block="initialiser les 7 LED (DATA P0, CLOCK P14)"
    //% weight=100
    export function initialiser() {
        for (let i=0; i<N; i++) { r[i]=0; g[i]=0; b[i]=0 }
        send()
    }

    //% block="LED numéro %numero en %couleur"
    //% numero.min=1 numero.max=7 numero.defl=1
    //% weight=90
    export function led(numero: number, couleur: Couleur) {
        if (numero < 1 || numero > 7) return
        let i = Math.round(numero)-1
        r[i]=0; g[i]=0; b[i]=0
        if (couleur == Couleur.Rouge) r[i]=255
        else if (couleur == Couleur.Vert) g[i]=255
        else if (couleur == Couleur.Bleu) b[i]=255
        else if (couleur == Couleur.Jaune) { r[i]=255; g[i]=180 }
        else if (couleur == Couleur.Blanc) { r[i]=255; g[i]=255; b[i]=255 }
        send()
    }

    //% block="LED numéro %numero rouge %rr vert %gg bleu %bb"
    //% numero.min=1 numero.max=7 numero.defl=1
    //% rr.min=0 rr.max=255 rr.defl=0
    //% gg.min=0 gg.max=255 gg.defl=255
    //% bb.min=0 bb.max=255 bb.defl=0
    //% weight=80
    export function ledRGB(numero: number, rr: number, gg: number, bb: number) {
        if (numero < 1 || numero > 7) return
        let i=Math.round(numero)-1
        r[i]=limit(rr); g[i]=limit(gg); b[i]=limit(bb)
        send()
    }

    //% block="éteindre les 7 LED"
    //% weight=70
    export function eteindreTout() {
        for (let i=0;i<N;i++) { r[i]=0; g[i]=0; b[i]=0 }
        send()
    }

    //% block="mettre les 7 LED en %couleur"
    //% weight=60
    export function toutes(couleur: Couleur) {
        for (let i=0;i<N;i++) {
            r[i]=0; g[i]=0; b[i]=0
            if (couleur == Couleur.Rouge) r[i]=255
            else if (couleur == Couleur.Vert) g[i]=255
            else if (couleur == Couleur.Bleu) b[i]=255
            else if (couleur == Couleur.Jaune) { r[i]=255; g[i]=180 }
            else if (couleur == Couleur.Blanc) { r[i]=255; g[i]=255; b[i]=255 }
        }
        send()
    }
}
