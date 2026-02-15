
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { content } = req.body;

    if (!content) {
        return res.status(400).json({ message: 'Missing content' });
    }

    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const REPO_OWNER = process.env.REPO_OWNER;
    const REPO_NAME = process.env.REPO_NAME;
    const FILE_PATH = 'data.ts'; // Adjust if in src/data.ts or similar

    if (!GITHUB_TOKEN || !REPO_OWNER || !REPO_NAME) {
        return res.status(500).json({ message: 'Missing GitHub configuration' });
    }

    try {
        // 1. Get current file SHA
        const fileResponse = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
            headers: {
                Authorization: `Bearer ${GITHUB_TOKEN}`,
                Accept: 'application/vnd.github.v3+json',
            },
        });

        if (!fileResponse.ok) {
            const errorText = await fileResponse.text();
            console.error('Error fetching file:', errorText);
            throw new Error('Failed to fetch file from GitHub');
        }

        const fileData = await fileResponse.json();
        const sha = fileData.sha;

        // 2. Prepare new content
        // We reconstruct the file content. 
        // WARNING: This overwrites the file. If you have comments outside the object, they might be lost if not handled.
        // We will hardcode the header comments based on the original file structure to keep it clean.
        const newFileContent = `
/**
 * ARCHIVO DE CONFIGURACIÓN MAESTRO - SOLINNTEC
 * V2.2 - Configuración total de activos y enlaces
 * (Updated via Web Editor)
 */

export const siteData = ${JSON.stringify(content, null, 2)};
`;

        const encodedContent = Buffer.from(newFileContent).toString('base64');

        // 3. Commit update
        const updateResponse = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${GITHUB_TOKEN}`,
                Accept: 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: 'chore: update site content via web editor',
                content: encodedContent,
                sha: sha,
            }),
        });

        if (!updateResponse.ok) {
            const errorText = await updateResponse.text();
            console.error('Error updating file:', errorText);
            throw new Error('Failed to update file on GitHub');
        }

        return res.status(200).json({ message: 'Content updated successfully' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}
