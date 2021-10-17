import React from 'react'

interface nftProps {
    header: string,
    message: string,
}

const NFTcard: React.FC<nftProps> = ({header,message}) => {
    return(
        <article className="nft">
            <h1 className="nft__title">{header}</h1>
            <p className="nft__text">{message}</p>
        </article>
    )
}

export default NFTcard;