// ============= 4 ETAPAS ===================
// 1) Variables y funciones comunes a todas las clases
// 2) Las clases que componen a nuestro videojuego (lógica del juego)
let character = "";
let stars = "";
let score = 0; // Variable para llevar el puntaje
this.isDamaged = false;
let isDead = false;
let attackFlag = false;
let shiftKey;
class Nivel1 extends Phaser.Scene/*Nivel 1*/ {
    constructor() {
        super('gameScene');
    }

    preload()/*Nivel 1*/ {
        this.load.baseURL = './';
        this.load.audio('bgsound', './img/Classic_Alien_Arrival_Sound_Effect.mp3');
        this.load.image('fondo1', './img/fondo1.jpg');
        this.load.image('prota', './img/prota/green_turn1.png');

        this.load.image('stay1', './img/prota/green_001_stay.png');
        this.load.image('stay2', './img/prota/green_002_stay.png');
        this.load.image('stay3', './img/prota/green_003_stay.png');

        this.load.image('turn2', './img/prota/green_turn2.png');
        this.load.image('turn3', './img/prota/green_turn3.png');
        this.load.image('walk1', './img/prota/green_walk1.png');
        this.load.image('walk2', './img/prota/green_walk2.png');
        this.load.image('walk3', './img/prota/green_walk3.png');
        this.load.image('walk4', './img/prota/green_walk4.png');
        this.load.image('walk5', './img/prota/green_walk5.png');
        this.load.image('walk6', './img/prota/green_walk6.png');
        this.load.image('jump1', './img/prota/green_jump1.png');
        this.load.image('jump2', './img/prota/green_jump2.png');
        this.load.image('jump3', './img/prota/green_jump3.png');
        this.load.image('jump4', './img/prota/green_jump4.png');
        this.load.image('prota', './img/prota/green_turn1.png');
        this.load.image('pisolv1', './img/volcano_floor.png');
        this.load.image('plat1', './img/PlataformaLarga.png');
        this.load.image('estrella', './img/star.png');
        this.load.image('npc1', './img/npc1.png');

        for (let i = 0; i <= 29; i++) {
            const key = `stitch${i}`;
            const path = `./img/stitch1/${i}.png`;
            this.load.image(key, path);
        }

        for (let i = 1; i <= 6; i++) {
            const key = `run${i}`;
            const path = `./img/prota/green__run${i}.png`;
            this.load.image(key, path);
        }
    }

