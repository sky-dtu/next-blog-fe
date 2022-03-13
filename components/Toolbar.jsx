import { useRouter } from 'next/router';
import React from 'react';
import styles from '../styles/Toolbar.module.css'


const Toolbar = () => {

    const router = useRouter();

    return (
        <div className={styles.main}>
            <div onClick={() => router.push('/')}>Home</div>
            <div onClick={() => window.location.href = 'https://github.com/sky-dtu'}>Github</div>
            <div onClick={() => window.location.href = 'https://sandeepsky.netlify.com'}>Portfolio</div>
        </div>
    );
}




export default Toolbar;
