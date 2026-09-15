app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file received' });
    const uploader = (req.body.uploader || 'Anonymous').slice(0, 50);
    const file = req.file;

    const form = new FormData();
    form.append('chat_id', CHANNEL_ID);
    form.append('document', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype
    });
    form.append('caption',
      `Uploader: ${uploader}\nFile: ${file.originalname}\nDate: ${new Date().toISOString()}`
    );

    const tgRes = await axios.post(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`,
      form,
      {
        headers: form.getHeaders(),
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
        timeout: 120000
      }
    );

    if (!tgRes.data.ok) throw new Error(tgRes.data.description || 'Upload failed');

    const doc = tgRes.data.result.document;
    const shortId = crypto.randomBytes(6).toString('hex');

    filesMeta[shortId] = {
      id: shortId,
      fileId: doc.file_id,
      messageId: tgRes.data.result.message_id,
      name: file.originalname,
      size: doc.file_size || file.size,
      mime: file.mimetype,
      uploader,
      time: Date.now()
    };
    saveMeta();

    res.json({ success: true, id: shortId });
  } catch (err) {
    console.error('Upload error:', err.response?.data || err.message);
    res.status(500).json({
      error: err.response?.data?.description || err.message || 'Upload failed'
    });
  }
});