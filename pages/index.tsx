import { IndexPage } from "components/index-page";
import type { NextPage } from "next";
import { unstable_serialize } from "swr/infinite";

import { createAPIUrl } from "@/server/utils/url";

const Home: NextPage = () => {
  return <IndexPage />;
};

export async function getServerSideProps() {
  const response = await fetch(createAPIUrl("/api/posts")).then((v) =>
    v.json()
  );

  return {
    props: {
      fallback: {
        [unstable_serialize(() => "/api/posts")]: [response],
      },
    },
  };
}

export default Home;