    create()/*Nivel 1*/ {
        // Fondo
        this.sound.add('bgsound', {
            loop: true,
        }).play();
        this.add.image(640, 360, 'fondo1').setScale(0.5);

        // Crear un grupo para npc
        this.npcGroup = this.physics.add.staticGroup();

        this.npc = this.npcGroup.create(900, 545, 'npc1').setScale(0.8);
        this.stitch = this.npcGroup.create('stitch0');
        this.npc.refreshBody();

        // Crear el grupo dinámico para el personaje
        this.character = this.physics.add.group();
        this.characterObject = this.character.create(460, 545, 'prota').setScale(0.25);

        // Crear el grupo estático para el piso
        var piso = this.physics.add.staticGroup();
        for (let x = 50; x <= 1250; x += 100) {
            let pisoObjeto = piso.create(x, 710, 'pisolv1').setScale(0.2);
            pisoObjeto.refreshBody(); // Ajusta la hitbox al tamaño escalado
        }

        // Colisiones entre el personaje y el piso
        this.physics.add.collider(this.character, piso);

        // Agregar gravedad al personaje
        this.characterObject.body.setGravityY(100);
        this.characterObject.setCollideWorldBounds(true);

        // Teclas de movimiento
        this.cursors = this.input.keyboard.createCursorKeys();
        shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

        // Crear las estrellas
        this.stars = this.physics.add.group({
            key: 'estrella',
            repeat: 9,
            setXY: { x: 150, y: 0, stepX: 100 },
        });

        // Añadir rebote a las estrellas
        this.stars.children.iterate((child) => {
            child.setBounce(0.3);
            child.setScale(0.15);
            child.body.setSize(child.width * 0.5, child.height * 0.5);
            child.body.setOffset((child.width - child.body.width) / 2, (child.height - child.body.height) / 2);
        });

        let plataforma = new Array();
        plataforma[0] = piso.create(200, 300, 'plat1').setScale(0.5);
        plataforma[1] = piso.create(600, 500, 'plat1').setScale(0.5);
        plataforma[2] = piso.create(900, 300, 'plat1').setScale(0.5);
        for (let index = 0; index < plataforma.length; index++) {
            plataforma[index].refreshBody();
        }

        // Colisiones entre estrellas y el piso
        this.physics.add.collider(this.stars, piso);

        // Colisiones entre estrellas y el piso
        this.physics.add.collider(this.stars, piso);

        // Contador de estrellas recolectadas
        this.starsCollected = 0;
        this.totalStars = this.stars.getChildren().length;

        // Detectar la recolección de estrellas
        this.physics.add.overlap(this.characterObject, this.stars, collectStar, null, this);

        // Función para manejar la recolección de estrellas
        function collectStar(player, star) {
            score += 10;
            colliderStar(star); // Llamamos a la función que desactiva la estrella
            console.log("P1 Score: " + score);
        }

        // Función para desactivar las estrellas recolectadas
        function colliderStar(star) {
            // Desactiva el sprite visualmente
            star.setVisible(false); // Opcional, si el sprite sigue visible

            // Eliminar el cuerpo físico
            if (star.body) {
                star.body.destroy();
            }
        }

        // Crear la animación de caminar
        this.anims.create({
            key: 'walk',
            frames: [
                { key: 'walk1' },
                { key: 'walk2' },
                { key: 'walk3' },
                { key: 'walk4' },
                { key: 'walk5' },
                { key: 'walk6' },
            ],
            frameRate: 6,
            repeat: -1
        });
        //Animación para saltar
        this.anims.create({
            key: 'jump',
            frames: [
                { key: 'jump1' },
                { key: 'jump2' },
                { key: 'jump3' },
                { key: 'jump4' },
            ],
            frameRate: 3,
            repeat: 0
        });
        // Reposo con pausa entre frames
        this.anims.create({
            key: 'turn',
            frames: [
                { key: 'stay3' },
                { key: 'stay2' },
                { key: 'stay1' },
            ],
            frameRate: 10,                   // Mantener un frameRate normal para fluidez
            repeat: -1,                     // Repetir indefinidamente
            repeatDelay: 3000                // Pausa de 500ms entre repeticiones de la animación
        });

        this.anims.create({
            key: 'stitch',
            frames: Array.from({ length: 29 }, (_, i) => ({ key: `stitch${i}` })),
            frameRate: 10,
            repeat: -1
        });

        this.stitch.anims.play('stitch', true);

        // Animación correr
        this.anims.create({
            key: 'run',
            frames: Array.from({ length: 6 }, (_, i) => ({ key: `run${i + 1}` })),
            frameRate: 10,
            repeat: -1
        });

        // Configurar el teclado
        this.cursors = this.input.keyboard.createCursorKeys();
        this.shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

        // Configurar variables
        this.isDamaged = false;
        this.fallTime = 0;

        // Crear botones táctiles
        this.leftButton = this.add.rectangle(50, this.scale.height - 50, 100, 100, 0x6666ff, 0.5)
            .setInteractive();
        this.rightButton = this.add.rectangle(200, this.scale.height - 50, 100, 100, 0x6666ff, 0.5)
            .setInteractive();
        this.jumpButton = this.add.rectangle(this.scale.width - 50, this.scale.height - 50, 100, 100, 0xff6666, 0.5)
            .setInteractive();
        this.runButton = this.add.rectangle(this.scale.width - 150, this.scale.height - 50, 100, 100, 0x66ff66, 0.5)
            .setInteractive();

        // Variables para rastrear entradas táctiles
        this.touchInput = {
            left: false,
            right: false,
            jump: false,
            run: false
        }

        // Configurar eventos táctiles
        this.leftButton.on('pointerdown', () => this.touchInput.left = true);
        this.leftButton.on('pointerup', () => this.touchInput.left = false);
        this.rightButton.on('pointerdown', () => this.touchInput.right = true);
        this.rightButton.on('pointerup', () => this.touchInput.right = false);
        this.jumpButton.on('pointerdown', () => this.touchInput.jump = true);
        this.jumpButton.on('pointerup', () => this.touchInput.jump = false);
        this.runButton.on('pointerdown', () => this.touchInput.run = true);
        this.runButton.on('pointerup', () => this.touchInput.run = false);

    }

