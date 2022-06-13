import { useQuery } from "@apollo/client";
import UserNavigation from "../../../components/usernav";
import { useIsAuth } from "../../../utils/userIsAuth";
import { GET_LOCATIONS_QUERY } from "../../../graphql/queries";

type propsType = {
  [key: string]: any;
};

const Locations = (props: propsType) => {
  useIsAuth();
  const { data, loading } = useQuery(GET_LOCATIONS_QUERY);
  if (!loading && data && data.locations && data.locations.locations) {
    let cssClass = "";
    return (
      <>
        <UserNavigation selected="locations" />
        <main className="location__container">
          {data.locations.locations.map((location: any) => {
            return (
              <article key={location.id} className="location">
                <h3>Region</h3>
                <p>{location.region}</p>
                <h3>City</h3>
                <p>{location.city}</p>
                <h3>Photographs took there</h3>
                <p>{location.photographs.length}</p>
              </article>
            );
          })}
        </main>
      </>
    );
  }
  return (
    <>
      <UserNavigation selected="locations" />
      <h1 className="location__heading">Getting location data ready!</h1>
    </>
  );
};

export default Locations;
