import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {getSortedPostsData} from '../lib/posts'
import Link from 'next/link'

const Home = ({allPostsData}) => (
    <div className={styles.container}>
        <Head>
            <title>Sebastian Dehne's Blog</title>
            <link rel="icon" href="/favicon.ico"/>
        </Head>

        <main className={styles.main}>
            <div className={styles.about}>
                <img className={styles.imgMe} src="/images/seb.jpg" alt="Sebastian Dehne"/>
                <h1>Sebastian Dehne's Blog</h1>
                <p>[<a href="mailto:sebastian@dehnes.com">Email</a>, <a
                    href="https://github.com/sebdehne">GitHub</a>, <a href="https://twitter.com/sebdehne">Twitter</a>]
                </p>
                <p>I’m an electronics and computer enthusiast who is currently employed at <a
                    href="https://scienta.no/">Scienta</a> and works for the
                    Norwegian tax office. At work I design and build large-scale, highly available software systems
                    and
                    in my spare time, when not working or spending time with my lovely family, I design & build
                    electronics projects. I’m also a licensed ham radio operator and my callsign is LB3OJ.</p>
                <p>This is my personal blog on which I will typically post all kinds of things that keep me busy in
                    my
                    spare time. Although mostly related to software & electronics, I might also share photographs or
                    other content from time to time.</p>
            </div>

            <ul className={styles.postIndex}>
                {allPostsData.map(post => (
                    <li key={post.id} className={styles.postLink}>
                        {post.date}
                        <span className={styles.postLinkCategoryWithBreak}> [{post.category}]:<br/></span>
                        <span
                            className={styles.postLinkCategoryNoBreak}> [{post.category.padStart(13, " ")}]: </span>
                        <span className={styles.postLinkTitle}>
                                <Link href={post.URL + ".html"}>{post.title}</Link>
                            </span>
                    </li>
                ))}
            </ul>
        </main>

    </div>
)
export default Home;

export async function getStaticProps() {
    const allPostsData = getSortedPostsData()
    return {
        props: {
            allPostsData
        }
    }
}
