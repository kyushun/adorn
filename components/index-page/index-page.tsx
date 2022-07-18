import { ImageItem } from "./image-item";
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
        {data.map(({ posts }) =>
          posts.map(({ images, ...post }) =>
            images.map((image) => (
              <ImageItem key={image.url} post={post} image={image} />
            ))
          )
        )}
      </div>
      {isLoadingMore && <div className="text-center">Loading...</div>}

      <div ref={bottomRef} className="h-[1px] w-[1px]" />
    </div>
  );
};
