import Head from "next/head";
import Image from "next/image";
import Toolbar from "../components/Toolbar";
import styles from "../styles/Home.module.css";
import imageUrlBuilder from "@sanity/image-url";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Home({ posts }) {
	// console.log("comp posts", posts);

	const router = useRouter();
	const [mappedPosts, setMappedPosts] = useState(null);

	useEffect(() => {
		if (posts.length) {
			const imgBuilder = imageUrlBuilder({
				projectId: "kyrxu3xu",
				dataset: "production",
			});

			// console.log("in useeffect", posts);

			setMappedPosts(
				posts.map((p) => {
					// console.log(p.author);

					return {
						...p,
						mainImage: imgBuilder
							.image(p.mainImage)
							.width(500)
							.height(250),
					};
				})
			);
		} else {
			setMappedPosts([]);
		}
	}, [posts]);

	return (
		<div className={styles.container}>
			<Toolbar />
			<div className={styles.main}>
				<h1>Welcome to My Blog</h1>
				<h3>Recent Posts</h3>

				<div className={styles.feed}>
					{mappedPosts && mappedPosts.length ? (
						mappedPosts.map((p, index) => {
							return (
								<div
									onClick={() =>
										router.push(`/post/${p.slug.current}`)
									}
									key={index}
									className={styles.post}>
									<h3>{p.title}</h3>
									<img
										src={p.mainImage}
										className={styles.mainImage}
									/>
								</div>
							);
						})
					) : (
						<>No Post Yet !!!</>
					)}
				</div>
			</div>
		</div>
	);
}

export const getServerSideProps = async (pageContext) => {

	const query = encodeURIComponent(`*[ _type == "post" ]`);
	const url = `https://kyrxu3xu.api.sanity.io/v1/data/query/production?query=${query}`;

	const result = await fetch(url).then((res) => res.json());
	// console.log(result);

	if (!result.result || !result.result.length) {
		return {
			props: {
				posts: [],
			},
		};
	} else {
		return {
			props: {
				posts: result.result,
			},
		};
	}
};