    update() {
        // Detener movimiento horizontal
        this.characterObject.body.setVelocityX(0);

        if (!this.isDead) {
            // Movimiento a la izquierda
            if (this.cursors.left.isDown || this.touchInput.left) {
                let velocity = this.touchInput.run ? -330 : -200;
                this.characterObject.body.setVelocityX(velocity);
                this.characterObject.flipX = true;
                this.characterObject.anims.play(this.touchInput.run ? 'run' : 'walk', true);
            }

            // Movimiento a la derecha
            if (this.cursors.right.isDown || this.touchInput.right) {
                let velocity = this.touchInput.run ? 330 : 200;
                this.characterObject.body.setVelocityX(velocity);
                this.characterObject.flipX = false;
                this.characterObject.anims.play(this.touchInput.run ? 'run' : 'walk', true);
            }

            // Saltar
            if ((this.cursors.up.isDown || this.touchInput.jump) && this.characterObject.body.touching.down) {
                this.characterObject.body.setVelocityY(-430);
                this.characterObject.anims.play('jump', true);
            }

            // Animación en reposo
            if (!this.cursors.left.isDown && !this.cursors.right.isDown &&
                !this.touchInput.left && !this.touchInput.right &&
                this.characterObject.body.touching.down) {
                this.characterObject.anims.play('turn', true);
            }
        }

        // Verificar si se recolectaron todas las estrellas
        if (score == 100) {
            this.stitch.anims.stop();  // Detener la animación anterior
            this.scene.start('nextLevelScene'); // Cambiar a la siguiente escena (nivel)
        }
    }
}

class Nivel2 extends Phaser.Scene/*Nivel 2*/ {
    constructor()/*Nivel 2*/ {
        super('nextLevelScene');
    }

    preload() /*Nivel 2*/ {
        // En primer lugar, solo se ejecuta una vez
        // Multimedia
        this.load.baseURL = './';
        this.load.image('stay1', './img/prota/green_001_stay.png');
        this.load.image('stay2', './img/prota/green_002_stay.png');
        this.load.image('stay3', './img/prota/green_003_stay.png');

        this.load.image('hurt1', './img/prota/green_hurt1.png');
        this.load.image('hurt2', './img/prota/green_hurt2.png');
        this.load.image('hurt3', './img/prota/green_hurt3.png');
        this.load.image('hurt4', './img/prota/green_hurt4.png');

        for (let i = 0; i <= 17; i++) {
            const key = `s${i}`;
            const path = `./img/stitch2/s${i}.png`;
            this.load.image(key, path);
        }

        for (let i = 1; i <= 5; i++) {
            const key = `dead${i}`;
            const path = `./img/prota/green_dead${i}.png`;
            this.load.image(key, path);
        }

        this.load.image('fondo2', './img/fondo2.png');
        this.load.image('prota', './img/prota/green_turn1.png');
        this.load.image('turn2', './img/prota/green_turn2.png');
        this.load.image('turn3', './img/prota/green_turn3.png');
        for (let i = 1; i <= 6; i++) {
            const key = `walk${i}`;
            const path = `./img/prota/green_walk${i}.png`;
            this.load.image(key, path);
        }
        for (let i = 1; i <= 4; i++) {
            const key = `jump${i}`;
            const path = `./img/prota/green_jump${i}.png`;
            this.load.image(key, path);
        }
        for (let i = 1; i <= 6; i++) {
            const key = `run${i}`;
            const path = `./img/prota/green__run${i}.png`;
            this.load.image(key, path);
        }
        for (let i = 1; i <= 35; i++) {
            const key = `m${i}`;
            const path = `./img/mushroom/m_${String(i).padStart(3, '0')}.png`;
            this.load.image(key, path);
        }
        this.load.spritesheet('puas', './img/enemy_2.png', { frameWidth: 64, frameHeight: 64 });
        this.load.image('pisoIz', './img/stofloor-le.png');
        this.load.image('pisoCe', './img/stofloor-ce.png');
        this.load.image('pisoDe', './img/stofloor-ri.png');
        this.load.image('plat2', './img/piso2.png');
        this.load.image('estrella', './img/star.png');

    }

