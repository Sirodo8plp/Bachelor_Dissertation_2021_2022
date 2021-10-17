import React from "react";
import fillerPic1 from '../public/header-picture-1.jpg';
import fillerPic2 from '../public/header-picture-2.jpg';
import fillerPic3 from '../public/header-picture-3.jpg';
import Image from 'next/image';

function Header() {
    return(
        <header className="header">
            <section className="header__text">
                <h1 className="header__title">Seal The Moment</h1>
                <p className="header__info">Take a photograph wherever you are,
                convert it to NFT and make your moments unique!</p>
            </section>
            <section className="header__images">
                <figure className="header__figure header__figure--left">
                    <Image 
                    alt= "Photo by Michael Dam on Unsplash"
                    layout="fill"
                    objectFit="cover"
                    src={fillerPic3}/>
                </figure>
                <figure className="header__figure header__figure--bottomRight">
                    <Image
                    layout="fill"
                    objectFit="cover" 
                    src={fillerPic2}/>
                </figure>
                <figure className="header__figure header__figure--upRight">
                    <Image 
                    layout="fill"
                    objectFit="cover"
                    src={fillerPic1}/>
                </figure>
            </section>
        </header>
    )
}

export default Header;