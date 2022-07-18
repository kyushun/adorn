import { useFetchPosts } from "./use-fetch-posts";

export const IndexPage = () => {
  const { bottomRef, data, error, isLoadingMore } = useFetchPosts();

  if (error) {
    return <div>error</div>;
  }

  if (!data) {
    return <div>loading</div>;
  }

  return (
    <div>
      <div className="m-4 columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6">
        {data.map((v) =>
          v.posts.map((post) =>
            post.images.map((image) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={image.url}
                src={image.url}
                alt=""
                className="mb-4 cursor-pointer rounded-xl transition-opacity hover:opacity-75"
              />
            ))
          )
        )}
      </div>
      {isLoadingMore && <div className="text-center">Loading...</div>}

      <div ref={bottomRef} className="h-[1px] w-[1px]" />
    </div>
  );
};
