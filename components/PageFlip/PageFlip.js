import React from 'react'
import HTMLFlipBook from 'react-pageflip'
import styles from './PageFlip.module.css'

import useWindowDimensions from '../Utils/useWindowDimensions'

const Page = React.forwardRef((props, ref) => {
    return (
        <div className={styles.pages} ref={ref}>
            {/* ref required 
            <h1>Page Header</h1>*/}
            <p>{props.children}</p>
            <p>Pagina: {props.number}</p>
        </div>
    );
});

export default function PF() {

    const { height, width } = useWindowDimensions();

    const getWidth = () => {

        let w = 1300
        if (width < 600) w = 280
        return w
    }

    const getHeight = () => {

        let h = 500
        if (width < 600) h = 200
        return h
    } 

    return (
        <HTMLFlipBook width={getWidth()} height={getHeight()}>
            <Page number="1"><img src="slides.jpg" className={styles.img}/></Page>
            <Page number="2"><img src="slides2.jpg" className={styles.img}/></Page>
            <Page number="3"><img src="banner-site-dark.jpg" className={styles.img}/></Page>
            <Page number="4"><img src="banner-site-ocara.jpg" className={styles.img}/></Page>
        </HTMLFlipBook>
    );
}