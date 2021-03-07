import {getPostData, getSortedPostsData} from "../lib/posts";
import styles from "../styles/Post.module.css";
import Head from "next/head";
import Link from 'next/link'

const Post = ({post}) => (
    <div className={styles.container}>
        <Head>
            <title>{post.title}</title>
            <link rel="icon" href="/favicon.ico"/>
        </Head>

        <main className={styles.main}>
            <header>
                <h4><Link href="/">Home</Link></h4>
                <h1 className={styles.PostTitle}>{post.title}</h1>
                <span className={styles.PostInfo}>{post.date}</span>
            </header>

            <article className={styles.PostContent} dangerouslySetInnerHTML={{__html: post.contentHtml}}/>
        </main>
    </div>
);

export default Post;

export const getStaticPaths = async () => ({
    paths: getSortedPostsData().map(post => ({
        params: {
            url: post.URL.split("/").slice(1)
        }
    })),
    fallback: false
});


export async function getStaticProps(props) {
    const url = "/" + props.params.url.join("/");
    let post = getSortedPostsData().find(p => p.URL === url);

    const postData = await getPostData(post.fileName);

    return {
        props: {
            post: postData
        }
    };
}
