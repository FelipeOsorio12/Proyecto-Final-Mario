kaboom({
    global: true,
    fullscreen: true,
    scale: 2,
    clearColor: [0,0,0,1]
})



let isJumping = true
let isBig = false

loadRoot("https://i.imgur.com/")

loadSprite('bloque', 'M6rwarW.png') // bloque rojo
loadSprite('goomba', 'KPO3fR9.png')  // enemigo champiñon
loadSprite('caja', 'gesQ1KP.png') // caja con signo de interrogacion
loadSprite('unboxed', 'bdrLpi6.png') // caja anterior una vez golpeada
loadSprite('moneda', 'wbKxhcd.png') // moneda
loadSprite('hongo', '0wMd92p.png')//hongo para ser grande

loadSprite("mario", "OzrEnBy.png", {
    sliceX: 3.9,
    anims: {
        idle: {
            from: 0,
            to: 0,
        },
        move: {
            from: 1,
            to: 2,
        },
        
    },
});

loadSprite('bloque2', 'pogC9x5.png') // bloque 2
loadSprite('tubo-top-left', 'ReTPiWY.png') // tubo esquerdo
loadSprite('tubo-top-right', 'hj2GK4n.png') // tubo direito
loadSprite('tubo-bottom-left', 'c1cYSbt.png') // tubo parte de baixo esquerdo
loadSprite('tubo-bottom-right', 'nqQ79eI.png') // tubo parte de baixo direito

loadSprite('bloqueazul', 'fVscIbn.png') // bloque azul
loadSprite('bloqueazul2', '3e5YRQd.png') // bloque 2 azul
loadSprite('bloqueazul3', 'gqVoI2b.png') // bloque 3 azul
loadSprite('goombaazul', 'SvV4ueD.png') // enemigo champiñon azul


