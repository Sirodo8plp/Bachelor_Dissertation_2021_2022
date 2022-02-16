import React from "react";
import { useRouter } from "next/router";
import { useFindPostcardByIdQuery } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { withUrqlClient } from "next-urql";
import Image from "next/image";
import { Location, Camera } from "react-ionicons";

const Post = () => {
  const router = useRouter();
  const pcID: string = router.query.pcID as string;
  const [{ data, fetching }] = useFindPostcardByIdQuery({
    variables: { id: pcID },
  });
  if (!fetching && data && data.findPostcardById) {
    return (
      <>
        <main className="viewPostcard">
          <article className="viewPostcard__location">
            <Location cssClasses="viewPostcard__svg" />
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
            {data.findPostcardById.photographs.map((photo) => {
              return (
                <figure key={photo.id} className="viewPostcard__figure">
                  <Image
                    src={photo.imageLink}
                    layout="responsive"
                    width={50}
                    height={50}
                  />
                  <figcaption className="viewPostcard__caption">
                    <Camera cssClasses="viewPostcard__caption__SVG" />
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

export default withUrqlClient(createUrqlClient)(Post);