    create() /*Nivel 2*/ {
        // Fondo
        this.add.image(640, 360, 'fondo2').setScale(0.9);

        // Crear un grupo para npc
        let npcGroup2 = this.physics.add.staticGroup();
        let stitch2 = npcGroup2.create('stitch0');
        // Crear el sprite para el personaje
        this.characterObject = this.physics.add.sprite(460, 545, 'prota').setScale(0.25);  // Usamos 'prota1' inicialmente

        // Crear el sprite para el hongo
        this.mushroomGroup = this.physics.add.staticGroup();  // Usamos 'prota1' inicialmente
        this.mushroom = this.mushroomGroup.create(260, 650, 'm1').setScale(0.25);
        this.mushroom.refreshBody();

        //Crear el sprite para puas
        this.spike = this.physics.add.sprite(600, 445, 'puas').setScale(0.8);




        // Crear el grupo estático para el piso
        var piso = this.physics.add.staticGroup();
        let pisoIz = piso.create(50, 720, 'pisoIz').setScale(0.75);
        pisoIz.refreshBody();
        let pisoDe = piso.create(1250, 720, 'pisoDe').setScale(0.75);
        pisoDe.refreshBody();
        for (let x = 150; x <= 1150; x += 100) {
            let pisoObjeto = piso.create(x, 720, 'pisoCe').setScale(0.75);
            pisoObjeto.refreshBody(); // Ajusta la hitbox al tamaño escalado
        }

        // Colisiones entre el personaje y el piso
        this.physics.add.collider(this.characterObject, piso);
        this.physics.add.collider(this.spike, piso);

        // Agregar gravedad al personaje
        this.characterObject.body.setGravityY(100);
        this.characterObject.setCollideWorldBounds(true);
        this.spike.setCollideWorldBounds(true);

        // Teclas de movimiento
        this.cursors = this.input.keyboard.createCursorKeys();
        shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

        // Crear las estrellas
        this.stars = this.physics.add.group({
            key: 'estrella',
            repeat: 9,
            setXY: { x: 150, y: 0, stepX: 100 },
        });

        // Añadir rebote a las estrellas
        this.stars.children.iterate((child) => {
            child.setBounce(0.3);
            child.setScale(0.15);
            child.body.setSize(child.width * 0.5, child.height * 0.5);
            child.body.setOffset((child.width - child.body.width) / 2, (child.height - child.body.height) / 2);
        });

        let plataforma = new Array();
        plataforma[0] = piso.create(200, 300, 'plat2').setScale(0.3);  // Crear plataforma 1
        plataforma[1] = piso.create(600, 500, 'plat2').setScale(0.3);  // Crear plataforma 2
        plataforma[2] = piso.create(900, 300, 'plat2').setScale(0.3);  // Crear plataforma 3

        // Ajuste del cuadro de colisión para cada plataforma
        for (let index = 0; index < plataforma.length; index++) {
            // Ajustar el tamaño del cuadro de colisión
            // Asegúrate de que la altura sea más pequeña y la misma que el sprite visual
            let width = plataforma[index].width;  // Usamos el ancho del sprite
            let height = 10; // Ajusta la altura de la colisión (puedes cambiarlo si es necesario)

            plataforma[index].body.setSize(250, 40);  // Cambia el tamaño de la colisión

            // Ajustar la posición del cuadro de colisión
            // Si el cuadro de colisión está demasiado abajo, ajustamos el offset para moverlo hacia arriba
            let offsetY = -5;  // Ajuste del desplazamiento hacia arriba (ajusta según sea necesario)

            plataforma[index].body.setOffset(320, 95);  // Ajustar el desplazamiento en Y

            // Finalmente, actualizamos el cuerpo físico para reflejar los cambios

        }


        // Colisiones entre estrellas y el piso
        this.physics.add.collider(this.stars, piso);
        this.physics.add.collider(this.stars, this.spike);

        // Contador de estrellas recolectadas
        this.starsCollected = 0;
        this.totalStars = this.stars.getChildren().length;

        this.physics.add.overlap(this.characterObject, this.stars, collectStar, null, this);
        this.physics.add.overlap(this.characterObject, this.mushroom, makeDamage, null, this);
        this.physics.add.overlap(this.characterObject, this.spike, makeDamage2, null, this);

        // Función para manejar la recolección de estrellas
        function collectStar(player, star) {
            score += 25;
            colliderStar(star); // Llamamos a la función que desactiva la estrella
            console.log("P1 Score: " + score);
        }

        // Función para desactivar las estrellas recolectadas
        function colliderStar(star) {
            // Desactiva el sprite visualmente
            star.setVisible(false); // Opcional, si el sprite sigue visible

            // Eliminar el cuerpo físico
            if (star.body) {
                star.body.destroy();
            }
        }

        

        function makeDamage(player, mushroom) {
            colliderMushroom(mushroom);
            score -= 50;
            if (score < 0) {
                score = 0;
                console.log("Score: " + score);
                console.log("Game Over");
                this.physics.pause();
                isDead = true;
                this.isDamaged = false;
                //this.characterObject.setSize(300, 100);
                this.characterObject.setPosition(this.characterObject.x, this.characterObject.y + 25);

                this.characterObject.setTint(0xAE445A); // Cambio de color para mostrar que ha perdido
                this.characterObject.anims.play('death', true);
                this.time.addEvent({
                    delay: 1500,
                    loop: false,
                    callback: () => {
                        this.scene.start("endScene");
                    }
                });
            } else {
                this.characterObject.setTint(0xff0000);
                this.mushroom.setTint(0x0A3981);
                // Usar el temporizador para esperar 500ms antes de restaurar el color
                this.characterObject.anims.play('hurt', true);
                this.isDamaged = true;
                this.time.addEvent({
                    delay: 500, // Esperar 500ms
                    callback: () => {
                        this.characterObject.clearTint(); // Restaurar el color original
                    },
                    loop: false // Solo se ejecuta una vez
                });
                console.log("Score: " + score)
                this.time.addEvent({
                    delay: 2000, // Esperar 2 segundos antes de reaparecer
                    callback: () => {
                        this.mushroom.enableBody(true, 260, 650, true, true); // Reactivar el hongo
                        this.mushroom.setVisible(true); // Asegúrate de que sea visible
                        this.mushroom.clearTint();
                    },
                    loop: false
                });
            }
        }



        function makeDamage2(player, spike) {
            colliderMushroom(spike);
            score -= 50;
            if (score < 0) {
                score = 0;
                console.log("Score: " + score);
                console.log("Game Over");
                this.physics.pause();

                //makeDeath();
                isDead = true;
                this.isDamaged = false;
                //this.characterObject.setSize(300, 100);
                this.characterObject.setPosition(this.characterObject.x, this.characterObject.y + 25);

                this.characterObject.setTint(0xAE445A); // Cambio de color para mostrar que ha perdido
                this.characterObject.anims.play('death', true);


                this.time.addEvent({
                    delay: 2500,
                    loop: false,
                    callback: () => {
                        this.scene.start("endScene");
                    }
                });
            } else {
                this.characterObject.setTint(0xff0000);
                this.spike.setTint(0x54473F);
                // Usar el temporizador para esperar 500ms antes de restaurar el color
                this.characterObject.anims.play('hurt', true);
                this.isDamaged = true;
                this.time.addEvent({
                    delay: 500, // Esperar 500ms
                    callback: () => {
                        this.characterObject.clearTint(); // Restaurar el color original
                    },
                    loop: false // Solo se ejecuta una vez
                });
                console.log("Score: " + score)
                this.time.addEvent({
                    delay: 2000, // Esperar 2 segundos antes de reaparecer
                    callback: () => {
                        this.spike.enableBody(true, 600, 450, true, true); // Reactivar el hongo
                        this.spike.setVisible(true); // Asegúrate de que sea visible
                        this.spike.clearTint();
                    },
                    loop: false
                });
            }
        }

        // Función para desactivar las estrellas recolectadas
        function colliderMushroom(mushroom) {
            // Desactivar la estrella completamente para evitar el bucle
            mushroom.disableBody(false, false); // Desactiva el cuerpo del hongo
            mushroom.setVisible(true);
        }

        // Crear la animación de caminar
        this.anims.create({
            key: 'walk',
            frames: [
                { key: 'walk1' },
                { key: 'walk2' },
                { key: 'walk3' },
                { key: 'walk4' },
                { key: 'walk5' },
                { key: 'walk6' },
            ],
            frameRate: 6,
            repeat: -1
        });
        //Animación para saltar
        this.anims.create({
            key: 'jump',
            frames: [
                { key: 'jump1' },
                { key: 'jump2' },
                { key: 'jump3' },
                { key: 'jump4' },
            ],
            frameRate: 3,
            repeat: 0
        });
        // Reposo con pausa entre frames
        this.anims.create({
            key: 'turn',
            frames: [
                { key: 'stay3' },
                { key: 'stay2' },
                { key: 'stay1' },
            ],
            frameRate: 10,                   // Mantener un frameRate normal para fluidez
            repeat: -1,                     // Repetir indefinidamente
            repeatDelay: 3000                // Pausa de 500ms entre repeticiones de la animación
        });

        // Animación hongo
        this.anims.create({
            key: 'mushroom',
            frames: Array.from({ length: 32 }, (_, i) => ({ key: `m${i + 1}` })),
            frameRate: 10,
            repeat: -1
        });


        // Crear animación de púas
        this.anims.create({
            key: 'spike',  // Nombre de la animación
            frames: this.anims.generateFrameNumbers('puas', { start: 0, end: 4 }),  // Los fotogramas de la animación
            frameRate: 10,  // Velocidad de fotogramas
            repeat: 0  // No repetir la animación automáticamente
        });

        // Animación daño
        this.anims.create({
            key: 'death',
            frames: [
                { key: 'hurt1' },
                { key: 'hurt2' },
                { key: 'hurt3' },
                { key: 'hurt4' },
                { key: 'dead1' },
                { key: 'dead2' },
                { key: 'dead3' },
                { key: 'dead4' },
                { key: 'dead5' },
            ],
            frameRate: 15,
            repeat: 0
        });
        // Animación daño
        this.anims.create({
            key: 'hurt',
            frames: [
                { key: 'hurt1' },
                { key: 'hurt2' },
                { key: 'hurt3' },
                { key: 'hurt4' },
            ],
            frameRate: 10,
            repeat: -1
        });

        // Animación correr
        this.anims.create({
            key: 'run',
            frames: Array.from({ length: 6 }, (_, i) => ({ key: `run${i + 1}` })),
            frameRate: 10,
            repeat: -1
        });



        // 2. Función para reproducir la animación con delay
        const startAnimationWithDelay = () => {
            //console.log("Iniciando animación...");  // Aquí puedes agregar un console.log para verificar que se ejecuta
            this.spike.anims.play('spike', true);  // Reproducir la animación
        };

        // 3. Definir el retraso en milisegundos (2000 ms = 2 segundos)
        const delay = 2000;

        // 4. Iniciar la animación con el primer retraso
        this.time.addEvent({
            delay: delay,  // Tiempo de retraso antes de iniciar
            callback: () => {
                startAnimationWithDelay();  // Reproduce la animación
            },
            loop: false  // Solo se ejecuta una vez después del retraso
        });

        // 5. Si deseas repetir la animación después del primer retraso, puedes configurar un segundo temporizador:
        this.time.addEvent({
            delay: delay,  // Tiempo de retraso entre cada ejecución
            callback: () => {
                startAnimationWithDelay();  // Reproduce la animación
            },
            loop: true  // Repetir de manera continua después de cada retraso
        });

        this.anims.create({
            key: 'stitch2',
            frames: Array.from({ length: 17 }, (_, i) => ({ key: `s${i}` })),
            frameRate: 10,
            repeat: -1
        });

        stitch2.anims.play('stitch2', true);



    }


