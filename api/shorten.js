export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ status: false, error: 'Method not allowed' });
    }

    const { url, provider, alias } = req.body;

    if (!url) {
        return res.status(400).json({ status: false, error: 'URL tidak boleh kosong.' });
    }

    try {
        let shortUrl = '';

        if (provider === 'tinyurl') {
            const apiUrl = alias
                ? `https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}&alias=${encodeURIComponent(alias)}`
                : `https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`;

            const response = await fetch(apiUrl);
            const text = await response.text();

            if (!text.startsWith('https://')) {
                throw new Error('Alias sudah dipakai atau URL tidak valid.');
            }
            shortUrl = text.trim();

        } else {
            // Default: is.gd
            const response = await fetch(
                `https://is.gd/create.php?format=simple&url=${encodeURIComponent(url)}`
            );
            const text = await response.text();

            if (!text.startsWith('https://')) {
                throw new Error('URL tidak valid atau ditolak oleh is.gd.');
            }
            shortUrl = text.trim();
        }

        return res.status(200).json({ status: true, result: shortUrl });

    } catch (err) {
        return res.status(500).json({ status: false, error: err.message });
    }
                  }
