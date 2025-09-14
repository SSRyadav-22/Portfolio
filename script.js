document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Navigation ---
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', () => {
        nav.classList.toggle('nav-active');
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
        burger.classList.toggle('toggle');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('nav-active')) {
                nav.classList.remove('nav-active');
                burger.classList.remove('toggle');
                navLinks.forEach(lnk => lnk.style.animation = '');
            }
        });
    });

    // --- Smooth Scrolling for Nav Links & Active Class ---
    const sections = document.querySelectorAll("main section");
    const navLi = document.querySelectorAll("header nav ul li a");
    window.addEventListener("scroll", () => {
        let current = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });
        navLi.forEach(a => {
            a.classList.remove("active");
            if (a.getAttribute("href") == "#" + current) {
                a.classList.add("active");
            }
        });
    });

    // --- Scroll Animations ---
    const scrollElements = document.querySelectorAll(".animate-on-scroll");
    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend);
    };
    const displayScrollElement = (element) => {
        element.classList.add("is-visible");
    };
    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.25)) {
                displayScrollElement(el);
            }
        });
    };
    handleScrollAnimation();
    window.addEventListener("scroll", handleScrollAnimation);

    // --- Update Footer Year ---
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Sparks Effect for Hero Name ---
    const heroSection = document.querySelector('.hero');
    const heroNameElement = document.querySelector('#home .hero-content h1.neon-text-effect');
    const heroContentElement = document.querySelector('#home .hero-content');
    let sparksInterval;

    function createSpark() {
        if (!heroNameElement || !heroContentElement) return;
        const spark = document.createElement('div');
        spark.classList.add('spark');
        const nameRect = heroNameElement.getBoundingClientRect();
        const contentRect = heroContentElement.getBoundingClientRect();
        const startX = Math.random() * nameRect.width;
        const startY = nameRect.height * (0.5 + Math.random() * 0.5);
        spark.style.left = (nameRect.left - contentRect.left + startX) + 'px';
        spark.style.top = (nameRect.top - contentRect.top + startY) + 'px';
        const fallDuration = 0.5 + Math.random() * 1;
        const driftX = (Math.random() - 0.5) * 60;
        const fallDistance = 100 + Math.random() * 150;
        heroContentElement.appendChild(spark);
        spark.animate([{
            transform: 'translateY(0) translateX(0)',
            opacity: 0.8
        }, {
            transform: `translateY(${fallDistance}px) translateX(${driftX}px)`,
            opacity: 0
        }], {
            duration: fallDuration * 1000,
            easing: 'ease-out',
            fill: 'forwards'
        });
        setTimeout(() => {
            if (spark.parentNode) {
                spark.parentNode.removeChild(spark);
            }
        }, fallDuration * 1000);
    }
    const heroObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            if (!sparksInterval && heroNameElement && heroContentElement) {
                for (let i = 0; i < 5; i++) setTimeout(createSpark, Math.random() * 500);
                sparksInterval = setInterval(createSpark, 100 + Math.random() * 200);
            }
        } else {
            clearInterval(sparksInterval);
            sparksInterval = null;
        }
    }, {
        threshold: 0.1
    });
    if (heroSection) {
        heroObserver.observe(heroSection);
    }

    // --- Typewriter and Neon Flow Effect for About Me Section ---
    const aboutParagraphs = document.querySelectorAll('#about .about-text p');
    const textsToType = [];
    if (aboutParagraphs.length > 0) {
        aboutParagraphs.forEach(p => {
            textsToType.push(p.textContent || "");
            p.innerHTML = '';
        });
    }
    const typingSpeed = 15;
    const neonFlowDelay = 8;
    async function typeAndNeonFlow(element, text, charNeonColorVar = '--neon-primary', activeFlowNeonColorVar = '--neon-secondary') {
        if (!text) return;
        const wordsAndSpaces = text.split(/(\s+)/);
        for (const part of wordsAndSpaces) {
            if (part.match(/^\s+$/)) {
                const spaceSpan = document.createElement('span');
                spaceSpan.innerHTML = part;
                spaceSpan.style.opacity = '1';
                element.appendChild(spaceSpan);
            } else if (part.length > 0) {
                const wordWrapper = document.createElement('span');
                wordWrapper.classList.add('word-wrapper');
                element.appendChild(wordWrapper);
                for (let i = 0; i < part.length; i++) {
                    const char = part[i];
                    const charSpan = document.createElement('span');
                    charSpan.textContent = char;
                    charSpan.classList.add('typed-char-neon');
                    charSpan.style.setProperty('--neon-primary-override', `var(${charNeonColorVar})`);
                    charSpan.style.setProperty('--neon-secondary-override', `var(${activeFlowNeonColorVar})`);
                    wordWrapper.appendChild(charSpan);
                    await new Promise(resolve => setTimeout(resolve, typingSpeed));
                    charSpan.style.opacity = '1';
                    charSpan.classList.add('active-flow');
                    await new Promise(resolve => setTimeout(resolve, neonFlowDelay));
                    charSpan.classList.remove('active-flow');
                }
            }
        }
    }
    const aboutSection = document.getElementById('about');
    let aboutAnimationStarted = false;
    if (aboutSection && aboutParagraphs.length > 0) {
        const aboutObserver = new IntersectionObserver(async (entries) => {
            if (entries[0].isIntersecting && !aboutAnimationStarted) {
                aboutAnimationStarted = true;
                aboutObserver.unobserve(aboutSection);
                if (textsToType.length > 0 && textsToType[0]) {
                    await typeAndNeonFlow(aboutParagraphs[0], textsToType[0], '--neon-primary', '--neon-accent');
                }
                if (textsToType.length > 1 && textsToType[1] && aboutParagraphs.length > 1) {
                    await typeAndNeonFlow(aboutParagraphs[1], textsToType[1], '--neon-primary', '#FFFFFF');
                }
            }
        }, {
            threshold: 0.3
        });
        aboutObserver.observe(aboutSection);
    }

    // --- Liquid Ether Background Effect ---
    const contactSection = document.getElementById('contact');
    const liquidEtherContainer = document.getElementById('liquid-ether-container');

    if (contactSection && liquidEtherContainer && typeof THREE !== 'undefined') {
        let webglManager = null;
        const contactObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                if (!webglManager) {
                    webglManager = new WebGLManager({
                        $wrapper: liquidEtherContainer,
                        autoDemo: true,
                        autoSpeed: 0.5,
                        autoIntensity: 2.2,
                        autoResumeDelay: 3000,
                        autoRampDuration: 0.6,
                        takeoverDuration: 0.25,
                        simulationOptions: {
                            mouse_force: 20,
                            cursor_size: 100,
                            isViscous: false,
                            viscous: 30,
                            iterations_viscous: 32,
                            iterations_poisson: 32,
                            dt: 0.014,
                            BFECC: true,
                            resolution: 0.5,
                            isBounce: false,
                            colors: ['#5227FF', '#FF9FFC', '#B19EEF']
                        }
                    });
                }
                webglManager.start();
            } else {
                if (webglManager) {
                    webglManager.pause();
                }
            }
        }, {
            threshold: 0.01
        });

        contactObserver.observe(contactSection);

        // --- All supporting classes for the liquid effect ---
        const face_vert = `attribute vec3 position;uniform vec2 px;uniform vec2 boundarySpace;varying vec2 uv;precision highp float;void main(){vec3 pos=position;vec2 scale=1.0-boundarySpace*2.0;pos.xy=pos.xy*scale;uv=vec2(0.5)+(pos.xy)*0.5;gl_Position=vec4(pos,1.0);}`;
        const line_vert = `attribute vec3 position;uniform vec2 px;precision highp float;varying vec2 uv;void main(){vec3 pos=position;uv=0.5+pos.xy*0.5;vec2 n=sign(pos.xy);pos.xy=abs(pos.xy)-px*1.0;pos.xy*=n;gl_Position=vec4(pos,1.0);}`;
        const mouse_vert = `precision highp float;attribute vec3 position;attribute vec2 uv;uniform vec2 center;uniform vec2 scale;uniform vec2 px;varying vec2 vUv;void main(){vec2 pos=position.xy*scale*2.0*px+center;vUv=uv;gl_Position=vec4(pos,0.0,1.0);}`;
        const advection_frag = `precision highp float;uniform sampler2D velocity;uniform float dt;uniform bool isBFECC;uniform vec2 fboSize;uniform vec2 px;varying vec2 uv;void main(){vec2 ratio=max(fboSize.x,fboSize.y)/fboSize;if(isBFECC==false){vec2 vel=texture2D(velocity,uv).xy;vec2 uv2=uv-vel*dt*ratio;vec2 newVel=texture2D(velocity,uv2).xy;gl_FragColor=vec4(newVel,0.0,0.0);}else{vec2 spot_new=uv;vec2 vel_old=texture2D(velocity,uv).xy;vec2 spot_old=spot_new-vel_old*dt*ratio;vec2 vel_new1=texture2D(velocity,spot_old).xy;vec2 spot_new2=spot_old+vel_new1*dt*ratio;vec2 error=spot_new2-spot_new;vec2 spot_new3=spot_new-error/2.0;vec2 vel_2=texture2D(velocity,spot_new3).xy;vec2 spot_old2=spot_new3-vel_2*dt*ratio;vec2 newVel2=texture2D(velocity,spot_old2).xy;gl_FragColor=vec4(newVel2,0.0,0.0);}}`;
        const color_frag = `precision highp float;uniform sampler2D velocity;uniform sampler2D palette;uniform vec4 bgColor;varying vec2 uv;void main(){vec2 vel=texture2D(velocity,uv).xy;float lenv=clamp(length(vel),0.0,1.0);vec3 c=texture2D(palette,vec2(lenv,0.5)).rgb;vec3 outRGB=mix(bgColor.rgb,c,lenv);float outA=mix(bgColor.a,1.0,lenv);gl_FragColor=vec4(outRGB,outA);}`;
        const divergence_frag = `precision highp float;uniform sampler2D velocity;uniform float dt;uniform vec2 px;varying vec2 uv;void main(){float x0=texture2D(velocity,uv-vec2(px.x,0.0)).x;float x1=texture2D(velocity,uv+vec2(px.x,0.0)).x;float y0=texture2D(velocity,uv-vec2(0.0,px.y)).y;float y1=texture2D(velocity,uv+vec2(0.0,px.y)).y;float divergence=(x1-x0+y1-y0)/2.0;gl_FragColor=vec4(divergence/dt);}`;
        const externalForce_frag = `precision highp float;uniform vec2 force;uniform vec2 center;uniform vec2 scale;uniform vec2 px;varying vec2 vUv;void main(){vec2 circle=(vUv-0.5)*2.0;float d=1.0-min(length(circle),1.0);d*=d;gl_FragColor=vec4(force*d,0.0,1.0);}`;
        const poisson_frag = `precision highp float;uniform sampler2D pressure;uniform sampler2D divergence;uniform vec2 px;varying vec2 uv;void main(){float p0=texture2D(pressure,uv+vec2(px.x*2.0,0.0)).r;float p1=texture2D(pressure,uv-vec2(px.x*2.0,0.0)).r;float p2=texture2D(pressure,uv+vec2(0.0,px.y*2.0)).r;float p3=texture2D(pressure,uv-vec2(0.0,px.y*2.0)).r;float div=texture2D(divergence,uv).r;float newP=(p0+p1+p2+p3)/4.0-div;gl_FragColor=vec4(newP);}`;
        const pressure_frag = `precision highp float;uniform sampler2D pressure;uniform sampler2D velocity;uniform vec2 px;uniform float dt;varying vec2 uv;void main(){float step=1.0;float p0=texture2D(pressure,uv+vec2(px.x*step,0.0)).r;float p1=texture2D(pressure,uv-vec2(px.x*step,0.0)).r;float p2=texture2D(pressure,uv+vec2(0.0,px.y*step)).r;float p3=texture2D(pressure,uv-vec2(0.0,px.y*step)).r;vec2 v=texture2D(velocity,uv).xy;vec2 gradP=vec2(p0-p1,p2-p3)*0.5;v=v-gradP*dt;gl_FragColor=vec4(v,0.0,1.0);}`;
        const viscous_frag = `precision highp float;uniform sampler2D velocity;uniform sampler2D velocity_new;uniform float v;uniform vec2 px;uniform float dt;varying vec2 uv;void main(){vec2 old=texture2D(velocity,uv).xy;vec2 new0=texture2D(velocity_new,uv+vec2(px.x*2.0,0.0)).xy;vec2 new1=texture2D(velocity_new,uv-vec2(px.x*2.0,0.0)).xy;vec2 new2=texture2D(velocity_new,uv+vec2(0.0,px.y*2.0)).xy;vec2 new3=texture2D(velocity_new,uv-vec2(0.0,px.y*2.0)).xy;vec2 newv=4.0*old+v*dt*(new0+new1+new2+new3);newv/=4.0*(1.0+v*dt);gl_FragColor=vec4(newv,0.0,0.0);}`;
        function makePaletteTexture(stops) { let arr; if (Array.isArray(stops) && stops.length > 0) { arr = stops.length === 1 ? [stops[0], stops[0]] : stops; } else { arr = ['#ffffff', '#ffffff']; } const w = arr.length; const data = new Uint8Array(w * 4); for (let i = 0; i < w; i++) { const c = new THREE.Color(arr[i]); data[i * 4 + 0] = Math.round(c.r * 255); data[i * 4 + 1] = Math.round(c.g * 255); data[i * 4 + 2] = Math.round(c.b * 255); data[i * 4 + 3] = 255; } const tex = new THREE.DataTexture(data, w, 1, THREE.RGBAFormat); tex.magFilter = THREE.LinearFilter; tex.minFilter = THREE.LinearFilter; tex.wrapS = THREE.ClampToEdgeWrapping; tex.wrapT = THREE.ClampToEdgeWrapping; tex.generateMipmaps = false; tex.needsUpdate = true; return tex; }
        class CommonClass { constructor() { this.width = 0; this.height = 0; this.pixelRatio = 1; this.renderer = null; this.clock = null; } init(container) { this.container = container; this.pixelRatio = Math.min(window.devicePixelRatio || 1, 2); this.resize(); this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); this.renderer.autoClear = false; this.renderer.setClearColor(new THREE.Color(0x000000), 0); this.renderer.setPixelRatio(this.pixelRatio); this.renderer.setSize(this.width, this.height); this.renderer.domElement.style.width = '100%'; this.renderer.domElement.style.height = '100%'; container.appendChild(this.renderer.domElement); this.clock = new THREE.Clock(); this.clock.start(); } resize() { if (!this.container) return; const rect = this.container.getBoundingClientRect(); this.width = Math.max(1, Math.floor(rect.width)); this.height = Math.max(1, Math.floor(rect.height)); if (this.renderer) this.renderer.setSize(this.width, this.height, false); } update() { this.delta = this.clock.getDelta(); this.time += this.delta; } }
        const Common = new CommonClass();
        class MouseClass { constructor() { this.coords = new THREE.Vector2(); this.coords_old = new THREE.Vector2(); this.diff = new THREE.Vector2(); this.container = null; this.isHoverInside = false; this.hasUserControl = false; this.isAutoActive = false; this.autoIntensity = 2.2; this.takeoverActive = false; this.takeoverStartTime = 0; this.takeoverDuration = 0.25; this.takeoverFrom = new THREE.Vector2(); this.takeoverTo = new THREE.Vector2(); this.onInteract = null; this._onMouseMove = this.onDocumentMouseMove.bind(this); this._onTouchStart = this.onDocumentTouchStart.bind(this); this._onTouchMove = this.onDocumentTouchMove.bind(this); this._onMouseEnter = this.onMouseEnter.bind(this); this._onMouseLeave = this.onMouseLeave.bind(this); } init(container) { this.container = container; container.addEventListener('mousemove', this._onMouseMove, false); container.addEventListener('touchstart', this._onTouchStart, { passive: false }); container.addEventListener('touchmove', this._onTouchMove, { passive: false }); container.addEventListener('mouseenter', this._onMouseEnter, false); container.addEventListener('mouseleave', this._onMouseLeave, false); } dispose() { if (!this.container) return; this.container.removeEventListener('mousemove', this._onMouseMove); this.container.removeEventListener('touchstart', this._onTouchStart); this.container.removeEventListener('touchmove', this._onTouchMove); this.container.removeEventListener('mouseenter', this._onMouseEnter); this.container.removeEventListener('mouseleave', this._onMouseLeave); } setCoords(x, y) { if (!this.container) return; const rect = this.container.getBoundingClientRect(); const nx = (x - rect.left) / rect.width; const ny = (y - rect.top) / rect.height; this.coords.set(nx * 2 - 1, -(ny * 2 - 1)); } setNormalized(nx, ny) { this.coords.set(nx, ny); } onDocumentMouseMove(event) { if (this.onInteract) this.onInteract(); if (this.isAutoActive && !this.hasUserControl && !this.takeoverActive) { const rect = this.container.getBoundingClientRect(); const nx = (event.clientX - rect.left) / rect.width; const ny = (event.clientY - rect.top) / rect.height; this.takeoverFrom.copy(this.coords); this.takeoverTo.set(nx * 2 - 1, -(ny * 2 - 1)); this.takeoverStartTime = performance.now(); this.takeoverActive = true; this.hasUserControl = true; this.isAutoActive = false; return; } this.setCoords(event.clientX, event.clientY); this.hasUserControl = true; } onDocumentTouchStart(event) { if (event.touches.length === 1) { event.preventDefault(); const t = event.touches[0]; if (this.onInteract) this.onInteract(); this.setCoords(t.pageX, t.pageY); this.hasUserControl = true; } } onDocumentTouchMove(event) { if (event.touches.length === 1) { event.preventDefault(); const t = event.touches[0]; if (this.onInteract) this.onInteract(); this.setCoords(t.pageX, t.pageY); } } onMouseEnter() { this.isHoverInside = true; } onMouseLeave() { this.isHoverInside = false; } update() { if (this.takeoverActive) { const t = (performance.now() - this.takeoverStartTime) / (this.takeoverDuration * 1000); if (t >= 1) { this.takeoverActive = false; this.coords.copy(this.takeoverTo); } else { const k = t * t * (3 - 2 * t); this.coords.lerpVectors(this.takeoverFrom, this.takeoverTo, k); } } this.diff.subVectors(this.coords, this.coords_old); this.coords_old.copy(this.coords); if (this.coords_old.x === 0 && this.coords_old.y === 0) this.diff.set(0, 0); if (this.isAutoActive && !this.takeoverActive) this.diff.multiplyScalar(this.autoIntensity); } }
        const Mouse = new MouseClass();
        class AutoDriver { constructor(mouse, manager, opts) { this.mouse = mouse; this.manager = manager; this.enabled = opts.enabled; this.speed = opts.speed; this.resumeDelay = opts.resumeDelay || 3000; this.rampDurationMs = (opts.rampDuration || 0) * 1000; this.active = false; this.current = new THREE.Vector2(0, 0); this.target = new THREE.Vector2(); this.lastTime = performance.now(); this.activationTime = 0; this.margin = 0.2; this._tmpDir = new THREE.Vector2(); this.pickNewTarget(); } pickNewTarget() { const r = Math.random; this.target.set((r() * 2 - 1) * (1 - this.margin), (r() * 2 - 1) * (1 - this.margin)); } forceStop() { this.active = false; this.mouse.isAutoActive = false; } update() { if (!this.enabled) return; const now = performance.now(); const idle = now - this.manager.lastUserInteraction; if (idle < this.resumeDelay || this.mouse.isHoverInside) { if (this.active) this.forceStop(); return; } if (!this.active) { this.active = true; this.current.copy(this.mouse.coords); this.lastTime = now; this.activationTime = now; } if (!this.active) return; this.mouse.isAutoActive = true; let dtSec = (now - this.lastTime) / 1000; this.lastTime = now; if (dtSec > 0.2) dtSec = 0.016; const dir = this._tmpDir.subVectors(this.target, this.current); const dist = dir.length(); if (dist < 0.01) { this.pickNewTarget(); return; } dir.normalize(); let ramp = 1; if (this.rampDurationMs > 0) { const t = Math.min(1, (now - this.activationTime) / this.rampDurationMs); ramp = t * t * (3 - 2 * t); } const step = this.speed * dtSec * ramp; const move = Math.min(step, dist); this.current.addScaledVector(dir, move); this.mouse.setNormalized(this.current.x, this.current.y); } }
        class ShaderPass { constructor(props) { this.props = props || {}; this.uniforms = this.props.material ?.uniforms; this.scene = new THREE.Scene(); this.camera = new THREE.Camera(); if (this.uniforms) { this.material = new THREE.RawShaderMaterial(this.props.material); const geometry = new THREE.PlaneGeometry(2, 2); this.plane = new THREE.Mesh(geometry, this.material); this.scene.add(this.plane); } } update() { Common.renderer.setRenderTarget(this.props.output || null); Common.renderer.render(this.scene, this.camera); Common.renderer.setRenderTarget(null); } }
        class Advection extends ShaderPass { constructor(simProps) { super({ material: { vertexShader: face_vert, fragmentShader: advection_frag, uniforms: { boundarySpace: { value: simProps.cellScale }, px: { value: simProps.cellScale }, fboSize: { value: simProps.fboSize }, velocity: { value: simProps.src.texture }, dt: { value: simProps.dt }, isBFECC: { value: true } } }, output: simProps.dst }); this.uniforms = this.props.material.uniforms; const boundaryG = new THREE.BufferGeometry(); const vertices_boundary = new Float32Array([-1, -1, 0, -1, 1, 0, -1, 1, 0, 1, 1, 0, 1, 1, 0, 1, -1, 0, 1, -1, 0, -1, -1, 0]); boundaryG.setAttribute('position', new THREE.BufferAttribute(vertices_boundary, 3)); const boundaryM = new THREE.RawShaderMaterial({ vertexShader: line_vert, fragmentShader: advection_frag, uniforms: this.uniforms }); this.line = new THREE.LineSegments(boundaryG, boundaryM); this.scene.add(this.line); } update({ dt, isBounce, BFECC }) { this.uniforms.dt.value = dt; this.line.visible = isBounce; this.uniforms.isBFECC.value = BFECC; super.update(); } }
        class ExternalForce extends ShaderPass { constructor(simProps) { super({ output: simProps.dst }); const mouseG = new THREE.PlaneGeometry(1, 1); const mouseM = new THREE.RawShaderMaterial({ vertexShader: mouse_vert, fragmentShader: externalForce_frag, blending: THREE.AdditiveBlending, depthWrite: false, uniforms: { px: { value: simProps.cellScale }, force: { value: new THREE.Vector2(0, 0) }, center: { value: new THREE.Vector2(0, 0) }, scale: { value: new THREE.Vector2(simProps.cursor_size, simProps.cursor_size) } } }); this.mouse = new THREE.Mesh(mouseG, mouseM); this.scene.add(this.mouse); } update(props) { const forceX = (Mouse.diff.x / 2) * props.mouse_force; const forceY = (Mouse.diff.y / 2) * props.mouse_force; const uniforms = this.mouse.material.uniforms; uniforms.force.value.set(forceX, forceY); uniforms.center.value.set(Mouse.coords.x, Mouse.coords.y); uniforms.scale.value.set(props.cursor_size, props.cursor_size); super.update(); } }
        class Viscous extends ShaderPass { constructor(simProps) { super({ material: { vertexShader: face_vert, fragmentShader: viscous_frag, uniforms: { boundarySpace: { value: simProps.boundarySpace }, velocity: { value: simProps.src.texture }, velocity_new: { value: simProps.dst_.texture }, v: { value: simProps.viscous }, px: { value: simProps.cellScale }, dt: { value: simProps.dt } } }, output: simProps.dst, output0: simProps.dst_, output1: simProps.dst }); } update({ viscous, iterations, dt }) { let fbo_in, fbo_out; this.uniforms.v.value = viscous; for (let i = 0; i < iterations; i++) { if (i % 2 === 0) { fbo_in = this.props.output0; fbo_out = this.props.output1; } else { fbo_in = this.props.output1; fbo_out = this.props.output0; } this.uniforms.velocity_new.value = fbo_in.texture; this.props.output = fbo_out; this.uniforms.dt.value = dt; super.update(); } return fbo_out; } }
        class Divergence extends ShaderPass { constructor(simProps) { super({ material: { vertexShader: face_vert, fragmentShader: divergence_frag, uniforms: { boundarySpace: { value: simProps.boundarySpace }, velocity: { value: simProps.src.texture }, px: { value: simProps.cellScale }, dt: { value: simProps.dt } } }, output: simProps.dst }); } update({ vel }) { this.uniforms.velocity.value = vel.texture; super.update(); } }
        class Poisson extends ShaderPass { constructor(simProps) { super({ material: { vertexShader: face_vert, fragmentShader: poisson_frag, uniforms: { boundarySpace: { value: simProps.boundarySpace }, pressure: { value: simProps.dst_.texture }, divergence: { value: simProps.src.texture }, px: { value: simProps.cellScale } } }, output: simProps.dst, output0: simProps.dst_, output1: simProps.dst }); } update({ iterations }) { let p_in, p_out; for (let i = 0; i < iterations; i++) { if (i % 2 === 0) { p_in = this.props.output0; p_out = this.props.output1; } else { p_in = this.props.output1; p_out = this.props.output0; } this.uniforms.pressure.value = p_in.texture; this.props.output = p_out; super.update(); } return p_out; } }
        class Pressure extends ShaderPass { constructor(simProps) { super({ material: { vertexShader: face_vert, fragmentShader: pressure_frag, uniforms: { boundarySpace: { value: simProps.boundarySpace }, pressure: { value: simProps.src_p.texture }, velocity: { value: simProps.src_v.texture }, px: { value: simProps.cellScale }, dt: { value: simProps.dt } } }, output: simProps.dst }); } update({ vel, pressure }) { this.uniforms.velocity.value = vel.texture; this.uniforms.pressure.value = pressure.texture; super.update(); } }
        class Simulation { constructor(options) { this.options = options; this.fbos = {}; this.fboSize = new THREE.Vector2(); this.cellScale = new THREE.Vector2(); this.boundarySpace = new THREE.Vector2(); this.init(); } init() { this.calcSize(); this.createAllFBO(); this.createShaderPass(); } getFloatType() { return /(iPad|iPhone|iPod)/i.test(navigator.userAgent) ? THREE.HalfFloatType : THREE.FloatType; } createAllFBO() { const type = this.getFloatType(); const opts = { type, depthBuffer: false, stencilBuffer: false, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, wrapS: THREE.ClampToEdgeWrapping, wrapT: THREE.ClampToEdgeWrapping }; const fboNames = ['vel_0', 'vel_1', 'vel_viscous0', 'vel_viscous1', 'div', 'pressure_0', 'pressure_1']; fboNames.forEach(key => { this.fbos[key] = new THREE.WebGLRenderTarget(this.fboSize.x, this.fboSize.y, opts); }); } createShaderPass() { this.advection = new Advection({ cellScale: this.cellScale, fboSize: this.fboSize, dt: this.options.dt, src: this.fbos.vel_0, dst: this.fbos.vel_1 }); this.externalForce = new ExternalForce({ cellScale: this.cellScale, cursor_size: this.options.cursor_size, dst: this.fbos.vel_1 }); this.viscous = new Viscous({ cellScale: this.cellScale, boundarySpace: this.boundarySpace, viscous: this.options.viscous, src: this.fbos.vel_1, dst: this.fbos.vel_viscous1, dst_: this.fbos.vel_viscous0, dt: this.options.dt }); this.divergence = new Divergence({ cellScale: this.cellScale, boundarySpace: this.boundarySpace, src: this.fbos.vel_viscous0, dst: this.fbos.div, dt: this.options.dt }); this.poisson = new Poisson({ cellScale: this.cellScale, boundarySpace: this.boundarySpace, src: this.fbos.div, dst: this.fbos.pressure_1, dst_: this.fbos.pressure_0 }); this.pressure = new Pressure({ cellScale: this.cellScale, boundarySpace: this.boundarySpace, src_p: this.fbos.pressure_0, src_v: this.fbos.vel_viscous0, dst: this.fbos.vel_0, dt: this.options.dt }); } calcSize() { const width = Math.max(1, Math.round(this.options.resolution * Common.width)); const height = Math.max(1, Math.round(this.options.resolution * Common.height)); this.cellScale.set(1 / width, 1 / height); this.fboSize.set(width, height); } resize() { this.calcSize(); for (let key in this.fbos) { this.fbos[key].setSize(this.fboSize.x, this.fboSize.y); } } update() { this.options.isBounce ? this.boundarySpace.set(0, 0) : this.boundarySpace.copy(this.cellScale); this.advection.update({ dt: this.options.dt, isBounce: this.options.isBounce, BFECC: this.options.BFECC }); this.externalForce.update({ cursor_size: this.options.cursor_size, mouse_force: this.options.mouse_force }); let vel = this.fbos.vel_1; if (this.options.isViscous) { vel = this.viscous.update({ viscous: this.options.viscous, iterations: this.options.iterations_viscous, dt: this.options.dt }); } this.divergence.update({ vel }); const pressure = this.poisson.update({ iterations: this.options.iterations_poisson }); this.pressure.update({ vel, pressure }); } }
        class Output { constructor(options) { this.simulation = new Simulation(options); this.scene = new THREE.Scene(); this.camera = new THREE.Camera(); const paletteTex = makePaletteTexture(options.colors); this.output = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.RawShaderMaterial({ vertexShader: face_vert, fragmentShader: color_frag, transparent: true, depthWrite: false, uniforms: { velocity: { value: this.simulation.fbos.vel_0.texture }, boundarySpace: { value: new THREE.Vector2() }, palette: { value: paletteTex }, bgColor: { value: new THREE.Vector4(0, 0, 0, 0) } } })); this.scene.add(this.output); } resize() { this.simulation.resize(); } render() { Common.renderer.setRenderTarget(null); Common.renderer.render(this.scene, this.camera); } update() { this.simulation.update(); this.render(); } }
        class WebGLManager { constructor(props) { this.props = props; this.running = false; this.rafId = null; Common.init(props.$wrapper); Mouse.init(props.$wrapper); this.output = new Output(props.simulationOptions); this.lastUserInteraction = performance.now(); Mouse.onInteract = () => { this.lastUserInteraction = performance.now(); if (this.autoDriver) this.autoDriver.forceStop(); }; this.autoDriver = new AutoDriver(Mouse, this, { enabled: props.autoDemo, speed: props.autoSpeed, resumeDelay: props.autoResumeDelay, rampDuration: props.autoRampDuration }); this._loop = this.loop.bind(this); this._resize = this.resize.bind(this); window.addEventListener('resize', this._resize); } resize() { Common.resize(); this.output.resize(); } loop() { if (!this.running) return; if (this.autoDriver) this.autoDriver.update(); Mouse.update(); Common.update(); this.output.update(); this.rafId = requestAnimationFrame(this._loop); } start() { if (this.running) return; this.running = true; this.loop(); } pause() { this.running = false; if (this.rafId) cancelAnimationFrame(this.rafId); } dispose() { this.pause(); window.removeEventListener('resize', this._resize); Mouse.dispose(); if (Common.renderer) { const canvas = Common.renderer.domElement; if (canvas && canvas.parentNode) { canvas.parentNode.removeChild(canvas); } Common.renderer.dispose(); } } }
    }

    // --- Infinite Magic Card Scroll ---
    const scrollContainer = document.querySelector('.infinite-scroll-container');
    if (scrollContainer && typeof gsap !== 'undefined' && typeof Observer !== 'undefined') {
        gsap.registerPlugin(Observer);

        const originalCardData = [{
                title: 'Email',
                description: 'Click to send a message',
                label: 'Primary',
                href: '#' // Href is now just a placeholder
            },
            {
                title: 'LinkedIn',
                description: 'Connect Professionally',
                label: 'Network',
                href: 'https://www.linkedin.com/in/s-sai-rahual-338222312/'
            },
            {
                title: 'GitHub',
                description: 'Explore My Code',
                label: 'Projects',
                href: 'https://github.com/SSRyadav-22'
            },
            {
                title: 'Download CV',
                description: 'Review My Credentials',
                label: 'Resume',
                href: 'docs/Sai_Rahual_Resume.pdf'
            },
            {
                title: 'Blog',
                description: 'Read My Articles',
                label: 'Writing',
                href: '#'
            },
            {
                title: 'Case Studies',
                description: 'In-depth Project Details',
                label: 'Portfolio',
                href: '#portfolio'
            },
        ];

        const cardData = [...originalCardData, ...originalCardData];

        function addCardEffects(cardElement) {
            let timeouts = [];
            const glowColor = '132, 0, 255';
            cardElement.style.setProperty('--glow-color-rgb', glowColor);

            cardElement.addEventListener('mouseenter', () => {
                for (let i = 0; i < 10; i++) {
                    const timeoutId = setTimeout(() => {
                        if (!cardElement || !cardElement.getBoundingClientRect) return;
                        const {
                            width,
                            height
                        } = cardElement.getBoundingClientRect();
                        const particle = document.createElement('div');
                        particle.className = 'particle';
                        particle.style.cssText = `
                                left: ${Math.random() * width}px;
                                top: ${Math.random() * height}px;
                                background: rgba(${glowColor}, 1);
                                box-shadow: 0 0 6px rgba(${glowColor}, 0.6);
                            `;
                        cardElement.appendChild(particle);
                        gsap.fromTo(particle, {
                            scale: 0,
                            opacity: 0
                        }, {
                            scale: 1,
                            opacity: 1,
                            duration: 0.3,
                            ease: 'back.out(1.7)'
                        });
                        gsap.to(particle, {
                            opacity: 0,
                            duration: 1.5 + Math.random(),
                            ease: 'power2.out',
                            delay: 0.5,
                            onComplete: () => particle.remove()
                        });
                    }, i * 50);
                    timeouts.push(timeoutId);
                }
            });

            cardElement.addEventListener('mouseleave', () => {
                timeouts.forEach(clearTimeout);
                timeouts = [];
                cardElement.style.setProperty('--glow-intensity', '0');
            });

            cardElement.addEventListener('mousemove', e => {
                const rect = cardElement.getBoundingClientRect();
                const relativeX = ((e.clientX - rect.left) / rect.width) * 100;
                const relativeY = ((e.clientY - rect.top) / rect.height) * 100;
                cardElement.style.setProperty('--glow-x', `${relativeX}%`);
                cardElement.style.setProperty('--glow-y', `${relativeY}%`);
                cardElement.style.setProperty('--glow-intensity', '1');
            });
        }

        // ===================================
        // === MODIFIED CARD CREATION LOOP ===
        // ===================================
        cardData.forEach(data => {
            const itemWrapper = document.createElement('div');
            itemWrapper.className = 'infinite-scroll-item';

            const isEmailCard = data.title === 'Email';
            // Use a <div> for the email card trigger, and an <a> for others
            const card = document.createElement(isEmailCard ? 'div' : 'a');

            card.className = 'magic-card card--border-glow';

            if (isEmailCard) {
                // Add a special ID to the email card so we can select it later
                card.id = 'email-card-trigger';
                card.style.cursor = 'pointer'; // Make it look clickable
            } else {
                card.href = data.href || '#';
                // Correct logic for opening links in a new tab
                if (data.href && !data.href.startsWith('#')) {
                    card.target = '_blank';
                }
            }

            card.innerHTML = `
                <div class="card__header"><div class="card__label">${data.label}</div></div>
                <div class="card__content">
                    <h2 class="card__title">${data.title}</h2>
                    <p class="card__description">${data.description}</p>
                </div>
            `;

            addCardEffects(card);
            itemWrapper.appendChild(card);
            scrollContainer.appendChild(itemWrapper);
        });

        // ========================================
        // === NEW - POPUP MODAL & FORM LOGIC ===
        // ========================================
        const modal = document.getElementById('contact-modal');
        const closeModalBtn = document.getElementById('close-modal');
        // Find the email trigger card (there will be two because data is duplicated)
        const emailCardTriggers = document.querySelectorAll('#email-card-trigger');
        const contactForm = document.getElementById('contact-form');
        const formStatus = document.getElementById('form-status');

        const openModal = () => modal.classList.remove('hidden');
        const closeModal = () => modal.classList.add('hidden');

        if (emailCardTriggers.length > 0) {
            emailCardTriggers.forEach(trigger => trigger.addEventListener('click', openModal));
        }
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', closeModal);
        }
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal();
                }
            });
        }

        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const formData = new FormData(this);
                const object = Object.fromEntries(formData);
                const json = JSON.stringify(object);
                formStatus.textContent = 'Sending...';

                fetch('https://api.web3forms.com/submit', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: json
                    })
                    .then(async (response) => {
                        let jsonResponse = await response.json();
                        if (response.status == 200) {
                            formStatus.textContent = 'Message sent successfully!';
                            formStatus.style.color = 'var(--neon-accent)';
                        } else {
                            console.log(response);
                            formStatus.textContent = jsonResponse.message;
                            formStatus.style.color = 'red';
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        formStatus.textContent = "Oops! Something went wrong.";
                        formStatus.style.color = 'red';
                    })
                    .then(function() {
                        contactForm.reset();
                        setTimeout(() => {
                            closeModal();
                            formStatus.textContent = ''; // Reset status text
                        }, 2500);
                    });
            });
        }

        // ============================================
        // === GSAP ANIMATION LOGIC (WITH MOBILE FIX) ===
        // ============================================
        const divItems = gsap.utils.toArray(".infinite-scroll-item");
        if (divItems.length > 0) {
            // Use a small timeout to ensure layout is calculated
            setTimeout(() => {
                const itemHeight = divItems[0].offsetHeight;
                const itemMarginTop = parseFloat(getComputedStyle(divItems[0]).marginTop) || 0;
                const totalItemHeight = itemHeight + itemMarginTop;
                const totalHeight = totalItemHeight * divItems.length;
                const wrapFn = gsap.utils.wrap(-totalItemHeight, totalHeight - totalItemHeight);
                divItems.forEach((child, i) => gsap.set(child, {
                    y: i * totalItemHeight
                }));

                const observer = Observer.create({
                    target: scrollContainer,
                    type: 'wheel,touch,pointer',
                    // preventDefault: true, // REMOVED to prevent scroll trap on mobile
                    onPress: ({
                        target
                    }) => (target.style.cursor = 'grabbing'),
                    onRelease: ({
                        target
                    }) => (target.style.cursor = 'grab'),
                    // MODIFIED onChange for mobile touch inversion
                    onChange: (self) => {
                        // Check if the event is a touch event and invert the delta if it is
                        const move = (self.event.type === 'touchmove' ? -self.deltaY : self.deltaY) * 1.5;

                        divItems.forEach(child =>
                            gsap.to(child, {
                                duration: 0.5,
                                ease: 'expo.out',
                                y: `+=${-move}`, // This logic can stay the same
                                modifiers: {
                                    y: gsap.utils.unitize(wrapFn)
                                },
                            })
                        );
                    },
                });

                let rafId;
                const autoplaySpeed = 0.1;
                const directionFactor = 1;
                const speedPerFrame = autoplaySpeed * directionFactor;
                const tick = () => {
                    divItems.forEach(child =>
                        gsap.set(child, {
                            y: `+=${speedPerFrame}`,
                            modifiers: {
                                y: gsap.utils.unitize(wrapFn)
                            },
                        })
                    );
                    rafId = requestAnimationFrame(tick);
                };
                const stopTicker = () => cancelAnimationFrame(rafId);
                const startTicker = () => (rafId = requestAnimationFrame(tick));
                scrollContainer.addEventListener('mouseenter', stopTicker);
                scrollContainer.addEventListener('mouseleave', startTicker);
                startTicker();
            }, 100); // A 100ms delay can often be enough for rendering to catch up
        }
    }
});