    update() /*Nivel 2*/ {
        // Detener el movimiento horizontal cuando no haya teclas presionadas
        this.characterObject.body.setVelocityX(0);
        if (this.mushroom) {
            this.mushroom.anims.play('mushroom', true);

        }

        if (isDead) {

        } else {
            // Inicializar el tiempo de caída si no está tocando el suelo
            if (!this.characterObject.body.touching.down) {
                // Si no está tocando el suelo, incrementamos el tiempo de caída
                this.fallTime += this.game.loop.delta; // Aumentar el tiempo de caída
            } else {
                // Si toca el suelo, resetear el tiempo de caída
                this.fallTime = 0;
            }

            // Verificar si el personaje está tocando el suelo y presionando la tecla de salto
            if (this.cursors.up.isDown && this.characterObject.body.touching.down) {
                if (this.isDamaged == true) {
                    this.time.addEvent({
                        delay: 350, // Esperar 3s
                        loop: false, // Solo se ejecuta una vez
                        callback: () => {
                            this.isDamaged = false;
                        },
                    });
                } else {
                    this.characterObject.body.setVelocityY(-430); // Realiza el salto
                    this.characterObject.anims.play('jump', true); // Reproducir animación de salto
                }

            }
            // Si el personaje está en el aire y ha estado cayendo más de 300ms (tiempo de animación turn)
            else if (!this.characterObject.body.touching.down && this.fallTime > 300) {
                this.characterObject.anims.play('jump', true); // Reproducir animación de salto
            }
            // Movimiento combinado con salto (derecha)
            if (this.cursors.right.isDown && this.cursors.up.isDown) {
                if (this.isDamaged == true) {
                    this.time.addEvent({
                        delay: 350, // Esperar 3s
                        loop: false, // Solo se ejecuta una vez
                        callback: () => {
                            this.isDamaged = false;
                        },
                    });
                } else {
                    if (shiftKey.isDown) {
                        this.characterObject.body.setVelocityX(330); // Mover a la derecha mientras saltas
                        this.characterObject.flipX = false; // Mantener la dirección original
                        this.characterObject.anims.play('jump', true); // Animación de salto    
                    } else {
                        this.characterObject.body.setVelocityX(200); // Mover a la derecha mientras saltas
                        this.characterObject.flipX = false; // Mantener la dirección original
                        this.characterObject.anims.play('jump', true); // Animación de salto    
                    }
                }


            }
            // Movimiento combinado con salto (izquierda)
            else if (this.cursors.left.isDown && this.cursors.up.isDown) {
                if (this.isDamaged == true) {
                    this.time.addEvent({
                        delay: 350, // Esperar 3s
                        loop: false, // Solo se ejecuta una vez
                        callback: () => {
                            this.isDamaged = false;
                        },
                    });
                } else {
                    if (shiftKey.isDown) {
                        this.characterObject.body.setVelocityX(-330); // Mover a la izquierda mientras saltas
                        this.characterObject.flipX = true; // Invertir la dirección del personaje
                        this.characterObject.anims.play('jump', true); // Animación de salto
                    } else {
                        this.characterObject.body.setVelocityX(-200); // Mover a la izquierda mientras saltas
                        this.characterObject.flipX = true; // Invertir la dirección del personaje
                        this.characterObject.anims.play('jump', true); // Animación de salto    
                    }
                }
            }


            // Movimiento a la izquierda (caminar)
            else if (this.cursors.left.isDown) {
                if (this.isDamaged == true) {
                    this.time.addEvent({
                        delay: 350, // Esperar 3s
                        loop: false, // Solo se ejecuta una vez
                        callback: () => {
                            this.isDamaged = false;
                        },
                    });
                } else {
                    if (shiftKey.isDown) {
                        this.characterObject.body.setVelocityX(-330);   // Mover a la izquierda
                        this.characterObject.flipX = true;               // Invertir la dirección del personaje
                        this.characterObject.anims.play('run', true);    // Reproducir la animación de caminar
                    } else {
                        this.characterObject.body.setVelocityX(-200);   // Mover a la izquierda
                        this.characterObject.flipX = true;               // Invertir la dirección del personaje
                        this.characterObject.anims.play('walk', true);    // Reproducir la animación de caminar
                    }

                }
            }
            // Movimiento a la derecha (caminar)
            else if (this.cursors.right.isDown) {
                if (this.isDamaged == true) {
                    this.time.addEvent({
                        delay: 350, // Esperar 3s
                        loop: false, // Solo se ejecuta una vez
                        callback: () => {
                            this.isDamaged = false;
                        },
                    });
                } else {
                    if (shiftKey.isDown && this.cursors.right.isDown) {
                        console.log("SHIFT up");
                        this.characterObject.body.setVelocityX(330);    // Mover a la derecha
                        this.characterObject.flipX = false;              // Mantener la dirección original
                        this.characterObject.anims.play('run', true);    // Reproducir la animación de caminar
                    } else {
                        this.characterObject.body.setVelocityX(160);    // Mover a la derecha
                        this.characterObject.flipX = false;              // Mantener la dirección original
                        this.characterObject.anims.play('walk', true);    // Reproducir la animación de caminar
                    }

                }

            }

            // Si el personaje no se mueve y está tocando el suelo, reproducir la animación "turn"
            if (!this.cursors.left.isDown && !this.cursors.right.isDown && this.characterObject.body.touching.down) {
                if (this.isDamaged == true) {
                    this.time.addEvent({
                        delay: 350, // Esperar 3s
                        loop: false, // Solo se ejecuta una vez
                        callback: () => {
                            this.isDamaged = false;
                        },
                    });
                } else {
                    this.characterObject.anims.play('turn', true); // Reproducir animación de reposo
                }
            }

            // Si el personaje está en el aire, y ha estado cayendo menos de 300ms, reproducir la animación 'turn'
            if (!this.characterObject.body.touching.down && this.fallTime <= 300) {
                //this.characterObject.anims.play('turn', true); // Reproducir animación de reposo
            }
        }





    }



}

