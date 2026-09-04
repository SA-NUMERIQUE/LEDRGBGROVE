//% color=#7A5AF8 icon="\uf0eb" weight=100 block="RAPPEL LED"
namespace rappelLED {
    const DATA = DigitalPin.P0
    const CLOCK = DigitalPin.P14
    const N = 7

    export enum Couleur {
        //% block="rouge"
        Rouge,
        //% block="vert"
        Vert,
        //% block="bleu"
        Bleu,
        //% block="jaune"
        Jaune,
        //% block="cyan"
        Cyan,
        //% block="violet"
        Violet,
        //% block="blanc"
        Blanc
    }

    function bit(v: number) {
        pins.digitalWritePin(DATA, v ? 1 : 0)
        pins.digitalWritePin(CLOCK, 1)
        control.waitMicros(10)
        pins.digitalWritePin(CLOCK, 0)
        control.waitMicros(10)
    }

    function octet(v: number) {
        for (let i = 7; i >= 0; i--) bit((v >> i) & 1)
    }

    function rgb(r: number, g: number, b: number) {
        let c = 0xC0
        c |= ((~b >> 6) & 3)
        c |= (((~g >> 6) & 3) << 2)
        c |= (((~r >> 6) & 3) << 4)
        octet(c); octet(b); octet(g); octet(r)
    }

    function couleur(c: Couleur): number[] {
        if (c == Couleur.Rouge) return [255,0,0]
        if (c == Couleur.Vert) return [0,255,0]
        if (c == Couleur.Bleu) return [0,0,255]
        if (c == Couleur.Jaune) return [255,255,0]
        if (c == Couleur.Cyan) return [0,255,255]
        if (c == Couleur.Violet) return [255,0,255]
        return [255,255,255]
    }

    function chaine(cible: number, r: number, g: number, b: number) {
        for (let i=0;i<32;i++) bit(0)
        for (let i=1;i<=N;i++) {
            if (i==cible) rgb(r,g,b)
            else rgb(0,0,0)
        }
        for (let i=0;i<32;i++) bit(1)
    }

    function toutes(r:number,g:number,b:number) {
        for (let i=0;i<32;i++) bit(0)
        for (let i=0;i<N;i++) rgb(r,g,b)
        for (let i=0;i<32;i++) bit(1)
    }

    //% block="initialiser les 7 LED"
    //% weight=100
    export function initialiser() {
        pins.digitalWritePin(DATA,0)
        pins.digitalWritePin(CLOCK,0)
        toutes(0,0,0)
    }

    //% block="allumer LED $numero en $c"
    //% numero.min=1 numero.max=7 numero.defl=1
    //% weight=90
    export function allumerLED(numero:number,c:Couleur) {
        if (numero<1 || numero>7) return
        let x=couleur(c)
        chaine(numero,x[0],x[1],x[2])
    }

    //% block="éteindre LED $numero"
    //% numero.min=1 numero.max=7 numero.defl=1
    //% weight=80
    export function eteindreLED(numero:number) {
        if (numero<1 || numero>7) return
        chaine(numero,0,0,0)
    }

    //% block="éteindre toutes les LED"
    //% weight=70
    export function eteindreToutes() { toutes(0,0,0) }

    //% block="allumer toutes les LED en $c"
    //% weight=60
    export function toutesEnCouleur(c:Couleur) {
        let x=couleur(c)
        toutes(x[0],x[1],x[2])
    }
}