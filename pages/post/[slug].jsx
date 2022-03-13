import SanityBlockContent from "@sanity/block-content-to-react";
import imageUrlBuilder from "@sanity/image-url";
import { useState, useEffect } from "react";
import Toolbar from "../../components/Toolbar";
import styles from "../../styles/Post.module.css";

export const Post = ({ title, body, image, post, author }) => {
	
    const [imageUrl, setImageUrl] = useState(null);
	// console.log(title, body, image, post, author);

	useEffect(() => {
		const imgBuilder = imageUrlBuilder({
			projectId: "kyrxu3xu",
			dataset: "production",
		});

		setImageUrl(imgBuilder.image(image));
	}, [image]);

	return (
		<div>
			<Toolbar />
			<div className={styles.main}>
                <div>
				    <h1 className={styles.title}>{title}</h1>
                    {/* By: 
                    <span className={styles.authorname}>{author.name}</span> */}
                </div>
				{imageUrl && (
					<img src={imageUrl} className={styles.mainImage} />
				)}

				<div className={styles.body}>
					<SanityBlockContent blocks={body} />
				</div>
			</div>
		</div>
	);
};

export const getServerSideProps = async (pageContext) => {
	const pageSlug = pageContext.query.slug;
	// console.log(pageSlug);

	if (!pageSlug) {
		return {
			notFound: true,
		};
	}

	const query = encodeURIComponent(`*[ _type == "post" && slug.current == "${pageSlug}" ]`);
	const url = `https://kyrxu3xu.api.sanity.io/v1/data/query/production?query=${query}`;

	const result = await fetch(url).then((res) => res.json());
	// console.log(result);

	const post = result.result[0];

	const queryAuthor = encodeURIComponent(`*[ _type == "author" && _id == "${post.author._ref}" ]`);
	const urlAuthor = `https://kyrxu3xu.api.sanity.io/v1/data/query/production?query=${queryAuthor}`;
	const resultAuthor = await fetch(urlAuthor).then(res => res.json());
	// console.log("resultauthor", resultAuthor)

	if (!post) {
		return {
			notFound: true,
		};
	} else {
		return {
			props: {
				post: post,
				body: post.body,
				title: post.title,
				image: post.mainImage || null,
				author : resultAuthor.result[0] || null
			},
		};
	}
};

export default Post;
