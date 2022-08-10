import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import md from 'markdown-it';
import blockEmbedPlugin from 'markdown-it-iframe';

const postsDirectory = path.join(process.cwd(), 'posts')

export function getSortedPostsData() {
    // Get file names under /posts
    const fileNames = fs.readdirSync(postsDirectory)
    const allPostsData = fileNames.map(fileName => {
        // Remove ".md" from file name to get id
        const id = fileName.replace(/\.md$/, '')

        // Read markdown file as string
        const fullPath = path.join(postsDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf8')

        // Use gray-matter to parse the post metadata section
        const matterResult = matter(fileContents)

        // Combine the data with the id
        return {
            id,
            fileName,
            ...matterResult.data,
            URL: matterResult.data.URL.replace(".html", "")
        }
    })
    // Sort posts by date
    return allPostsData.sort((a, b) => {
        if (a.date < b.date) {
            return 1
        } else {
            return -1
        }
    })
}

export async function getPostData(filename) {
    const fileContents = fs.readFileSync(postsDirectory + "/" + filename, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)

    // Use remark to convert markdown into HTML string
    const m = md();
    m.use(blockEmbedPlugin, {
        allowfullscreen: true,
        width: 800,
        height: 600
    });
    const processedContent = m.render(matterResult.content);
    const contentHtml = processedContent.toString()

    // Combine the data with the id and contentHtml
    return {
        filename,
        contentHtml,
        ...matterResult.data
    }
}