class Level extends Phaser.Scene {
    constructor() {
        super('levelScene');
    }

    preload() {
        // En primer lugar, solo se ejecuta una vez
        // Multimedia
    }

    create() {
        // En segundo lugar, se ejecuta una vez
        // Toda la lógica del videojuego
    }

    update() {
        // En tercer lugar, se ejutar una y otra vez
        // Actualización de multimedia
    }

}

class MainMenu extends Phaser.Scene {
    constructor() {
        super('mainmenu');
    }

    preload() {
        // En primer lugar, solo se ejecuta una vez
        // Multimedia
        this.load.baseURL = './';
        this.load.image('main', './img/screens/mainmenu.png');
    }

    create() {
        // En segundo lugar, se ejecuta una vez
        // Toda la lógica del videojuego
        const { width, height } = this.scale;

        const image = this.add.image(width/2, height/2, 'main').setScale(1)
        // Crear un objeto Graphics
        this.rectangulo = this.add.graphics();
        this.rectangulo2 = this.add.graphics();

        // Dimensiones de los botones
        this.button1 = new Phaser.Geom.Rectangle(550, 415, 180, 60);
        this.button2 = new Phaser.Geom.Rectangle(512, 500, 258, 60);

        this.rectangulo.lineStyle(4, 0xffffff, 1);  // Grosor de línea 4px, color rojo (0xff0000), opacidad 1 (totalmente opaco)
        this.rectangulo.strokeRect(this.button1);  // Coordenadas (100, 100), 200px de ancho y 150px de alto
        //this.rectangulo2.lineStyle(4, 0xffffff, 1);  // Grosor de línea 4px, color rojo (0xff0000), opacidad 1 (totalmente opaco)
        this.rectangulo2.strokeRect(this.button2);  // Coordenadas (100, 100), 200px de ancho y 150px de alto

        this.cursors = this.input.keyboard.createCursorKeys();
        this.selection = 1;

        this.enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        // Configurar el input táctil
        this.input.on('pointerdown', this.onTouch, this);  // Detectar toque en pantalla
    }