scene("game", ({ level, score, big }) => {
    layer(["bg", "obj", "ui"], "obj")

    const maps = [
        [
            '~                                   ~', 
            '~                                   ~',
            '~                                   ~',
            '~                                   ~',
            '~                                   ~',
            '~                                   ~',
            '~     %   =*=%=                     ~',
            '~                                   ~',
            '~                           -+      ~',
            '~                   ^   ^   ()      ~',
            '=====================================',
        ],
        [       
            '/                                   /',
            '/                                   /',
            '/                                   /',
            '/                                   /',
            '/                                   /',
            '/                                   /',
            '/    @@@@@@                         /',
            '/                     x x           /',
            '/                   x x x x    -+   /',
            '/          z   z  x x x x x x  ()   /',
            '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',
        ],
        [
            '                                     ',
            '                             !       ',
            '                            %%%%%%   ',
            '                     !               ',
            '             %%    %%%%%             ',
            '      %%%                            ',
            '                                     ',
            '   %                                 ',
            '=     !    !   =  ^  ^    !    !     ',
            '===========================    =====/',
            '                          =    =    /',
            '                                    /',
            '        !                           /',
            '      %*%                           /',
            ' -+           %                     /',
            ' ()!         !    ^                 /',
            '%%%%%%%%%%%%%%%%%%   ===============/',
            '                                     ',
            '                                     ',
            '                                     ',
          ],
          [
            '=                                   =',
            '=                                   =',
            '=                                   =',
            '=                                   =',
            '=                                   =',
            '=    ======          =              =',
            '=                 =  =  =           =',
            '=              =  =  =  =  =   -+   =',
            '=              =  =  =  =  =   ()   =',
            '=====================================',
          ],

    ]

    const levelCfg = {
        width: 20,
        height: 20,
        '=': [sprite('bloque'), solid()],
        '$': [sprite('moneda'), 'moneda'],
        '%': [sprite('caja'), solid(), 'moneda-caja'],
        '*': [sprite('caja'), solid(), 'hongo-caja'],
        '}': [sprite('unboxed'), solid()],
        '^': [sprite('goomba'), 'dangerous'],
        '#': [sprite('hongo'), 'hongo', body()],

        '~': [sprite('bloque2'), solid()],
        '(': [sprite('tubo-bottom-left'), solid(), scale(0.5)],
        ')': [sprite('tubo-bottom-right'), solid(), scale(0.5)],
        '-': [sprite('tubo-top-left'), solid(), 'tubo', scale(0.5)],
        '+': [sprite('tubo-top-right'), solid(), 'tubo', scale(0.5)],
        '!': [sprite('bloqueazul'), solid(), scale(0.5)],
        '/': [sprite('bloqueazul2'), solid(), scale(0.5)],
        'z': [sprite('goombaazul'),body(), 'dangerous', scale(0.5)],
        'x': [sprite('bloqueazul3'), solid(), scale(0.5)],
    }

    const gameLevel = addLevel(maps[level], levelCfg)

    const scoreLabel = add([
        text('Puntaje: ' +score, 10),
        pos(20,5),
        layer('ui'),
        {
            value: score
        }
    ])

    add([text('Nivel: ' +parseInt(level + 1), 10), pos(20,30)])

    function big(){
        return{
            isBig(){
                return isBig
            },
            smallify(){
                this.scale = vec2(1)
                isBig = false
            },
            biggify(){
                this.scale = vec2(1.5)
                isBig = true
            }
        }
    }    

    const player = add([
        
        sprite("mario", {
            animSpeed: 0.1,
            frame: 0
        }),
        solid(),
        body(),
        pos(60,0),
        big(),
        origin('bot'),
        {
            speed: 120
        }
    ])

    if(isBig){
        player.biggify()
    }

    keyDown('left', () => {
        player.flipX(true)
        player.move(-120,0)
    })

    keyDown('right', () => {
        player.flipX(false)
        player.move(120,0)
    })
    
    keyPress('space', () => {
        if(player.grounded()){
            player.jump(390)
            isJumping = true
        }
    })

    //animar mario
    keyPress('left', () => {
        player.flipX(true)
        player.play('move')
    })

    keyPress('right', () => {
        player.flipX(false)
        player.play('move')
    })    

    //////////////////////

    // animar parado //
    keyRelease('left', () => {
        player.play('idle')
    })

    keyRelease('right', () => {
        player.play('idle')
    })
    ///////////////////////////

    action('dangerous', (obj) => {
        obj.move(-20,0)
    })

    action('hongo', (obj) => {
        obj.move(20,0)
    })

    player.action(() => {
        if(player.grounded()){
            isJumping = false
        }
    })

    player.on('headbutt', (obj) => {
        if(obj.is('moneda-caja')){
            gameLevel.spawn('$', obj.gridPos.sub(0,1))
            destroy(obj)
            gameLevel.spawn('}', obj.gridPos.sub(0,0))
        }

        if(obj.is('hongo-caja')){
            gameLevel.spawn('#', obj.gridPos.sub(0,1))
            destroy(obj)
            gameLevel.spawn('}', obj.gridPos.sub(0,0))
        }

    })

    player.collides('hongo', (obj) => {
        destroy(obj)
        player.biggify()
    })

    player.collides('dangerous', (obj) => {
        if(isJumping){
            destroy(obj)
        }else{
            if(isBig){
                player.smallify()
            }else{
                go("lose", ({score: scoreLabel.value}))
            }
        }
    })

    player.collides('moneda', (obj) => {
        destroy(obj)
        scoreLabel.value++
        scoreLabel.text = 'monedas: ' +scoreLabel.value
    })

    player.collides('tubo', () => {
        keyPress('down', () => {
            go("game", {
                level: (level + 1) % maps.length,
                score: scoreLabel.value,
                big: isBig
            })
        })
    })
})

scene("lose", ({score}) => {
    add([ text('Juego Terminado\n\n Creditos:\n\n Andres Felipe Osorio\n\n Camilo Bedoya Gonzales \n\n\n\n (Pulse "espacio" para volver a jugar)  '), origin('center'), pos(width()/2, height()/2) ])

    

    keyPress('space', () => {
        go("game", {level: 0, score: 0, big: isBig})
    })
})



scene('main', () => {


add([
    text('pantalla inicio\n\n\n P R O Y E C T O\n\n F I N A L\n\n\n\n (Pulse "Enter" para jugar)'),
    pos(width()/2, height()/2 ),
    origin('center')
])

keyPress('enter', () => {
    go("game", {level: 0, score: 0, big: isBig})
})



})


go('main')








