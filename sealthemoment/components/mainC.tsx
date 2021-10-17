import React from 'react'
import data from '../public/nft';
import Nft from './nftCard';
import Link from 'next/link';

function mainContainer() {
    return(
        <main className="main">
            <h1 className="main__title">NFT Latest Information</h1>
            {data.map(info => {return <Nft key={info.id} header={info.header} message={info.message}/>})}
            <section className="main__linksContainer">
                <Link href="/register">
                    <a className="main__link">Create your account now!</a>
                </Link>
                <Link href="/login">
                    <a className="main__link">Sign In</a>
                </Link>
            </section>
        </main>
    )
}

export default mainContainer;