    update() {
        // En tercer lugar, se ejutar una y otra vez
        // Actualización de multimedia
        // Verificar si el personaje está tocando el suelo y presionando la tecla de salto
        if (
            (this.enter.isDown && (!this.cursors.up.isDown && !this.cursors.down.isDown))
        ) {
            if (this.selection == 1) {
                this.scene.start('gameScene');
            } else if (this.selection == 2) {
                this.scene.start('controlsScene');
            }
        }
        if (this.cursors.up.isDown) {
            // Establecer el color y grosor del borde (lineStyle)
            this.selection = 1;
            console.log(this.selection);
            this.rectangulo.lineStyle(4, 0xffffff, 1);  // Grosor de línea 4px, color rojo (0xff0000), opacidad 1 (totalmente opaco)
            this.rectangulo.strokeRect(this.button1); // Coordenadas (100, 100), 200px de ancho y 150px de alto
            this.rectangulo2.lineStyle(4, 0x000000, 1);  // Grosor de línea 4px, color rojo (0xff0000), opacidad 1 (totalmente opaco)
            this.rectangulo2.strokeRect(this.button2);   // Coordenadas (100, 100), 200px de ancho y 150px de alto

        } else if (this.cursors.down.isDown) {
            this.selection = 2;
            console.log(this.selection);
            // Dibujar solo el borde del rectángulo (x, y, ancho, alto)
            this.rectangulo.strokeRect(this.button1);  // Coordenadas (100, 100), 200px de ancho y 150px de alto
            this.rectangulo2.strokeRect(this.button2);   // Coordenadas (100, 100), 200px de ancho y 150px de alto
            this.rectangulo2.lineStyle(4, 0xffffff, 1);  // Grosor de línea 4px, color rojo (0xff0000), opacidad 1 (totalmente opaco)
            this.rectangulo.lineStyle(4, 0x000000, 1);
        }

    }

