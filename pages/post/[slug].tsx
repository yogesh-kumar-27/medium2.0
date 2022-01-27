import { GetStaticProps } from "next";
import Header from "../../components/Header";
import { sanityClient, urlFor } from "../../sanity";
import { Post } from "../../typings";
import Head from "next/head";
import PortableText from "react-portable-text";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
// import comment from '../api/createComment'
interface Props {
  post: Post;
}

interface FrormInut {
  _id: string;
  name: string;
  email: string;
  comment: string;
}
const Blog = ({ post }: Props) => {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FrormInut>();
  const onSubmit: SubmitHandler<FrormInut> = async (data) => {
    await fetch("../api/createComment", {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then(() => {
        console.log(data);
        setSubmitted(true);
      })
      .catch((err) => {
        console.log(err);
        setSubmitted(false);
      });
  };
  return (
    <main>
      <Head>
        <title>Medium Blog - Post Detail</title>
      </Head>
      <Header />
      <img
        className="w-full h-40 object-cover"
        src={urlFor(post.mainImage).url()!}
        alt=""
      />
      <article className="max-w-3xl mx-auto p-5">
        <h1 className="text-2xl md:text-6xl mt-10 mb-3 font-bold capitalize">
          {post.title}
        </h1>
        <h2 className="text-xl md:text-2xl text-gray-500 m-2 tracking-wide">
          {post.description}
        </h2>
        <div className="flex items-center space-x-2">
          <img
            className="h-10 w-10 rounded-full"
            src={urlFor(post.author.image).url()!}
            alt=""
          />
          <h4 className="font-extralight text-sm">
            Blog post by{" "}
            <span className="text-green-600">{post.author.name}</span> -
            Published at {new Date(post._createAt).toLocaleString()}
          </h4>
        </div>

        <div className="mt-10">
          <PortableText
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
            projectId={process.env.NEXT_PUBLIC_PROJECT_ID!}
            content={post.body}
            serializers={{
              h1: (props: any) => (
                <h1
                  className="text-2xl text-gray-900 font-bold my-5"
                  {...props}
                />
              ),
              h2: (props: any) => (
                <h1
                  className="text-xl font-bold text-gray-900 my-5"
                  {...props}
                />
              ),
              li: ({ children }: any) => (
                <li className="ml-4 text-gray-900  list-disc">{children}</li>
              ),
              link: ({ href, children }: any) => (
                <a href={href} className="text-blue-500 hover:underline">
                  {children}
                </a>
              ),
              image: (props: any) => (
                <figure>
                  <img
                    className="w-full h-40"
                    src={urlFor(post.mainImage).url()!}
                    alt=""
                  />
                </figure>
              ),
            }}
          />
        </div>
      </article>
      <hr className="max-w-lg mx-auto border border-yellow-500" />

      {submitted ? (
        <div className="flex flex-col p-10 my-10 bg-yellow-500 shadow-md text-white max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold">
            Thank for submitting your comment!
          </h1>
          <p>Once it has approved, it'll appear below!</p>
        </div>
      ) : (
        <form
          className="flex flex-col p-5 max-w-2xl mx-auto mb-10"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h3 className="text-sm text-yellow-500">Enjoyed this article</h3>
          <h6 className="text-3xl font-bold">Leave a comment below!</h6>
          <hr className="py-3 mt-2" />
          {IFormInput()}
        </form>
      )}

      {/* Comments */}
      <div className="flex flex-col p-10 my-10 max-w-2xl mx-auto space-y-2 shadow shadow-yellow-500">
        <h3 className="text-4xl font-bold">Comments</h3>
        <hr className="pb-2" />
        {post.comments.map((comment) => (
          <div key={comment._id}>
            <p>
              <span className="text-yellow-500">{comment.name}: </span>
              {comment.comment}
            </p>
            <p>
              - Published at {new Date(comment._createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </main>
  );

  function IFormInput() {
    return (
      <>
        <input {...register("_id")} type="hidden" id="_id" value={post._id} />
        <label className="block mb-5">
          <span className="text-gray-700">Name</span>
          <input
            {...register("name", { required: true })}
            className="shadow border rounded py-2 px-3 form-input mt-1 block outline-none w-full focus:ring ring-yellow-500"
            type="text"
            placeholder="John Appleseed"
          />
        </label>
        <label className="block mb-5">
          <span className="text-gray-700">Email</span>
          <input
            {...register("email", { required: true })}
            className="shadow border rounded py-2 px-3 form-input mt-1 block outline-none w-full focus:ring ring-yellow-500"
            type="email"
            placeholder="John Appleseed"
          />
        </label>
        <label className="block mb-5">
          <span className="text-gray-700">Comment</span>
          <textarea
            {...register("comment", { required: true })}
            className="shadow border rounded py-2 px-3 form-textarea mt-1 block w-full outline-none focus:ring ring-yellow-500 "
            rows={8}
            placeholder="John Appleseed"
          />
        </label>
        {/* error will return when field validation fails */}
        <div className="flex flex-col p-5">
          {errors.name && (
            <span className="text-red-500 capitalize">
              - the name field is required
            </span>
          )}
          {errors.email && (
            <span className="text-red-500 capitalize">
              - the email field is required
            </span>
          )}
          {errors.comment && (
            <span className="text-red-500 capitalize">
              - the comment field is required
            </span>
          )}
          <input
            type="submit"
            className="bg-yellow-500 hover:border-yellow-400 
          shadow focus:shadow-outile focus:outline-none text-white 
          font-bold py-2 px-4 rounded cursor-pointer "
          />
        </div>
      </>
    );
  }
};

export default Blog;

export const getStaticPaths = async () => {
  const query = `*[_type=="post"]{
          _id,
          slug {
              current
          }
        }`;

  const posts = await sanityClient.fetch(query);

  const paths = posts.map((post: Post) => ({
    params: { slug: post.slug.current },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type == "post" && slug.current == $slug][0]{
          _id,
          _createdAt,
          title,
          author->{
              name,
              image
          },
          'comments':*[_type=="comment" && post._ref==^._id && approved==true],
          description, 
          mainImage, 
          slug, 
          body
      }`;

  const post = await sanityClient.fetch(query, { slug: params?.slug });

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
    },
    revalidate: 60,
  };
};
