import React from 'react';
import { Link } from 'react-router';
import { ScrollLink } from 'react-scrollkit';
import { isMobile, preloadImages } from '../utils';

let particles, parallax, particlesJSON;

/* client asset */
if ( process.env.CanUseDom ) {
    particles = require('particles.js');
    //parallax = require('../assets/vendor/parallax.js');
    particlesJSON = require('../assets/json/particles.json');
}

/* hero background + text */
class Hero extends React.Component {

    constructor() {
        super();
        this.state = {
            loaded: false,
        }
        this._isMounted = true;
        this.parallax = null;
        this.debounce = null;
        this.screenWidth = 0;
        this.debounceResize = this.debounceResize.bind(this);
        this.setSize = this.setSize.bind(this);
        this.heroImages = ['http://pmhc.co/images/hero/mountain_night.jpg', 'http://pmhc.co/images/hero/trees_night.png'];
    
 

    }

    componentDidMount() {
        preloadImages(this.heroImages).then(() => {
            if (this._isMounted) {
                this.initHero();
            }
        });
    }

    initHero(classStyle) {
        window.addEventListener('resize', this.debounceResize);
        particlesJS('hero-particle', particlesJSON);

        const { heroBg, heroExtra, heroScene, heroWrapper } = this.refs;

        heroBg.style.backgroundImage = 'url('+ this.heroImages[0] + ')';
        heroExtra.style.backgroundImage = 'url(' + this.heroImages[1] + ')';

        /*
        setTimeout(() => {
            this.parallax = new Parallax(heroScene, {
                listenTo: heroWrapper,
                relativeInput: true,
                clipRelativeInput: true,
                limitX: 100,
                limitY: 100
            });
        }, 1251);
        */

        this.setSize();
        this.setState({ 
            loaded: true
        });
    }
    
    debounceResize() {
        if (this.debounce) clearTimeout(this.debounce);
        this.debounce = setTimeout(this.setSize, 150);
    }

 
    setSize() {
        const { innerWidth: w, innerHeight: h } = window;
        const { heroBg, heroExtra, heroParticle } = this.refs;
        if (isMobile() && (w === this.screenWidth)) {
            return;
        }
        this.screenWidth = w;
        heroBg.style.width = (w ) + 'px';
        heroBg.style.height = (h ) + 'px';
        heroExtra.style.width = (w + 150) + 'px';
        heroParticle.style.width = (w + 150) + 'px';
        heroParticle.style.height = ((h * 0.33) + 150) + 'px';
    }    

    componentWillUnmount() {
        this._isMounted = false;
       // if (this.parallax) this.parallax.disable();
        if (this.debounce) clearTimeout(this.debounce); 
        window.removeEventListener('resize', this.debounceResize); 
    }

    render() {

        const heroClass = this.state.loaded ? 'hero active-nodelay' : 'hero';

        return (
            <div className={ heroClass }>
                <div id="hero-canvas">
                    <div ref="heroScene" id="scene">
                        <div className="layer hero-bg" ref="heroBg"  />
                        <div className="layer" id="hero-particle" ref="heroParticle"  />
                        <div className="layer hero-text" ref="heroText">
                            <div className="hero-text-left">P&ndash;</div>
                        </div>
                        <div className="layer hero-grid" />
                        <div className="layer hero-extra" ref="heroExtra" />
                    </div>
                </div>  
                <div ref="heroWrapper" className="hero-wrapper">
                    <div className="inner">
                        <div className="hero-msg"><span>Hi &mdash; I'm Philip Chung.</span><span>I create digital solutions.</span></div>   
                    </div>
                    <div className="hero-bottom">
         
                        <ScrollLink to="content" smooth={ true } className="icon down" onClick={ this.doStuff } />
                    </div>
                </div>
            </div>
        );
    }
}

Hero.displayName = "Hero";
export default Hero

 