    onTouch(pointer) {
        // Verificar si el toque fue dentro de los rectángulos
        if (this.button1.contains(pointer.x, pointer.y)) {
            this.selection = 1;
            this.scene.start('gameScene');
        } else if (this.button2.contains(pointer.x, pointer.y)) {
            this.selection = 2;
            this.scene.start('controlsScene');
        }
    }
}

class Controls extends Phaser.Scene {
    constructor() {
        super('controlsScene');
    }

    preload() {
        // En primer lugar, solo se ejecuta una vez
        // Multimedia
        this.load.baseURL = './';
        this.load.image('controls', './img/screens/controls.png');
    }

    create() {
        // En segundo lugar, se ejecuta una vez
        // Toda la lógica del videojuego
        const { width, height } = this.scale;
        this.add.image(width/2, height/2, 'controls').setScale(1)
        this.rectangulo = this.add.graphics();

        this.button = new Phaser.Geom.Rectangle(505, 610, 170, 60);

        this.rectangulo.lineStyle(4, 0xffffff, 1);  // Grosor de línea 4px, color rojo (0xff0000), opacidad 1 (totalmente opaco)
        this.rectangulo.strokeRect(this.button1);
        this.enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        // Configurar el input táctil
        this.input.on('pointerdown', this.onTouch, this);  // Detectar toque en pantalla
    }

    update() {
        // En tercer lugar, se ejutar una y otra vez
        // Actualización de multimedia
        if (this.enter.isDown) {
            this.scene.start('mainmenu');
        }
    }

    onTouch(pointer) {
        // Verificar si el toque fue dentro de los rectángulos
        if (this.button.contains(pointer.x, pointer.y)) {
            this.scene.start('mainmenu');
        }
    }

}

class EndGame extends Phaser.Scene {
    constructor() {
        super('endScene');
    }

    preload() {
        // En primer lugar, solo se ejecuta una vez
        // Multimedia
        this.load.baseURL = './';
        this.load.image('gameover', './img/gameover.png');
    }

    create() {
        // En segundo lugar, se ejecuta una vez
        // Toda la lógica del videojuego
        this.add.image(640, 360, 'gameover').setScale(0.2);
    }

    update() {
        // En tercer lugar, se ejutar una y otra vez
        // Actualización de multimedia
    }

}


// 3) Configuración base del videojuego
const config = {
    type: Phaser.AUTO,
    // Array que indica el orden de visualización del vj
    scene: [MainMenu,Controls, Nivel1, Nivel2, Level, EndGame],
    scale: {
        mode: Phaser.Scale.FIT,
        width: 1280,
        height: 720,
    }, physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: {
                y: 300,

            },
        },
    },
}
// 4) Inicialización de Phaser
new Phaser.Game(config);
