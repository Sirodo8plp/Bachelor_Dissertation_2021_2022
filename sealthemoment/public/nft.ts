interface Nft {
    id: number,
    message: string,
    header: string
}

const NftInformation: Nft[] = [{
    id: 1,
    message: `In Q3 (July-Sept.), sales of non-fungible tokens
    were up 8x over the prior quarter to a record $10.7B.`,
    header: 'Q3'
},
{
    id:2,
    message: `NFTs use blockchain, the technology behind bitcoin,
    to register ownership of unique digital items.`,
    header: 'Blockchain'
},
{
    id: 3,
    message: `On OpenSea, the biggest NFT platform, monthly sales
    surpassed $3B in each of the last 2 months, more than 20x the
    volume as in June`,
    header: 'OpenSea'
},
{
    id: 4,
    message: `According to nonfungible.com data, a majority of NFT
    sales are between $101 and $1,000. The most popular items are collectibles,
    art, utilities and games.`,
    header: 'Items'
}]

export default NftInformation;