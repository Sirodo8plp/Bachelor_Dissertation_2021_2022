import React from "react";
import { useRouter } from "next/router";
import { GET_POSTCARD_BY_ID_QUERY } from "../../graphql/queries";
import Image from "next/image";
import { useQuery } from "@apollo/client";

const Post = () => {
  const router = useRouter();
  const pcID: string = router.query.pcID as string;
  const { data, loading } = useQuery(GET_POSTCARD_BY_ID_QUERY, {
    variables: { id: pcID },
  });
  if (!loading && data && data.findPostcardById) {
    return (
      <>
        <main className="viewPostcard">
          <article className="viewPostcard__location">
            <Image
              src="/SVG/location.svg"
              className="viewPostcard__svg"
              width={30}
              height={30}
            />
            <p>
              {" "}
              Created at:
              {data.findPostcardById.location.region},
              {data.findPostcardById.location.city}
            </p>
          </article>
          <article className="viewPostcard__description">
            <h2>Message</h2>
            <p>{data.findPostcardById.description}</p>
          </article>
          <section className="viewPostcard__photographs">
            {data.findPostcardById.photographs.map((photo: any) => {
              return (
                <figure key={photo.id} className="viewPostcard__figure">
                  <Image
                    src={photo.imageLink}
                    layout="responsive"
                    width={50}
                    height={50}
                  />
                  <figcaption className="viewPostcard__caption">
                    <Image
                      className="viewPostcard__caption__SVG"
                      src="/SVG/camera.svg"
                      width={30}
                      height={30}
                    />
                    <p className="viewPostcard__caption__text">
                      Took at: &nbsp;
                      {data.findPostcardById?.location.region},
                      {data.findPostcardById?.location.city}
                    </p>
                    <p>Tx Hash: {photo.transactionHash}</p>
                  </figcaption>
                </figure>
              );
            })}
          </section>
        </main>
      </>
    );
  }
  return <h1 className="viewPostcard__loading">loading</h1>;
};

export default Post;
